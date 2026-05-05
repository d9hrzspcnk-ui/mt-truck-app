# MT Truck & Trailer Repair App

First version of a simple desktop/web shop management app for a diesel truck and trailer repair business.

## Features

- Dashboard overview
- Customers
- Companies
- Vehicles (VIN, unit number, license plate, mileage)
- Work orders with mechanic task checklist
- Invoice list
- Parts inventory
- Upload pictures to work orders
- Maintenance reminders
- Global search (customer, company, VIN, truck, unit number)
- Basic shop expense calculator for suggested hourly labor rate

## Tech

- React + Vite (web UI)
- Electron (desktop wrapper)

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Run desktop + web dev mode

```bash
npm run dev
```

This starts Vite and launches Electron once the dev server is ready.

### 3) Build web assets

```bash
npm run build
```

### 4) Run Electron against built assets

```bash
npm run start
```

(Requires running `npm run build` first so `dist/` exists.)
