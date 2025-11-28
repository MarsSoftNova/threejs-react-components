# threejs-example

A small React app demonstrating a few Three.js scenes and navigation between them.

This project was scaffolded with Create React App and uses:

- React
- Three.js for 3D rendering
- GSAP for animations
- React Router for navigation

## Quick Start

Prerequisites: Node.js (14+ recommended) and npm (or yarn).

1. Install dependencies

```powershell
npm install
```

2. Start the development server

```powershell
npm start
```

Open http://localhost:3000 in your browser. The app will hot-reload as you edit files.

3. Build for production

```powershell
npm run build
```

4. Run tests

```powershell
npm test
```

## What you'll find in this repo

Top-level files

- `package.json` — dependencies and scripts
- `public/` — static HTML + manifest
- `src/` — React app source

Important source files

- `src/index.js` — app entry
- `src/App.js` — router + routes
- `src/components/Homepage.js` — landing page
- `src/components/CubeSelect.js` — a Three.js cube group scene
- `src/components/LabCity.js` — another Three.js scene
- `src/assets/css/` — styles used by scenes/pages

Routes

- `/` — homepage
- `/cube-group-rotate` — cube group rotation demo
- `/lab-city` — lab city demo

## Development notes

- Three.js scenes are implemented inside React components under `src/components/`. If you add new scenes, follow the existing pattern: create a component that mounts a Three.js renderer into a DOM node and clean up on unmount.
- Animations use GSAP (see `package.json`).
- Router is implemented with `react-router-dom` (v6+ API).

## Tests & Quality

- This project uses Create React App test tooling. Run `npm test` for the test runner.

## Contributing

Contributions are welcome. If you add features, please:

1. Add code under `src/components` or `src/assets` as appropriate.
2. Update this README with any new routes or setup steps.

## License

This project does not include a license file. Add one if you plan to publish it (for example, MIT).

---

If you'd like, I can also:

- Add a short developer guide for adding new Three.js scenes.
- Add a minimal CONTRIBUTING.md and LICENSE file.

Tell me which extras you'd like and I'll add them.
