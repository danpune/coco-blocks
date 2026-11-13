# Coco Blocks

A falling-block puzzle game for the browser. Works with a keyboard on desktop and with touch on phones and tablets.

> **Hobby project.** Coco Blocks is a free, fan-made game with no ads and no purchases. It is not affiliated with, endorsed by, or connected to any game company or brand. All code, visuals and the music arrangement were written from scratch.

## Play

Open `index.html` in a browser, or host the folder with GitHub Pages.

## Modes

- **Marathon** – endless play that speeds up every 10 lines
- **Sprint** – clear 40 lines as fast as you can
- **Classic '84** – green-screen look, no hold, no ghost piece

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move | ← → | ◀ ▶ buttons, or drag on the board |
| Rotate | ↑ / X (right), Z (left) | ↻ ↺ buttons, or tap the board |
| Soft drop | ↓ | Soft Drop button, or drag down |
| Hard drop | Space | Hard Drop button, or flick down |
| Hold | C / Shift | Tap the Hold box, or flick up |
| Pause | P / Esc | Pause button |

## Tech

One self-contained `index.html`: plain JavaScript, HTML canvas for drawing, Web Audio for the synthesized music and sound effects. No libraries, no build step, no tracking. Best scores are saved in the browser's local storage.

## License

MIT – see [LICENSE](LICENSE).
