
# ToolBox

ToolBox is a lightweight and accessible front-end UI toolkit. It is built using pure HTML, SCSS, and JavaScript (with Vite), and provides reusable, customizable, and framework-free components. Users are encouraged to freely use and modify this project as they wish.

---

## 🌟 Features

- ⚙️ Modular JS components
- 🎯 ARIA accessibility support
- 🧠 Keyboard navigation for all interactive elements
- 🪶 No dependencies or frameworks
- ⚡ Powered by Vite
- 🌐 Easily customizable and extendable

---

## 📁 Project Structure

```
.
├── components/        # JavaScript UI components (modals, forms, navs, etc.)
├── traits/            # Shared utility functions (ARIA, inert, key events, etc.)
├── styles/            # SCSS/CSS files (not included here but referenced in HTML)
├── index.html         # Main landing page
├── main.js            # JS entry point
├── package.json       # Project metadata and scripts
├── vite.config.js     # (optional) Vite config
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development mode

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

---

## 🔧 Customization

Each component is written as a standalone JavaScript module, using query selectors and basic event handling. All logic is centralized inside `components/` and `traits/`, so you can pick, remove, or refactor features easily without affecting others.

---

## 🤝 Contributing

You’re welcome to fork this repo, add your own ideas, fix bugs, or refactor components. Contributions are open!

---

## 📜 License

This project is licensed under the MIT License.

---

© 2025 oussSika
