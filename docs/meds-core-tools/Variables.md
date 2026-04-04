---
sidebar_position: 1
---

# Variables

Variables are `Resources` that hold a typed value and emit a signal when the value changes.

Available variable types (scripts live under `addons/godot_meds_core/scripts/variables/`):

| Icon | Type | Notes |
| --- | --- | --- |
| ![BaseVariable icon](/img/variables/BaseVariable.svg) | `BaseVariable` | Shared base resource for all variable types |
| ![BoolVariable icon](/img/variables/BoolVariable.svg) | `BoolVariable` | Stores a `bool` |
| ![IntVariable icon](/img/variables/IntVariable.svg) | `IntVariable` | Stores an `int` |
| ![FloatVariable icon](/img/variables/FloatVariable.svg) | `FloatVariable` | Stores a `float` |
| ![StringVariable icon](/img/variables/StringVariable.svg) | `StringVariable` | Stores a `String` |
| ![ColorVariable icon](/img/variables/ColorVariable.svg) | `ColorVariable` | Stores a `Color` |
| ![Vector2Variable icon](/img/variables/Vector2Variable.svg) | `Vector2Variable` | Stores a `Vector2` |
| ![Vector3Variable icon](/img/variables/Vector3Variable.svg) | `Vector3Variable` | Stores a `Vector3` |

Common API (implemented via `BaseVariable`):

- `value` property (typed per variable)
- `value_changed(new_value)` signal
- `initial_value` exported property
- `debug_logs` exported bool: when enabled, logs value changes + a stack trace + which listeners are connected
- `save_to_device` exported bool: persists changes to `user://settings.cfg` and reloads on startup
  - stored in section `variables`
  - key is the variable’s `resource_path.get_basename()`

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
