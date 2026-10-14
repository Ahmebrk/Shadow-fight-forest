# Test report — SHADOW CLASH

Date: 2026-10-14 (weapon animation pass)

## Executed after weapon changes
- `bash tests/run-release-checks.sh` — exit code 0.
- Inline JavaScript syntax checks — passed.
- Combat/AI simulation scripts `run1.js`, `run2.js`, `run4.js`, `run5.js` — completed.
- Rig/render logic scripts `run7.js`, `run8.js` — completed with 10 fighter identities and no reported render exceptions in simulation.
- `dom_test.js` — 84 checks, 0 failed.
- `cap_run.js` — 16 simulated scenes captured.

## Changes in this pass
- Sword and axe heavy attacks have dedicated weapon-swing posing.
- Soraya's rifle has an aiming/firing pose for light and heavy attacks.
- Seraphina's dual blades have a two-arm heavy swing.
- Goran is configured as an axe fighter; his forearm-linked weapon has an axe-head silhouette.

## Known limitations
- Real Three.js/WebGL rendering and visual weapon alignment have not been verified in a live browser after these changes.
- Physical Android frame rate, touch feel, and actual audio playback remain untested.
- The roster has 10 fighter identities but reuses two underlying skinned base models.
- Some AI facing/stuck anomalies and H→L follow-up misses remain in the simulation report.

## Android visual smoke test
1. Open the HTML with internet access and keep both MP3 files beside it.
2. Select Ravenna, Kenji, Goran, Soraya, and Seraphina one at a time.
3. Test light/heavy/special/ultimate attacks; check weapon stays attached to the hand/forearm and attacks visibly use it.
4. Check touch release, pause/resume, rematch, and portrait/landscape resize.

Status: automated checks pass; not certified for release on a real Android device.
