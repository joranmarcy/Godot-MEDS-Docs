---
sidebar_position: 1
---

# Variables

Variables are `Resources` that hold a typed value and emit a signal when the value changes.

Variable classes (scripts live under `addons/godot_meds_core/scripts/variables/`):

| Icon | Type | Extends | Notes |
| --- | --- | --- | --- |
| ![BaseVariable icon](/img/variables/BaseVariable.svg) | `BaseVariable` | `Resource` | Shared base resource for all variable types |
| ![BaseVariable icon](/img/variables/BaseVariable.svg) | `NumericVariable` | `BaseVariable` | Shared numeric base for `FloatVariable` and `IntVariable` |
| ![BoolVariable icon](/img/variables/BoolVariable.svg) | `BoolVariable` | `BaseVariable` | Stores a `bool` |
| ![IntVariable icon](/img/variables/IntVariable.svg) | `IntVariable` | `NumericVariable` | Stores an `int` with optional clamping and range metadata |
| ![FloatVariable icon](/img/variables/FloatVariable.svg) | `FloatVariable` | `NumericVariable` | Stores a `float` with optional clamping and range metadata |
| ![StringVariable icon](/img/variables/StringVariable.svg) | `StringVariable` | `BaseVariable` | Stores a `String` |
| ![ColorVariable icon](/img/variables/ColorVariable.svg) | `ColorVariable` | `BaseVariable` | Stores a `Color` |
| ![Vector2Variable icon](/img/variables/Vector2Variable.svg) | `Vector2Variable` | `BaseVariable` | Stores a `Vector2` |
| ![Vector3Variable icon](/img/variables/Vector3Variable.svg) | `Vector3Variable` | `BaseVariable` | Stores a `Vector3` |

Common API (implemented via `BaseVariable`):

- `value` property (typed per variable)
- `value_changed(new_value)` signal
- `initial_value` exported property
- `debug_logs` exported bool: when enabled, logs value changes + a stack trace + which listeners are connected
- `save_to_device` exported bool: persists changes to `user://settings.cfg` and reloads on startup
- `reset_on` exported enum: controls when the variable resets
- `reset_on = "On Scene Load"` resets on each scene load
- `reset_on = "On Application Start"` keeps the runtime value cached across scene loads until the app restarts
- persisted values are stored in section `variables`
- persisted keys use the variable's `resource_path.get_basename()`

Numeric API (implemented via `NumericVariable`, `FloatVariable`, and `IntVariable`):

- `clamp_value` exported bool: enables runtime clamping
- `min_value` and `max_value` exported properties on `FloatVariable` and `IntVariable`
- `range_changed(clamp_enabled, min_value, max_value)` signal on `FloatVariable` and `IntVariable`
- both `initial_value` and runtime `value` assignments are sanitized through the numeric clamp rules

## Creating a variable resource

1. In the FileSystem dock: **Right click → New Resource…**
2. Pick e.g. `BoolVariable` and save it as a `.tres`.
3. Assign that `.tres` to exported fields in scripts.

## Using variables in scripts

```gdscript
extends Node

@export var bool_variable: BoolVariable

func _ready() -> void:
	bool_variable.value_changed.connect(_on_bool_changed)
	print("Initial value:", bool_variable.value)

func _on_bool_changed(new_value: bool) -> void:
	print("Bool changed to:", new_value)
```

When you want better debug output that includes the caller, prefer the typed helper method:

```gdscript
bool_variable.set_value(true, self)
```

For numeric variables, you can configure clamping directly on the resource:

```gdscript
@export var health: FloatVariable

func _ready() -> void:
	health.range_changed.connect(_on_health_range_changed)
	health.value_changed.connect(_on_health_changed)
	health.set_value(125.0, self)

func _on_health_range_changed(clamp_enabled: bool, min_value: float, max_value: float) -> void:
	print("Clamp:", clamp_enabled, "Range:", min_value, "-", max_value)

func _on_health_changed(new_value: float) -> void:
	print("Health:", new_value)
```
