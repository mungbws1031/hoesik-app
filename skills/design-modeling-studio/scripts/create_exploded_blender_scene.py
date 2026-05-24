#!/usr/bin/env python3
"""Create a simple editable Blender exploded assembly from a JSON part spec.

Run inside Blender:
  blender --background --python create_exploded_blender_scene.py -- --spec spec.json --out assembly.blend

The script is intentionally small and meant to be copied and adapted per project.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


DEFAULT_SPEC = {
    "units": "mm",
    "title": "Exploded assembly concept",
    "camera": {"location": [145, -190, 115], "look_at": [0, 0, 22], "lens": 70},
    "parts": [
        {
            "name": "metal cap",
            "kind": "rounded_box",
            "dims": [122, 22, 5],
            "location": [0, 0, 62],
            "color": [0.64, 0.61, 0.55, 1.0],
            "label": True,
        },
        {
            "name": "PSA film",
            "kind": "rounded_box",
            "dims": [114, 18, 0.8],
            "location": [0, 0, 48],
            "color": [0.92, 0.90, 0.86, 0.38],
            "alpha": 0.38,
            "label": True,
        },
        {
            "name": "PC ABS carrier",
            "kind": "rounded_box",
            "dims": [120, 24, 8],
            "location": [0, 0, 32],
            "color": [0.01, 0.01, 0.01, 1.0],
            "label": True,
        },
        {
            "name": "TPU perimeter seal",
            "kind": "rect_loop",
            "dims": [118, 22, 2.5],
            "wall": 2.5,
            "location": [0, 0, 16],
            "color": [0.015, 0.015, 0.014, 1.0],
            "label": True,
        },
        {
            "name": "snap dome",
            "kind": "cylinder",
            "dims": [24, 24, 4],
            "location": [0, 0, 2],
            "color": [0.78, 0.75, 0.69, 1.0],
            "label": True,
        },
        {
            "name": "FPC and stiffener",
            "kind": "rounded_box",
            "dims": [126, 11, 1.4],
            "location": [0, 0, -10],
            "color": [0.86, 0.46, 0.06, 1.0],
            "label": True,
        },
        {
            "name": "frame",
            "kind": "rounded_box",
            "dims": [145, 30, 12],
            "location": [0, 0, -28],
            "color": [0.18, 0.18, 0.17, 1.0],
            "label": True,
        },
    ],
}


def parse_args() -> argparse.Namespace:
    script_args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--spec", type=Path, help="JSON part specification")
    parser.add_argument("--out", type=Path, default=Path("exploded_assembly.blend"))
    parser.add_argument("--render", type=Path, help="Optional PNG render path")
    return parser.parse_args(script_args)


def reset_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 0.001


def material(name: str, color: list[float], alpha: float | None = None) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    rgba = list(color)
    if alpha is not None:
        rgba[3] = alpha
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = rgba
    bsdf.inputs["Roughness"].default_value = 0.42
    bsdf.inputs["Metallic"].default_value = 0.4 if "metal" in name.lower() else 0.0
    if rgba[3] < 1:
        bsdf.inputs["Alpha"].default_value = rgba[3]
        mat.blend_method = "BLEND"
        mat.use_screen_refraction = True
    return mat


def add_rounded_box(name: str, dims: list[float], loc: list[float], mat: bpy.types.Material) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = obj.modifiers.new("small radius bevel", "BEVEL")
    bevel.width = min(dims) * 0.18
    bevel.segments = 8
    obj.modifiers.new("weighted normals", "WEIGHTED_NORMAL")
    obj.data.materials.append(mat)
    return obj


def add_cylinder(name: str, dims: list[float], loc: list[float], mat: bpy.types.Material) -> bpy.types.Object:
    radius = max(dims[0], dims[1]) / 2
    depth = dims[2]
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=radius, depth=depth, location=loc)
    obj = bpy.context.object
    obj.name = name
    bevel = obj.modifiers.new("soft edge bevel", "BEVEL")
    bevel.width = depth * 0.12
    bevel.segments = 8
    obj.modifiers.new("weighted normals", "WEIGHTED_NORMAL")
    obj.data.materials.append(mat)
    return obj


def add_rect_loop(name: str, dims: list[float], wall: float, loc: list[float], mat: bpy.types.Material) -> bpy.types.Object:
    width, depth, height = dims
    pieces = []
    bar_specs = [
        ("front", [width, wall, height], [0, -depth / 2 + wall / 2, 0]),
        ("back", [width, wall, height], [0, depth / 2 - wall / 2, 0]),
        ("left", [wall, depth - 2 * wall, height], [-width / 2 + wall / 2, 0, 0]),
        ("right", [wall, depth - 2 * wall, height], [width / 2 - wall / 2, 0, 0]),
    ]
    for suffix, part_dims, offset in bar_specs:
        piece_loc = [loc[i] + offset[i] for i in range(3)]
        pieces.append(add_rounded_box(f"{name} {suffix}", part_dims, piece_loc, mat))
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=loc)
    parent = bpy.context.object
    parent.name = name
    for piece in pieces:
        piece.parent = parent
    return parent


def add_label(text: str, loc: list[float], index: int) -> None:
    label_loc = [-95, -32, loc[2]]
    bpy.ops.object.text_add(location=label_loc, rotation=(math.radians(68), 0, 0))
    obj = bpy.context.object
    obj.name = f"label - {text}"
    obj.data.body = text
    obj.data.align_x = "LEFT"
    obj.data.size = 4.0
    mat = material(f"label black {index}", [0.02, 0.02, 0.02, 1.0])
    obj.data.materials.append(mat)

    curve = bpy.data.curves.new(f"leader - {text}", "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = 0.12
    poly = curve.splines.new("POLY")
    poly.points.add(1)
    poly.points[0].co = (label_loc[0] + 24, label_loc[1], label_loc[2], 1)
    poly.points[1].co = (loc[0] - 10, loc[1], loc[2], 1)
    line = bpy.data.objects.new(f"leader - {text}", curve)
    bpy.context.collection.objects.link(line)
    line.data.materials.append(mat)


def look_at(obj: bpy.types.Object, target: list[float]) -> None:
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def build_scene(spec: dict) -> None:
    reset_scene()
    mats: dict[str, bpy.types.Material] = {}
    for idx, part in enumerate(spec["parts"]):
        name = part["name"]
        color = part.get("color", [0.5, 0.5, 0.5, 1.0])
        mat = mats.setdefault(name, material(name, color, part.get("alpha")))
        kind = part.get("kind", "rounded_box")
        dims = part["dims"]
        loc = part["location"]
        if kind == "cylinder":
            add_cylinder(name, dims, loc, mat)
        elif kind == "rect_loop":
            add_rect_loop(name, dims, float(part.get("wall", 2.0)), loc, mat)
        else:
            add_rounded_box(name, dims, loc, mat)
        if part.get("label"):
            add_label(name, loc, idx)

    bpy.ops.object.light_add(type="AREA", location=[0, -80, 120])
    light = bpy.context.object
    light.name = "large softbox"
    light.data.energy = 450
    light.data.size = 80

    camera_spec = spec.get("camera", DEFAULT_SPEC["camera"])
    bpy.ops.object.camera_add(location=camera_spec["location"])
    camera = bpy.context.object
    camera.name = "camera - exploded assembly"
    camera.data.lens = camera_spec.get("lens", 70)
    look_at(camera, camera_spec.get("look_at", [0, 0, 0]))
    bpy.context.scene.camera = camera

    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.scene.cycles.samples = 64
    bpy.context.scene.render.resolution_x = 1800
    bpy.context.scene.render.resolution_y = 1200


def main() -> None:
    args = parse_args()
    spec = json.loads(args.spec.read_text(encoding="utf-8")) if args.spec else DEFAULT_SPEC
    build_scene(spec)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(args.out))
    if args.render:
        args.render.parent.mkdir(parents=True, exist_ok=True)
        bpy.context.scene.render.filepath = str(args.render)
        bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
