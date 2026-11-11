# Loft 3D Tour — Interaktivna 1:1 WebGL Rekonstrukcija

**Live produkcijski link (Google Cloud Run):** https://loft-3d-tour-370434332956.europe-west1.run.app

Interaktivna 3D web-stranica za šetnju kroz dvoetažni interijer (`8.89 × 10.23 × 6.19 m`) rekonstruiran u mjerilu **1:1** iz Apple LiDAR RoomPlan skena (`room.usdz`) i referentnih fotografija u Blenderu te prikazan u stvarnom vremenu pomoću **Three.js (WebGL)**.

## Značajke
- **Scroll-vođena 3D kamera**: Glatko kretanje kroz 8 zona prizemlja i uspon lebdećim stepeništem na gornju galeriju.
- **360° Slobodni pogled**: Mogućnost otključavanja kamere na bilo kojoj točki za slobodnu rotaciju i zumiranje.
- **Večernji i dnevni ambijent**: Prebacivanje između večernje unutarnje rasvjete i dnevnog osvjetljenja u stvarnom vremenu.
- **Interaktivni 2D tlocrt (radar)**: Prikaz trenutne pozicije, kuta gledanja i brzi skok u odabranu prostoriju.
- **Usporedba sa stvarnim fotografijama**: Pregled referentnih fotografija i fotorealističnih Cycles rendera.

## Lokalno pokretanje

```bash
npm install
npm start
```

Aplikacija se pokreće na `http://localhost:8080`.
