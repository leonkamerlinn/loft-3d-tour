# Loft 3D Tour — 1:1 rekonstrukcija + redizajn Japandi

**Live (Google Cloud Run):** https://loft-3d-tour-370434332956.europe-west1.run.app
**Izravno na redizajn:** https://loft-3d-tour-370434332956.europe-west1.run.app/?interijer=redizajn

Interaktivna 3D web-stranica za šetnju kroz dvoetažni interijer (`8.89 × 10.23 × 6.19 m`) u mjerilu **1:1**, rekonstruiran iz Apple LiDAR RoomPlan skena (`room.usdz`) i referentnih fotografija u Blenderu te prikazan u stvarnom vremenu pomoću **Three.js (WebGL)**.

## Dva interijera, ista arhitektura

| | Postojeće | Redizajn ✦ Japandi Calm |
|---|---|---|
| Zidovi | bijela žbuka | topli vapneni štuk |
| Pod | hrastov laminat | parket riblja kost |
| Dimnjak | crvena opeka | izbijeljena opeka |
| Krovne grede | medeni hrast | ebonizirani (crno močeni) hrast |
| Istočni zid | tamne rustikalne daske | vertikalne hrastove letvice na crnom filcu |
| Kuhinja | beton siva + antracit | kadulja mat + hrast + travertin |
| Blagovaonica | hrastov stol, baršunaste stolice | okrugli travertinski stol Ø 136 cm, hrast + bouclé |
| Boravak | siva chesterfield L-garnitura | krem bouclé modularna garnitura, mid-century fotelja |
| Rasvjeta | kupole i opalne kugle | papirnate lampe (Akari), LED trake, 2700 K |

Prekidač **Postojeće / Redizajn** nalazi se u gornjoj traci. Kartice se mijenjaju ovisno o interijeru, a gumb **⇆ Prije / poslije** otvara klizač s Cycles renderima iz identične kamere.

## Značajke
- Scroll-vođena kamera kroz 8 zona i uspon na galeriju (cijela putanja provjerena raycastom u Blenderu)
- 360° slobodni pogled, večernji / dnevni ambijent, interaktivni tlocrt
- Prilagođeno mobitelima (na mobitelu je u GPU memoriji samo aktivni interijer)

## Lokalno pokretanje

```bash
npm install
npm start   # http://localhost:8080
```
