# Deg ø Vin – webbplats

Webbplatsen för Deg ø Vin, napolitansk surdegspizzeria på Spångavägen 309 i Bromma. Byggd och förvaltad av Dara IT.
Next.js 16 (App Router), deployas på Vercel till [degovin.se](https://degovin.se) vid push till `main`.

## Köra lokalt

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # kontrollera innan push
```

## Innehåll från Dara IT-portalen

Meny, vinmeny, öppettider, lunch, texter, kontaktuppgifter, länkar och galleri redigeras av kunden i
[portal-dara-it.com](https://portal-dara-it.com) (CMS v2).

- `cms/manifest.ts` – vad som går att redigera. Nycklarna får aldrig döpas om, då slutar sparat innehåll att synas.
- `cms/defaults.ts` – nuvarande innehåll, används tills kunden sparar något och om portalen inte svarar.
- `app/.well-known/dara-cms.json/route.ts` – publicerar manifestet som portalen läser.
- `app/page.tsx` – hämtar innehållet på servern (uppdateras högst en gång per minut).
- `lib/dara-cms.ts` – ramverksoberoende kärna; samma fil kan användas i andra kunders sajter.

Strukturerad data för Google (adress, öppettider) ligger i `app/layout.tsx` och uppdateras inte från portalen.
