# Kuća Banfi 201A (Po + Pr + Pk + 3D Vrt) — 1:1 rekonstrukcija + Japandi redizajn

**Live (Google Cloud Run):** https://loft-3d-tour-370434332956.europe-west1.run.app
**Izravno na redizajn:** https://loft-3d-tour-370434332956.europe-west1.run.app/?interijer=redizajn
**Tehnička mapa za majstore:** https://loft-3d-tour-370434332956.europe-west1.run.app/majstor.html

Interaktivna 3D web-šetnja kroz **cjelovitu obiteljsku kuću na tri etaže** (**Podrum -2.73 m + Prizemlje 0.00 m + Potkrovlje +2.73 m**, gabarit `10.09 × 10.18 m`, sljeme `+6.19 m`, ukupno `248.4 m²` neto površine) i uređeni **3D vrt**, rekonstruirana u mjerilu **1:1** spajanjem građevinskih nacrta (`Po + Pr + Pk`, situacija, presjeci), triju Apple LiDAR RoomPlan skenova i referentnih fotografija u Blenderu te prikazana u stvarnom vremenu pomoću **Three.js (WebGL)**.

## Dva interijera i okućnice, ista 1:1 arhitektura (15 povezanih zona)

| | Postojeće stanje | Redizajn ✦ Japandi Calm |
|---|---|---|
| Okućnica & 3D Vrt | 2P prilaz s ceste Banfi, vanjsko stubište (-2.73 → 0.00 m), drveni ulazni trijem, travnata terasa s pergolom | Travertin R11 terasa & koračne ploče, uljena cedar pergola, vrtni lounge, 2700 K stupići |
| Podrum (`-2.73 m`) | Garaža (vrata 540 × 220 cm), radna prostorija SW, U-stubište, vešeraj i kotlovnica s engleskim šahtovima | Tehnički porculan R10, antracit radni pult, linearna LED rasvjeta, uređeni atelier/radna soba |
| Prizemlje jug (`0.00 m`) | Otvoreni atrij, antracit-hrast kuhinja, blagovaonica, peć na pelete na crvenoj opeci, boravak, SE balkon | Parket riblja kost, vapneni štuk, kadulja + travertin kuhinja, Akari lampe, letvičasti TV zid, bouclé garnitura |
| Prizemlje sjever (`0.00 m`) | Predsoblje s U-stubištem, Soba 1 SZ, Kupaonica Pr (walk-in tuš), Soba 2 SI | Parket riblja kost, laneni tekstil, walk-in kupaonica u mat travertinu i brušenoj mjedi |
| Krovište & L-stepenište | 14 otvorenih lebdećih gazišta bez čela, povišene uzdužne grede, 2× napete sajle s 8 spotova | Ebonizirane grede i rešetke na toplom bijelom stropu, mat uljena otvorena gazišta |
| Potkrovlje (`+2.73 / +2.74 m`) | Čist most galerije, L-radni stol, garderoba (5-krilni bijeli ormar), kutna kada, glavna spavaća soba | Ebonizirani rukohvat, hrastove fronte ormara s LED krunom, spa travertin + mjed, lebdeći krevet s bouclé uzglavljem |

Prekidač **Postojeće / Redizajn** nalazi se u gornjoj traci. Kartice se mijenjaju ovisno o interijeru, a gumb **⇆ Prije / poslije** otvara klizač s Cycles renderima iz identične kamere.

## Značajke
- Scroll-vođena kamera kroz **15 zona** (od prilaza i 3D vrta, preko vanjskog i unutarnjeg U-stubišta kroz podrum i sve prizemne sobe sve do potkrovlja) s bezkolidarnim Centripetal Catmull-Rom putanjama
- **360° šetnja (`WASD`)** — rotacija oko očišne točke bez prolaska kroz zidove (`three-mesh-bvh` kolizijska kapsula, automatsko penjanje i spuštanje po vanjskim, podrumskim U-stubama i glavnom L-stepeništu, tap-to-walk, mobilni joystick)
- **4-etažni interaktivni radar tlocrt** (`Situacija / Vrt`, `Podrum -2.73 m`, `Prizemlje 0.00 m`, `Potkrovlje +2.73 m`) s dinamičnim skokom i negativnom visinskom telemetrijom
- **📏 Mjeri (3D laser)** — dodirom bilo koje dvije točke na 3D modelu mjeri ukupnu, vodoravnu (`↔`) i visinsku (`↕`) udaljenost u metrima i centimetrima
- **🛠 Za majstore** (`/majstor.html` + bočna ladica u turi) — **8 kotiranih ortografskih tlocrta** (`Situacija`, `Podrum`, `Prizemlje`, `Potkrovlje` × postojeće & redizajn), tehnički listovi za svih **15 zona**, troškovnik radova s Excel `;` UTF-8 CSV izvozom i A4 ispisom / PDF-om
- Dnevno / večernje osvjetljenje, dinamičko zonsko prigušivanje svjetala i optimizacija za mobitele (`room_3d.glb` 3.8 MB, `room_redesign.glb` 5.2 MB)

## Lokalno pokretanje

```bash
npm install
npm start   # http://localhost:8080
```