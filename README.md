# OneTier | AnyCloud DataSecure Portfolio

This project is a high-performance, static website built from the ground up using Astro, tailored for OneTier—a company focused on cybersecurity, network protection, and data security. Designed with an emphasis on speed, responsiveness, and modern aesthetics, the site demonstrates cutting-edge performance by leveraging Astro’s static site generation capabilities, optimizing load times and ensuring seamless user interactions.

# Features

To maximize flexibility and interactivity, this website incorporates a custom vector graphic path system. Built with fixed anchors on HTML elements, the system enhances responsiveness and adaptability, enabling sophisticated animations that adjust dynamically to screen size and orientation. This unique approach aligns with our focus on delivering engaging, scalable web experiences that excel across all device types.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

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
├── [astro.config.mjs](http://_vscodecontentref_/1)
├── [package.json](http://_vscodecontentref_/2)
├── [postcss.config.js](http://_vscodecontentref_/3)
├── [tailwind.config.js](http://_vscodecontentref_/4)
└── [tsconfig.json](http://_vscodecontentref_/5)

Astro looks for .astro or .md files in the src/pages/ directory. Each page is exposed as a route based on its file name.

There's nothing special about src/components/, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

🏠 Homepage
The homepage of this site is designed to provide a comprehensive overview of OneTier's offerings and key information. It includes the following sections:

Hero Section: A welcoming hero section with a brief introduction and a call-to-action button.
Products: A showcase of our main products with brief descriptions and links to detailed pages.
Clients: A carousel displaying logos of our clients and partners.
Events: Information about upcoming events, dynamically fetched and displayed.
Blog: A section highlighting the latest blog articles with excerpts and links to full posts.
Contact: A contact form for visitors to get in touch with us.
Homepage Metadata
🧩 Key Components
Layout.astro: The main layout component used across various pages.
CardComponent.astro: A reusable card component.
ProductSnippet.astro: Displays product snippets.
CounterComponent.jsx: A React component for counting.
DottedPathSVG.astro: SVG component for dotted paths.
Carousel.astro: A carousel component for displaying logos and images.
📄 Pages
index.astro: The main landing page that includes various sections like products, clients, events, and a carousel.
global-data-security.astro: Page for Global Data Security product.
partners.astro: Page for Partner Program.
company.astro: Company overview page.
leadership.astro: Leadership team page.
news/index.astro: News page listing recent posts.
blog/index.astro: Blog page listing recent posts.
🧞 Commands
All commands are run from the root of the project, from a terminal:

Command	Action
npm install	Installs dependencies
npm run dev	Starts local dev server at localhost:4321
npm run build	Build your production site to ./dist/
npm run preview	Preview your build locally, before deploying
npm run astro ...	Run CLI commands like astro add, astro check
npm run astro -- --help	Get help using the Astro CLI
👀 Want to learn more?
Check out our documentation or jump into our Discord server.
