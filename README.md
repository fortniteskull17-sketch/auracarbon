AuraCarbon (rebuilt)

This is a single Next.js app implementing a Green Credit calculator.

Quick start (development):

1) Install dependencies

```bash
cd auracarbon_rebuilt
npm install
```

2) Run dev server

```bash
npm run dev
```

Open http://localhost:3000

Production (Docker):

```bash
docker compose build
docker compose up
```

API: POST /api/green-credits/calculate
Body: { baseline_tco2e: number, new_tco2e: number, credit_price_usd?: number }
