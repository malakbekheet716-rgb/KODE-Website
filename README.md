# KODE Sports Club — Employee Hub (Editable UI)

## Open the website
Open `index.html` in Chrome or Edge.

## Project structure

- `index.html` — main page structure
- `css/styles.css` — all visual styling, responsive layout, themes, and mascot animation
- `js/app.js` — dashboard navigation and interactions
- `assets/mascots/` — editable SVG cartoon companions
- `assets/icons/` — editable KODE SVG icon
- `data/pets.json` — easy list of available companions

## Animated KODE Buddy

The buddy is intentionally a cute illustrated/cartoon mascot rather than a realistic animal.

Available:
- Fox
- Cat
- Dog
- Bull
- Panda
- Bunny
- Penguin
- Bear

The employee can choose a buddy from the small button in the bottom-right controls. The selection is stored in the browser.

To replace a mascot:
1. Edit/replace the matching SVG in `assets/mascots/`.
2. Keep the same filename, OR update `data/pets.json` and the `petData` object in `js/app.js`.

## Themes

Default: KODE Blue / Purple.

Also included:
- Ocean
- Emerald
- Sunset
- Rose
- Indigo
- Light / Dark mode
- English / Arabic RTL

## Important production note

This package is a frontend prototype. For real deployment, connect it to a backend for authentication, role-based access, department permissions, persistent content, comments, notifications, document storage, and audit logs.


## Default companion
The animated **KODE Dog (puppy)** is now the default companion. Use the `☺` button beside the Buddy controls to choose another mascot.


## Optional animated Buddy

The Buddy is **optional**. It is shown by default for employees who want it, but anyone can hide it using the **🐶 Buddy** button in the bottom-right corner. Once hidden, a **🐶 Show Buddy** button appears in the same area so the employee can bring it back.

The Buddy choice and visibility preference are saved separately in the employee's browser.
