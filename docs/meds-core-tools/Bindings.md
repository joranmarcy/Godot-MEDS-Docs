---
sidebar_position: 4
---

# Bindings

The core addon includes small UI scripts you can attach to common controls to keep them synced with MEDS variables.

Most binding scripts live under `addons/godot_meds_core/scripts/ui/`.

## At a glance

- Use these scripts when you want a control to reflect a variable automatically.
- Some bindings are one-way display bindings, while others are two-way editor bindings.
- `variable-driven-*` scripts are the current generic bindings.

## Basic usage

1. Add the target UI control, such as a `CheckBox`, `Label`, `Slider`, or `ProgressBar`.
2. Attach the matching script from `addons/godot_meds_core/scripts/ui/`.
3. In the Inspector, assign the exported variable resource.
4. For numeric controls, optionally configure clamping and range values on the variable resource itself.

## Current bindings

| Script | Attach to | Exported property | Direction | Notes |
| --- | --- | --- | --- | --- |
| `addons/godot_meds_core/scripts/ui/bool-driven-checkbox.gd` | `CheckBox` | `bool_var: BoolVariable` | Two-way | Checkbox state updates the variable, and variable changes update the checkbox |
| `addons/godot_meds_core/scripts/ui/color-driven-color-picker.gd` | `ColorPickerButton` | `color_variable: ColorVariable` | Two-way | Picker changes update the variable, and variable changes update the picker |
| `addons/godot_meds_core/scripts/ui/variable-driven-label.gd` | `Label` | `variable: BaseVariable` | One-way | Displays any variable value as text, with optional `prefix` and `suffix` |
| `addons/godot_meds_core/scripts/ui/variable-driven-slider.gd` | `Slider` | `variable: NumericVariable` | Two-way | Syncs with `FloatVariable` or `IntVariable`, including clamp-aware ranges |
| `addons/godot_meds_core/scripts/ui/variable-driven-progress-bar.gd` | `ProgressBar` | `variable: NumericVariable` | One-way | Displays `FloatVariable` or `IntVariable` values with clamp-aware bounds |

## Binding behavior

### Generic label binding

`variable-driven-label.gd` works with any variable type because it reads the value as a `Variant` and formats it with `str(...)`.

Available exports:

- `variable: BaseVariable`
- `prefix: String = ""`: text added before the variable value
- `suffix: String = ""`: text added after the variable value

`prefix` and `suffix` are simple formatting helpers for the label text. The binding converts the variable value with `str(...)`, then builds the final label as:

`prefix + str(value) + suffix`

This lets you add units, labels, or surrounding text without writing a custom script.

Examples:

- `prefix = "HP: "`, `suffix = ""` with value `75` becomes `HP: 75`
- `prefix = ""`, `suffix = "%"` with value `42` becomes `42%`
- `prefix = "Player: "`, `suffix = ""` with value `Robot` becomes `Player: Robot`
- `prefix = "("`, `suffix = ")"` with value `12` becomes `(12)`

Use `prefix` when the text should appear before the value, such as a field name.

Use `suffix` when the text should appear after the value, such as `%`, `HP`, `m`, or `pts`.

This is useful for text like health counters, names, scores, or debug labels.

### Numeric control bindings

`variable-driven-slider.gd` and `variable-driven-progress-bar.gd` both use `NumericVariable`.

They automatically:

- read the current numeric value on startup
- react to `value_changed(...)`
- react to `range_changed(...)`
- use the variable's `min_value` and `max_value` when `clamp_value` is enabled
- switch the slider or progress step to `1.0` when the bound variable is an `IntVariable`

Use `variable-driven-slider.gd` when the player should be able to edit the variable through the UI.

Use `variable-driven-progress-bar.gd` when the UI should only display the variable.

## Deprecated bindings

These older scripts still exist under `addons/godot_meds_core/scripts/ui/deprecated/`, but the current generic bindings are preferred.

| Deprecated script | Preferred replacement |
| --- | --- |
| `addons/godot_meds_core/scripts/ui/deprecated/float-driven-label.gd` | `addons/godot_meds_core/scripts/ui/variable-driven-label.gd` |
| `addons/godot_meds_core/scripts/ui/deprecated/string-driven-label.gd` | `addons/godot_meds_core/scripts/ui/variable-driven-label.gd` |
| `addons/godot_meds_core/scripts/ui/deprecated/float-driven-slider.gd` | `addons/godot_meds_core/scripts/ui/variable-driven-slider.gd` |

## Example setups

### Label bound to any variable

Create a variable resource such as `health.tres` using `FloatVariable`.

Attach `variable-driven-label.gd` to the label, then assign:

- `variable = health.tres`
- `prefix = "HP: "`

### Slider bound to a numeric variable

Create a variable resource such as `music-volume.tres` using `FloatVariable`.

Attach `variable-driven-slider.gd` to the slider, then assign:

- `variable = music-volume.tres`

If `music-volume.tres` has `clamp_value` enabled, the slider range follows that variable's `min_value` and `max_value` automatically.

## Notes

- `bool-driven-checkbox.gd` and `color-driven-color-picker.gd` expect their exported variable to be assigned before `_ready()` runs.
- `variable-driven-label.gd`, `variable-driven-slider.gd`, and `variable-driven-progress-bar.gd` guard against a missing variable more gracefully, but they are still most useful when the resource is assigned.
- Two-way bindings call `set_value(..., self)` so the variable can track the caller.
