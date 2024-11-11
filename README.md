![OneTier Homepage](public/homepage-screenshot.png)

This project is a high-performance, static website built from the ground up using Astro, tailored for OneTier—a company focused on cybersecurity, network protection, and data security. Designed with an emphasis on speed, responsiveness, and modern aesthetics, the site demonstrates cutting-edge performance by leveraging Astro’s static site generation capabilities, optimizing load times, and ensuring seamless user interactions. Currently located and hosted at www.onetier.com

---

## ✨ Features

To maximize flexibility and interactivity, this website incorporates a custom vector graphic path system. Built with fixed anchors on HTML elements, the system enhances responsiveness and adaptability, enabling sophisticated animations that adjust dynamically to screen size and orientation. This unique approach aligns with our focus on delivering engaging, scalable web experiences that excel across all device types.

---

## 🚀 Project Structure

Here's an overview of the main directories and files in the project:

    ├── public/
    │   ├── clientLogos/
    │   ├── css/
    │   ├── featureIcons/
    │   ├── fonts/
    │   ├── helpers/
    │   ├── lines/
    │   ├── menuIcons/
    │   ├── mockups/
    │   ├── partnerLogos/
    │   ├── productIcons/
    │   ├── productImages/
    │   ├── profiles/
    │   ├── social-media-icons/
    │   ├── solutionsIcons/
    │   ├── robots.txt
    │   └── sitemap.xml
    ├── src/
    │   ├── components/
    │   ├── data/
    │   ├── layouts/
    │   ├── pages/
    │   ├── lib/
    │   ├── consts.ts
    │   └── env.d.ts
    ├── .astro/
    ├── .vscode/
    ├── astro.config.mjs
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── tsconfig.json

Astro automatically exposes `.astro` and `.md` files in the `src/pages/` directory as routes.

---

## 🏠 Homepage Structure

The homepage is designed to provide a comprehensive overview of OneTier's offerings. It includes:

- **Hero Section**: An introduction with a call-to-action.
- **Products**: Displaying key products with descriptions and links.
- **Clients**: Carousel featuring logos of clients and partners.
- **Events**: Upcoming events, dynamically fetched and displayed.
- **Blog**: Latest articles with excerpts and links.
- **Contact**: Contact form for visitor inquiries.

---

## 🧩 Key Components

- **Layout.astro**: Main layout component for multiple pages.
- **CardComponent.astro**: Reusable card component.
- **ProductSnippet.astro**: Displays product snippets.
- **CounterComponent.jsx**: A React component for counting.
- **DottedPathSVG.astro**: SVG component for dotted paths.
- **Carousel.astro**: Displays logos and images in a carousel.

---

## 📄 Pages Overview

- `index.astro`: Main landing page with products, clients, events, and carousel.
- `global-data-security.astro`: Global Data Security product page.
- `partners.astro`: Partner Program page.
- `company.astro`: Company overview page.
- `leadership.astro`: Leadership team page.
- `news/index.astro`: News page listing recent posts.
- `blog/index.astro`: Blog page listing recent posts.

---

## 🧞 Commands

Commands for running the project from the terminal:

| Command                  | Action                                                    |
|--------------------------|-----------------------------------------------------------|
| `npm install`            | Install dependencies                                      |
| `npm run dev`            | Start local development server at `localhost:4321`        |
| `npm run build`          | Build production site to `./dist/`                        |
| `npm run preview`        | Preview build locally                                     |
| `npm run astro ...`      | Run Astro CLI commands like `astro add`, `astro check`    |
| `npm run astro -- --help`| Get help using the Astro CLI                              |

---
