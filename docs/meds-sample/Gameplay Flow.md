---
sidebar_position: 2
---

# Gameplay Flow

The sample is built around a few shared resources. UI, gameplay logic, audio, and scene transitions all react to the same MEDS variables and events.

## High-level flow

1. The menu reads and edits shared MEDS resources.
2. The robot and other listeners react to those resources.
3. Pressing `Take Damage` raises a shared MEDS event.
4. The damage event reduces the shared health variable.
5. UI, audio, and scene logic all update from that same health resource.

## Menu flow

The menu scene at `samples/prefabs/menu.tscn` is the main control surface for the sample.

It uses these bindings:

- `variable-driven-label.gd` to display variable values in labels
- `bool-driven-checkbox.gd` to edit `robot-visibility.tres`
- `variable-driven-slider.gd` to edit `robot-rotation.tres`
- `color-driven-color-picker.gd` to edit `damage-color.tres`
- `variable-driven-progress-bar.gd` to display `robot-health.tres`

This means the UI does not need custom code for each control. It simply points each binding at the right MEDS resource.

## Damage flow

The `Take Damage` button triggers the MEDS event `samples/events/take-damage.tres`.

The flow is:

1. The button calls `raise_event()` through `samples/scripts/raise-event.gd`.
2. `take-damage.tres` emits its `event_raised()` signal.
3. `samples/scripts/robot.gd` listens to that event.
4. The robot subtracts `damage-amount.tres` from `robot-health.tres`.

This is the core MEDS pattern in the sample: a resource event triggers gameplay, and a shared resource variable stores the result.

## Health-driven reactions

Several systems react to `robot-health.tres` at the same time:

- the progress bar updates through `variable-driven-progress-bar.gd`
- `samples/scripts/heartbeat-controller.gd` changes audio volume and pitch based on the health range
- `samples/scripts/scene-manager.gd` switches to the game-over scene when health reaches zero

This is useful because the sample does not need one big controller script to keep these systems in sync.

## Variable-driven visuals

The sample also demonstrates direct variable-to-scene bindings outside the menu UI:

- `samples/scripts/bind-bool-var-to-visibility.gd` applies `robot-visibility.tres` to a node's `visible` state
- `samples/scripts/bind-float-var-to-rotation.gd` applies `robot-rotation.tres` to a 3D node rotation
- `samples/scripts/bind-color-var-to-mat-albedo.gd` applies `damage-color.tres` to a material color

These scripts are intentionally small. They show how MEDS resources can drive runtime behavior without introducing heavy coupling.

## Scene transition flow

When `robot-health.tres` becomes `0` or lower:

1. `samples/scripts/scene-manager.gd` receives the updated value.
2. The scene manager loads `samples/game-over.tscn`.
3. `samples/scripts/game-over-manager.gd` lets the player retry and return to the main sample scene.

## Why this sample matters

This sample is small, but it covers the main MEDS ideas in one place:

- resources hold shared state
- events broadcast intent
- bindings connect resources to UI
- multiple systems can react to the same resource independently
- debugging is easier because the data lives in explicit resources instead of hidden node references