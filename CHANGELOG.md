# Changelog — SHADOW CLASH

## 2026-10-14 — Mobile layout patch
- Adjusted the portrait-mode touch-control block downward by a bounded amount (`clamp(36px, 7vh, 110px)`) to better balance unused space on tall phone screens.
- Kept the existing 2:1 fight viewport, button sizes, combat logic, and game modes unchanged.
- No character models, animation clips, weapon transforms, or arena assets were changed in this patch.


## Mobile/combat follow-up — 2026-10-14
- Adjusted the oversized forearm-mounted staff/accessory dimensions and offsets for GORAN and KENJI to sit closer to the hand and reduce clipping/overlong silhouettes.
- Kept the existing Three.js scene, combat logic, characters, controls, and modes intact.
- This is a targeted source adjustment; visual correctness still needs confirmation in the real WebGL build on-device.

## 2026-10-14 — Combat regression pass
- Re-ran the repository's release-check script against the current source.
- JavaScript syntax checks passed; combat simulation, combo follow-up, rig construction checks, and 84 DOM/touch checks completed without test-script failures.
- Simulation still reports some facing errors at intermediate AI levels and lower H→L combo reliability at some distances; these remain open rather than being described as fixed.
- No real WebGL browser rendering or physical Android test was performed in this pass.

## 2026-10-14 — Weapon-aware attack pass
- Added distinct heavy-attack posing for sword and axe users so heavy attacks visibly swing their held weapon instead of defaulting to a kick.
- Added rifle aiming/firing poses for Soraya and dual-blade heavy swings for Seraphina.
- Reclassified Goran as an axe fighter and refined his forearm-linked weapon into a visible war-axe silhouette.
- Preserved the existing combat logic, 10 fighter roster, imported motion clips, touch controls, audio, and game modes.
- Re-ran `tests/run-release-checks.sh`: JavaScript syntax checks passed; simulation/regression suite completed; 84 DOM/touch checks passed. Actual WebGL rendering and physical Android visual verification remain untested.
