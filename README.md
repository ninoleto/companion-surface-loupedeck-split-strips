# Companion Loupedeck — personal / opinionated fork

Unofficial Bitfocus Companion 5 surface module for **Loupedeck Live** and compatible Loupedeck-based controllers.

This fork exists because I prefer a different touchscreen workflow from the official Companion Loupedeck module. It keeps the official Bitfocus module as its technical base, while adding optional behavior that I personally want on my own controller.

The main additions are:

- optional separated square buttons on the two vertical touch strips
- live switching between native and separated strip layouts
- real hardware haptic feedback for touchscreen presses
- selectable haptic strength
- legacy strip fader / slider mode

> [!IMPORTANT]
> This is **not an official Bitfocus module**.
>
> It is a personal, opinionated fork of the official open-source Bitfocus Companion Loupedeck surface module.
>
> The custom behavior exists primarily because it matches how I personally use the controller.

## Why this fork exists

The official Companion Loupedeck module uses the full height of each virtual button area on the two vertical LCD strips.

That is a valid design, but I personally do not like using the strips that way.

The central 4 × 3 LCD grid has physical dividers between buttons. The vertical strips do not: each strip is one continuous touch surface containing three virtual controls. During live use I found it too easy to hit a neighboring control, especially when pressing quickly or touching the strip at an angle.

My older Companion 4 setup used smaller separated square buttons instead, and I preferred that workflow.

This fork keeps that option available while still preserving the current native layout.

## Vertical strip layouts

Set:

`LCD strip mode: Split buttons`

You can then choose between two layouts.

### Native layout

With **Separated strip buttons (square)** disabled, the module uses the native strip layout inherited from the official Bitfocus module.

This preserves:

- native strip dimensions
- full-height artwork
- native edge padding
- gradients and continuous graphics
- full native touch areas

### Separated square layout

Enable:

`Separated strip buttons (square)`

The two vertical strips become six separated Companion controls: three on the left and three on the right.

The separated layout:

- uses 60 × 60 square Companion artwork
- centers each square inside its physical strip section
- leaves black space above and below each button
- makes those gaps touch-inactive
- reduces accidental activation of neighboring controls
- keeps icons and artwork square instead of stretching them vertically

This is the layout I personally use.

## Runtime layout switching

Both strip layouts are registered when the surface starts.

The module:

- renders only the selected layout
- routes touch events only to the active layout
- caches Companion button graphics
- redraws the strips immediately when the layout changes
- does not require a Companion restart when switching layouts
- tracks touch IDs so release events return to the control that originally received the press

## Touchscreen haptic feedback

The current development version adds **real hardware haptic feedback** for touchscreen presses.

This uses the vibration functionality exposed by the Loupedeck hardware API. It is not a visual or software-only simulation.

Enable or disable it with:

`Touch Haptic Feedback`

A short vibration is generated when a valid touchscreen control is pressed.

Haptic feedback is used for touchscreen button interactions, including the main LCD controls and strip buttons. It does not continuously vibrate while dragging a strip slider.

### Haptic strength

The surface settings provide three choices:

- **Subtle** — default
- **Light**
- **Normal** — strongest of the three

The first implementation used the normal vibration pattern. After testing it on a real Loupedeck Live, I found it much too strong, so weaker options were added and **Subtle** became the default.

## My preferred configuration

My own setup uses:

- `LCD strip mode: Split buttons`
- `Separated strip buttons (square): Enabled`
- `Touch Haptic Feedback: Enabled`
- `Haptic strength: Subtle`

These are personal preferences, not universal recommendations. The options exist so other users can choose differently.

## This project is vibe-coded

This fork is **vibe-coded and heavily AI-assisted**.

I want to be transparent about that.

I decide what I want the controller to do, test the behavior on real hardware, inspect the results, report problems, and iterate on the implementation using AI-assisted development tools.

ChatGPT and Codex have been used extensively for:

- implementation
- debugging
- refactoring
- Git conflict resolution
- code review
- documentation
- release preparation

I am not claiming that every line in this fork was manually written by me.

My role is primarily defining the workflow and behavior I want, testing changes on actual hardware, identifying problems, deciding what feels right in real use, and validating the final result.

The source is public so anyone can inspect exactly what the module does. If AI-assisted development is something you do not want in software you use, this fork may simply not be for you.

## Personal preference, not an upstream replacement

This project is not intended to prove that the official Bitfocus implementation is wrong.

The official module is the upstream project and remains the appropriate choice for users who prefer its behavior.

This fork exists because **I personally do not like some aspects of the official touchscreen behavior for my workflow**.

Instead of maintaining private patches only for myself, I publish them so other users with similar preferences can use them too.

The custom behavior should therefore be considered an optional workflow choice rather than a proposed universal default.

## Legacy fader / slider mode

The legacy strip fader behavior remains available.

Set:

`LCD strip mode: Fader / slider (legacy)`

When slider mode is active, the split-button layouts are not used and the existing fader-value functionality remains available.

## Compatibility

Intended for:

- Bitfocus Companion 5
- Loupedeck Live
- compatible controllers supported by the upstream Loupedeck surface module

The current haptic implementation has been physically tested on a real **Loupedeck Live** with Companion running on a Linux headless system.

Support for other compatible devices is inherited from the upstream Bitfocus module, but every custom feature may not have been physically tested on every supported controller.

This release line is **not intended for Companion 4.x**.

## Installation

Download the `.tgz` module package from the latest GitHub Release.

Do **not** extract the archive.

In Companion:

1. Back up your Companion configuration.
2. Open **Modules**.
3. Click **Import module package**.
4. Select the downloaded `.tgz` package.
5. Do not use **Import offline module bundle**.
6. Open **Surfaces**.
7. Add or edit the **Loupedeck** surface integration.
8. Select the imported module version.
9. Configure the strip layout and haptic feedback to your preference.

If the imported version does not appear immediately, restart Companion or use **Rescan USB**.

Completely close the official Loupedeck or Razer Stream Controller software before using the controller with Companion. The official application may retain control of the USB device.

## Linux USB permissions

Companion may report that its generated udev rules are missing or outdated.

For a manually configured headless installation, Companion commonly generates:

`50-companion-headless.rules`

Install the generated rules into:

```text
/etc/udev/rules.d/
```

Then reload them:

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

Disconnect and reconnect the controller afterward.

## Developer-directory installation

Using **Import module package** is recommended for normal use.

For development, Companion can load the module from an extra module directory. The configured path should point to the directory containing the module folder, for example:

```text
/home/USERNAME/companion-module-dev
```

not directly to the module itself:

```text
/home/USERNAME/companion-module-dev/companion-surface-loupedeck
```

For a custom headless Companion launch:

```bash
--extra-module-path=/home/USERNAME/companion-module-dev
```

Avoid keeping multiple active copies of `companion-surface-loupedeck` in the same developer-module path.

## Troubleshooting

### Custom options are missing

Check that:

- Companion 5 is running
- the custom module version is installed and selected
- an older developer copy is not overriding the packaged module
- Companion was restarted after changing module versions

### Haptic feedback does not work

Check that:

- **Touch Haptic Feedback** is enabled
- you are pressing a touchscreen control rather than dragging a slider
- the hardware supports the vibration command
- Companion logs do not report a haptic or vibration error

### Controller is not detected

- Completely close the official Loupedeck or Razer software.
- Disconnect and reconnect the controller.
- Try a direct USB connection.
- Use **Rescan USB**.
- Check Companion logs.
- On Linux, verify the generated udev rules.

### Companion loads the wrong module version

- Remove duplicate development copies.
- Check all configured extra-module directories.
- Select the intended module version in the surface integration.
- Restart Companion.

## Relationship to upstream

This project is based on the official open-source Bitfocus Companion Loupedeck surface module.

Where useful, changes may also be proposed upstream. This fork can remain more opinionated because its primary purpose is to support my own preferred Loupedeck workflow.

## Credits

Original Companion Loupedeck surface module:

**Bitfocus and its contributors**

Personal fork, feature direction and physical hardware testing:

**Nino Milin**

Development, debugging and documentation:

**Heavily AI-assisted using ChatGPT and Codex**

## License

MIT.
