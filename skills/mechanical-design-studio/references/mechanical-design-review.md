# Mechanical Design Review

Use this reference for full reviews, failure diagnosis, DFM/DFA checks, tolerance checks, and risk tables.

## Review Sequence

1. Restate the intended function in one sentence.
2. Identify the critical user action and mechanical action.
3. Define fixed body, moving body, constraints, stops, datum scheme, and force source.
4. List all interfaces: user hand, consumable, sample, PCB/FPC, label, seal, fastener, tool, packaging, and cleaning path.
5. Check manufacturing route and assembly order before adding detail.
6. Convert each concern into `failure mode -> likely cause -> design change -> verification`.

## Core Checks

### Function and Kinematics

- Is the motion path obvious, guided, and stopped at both ends?
- Are lead-ins, chamfers, ramps, or compliance included where users insert or align parts?
- Are there hard stops that avoid overstressing snaps, springs, hinges, or seals?
- Is the mechanism tolerant of dirt, liquid, molding variation, and user angle variation?

### Loads and Durability

- Identify the load path from user force to reaction surface.
- Check bending, shear, pullout, snap strain, creep, wear, fatigue, and impact risk.
- Note where hand calculation, FEA, bench testing, or supplier data is required.

### Tolerance and Datums

- Define the primary datum surfaces first.
- Call out clearance versus interference versus controlled compression.
- Identify the stack that controls sealing, optical alignment, cassette fit, door closure, latch engagement, and PCB/button alignment.
- Avoid depending on cosmetic outer surfaces for precision alignment unless unavoidable.

### Plastic DFM

- Maintain consistent wall thickness where possible.
- Add ribs instead of thick solid blocks.
- Check draft direction, undercuts, slider/lifter needs, sink marks, weld/knit lines, gate/ejector locations, and texture allowance.
- Make snap fits serviceable only if repeated service is required; otherwise optimize for assembly reliability.

### DFA and Service

- Minimize part count and orientation ambiguity.
- Add poka-yoke geometry where wrong insertion is plausible.
- Ensure tools have access and screws are not hidden behind fragile cosmetic parts.
- Separate factory-only assembly from user-accessible actions.

### Safety, Hygiene, and Use Error

- Check pinch points, sharp edges, small detachable parts, heat, electrical access, and stored spring energy.
- For medical/IVD concepts, separate wet and dry zones, protect sample paths, avoid hidden crevices, and make cleaning/waste handling explicit.
- Phrase regulatory observations as risks or design inputs, not compliance conclusions.

## Risk Table Format

Use this compact table:

| Priority | Risk | Likely cause | Impact | Recommended change | Verification |
|---|---|---|---|---|---|
| High/Med/Low | What can fail | Mechanical reason | User/product impact | Design action | Test/check |

## Decision Matrix Format

Use this for comparing options:

| Route | Principle | Strength | Weakness | Manufacturing impact | Best use case | Verdict |
|---|---|---|---|---|---|---|

Score only when it helps the decision. Good lenses are reliability, tolerance sensitivity, part count, cost, usability, cleanliness, and prototype speed.
