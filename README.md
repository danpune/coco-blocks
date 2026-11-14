# Coco Blocks

A falling-block puzzle game for the browser. Works with a keyboard on desktop and with touch on phones and tablets.

> **Hobby project.** Coco Blocks is a free, fan-made game with no ads and no purchases. It is not affiliated with, endorsed by, or connected to any game company or brand. All code, visuals and the music arrangement were written from scratch.

## Play

Play it at https://danpune.github.io/coco-blocks/ or open `index.html` in a browser.

On an iPhone or iPad, open the link in Safari, tap Share, then "Add to Home Screen" to get an app icon that opens the game full screen.

## Modes and options

- **Marathon** – endless play that speeds up every 10 lines
- **Sprint** – clear 40 lines as fast as you can
- **Classic '84** – green-screen look, random pieces, no hold and no landing outline
- **Start level** – begin Marathon or Classic at any level from 1 to 15
- **Chill** – the fall speed stops rising at level 8; Chill games keep their own best score

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move | ← → | ◀ ▶ buttons, or drag on the board |
| Rotate | ↑ / X (right), Z (left) | ↻ ↺ buttons, or tap the board |
| Soft drop | ↓ | Soft Drop button, or drag down |
| Hard drop | Space | Hard Drop button, or flick down |
| Hold | C / Shift | Tap the Hold box, or flick up |
| Pause | P / Esc | Pause button |

## Sound

- The speaker button mutes everything. The ♪ button switches between the two music tracks, or turns music off.
- Track 1 is the project's own arrangement of "The Little Birch Tree" (Vo pole beryoza stoyala), a traditional Russian folk song in print since the 1790s and in the public domain. Track 2, "Coco's Theme", is an original composition.
- All sound is synthesized in the browser; there are no audio files.

## Tech

`index.html` holds the whole game: plain JavaScript, HTML canvas for drawing, Web Audio for the music and sound effects. No libraries, no build step, no tracking. The only other files are the app icons and `manifest.webmanifest` for the home-screen install. Best scores and settings are saved in the browser's local storage.

## Tests

`node tests/logic.js` runs the rule tests (needs only Node). They also run automatically on every push through GitHub Actions.

## License

MIT – see [LICENSE](LICENSE).
