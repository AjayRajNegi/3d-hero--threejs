# 3D Planet - Interactive Earth Visualization

A stunning 3D Earth visualization built with Next.js and Three.js, featuring realistic shaders, atmospheric effects, and smooth scroll-triggered animations.

![3D Planet](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-0.182.0-black?style=flat-square&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

## ✨ Features

- **Realistic 3D Earth Rendering** - Custom GLSL shaders for photorealistic Earth visualization
- **Day/Night Cycle** - Dynamic blending between day and night textures based on sun position
- **Atmospheric Effects** - Beautiful atmosphere rendering with twilight colors
- **Cloud Specular Reflections** - Realistic specular highlights on cloud layers
- **Scroll-Triggered Animations** - Smooth camera transitions and content blur effects using GSAP ScrollTrigger
- **Responsive Design** - Optimized for both desktop and mobile devices
- **Smooth Scrolling** - Enhanced scroll experience with Lenis
- **Performance Optimized** - Efficient rendering with GSAP ticker for smooth 60fps animations

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **3D Library**: [Three.js 0.182.0](https://threejs.org/)
- **Animation**: [GSAP 3.14.2](https://greensock.com/gsap/) with ScrollTrigger
- **Smooth Scrolling**: [Lenis 1.3.17](https://lenis.studiofreight.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: TypeScript 5
- **Linting/Formatting**: [Biome](https://biomejs.dev/)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AjayRajNegi/3d-hero--threejs.git
cd 3d_planet
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Add Earth textures to the `public/earth/` directory:
   - `day.jpg` - Daytime Earth texture
   - `night.jpg` - Nighttime Earth texture (city lights)
   - `specularClouds.jpg` - Cloud and specular map

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

The page auto-updates as you edit files. You can start editing the page by modifying `src/app/page.tsx`.

### Build

Create a production build:

```bash
npm run build
npm start
```

### Linting & Formatting

```bash
# Check for linting errors
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
3d_planet/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page with hero section
│   │   └── favicon.ico
│   ├── components/
│   │   └── 3D/
│   │       ├── planet.ts       # Main 3D planet initialization
│   │       └── shaders/
│   │           ├── earth/
│   │           │   ├── vertex.glsl    # Earth vertex shader
│   │           │   └── fragment.glsl  # Earth fragment shader
│   │           └── atmosphere/
│   │               ├── vertex.glsl    # Atmosphere vertex shader
│   │               └── fragment.glsl  # Atmosphere fragment shader
│   ├── styles/
│   │   ├── base.css
│   │   ├── fonts.css
│   │   ├── landing.css
│   │   └── main.css
│   └── types/
│       └── custom.d.ts         # TypeScript type definitions
├── public/
│   └── earth/                  # Earth texture maps (add your textures here)
│       ├── day.jpg
│       ├── night.jpg
│       └── specularClouds.jpg
├── next.config.ts              # Next.js configuration with GLSL loader
├── tsconfig.json               # TypeScript configuration
├── biome.json                  # Biome linting/formatting config
└── package.json
```

## 🎨 Key Features Explained

### Custom Shaders

The project uses custom GLSL shaders for advanced rendering:

- **Earth Shader**: Handles day/night texture blending, atmospheric scattering, cloud specular reflections, and Fresnel effects
- **Atmosphere Shader**: Renders the atmospheric glow around the planet with dynamic color transitions

### Scroll Animations

GSAP ScrollTrigger creates smooth scroll-based animations:
- Content blur and fade effects
- Camera zoom and position transitions
- Pin the hero section during scroll

### Performance

- Uses GSAP ticker for efficient animation loops
- Optimized texture loading with anisotropy
- Responsive camera adjustments on window resize

## 🔧 Configuration

### GLSL Shader Loading

The project uses `raw-loader` to import GLSL shaders. This is configured in `next.config.ts`:

```typescript
turbopack: {
  rules: {
    "*.{glsl,vs,fs,vert,frag}": {
      loaders: ["raw-loader"],
      as: "*.js",
    },
  },
}
```

### Texture Requirements

For best results, use high-resolution textures:
- **Day texture**: 2048x1024 or higher resolution Earth day map
- **Night texture**: Matching resolution Earth night map with city lights
- **Specular/Clouds**: RG channels for specular intensity and cloud coverage

## 🚢 Deployment

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Three.js Documentation](https://threejs.org/docs/) - Learn about Three.js 3D graphics
- [GSAP Documentation](https://greensock.com/docs/) - Learn about GSAP animations
- [GLSL Shader Tutorials](https://thebookofshaders.com/) - Learn about shader programming

## 📝 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a private project. Contributions are not currently accepted.

---

Built using Next.js and Three.js
