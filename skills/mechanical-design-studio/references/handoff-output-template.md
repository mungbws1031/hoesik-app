# Handoff Output Template

Use this reference for CAD briefs, prototype plans, drawing outlines, PPT-ready mechanical explanations, and model instructions.

## Mechanical Brief

```markdown
## Mechanical Design Brief

### 1. Objective
- Function:
- User action:
- Product envelope:
- Use environment:

### 2. Assumptions
- Dimensions:
- Materials:
- Manufacturing route:
- Load/life targets:

### 3. Architecture
- Fixed structure:
- Moving structure:
- Motion axis:
- Force source:
- Stops:
- Datums:

### 4. Part Breakdown
| Part | Function | Material/process | Key interfaces | Notes |
|---|---|---|---|---|

### 5. Critical Interfaces
- User interface:
- Product/consumable interface:
- Seal/contact interface:
- PCB/FPC/electrical interface:
- Fastening interface:

### 6. Dimensions and Tolerances
| Feature | Nominal | Tolerance intent | Controlled by | Why it matters |
|---|---:|---|---|---|

### 7. Manufacturing and Assembly
- Tool direction:
- Parting lines:
- Assembly order:
- Inspection points:
- Service or disassembly:

### 8. Risks and Tests
| Risk | Test or check | Pass signal |
|---|---|---|
```

## Prototype Plan

Separate prototypes by learning goal:

- Proof of motion: rough 3D print, laser cut, foam, wire, off-the-shelf hinge/spring, or hand fixture.
- Ergonomic check: scale model with user touch points and insertion/removal flow.
- Tolerance check: printed or machined mating parts around critical datums.
- Durability check: repeated actuation, latch cycle, spring fatigue, drop/impact, cleaning exposure, or wear.
- Appearance model: CMF, texture, seams, labels, and visible part breaks.
- Pilot/manufacturing sample: real process, real material, tool direction, and assembly fixtures.

## CAD/Modeling Instructions

Provide these fields when asking another tool or operator to model the design:

- Units: millimeters unless specified otherwise.
- Coordinate system: front, rear, left, right, top, bottom.
- Origin: product centerline, insertion axis, hinge axis, or primary datum.
- Named parts and hierarchy.
- Editable dimensions.
- Motion positions: closed, open, partially inserted, latched, failed/overtravel if useful.
- Exploded view offsets along true assembly axes.
- Materials and colors by engineering function, not just aesthetics.
- Required exports: editable source, STEP/OBJ/STL if feasible, PNG/SVG/HTML preview when useful.

## PPT-Ready Mechanical Explanation

Use a short sequence:

1. `Problem`: what mechanical uncertainty or user failure this design solves.
2. `Principle`: the mechanism family and how motion/force is converted.
3. `Structure`: fixed parts, moving parts, stops, datums, and key interfaces.
4. `Manufacturing`: process, part count, assembly sequence, and cost drivers.
5. `Risks`: top 2-3 risks and how prototypes will verify them.
