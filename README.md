# Minecraft JS Clone

A 3D browser-based voxel engine built with **Three.js** and **Vite**, focusing on procedural terrain generation and efficient rendering.

This repository serves as a hands-on exploration of WebGL rendering, 3D spatial data structures, and graphics optimization.

---

## 🛠️ Tech Stack

* **Three.js** - 3D rendering engine
* **Vite** - Build tool & dev server
* **lil-gui** - Debug parameter controls

---

## 🔑 Key Features

* **Procedural Terrain:** Seeded pseudo-random number generation combined with Simplex Noise for reproducible heightmaps.
* **Efficient Memory Grid:** Lightweight 3D array data structure decoupled from rendering logic.
* **Instanced Rendering:** Single draw call GPU optimization using `InstancedMesh`.

---

## 🚀 Status

This project is actively under development. Additional features and engine improvements will be added over time!

---

## 🙏 Acknowledgments

Built following [Dan Greenheck's Minecraft Three.js Clone course](https://github.com/dgreenheck/minecraft-threejs-clone).