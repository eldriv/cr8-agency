# CR8 Agency

Modern marketing website for **CR8 Agency** — a creative studio offering graphic design, video editing, motion graphics, animation, and web development.

**Live site:** [cr8-agency.netlify.app](https://cr8-agency.netlify.app)

---

## About this project

This project is open source with their permission and will actively be used by my client, CR8 Agency. It is developed in close collaboration to ensure it meets their needs and reflects their brand. Contributions and forks are welcome.

**Note:** The backend API will not be publicized, it's intended to be separated for private use. You will see in the code under `src/config.js` that the backend URL has been deployed through [Render](https://render.com) (`https://cr8-backend.onrender.com` in production, `http://localhost:3002` locally).

---

## Features

- **Full-viewport hero** with cinematic background video and left-aligned content
- **About, Services, Works, and Contact** sections with scroll reveals and brand styling
- **Interactive service cards** with hover UI scenes tailored to each offering
- **Reels-style portfolio carousel** with snap scrolling and pagination
- **AI chat widget** powered by the private CR8 backend (Gemini proxy)
- **Contact form** via Formspree
- **Responsive layout** optimized for mobile and desktop
- **Scroll progress indicator** in the navigation bar

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm

### Install

```bash
git clone https://github.com/eldriv/cr8-agency.git
cd cr8-agency
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build
npm run preview   # optional — preview the production build locally
```

### Lint

```bash
npm run lint
```

---

## CR8 Agency

- **Tagline:** Let's Create & Unleash Your Creative Vision.
- **Email:** creativscr8@gmail.com · eldriv@proton.me
- **Portfolio:** [cr8-agency.netlify.app/#works](https://cr8-agency.netlify.app/#works)

---

## License

This frontend is open source with CR8 Agency's permission. See repository license terms if a `LICENSE` file is present; otherwise treat the project as shared with attribution to CR8 Agency.
