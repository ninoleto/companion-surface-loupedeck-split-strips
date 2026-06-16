# Companion Loupedeck / Razer Split Strips Dev Module

Experimental custom Bitfocus Companion surface module for the Razer Stream Controller / Loupedeck Live.

This fork changes the handling of the two small vertical strip displays between the encoders and the main buttons.

## What this does

The default Companion Loupedeck surface module treats the side strips mostly as touch/fader areas.

This custom version changes them into six split Companion bitmap/control areas:

- strip-left-0
- strip-left-1
- strip-left-2
- strip-right-0
- strip-right-1
- strip-right-2

Each strip section is exposed to Companion as a 60 x 90 px RGB bitmap area.

Touching a strip section sends normal Companion key down / key up events, so the strip sections can behave more like normal Companion buttons.

## Important

This is not an official Bitfocus Companion module.

This does not modify the Razer/Loupedeck firmware.

This only changes the Companion-side surface module.

Use at your own risk.

## Tested with

- Razer Stream Controller
- Companion running on Linux
- Custom dev module loaded with --extra-module-path

It may also work with Loupedeck Live, but I only tested my own Razer Stream Controller setup.

## Build

Install dependencies:

    yarn

Build the module:

    yarn build

## Loading in Companion

Clone or copy this module into a Companion dev modules folder.

Example:

    mkdir -p ~/companion-module-dev
    cd ~/companion-module-dev
    git clone https://github.com/ninoleto/companion-surface-loupedeck-split-strips.git companion-surface-loupedeck
    cd companion-surface-loupedeck
    yarn
    yarn build

The important part is that Companion must load the parent folder:

    ~/companion-module-dev

Not the module folder itself:

    ~/companion-module-dev/companion-surface-loupedeck

## Headless Linux / systemd example

Add this to the Companion backend command:

    --extra-module-path=/home/YOUR_USER/companion-module-dev

Then restart Companion:

    sudo systemctl daemon-reload
    sudo systemctl restart companion.service

Check logs:

    journalctl -u companion.service -f

You should see the dev Loupedeck surface module being loaded.

## Notes

This is a small experimental change based on the official companion-surface-loupedeck module.

Main code changes are in:

- src/instance.ts
- src/surface-schema.ts

## Credits

Based on the official Bitfocus Companion Loupedeck surface module.

Custom split-strip version prepared by Nino Milin with help from ChatGPT.

## License

MIT, same as the original module.

## Windows install from release package

This method is for users who download the ready-made `.tgz` package from the GitHub release page.

Tested package:

    companion-surface-loupedeck-split-strips-1.0.2-nino.tgz

Steps:

1. Download the `.tgz` file from the GitHub release page.
2. Extract it with 7-Zip.
3. Inside the archive there should be a `pkg` folder.
4. Rename the extracted `pkg` folder to:

   companion-surface-loupedeck

5. Create a developer modules folder, for example:

   C:\CompanionDev

6. Move the renamed module folder into it, so the final path is:

   C:\CompanionDev\companion-surface-loupedeck

7. Open the Companion launcher.
8. Open the launcher settings / advanced settings.
9. Enable developer modules.
10. Set the developer module path to the parent folder:

    C:\CompanionDev

Important: do not select this folder:

       C:\CompanionDev\companion-surface-loupedeck

Companion must point to the parent folder that contains the module folder.

11. Restart Companion.
12. Check the Companion logs or Surfaces page and confirm that the Loupedeck/Razer dev surface module is loaded.

Notes:

- This was tested on Linux with a Razer Stream Controller.
- Windows users should treat this as experimental and report if something behaves differently.
- This does not modify the device firmware.
- This is not an official Bitfocus Companion module.
