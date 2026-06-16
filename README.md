# Companion Loupedeck / Razer Split Strips Dev Module

Experimental custom Bitfocus Companion surface module for the **Razer Stream Controller / Loupedeck Live**.

This fork changes the handling of the two small vertical strip displays between the encoders and the main buttons.

## Quick Windows install

This is the easiest method for normal users. No programming should be needed.

Download this file from the GitHub release page:

```text
companion-surface-loupedeck-split-strips-1.0.2-nino.tgz
```

Release page:

```text
https://github.com/ninoleto/companion-surface-loupedeck-split-strips/releases/tag/v1.0.2-nino
```

SHA256 checksum:

```text
6634e14c137a76ab68e45a8ef8087a9f5b0daf51f5f8760c8872a579fc84cade
```

### Windows steps

1. Download the `.tgz` file from the GitHub release page.
2. Install **7-Zip** if you do not already have it.
3. Right-click the `.tgz` file and extract it with 7-Zip.
4. You may need to extract twice: first `.tgz`, then the `.tar` file inside it.
5. After extraction, you should see a folder named `pkg`.
6. Rename `pkg` to `companion-surface-loupedeck`.
7. Create this folder on Windows:

```text
C:\CompanionDev
```

8. Move the renamed folder into it.

Final path should be:

```text
C:\CompanionDev\companion-surface-loupedeck
```

9. Open the **Bitfocus Companion launcher**.
10. Open launcher settings / advanced settings.
11. Enable developer modules.
12. Set the developer module path to:

```text
C:\CompanionDev
```

Important: do **not** select this folder:

```text
C:\CompanionDev\companion-surface-loupedeck
```

Companion must point to the **parent folder** that contains the module folder.

13. Restart Companion.
14. Open Companion and check the Surfaces page or logs.
15. The Loupedeck/Razer dev surface module should now be loaded.

## For ChatGPT / helper bots

If you are helping someone install this, the most important rule is:

```text
Developer Module Path = parent folder
```

Correct:

```text
C:\CompanionDev
```

Wrong:

```text
C:\CompanionDev\companion-surface-loupedeck
```

The extracted release package contains a `pkg` folder. Rename `pkg` to `companion-surface-loupedeck`, then put it inside `C:\CompanionDev`.

## What this does

The default Companion Loupedeck surface module treats the side strips mostly as touch/fader areas.

This custom version changes them into six split Companion bitmap/control areas:

- `strip-left-0`
- `strip-left-1`
- `strip-left-2`
- `strip-right-0`
- `strip-right-1`
- `strip-right-2`

Each strip section is exposed to Companion as a **60 x 90 px RGB bitmap area**.

Touching a strip section sends normal Companion key down / key up events, so the strip sections can behave more like normal Companion buttons.

## Important

- This is **not an official Bitfocus Companion module**.
- This does **not** modify the Razer/Loupedeck firmware.
- This only changes the Companion-side surface module.
- Use at your own risk.

## Tested with

- Razer Stream Controller
- Companion running on Linux
- Custom dev module loaded with `--extra-module-path`

It may also work with Loupedeck Live, but I only tested my own Razer Stream Controller setup.

Windows install has not been personally tested by me yet. The package is provided so other users can test it.

## Advanced: build from source

This method is for users who know Node/Yarn or want to modify the code.

```bash
mkdir -p ~/companion-module-dev
cd ~/companion-module-dev
git clone https://github.com/ninoleto/companion-surface-loupedeck-split-strips.git companion-surface-loupedeck
cd companion-surface-loupedeck
yarn
yarn build
```

Then point Companion to the parent folder:

```text
~/companion-module-dev
```

Not the module folder itself:

```text
~/companion-module-dev/companion-surface-loupedeck
```

## Headless Linux / systemd example

Add this to the Companion backend command:

```bash
--extra-module-path=/home/YOUR_USER/companion-module-dev
```

Then restart Companion:

```bash
sudo systemctl daemon-reload
sudo systemctl restart companion.service
```

Check logs:

```bash
journalctl -u companion.service -f
```

## Main code changes

Main changes are in:

- `src/instance.ts`
- `src/surface-schema.ts`

The custom module creates six virtual Companion controls for the two vertical strip displays and draws each segment as a 60 x 90 RGB bitmap area.

## Credits

Based on the official Bitfocus Companion Loupedeck surface module.

Custom split-strip version prepared by Nino Milin with help from ChatGPT.

## License

MIT, same as the original module.
