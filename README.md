# Loft 3D Tour — 1:1 rekonstrukcija + redizajn Japandi

**Live (Google Cloud Run):** https://loft-3d-tour-370434332956.europe-west1.run.app
**Izravno na redizajn:** https://loft-3d-tour-370434332956.europe-west1.run.app/?interijer=redizajn
**Tehnička mapa za majstore:** https://loft-3d-tour-370434332956.europe-west1.run.app/majstor.html

Interaktivna 3D web-stranica za šetnju kroz dvoetažni interijer (`10.09 × 10.18 × 6.19 m`) u mjerilu **1:1**, rekonstruiran spajanjem triju Apple LiDAR RoomPlan skenova (`01_loft_glavni_dio.usdz`, `02_sjeverno_krilo_kat.usdz` i `03_gornja_galerija_i_most.usdz`) i referentnih fotografija u Blenderu te prikazan u stvarnom vremenu pomoću **Three.js (WebGL)**.

## Dva interijera, ista arhitektura (11 povezanih zona)

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
| Galerija, most & stubište (Room 3) | uvučeni krovni prozor, kutni stol s monitorom i biljkom uz ogradu, sjeverni most s rukohvatima, stubište sa zidnim okvirima i ZZ biljkom | japandi obrada galerije, mosta, stubišnih gazišta i rasvjete |
| Garderoba & ured (Room 2) | 5-krilni bijeli sjajni ormar + hrast letvice, kožna *Butterfly* fotelja, bačva-stolić *LEGENDS 1872*, crni radni stol | hrastove fronte s LED rasvjetom, bouclé & travertin |
| Kupaonica (Room 2) | pješčano-bež i sive pločice, polukružna kutna kada, rustik-hrast ormarić, okruglo ogledalo Ø 94 cm | mat travertin, brušena mjed, halo LED ogledalo |
| Glavna spavaća soba (Room 2) | smeđe-sivi krevet s bijelom ladicom i oker prekrivačem, otvorena hrastova konzola (2.31 m), solna lampa | lebdeći hrastov krevet, bouclé, lan i papirnate lampe |
| Rasvjeta | kupole i opalne kugle | papirnate lampe (Akari), LED trake, 2700 K |

Prekidač **Postojeće / Redizajn** nalazi se u gornjoj traci. Kartice se mijenjaju ovisno o interijeru, a gumb **⇆ Prije / poslije** otvara klizač s Cycles renderima iz identične kamere.

## Značajke
- Scroll-vođena kamera kroz **11 zona** s proširenim vidnim poljem (`96°–102° hFOV`), odvojenim kruženjem po malim sobama i asimetričnim kadriranjem uz rub kartica
- **360° šetnja (`WASD`)** — rotacija oko vlastite očišne točke bez propadanja kroz zidove (`three-mesh-bvh` kolizijska kapsula, automatski hod po stubištu, tap-to-walk, mobilni joystick)
- **📏 Mjeri (3D laser)** — dodirom bilo koje dvije točke na 3D modelu mjeri ukupnu, vodoravnu (`↔`) i visinsku (`↕`) udaljenost u metrima i centimetrima
- **🛠 Za majstore** (`/majstor.html` + bočna ladica u turi) — 4 kotirana ortografska tlocrta, tehnički listovi za svih 11 zona, troškovnik radova s Excel `;` UTF-8 CSV izvozom i A4 ispisom / PDF-om
- Večernji / dnevni ambijent, interaktivni tlocrt, **⇆ Prije / poslije** Cycles klizač i prilagodba mobitelima (u GPU memoriji ostaje samo aktivni interijer)

## Lokalno pokretanje

```bash
npm install
npm start   # http://localhost:8080
```
