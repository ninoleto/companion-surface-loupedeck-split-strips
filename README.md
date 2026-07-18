# Companion Loupedeck / Razer Separated Strip Buttons

Unofficial Bitfocus Companion 5 surface module for the **Loupedeck Live** and **Razer Stream Controller**.

This module preserves the official native vertical-strip rendering and adds one optional switch for separated **60 × 60** strip buttons.

<img width="1024" height="1024" alt="Official native strip controls compared with optional separated 60x60 strip buttons" src="https://github.com/user-attachments/assets/39081298-2e98-44c6-893f-a811051e043d" />

> [!IMPORTANT]
> This is an unofficial module based on the official open-source Bitfocus Companion Loupedeck surface module.
>
> The separated layout is optional. With the option disabled, the strips use the latest official native rendering behavior.

## Why this module exists

The controller's central 4 × 3 LCD button grid has plastic dividers between neighboring buttons. Those dividers provide a clear physical boundary for the finger.

The two vertical touch strips are different. Each strip is one continuous touch surface containing three virtual controls, with no physical divider between them.

During live use, full-height adjacent touch areas can make it easier to touch or move into the neighboring control accidentally. I previously used separated square strip buttons with Companion 4.x, and my pages and muscle memory were built around that workflow.

This module keeps that separated-button workflow available as an option without replacing or degrading the official native layout.

## Two layouts, one switch

Open the Loupedeck surface integration settings and set:

`LCD strip mode: Split buttons`

Then use:

`Separated strip buttons (60 × 60)`

### Switch disabled — official native layout

- Uses the latest official native strip dimensions and edge padding.
- Preserves full-height Companion artwork.
- Preserves gradients, circles and continuous graphics.
- Uses the full native touch area.
- Does not stretch, interpolate or extend square artwork.

### Switch enabled — separated 60 × 60 layout

- Uses native 60 × 60 Companion artwork.
- Centers each square button in its physical 60 × 90 strip section.
- Leaves a 15-pixel black area above and below each button.
- Makes those black areas touch-inactive.
- Reduces accidental activation of adjacent controls.
- Preserves the square-button workflow used by the earlier Companion 4.x version.

## How runtime switching works

Both layouts are registered when the surface starts, using different internal control IDs at the same grid positions.

The module:

- draws only the selected layout;
- routes touch events only to the selected layout;
- caches the latest Companion bitmap for every registered strip control;
- redraws the strips immediately when the setting changes;
- does not require a Companion restart when switching layouts;
- tracks touch IDs so release events return to the control that originally received the press.

## Six programmable strip controls

The two vertical strips provide six independent Companion controls:

- three on the left strip;
- three on the right strip.

Each control can:

- display its own text, icon and color;
- show independent feedback states;
- use Companion variables;
- run any assigned Companion action;
- generate normal key-down and key-up events.

The main LCD buttons, encoders, wheel and other controller functions retain the behavior of the official module.

## Compatibility

Built and physically tested with:

- Bitfocus Companion 5;
- Razer Stream Controller;
- Linux headless Companion.

The Razer Stream Controller and Loupedeck Live use the same supported control-surface family. This release is intended for Companion 5, not Companion 4.x.

## Download

Download from the latest GitHub release:

`companion-surface-loupedeck-separated-strips-v1.1.3.tgz`

Do not extract the file when importing it through Companion.

## Recommended installation

1. Back up your Companion configuration.
2. Open the Companion Admin interface.
3. Open **Modules**.
4. Click **Import module package**.
5. Select `companion-surface-loupedeck-separated-strips-v1.1.3.tgz`.
6. Do not choose **Import offline module bundle**.
7. Open **Surfaces**.
8. Add or edit the **Loupedeck** surface integration.
9. Select module version **1.1.3**.
10. Set **LCD strip mode** to **Split buttons**.
11. Enable **Separated strip buttons (60 × 60)** when you want the optional square layout.
12. Restart Companion or click **Rescan USB** if the imported version does not appear immediately.

Completely close the official Loupedeck or Razer Stream Controller software before using the controller with Companion. The official application may retain the USB device.

## Linux USB permissions

Companion may report that its generated udev rules are missing or outdated.

After enabling the surface integration:

1. Install or copy the generated Companion udev rules.
2. Reload the rules.
3. Disconnect and reconnect the controller.
4. Click **Rescan USB**.

For a manually configured headless installation, Companion normally generates:

`50-companion-headless.rules`

Copy the generated file into:

`/etc/udev/rules.d/`

Then run:

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

Reconnect the controller afterward.

## Advanced developer-directory installation

The preferred method is **Import module package**. Use a developer directory only for development or when package import is unavailable.

The developer-module path must point to the parent directory containing the module folder.

Correct:

```text
/home/USERNAME/companion-module-dev
```

Incorrect:

```text
/home/USERNAME/companion-module-dev/companion-surface-loupedeck
```

For a custom headless launch, add:

```bash
--extra-module-path=/home/USERNAME/companion-module-dev
```

Do not keep multiple active copies of `companion-surface-loupedeck` inside the same developer-module path.

## Troubleshooting

### The separated option is missing

Confirm that:

- Companion 5 is running;
- module version 1.1.3 is installed and selected;
- LCD strip mode is set to **Split buttons**;
- an older development copy is not overriding the imported package;
- Companion was restarted after changing module versions.

### The controller is not detected

- Close the official Loupedeck/Razer software completely.
- Disconnect and reconnect the controller.
- Try a direct USB port.
- Click **Rescan USB**.
- Check Companion logs.
- On Linux, verify the generated udev rules.

### Companion loads the wrong module version

- Remove duplicate development copies.
- Check every configured developer-module directory.
- Reopen the Loupedeck surface integration and select version 1.1.3.
- Restart Companion.

## Version 1.1.3

- Rebased on the latest official Loupedeck surface module changes.
- Preserves the official native strip rendering and hidden-edge padding.
- Registers native and separated layouts simultaneously with different IDs.
- Adds live switching between both layouts.
- Adds bitmap caching and immediate redraw after changing the option.
- Keeps separated 60 × 60 artwork and touch targets.
- Keeps 15-pixel touch-inactive gaps above and below separated buttons.
- Preserves correct press/release routing when the finger moves before release.
- Keeps legacy fader/slider mode available.

## Upstream contribution

The dual-layout implementation has also been submitted to the official Bitfocus repository as pull request **#24**.

## Credits

Based on the official Bitfocus Companion Loupedeck surface module.

Created and tested by Nino Milin with development and documentation assistance from ChatGPT.

## License

MIT.
