# 海与船 · Sail the Mind (Eazo edition)

A small 3D world you sail through. Four islands. Twelve people you can meet.
Wrapped in the Eazo Next.js template so it runs inside Eazo Mobile.

The Three.js scene lives as a single self-contained file at
`public/sail.html` (~78 KB, zero npm deps, Three.js via CDN). The Next.js
shell mounts it in a fullscreen iframe and adds:

- **Eazo auth** — a small Captain badge in the top-left (`auth.login()`).
- **Eazo memory** — every time you press `↵` to speak with someone, the
  scene posts an `encounter:open` message and the shell calls
  `memory.reportAction()`. Over time, your conversations become
  AI-searchable memory.

## Local dev

```bash
cp .env.example .env   # fill EAZO_APP_ID + EAZO_PRIVATE_KEY from creator.eazo.ai
bun install
bun dev                # → http://localhost:3000
```

The standalone scene also runs without Eazo at all — open `/sail.html`
directly in any browser.

## Deploy

```bash
vercel
```

The repo includes `vercel.json` with the iframe CSP already set so Eazo
Mobile can embed the deployed URL.

After deploy, paste the Vercel URL into your Eazo Creator app config to
register it as the live target.

## Editing the world

The scene is one file:

```
public/sail.html        ← edit this for any world changes
public/audio/*.mp3      ← CC0 audio (Kounine + Bruno's folio-2025)
src/components/sail/    ← Eazo SDK overlay layer
src/app/page.tsx        ← mounts SailWorld
```

Standalone repo: https://github.com/CaptainVuka/sail-the-mind. Keep
`public/sail.html` here in sync with `index.html` there.

## Credits

- **Music**: Kounine (Kevin Colombin) — *Baguira*, *Boy*, *Sudo*. CC0.
- **Ambient SFX**: from Bruno Simon's [folio-2025](https://github.com/brunosimon/folio-2025). CC0.
- **Template**: forked from [EazoAI/eazo-creator-nextjs-template](https://github.com/EazoAI/eazo-creator-nextjs-template).

## License

MIT for the wrapper code. CC0 for the audio. The upstream Eazo template
follows its own license.
