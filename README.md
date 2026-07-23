# 🌾 ApnaKissan – AI-Powered Smart Agriculture Ecosystem

ApnaKissan is a premium, next-generation digital farming companion designed for Indian farmers. The ecosystem leverages Artificial Intelligence, Computer Vision, Geospatial Intelligence, and Water Intelligence to assist farmers throughout the cultivation cycle: **Before Sowing**, **During Cultivation**, and **After Harvesting**.

The project is structured with an enterprise-ready modular architecture:

```
ApnaKissan/
├── Backend/          # Node.js + Express API & AI Agents
├── User/             # React Native Expo SDK 57 Mobile Application
├── Admin/            # React.js + Vite responsive Control Panel
└── docker-compose.yml
```

---

## 🌟 Key Features

### 1. AI Farm Digital Twin Simulator
A predictive simulation environment mapping physical plots. Farmers can simulate farming decisions (e.g., swapping paddy to maize, adjusting rainfall scenarios, altering irrigation routines) and inspect impacts on expected crop yield, water requirements, and net profits before making investments.

### 2. Multi-Agent AI Orchestration
Domain-specialized AI Agents collaborate through a central Orchestrator:
* **Farmer AI**: Agronomy guidelines and crop scheduling.
* **Geo AI**: Soil classification and NPK composition.
* **Weather AI**: Micro-climate adaptation.
* **Water AI**: Water stress indices and conservation.
* **Scheme AI**: Eligibility calculation.
* **Vision AI**: Image-based leaf diagnostic routines.

### 3. Google Earth-Style GIS Map Layers
Dynamic map overlay switcher allowing toggling of Soil Moisture profiles, NDVI Crop Density indexes, and Flood Risk outlines on top of base Sentinel Satellite imagery.

### 4. Computer Vision Disease Diagnostics
Foliar leaf image diagnostics tracking disease, confidence metrics, organic bio-treatments, chemical instructions, and local agro-inputs dealers.

---

## 🚀 Quick Start Guide

### Installation
Run the root workspace script to configure packages across all directories:
```bash
npm run install:all
```

### Running Modules Individually

#### API Server
```bash
cd Backend
npm run dev
```
*Port: 5000*

#### Web Admin Dashboard
```bash
cd Admin
npm run dev
```
*Port: 3000*

#### Expo Mobile Application
```bash
cd User
npm run start
```
Scan the terminal QR code using the **Expo Go** application on your physical Android or iOS device to run the app.