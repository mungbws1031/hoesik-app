# Modeling Output Contract

Use this reference when `design-modeling-studio` needs a complete modeling package or a CAD-aware handoff.

## Evidence To Model Translation

Create a compact table before modeling:

| Item | Visible evidence | Assumption | Modeling decision |
| --- | --- | --- | --- |
| Part | What is seen or specified | What is inferred | How it is represented |

Good modeling decisions include part name, geometry primitive, dimensions, material, location, interface surfaces, and whether the part is source, export, or preview only.

## Minimum Modeling Brief

Include these fields:

- Purpose: review render, mechanism explanation, assembly study, fit check, presentation, or CAD handoff.
- Units and scale: usually millimeters; state the anchor dimension.
- Coordinate system: define X/Y/Z and the insertion, hinge, or assembly axis.
- Part tree: top assembly, subassemblies, parts, flexible parts, labels, and hidden reference geometry.
- BOM: part name, material, process, finish, quantity, and critical interface.
- Dimension status: known, assumed, or placeholder.
- Assembly sequence: how parts stack, slide, snap, compress, fold, bond, or fasten.
- Risk notes: tolerance stack, thin walls, undercuts, seal compression, flex fatigue, adhesive area, contamination path, and user handling.

## Deliverable Matrix

Choose only the formats useful for the task:

| Need | Preferred deliverable | Notes |
| --- | --- | --- |
| Editable visual concept | `.blend` plus generation script | Best for exploded views, labels, camera, materials, and presentations. |
| Mesh exchange | `.obj` plus `.mtl` | Good for review and import, not true parametric CAD. |
| Parametric concept | `.scad`, CadQuery `.py`, or FreeCAD macro | Best when dimensions should be edited repeatedly. |
| CAD exchange | `.step` | Say whether it is CAD-native solids or faceted concept geometry. |
| Review artifact | `.png`, `.html`, `.svg`, or `.pdf` | Use for communication, not source editing. |
| Image model prompt | English prompt plus Korean intent note | Useful when the user wants a realistic render before CAD. |

## Exploded Assembly Recipe

For exploded product images like layered caps, films, carriers, seals, domes, FPCs, and frames:

1. Set a single assembly axis, usually vertical Z for stack-ups or X for insertion mechanisms.
2. Model the fixed base first, then stack functional layers from bottom to top.
3. Keep each part's footprint aligned to its installed location, then apply an exploded offset.
4. Use material contrast: metal satin, black PC/ABS, translucent PSA film, matte TPU, amber FPC, brushed stiffener.
5. Add labels only after the geometry reads clearly without labels.
6. Leave enough spacing to show interfaces: tabs, bosses, seal grooves, compression faces, FPC pads, and snap features.
7. Provide one beauty view and one engineering view: beauty view for presentation, engineering view for dimensions and callouts.

## Mechanism Modeling Recipe

For doors, hinges, sliders, snap fits, cassettes, latches, fixtures, and actuators:

- Identify the motion family first: rotate, slide, flex, snap, cam, detent, compression, or peel.
- Define the hard stops, user contact area, return force, clearance, and failure mode.
- Show at least two states if motion matters: open/loaded and closed/locked.
- Use cutaways when hidden interfaces matter more than exterior appearance.
- Avoid changing the mechanism family after the user narrows it.

## Rendering Prompt Structure

When generating prompt text, use:

`A realistic product-design render of [product/assembly], [view angle], [scale], [exploded or assembled state], [materials and finishes], [key functional details], [lighting/background], [style constraints], no impossible geometry, no unapproved claims or logos.`

Add a short Korean note explaining the intent of the prompt.

## Verification Checklist

Before final response:

- Confirm files exist and paths are correct.
- Run syntax checks for scripts when possible.
- For Blender scripts, note if Blender was unavailable or not run.
- For STEP, explicitly state `CAD-native` or `faceted concept`.
- Mention unresolved dimensions or assumptions that should be replaced before manufacturing.
