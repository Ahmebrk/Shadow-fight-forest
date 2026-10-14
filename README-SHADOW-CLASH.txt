SHADOW CLASH 3D: BLOOD DYNASTY — FOREST EDITION

STARTING THE GAME
1. Extract the entire ZIP archive.
2. Keep shadow-clash-forest-3d.html, 321fightSoundeffect.mp3, and shadow-clash-song.mp3 together in the same folder.
3. Open shadow-clash-forest-3d.html in a modern browser while connected to the internet.
4. Three.js r128 and the Oswald font are loaded from external CDNs. If the 3D library cannot load, the game attempts to use its 2D fallback.
5. For the most reliable local test, serve the folder over HTTP using a local web server. Opening the HTML directly may work, but browser restrictions and network settings can affect external assets.

MOBILE CONTROLS
- Left circular joystick: movement, jump/crouch directions.
- Square: light attack.
- Cross: heavy attack.
- Triangle: special attack (requires energy).
- Circle: ultimate (requires full energy).
- R1: block.
- R2: dash.

KEYBOARD CONTROLS
- A/D move, W jump, S crouch, Q/E sidestep, Shift dash.
- J light, K heavy, L special, I block, Space ultimate.
- Esc pauses.
- Local 2P uses arrow keys, comma, period, slash, right Shift, and Enter.

CONTENTS
- shadow-clash-forest-3d.html: complete game entry point.
- 321fightSoundeffect.mp3 and shadow-clash-song.mp3: audio files.
- tests/: Node simulation and regression checks. Run `bash tests/run-release-checks.sh` from this folder.
- RELEASE-STATUS.txt: current test results and known limitations.

IMPORTANT
Automated simulations are not equivalent to testing real WebGL rendering on an Android phone. This package is not certified as release-ready until the 3D render path, touch controls, audio, and performance have been checked on target devices. Ten fighter identities currently reuse two base skinned models; some animation actions are procedural.
