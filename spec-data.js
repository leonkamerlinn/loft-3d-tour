// Tehnički podaci i troškovnik za izvođače radova ("majstore")
// Svi brojevi potječu iz 1:1 LiDAR + Blender geometrije (01_loft_postojece_stanje.blend i 02_loft_redizajn_japandi.blend).
// Čisti ES modul bez ovisnosti o DOM-u (zajednički za index.html #spec-drawer i majstor.html).

export const PROJECT = {
  title: 'Dvoetažni Loft 1:1 — Tehnička mapa i troškovnik za izvođače',
  subtitle: 'Adaptacija postojećeg stanja u koncept „Japandi Calm” (prizemlje + galerija + sjeverno krilo)',
  version: '1.0',
  date: '13. 11. 2026.',
  units: 'm / cm / m²',
  accuracy: 'Apple LiDAR RoomPlan 1:1 skenovi (Room 1 + Room 2) + fotogrametrijska kalibracija (±1–2 cm)',
  disclaimer: 'Sve mjere izvedene su iz 1:1 LiDAR 3D modela. Izvođač (stolar, keramičar, električar, vodoinstalater) dužan je prije narudžbe materijala i izrade namještaja po mjeri izvršiti kontrolnu izmjeru na gradilištu.',
  overall: {
    footprint: '10.09 × 10.18 m',
    ridge: '6.19 m',
    netFloorArea_m2: 103.6,
    floors: [
      {
        name: 'Prizemlje (0.00 m)',
        zones: '01–06',
        area_m2: 53.7,
        height: '2.53 m pod galerijom / do 6.19 m u sljemenu'
      },
      {
        name: 'Međukat / krovište (+2.74 m)',
        zones: '07–08',
        area_m2: 12.1,
        height: '2.48 – 3.45 m pod kosinom'
      },
      {
        name: 'Sjeverno krilo — kat (+2.73 m, Room 2)',
        zones: '09–11',
        area_m2: 37.8,
        height: '2.49 m ravni strop (nadozidi 1.21 m istok / 1.47 m zapad)'
      }
    ]
  },
  siteSequence: [
    '1. Zaštita gradilišta, demontaža postojeće pokretne opreme, rasvjete, tamnih zidnih dasaka i starih fronti ormara/kuhinje.',
    '2. Grubi elektroinstalaterski radovi (štemanje/kabliranje skrivenih LED napajanja 24 V DC, TV bužira Ø 50 mm, utičnica uz krevet i kuhinju, IP44 krugova u kupaonici).',
    '3. Vodoinstalaterski grubi razvod i priprema podloge u kupaonici (zona 10) te kuhinji (zona 02).',
    '4. Hidroizolacija kupaonice u dva sloja s brtvenim trakama, polaganje mat travertin porculana (pod, kada, zidni stup umivaonika i WC obzid).',
    '5. Skela u atriju i krovištu: lagano brušenje i ebonizirano lazurno močenje triju krovnih rešetki i podrožnica, ličenje kosih stropova, bijela lazura dimnjaka.',
    '6. Fina žbuka i toplo vapneno ličenje zidova (NCS S 1505-Y30R) u svim suhim prostorijama.',
    '7. Niveliranje podloge i polaganje troslojnog hrastovog parketa riblja kost (prizemlje, galerija, garderoba i spavaća soba) te letvica.',
    '8. Montaža akustičnog panel-zida od hrastovih letvica na istočnom zidu boravka, novih fronti ormara (zona 09), kuhinje (zona 02) i kamenih ploča travertina.',
    '9. Fina montaža sanitarija u brušenoj mjedi, rasvjetnih tijela (2700 K), prekidača, utičnica i ispitivanje električnih/hidro instalacija.',
    '10. Isporuka i montaža pokretnog namještaja, tepiha, lanenih sjenila i završno čišćenje.'
  ]
};

export const ZONES = [
  {
    stop: 0,
    code: '01',
    name: 'Ulazni atrij i predsoblje',
    floor: 'Prizemlje (0.00 m)',
    openPlan: true,
    dims: {
      length_m: 3.8,
      width_m: 3.58,
      clearHeight_m: 6.19,
      kneeWall_m: null,
      floorArea_m2: 13.6,
      wallArea_m2: 24.5,
      note: 'Predsoblje (1.60 × 1.63 m, strop 2.14 m) + ulazna os otvorenog atrija do sljemena 6.19 m.'
    },
    existing: [
      'Predsoblje obloženo laminatom i bijelom žbukom; ulazni otvor s bijelim dovratnikom 102 × 203 cm i otvorenim bijelim krilom.',
      'Sjeverna vrata prema pomoćnom krilu s hrastovim okvirom 90 × 208 cm i pjeskarenim staklom.',
      'Centralni dvoetažni prostor s izravnim pogledom na južni dimnjak i međukatni stup.'
    ],
    redesign: {
      summary: 'Topla minimalistička ulazna zona: pod prelazi u hrastov parket riblja kost, zidovi dobivaju vapneni štuk, a dovratnik sjevernih vrata tamni ebonizirani ton.',
      finishes: [
        { element: 'Pod', material: 'Troslojni hrastov parket (riblja kost)', spec: 'Letvice 600 × 120 × 14 mm, prirodni uljeni hrast', qty: 15.0, unit: 'm²', note: 'Uključeno +10 % otpada za rezanje pod kutem' },
        { element: 'Zidovi i predsoblje', material: 'Vapneni štuk (prijedlog)', spec: 'Fina mineralna glet-masa + vapnena boja NCS S 1505-Y30R (#e9e1d3)', qty: 24.5, unit: 'm²', note: 'Bez otpada; uračunata impregnacija' },
        { element: 'Dovratnici ulaznog dijela', material: 'Ebonizirani hrast (lazura)', spec: 'Ton RAL 9005 mat lazura u 2 sloja na postojeći hrast', qty: 1, unit: 'kom', note: 'Svijetli otvor 90 × 205 cm' }
      ],
      furniture: [
        { item: 'Zidno ogledalo / vješalica (prijedlog)', dims: '60 × 4 × 160 cm', material: 'Masivni hrast + kristalno ogledalo', position: 'Zapadni zid predsoblja (X ≈ -0.60 m)', note: 'Prijedlog za odlaganje kaputa u niši predsoblja' }
      ],
      lighting: [
        { item: 'Ugradbena stropna svjetiljka predsoblja (prijedlog)', spec: '12 W LED, 2700 K, CRI > 90, IP20, mat bijela', qty: 1, mount: 'Središte stropa predsoblja (h = 2.14 m)', circuit: 'Krug 1 — senzor ili izmjenični prekidač uz ulaz' }
      ],
      electrical: [
        { item: 'Glavni blok prekidača atrija', qty: 2, height_cm: 105, position: 'Istočna strana međukatnog stupa (X = -0.27, Y = -1.95 m)', note: 'Postojeća pozicija; zamjena maski u mat antracit/crnu' },
        { item: 'Utičnica opća 230 V', qty: 1, height_cm: 30, position: 'Sjeverni zid uz predsoblje', note: 'Za robotski usisavač / održavanje' }
      ],
      plumbing: [],
      sequence: [
        'Zaštititi staklena vrata i demontirati stari laminat u predsoblju.',
        'Obnoviti/izravnati estrih, položiti impregnaciju i pripremiti podlogu za riblju kost u kontinuitetu s prizemljem.',
        'Izvesti gletanje i nanošenje toplog vapnenog štuka (NCS S 1505-Y30R).',
        'Pobrusiti i tonirati hrastov dovratnik u tamni ebonizirani hrast.'
      ]
    },
    checks: [
      'Provjeriti smjer polaganja riblje kosti da prati glavnu sjever–jug os atrija.',
      'Izmjeriti debljinu parketa + ljepila (≈16 mm) radi visine praga ulaznih vrata.'
    ]
  },
  {
    stop: 1,
    code: '02',
    name: 'Kuhinja',
    floor: 'Prizemlje — zapad (0.00 m)',
    openPlan: true,
    dims: {
      length_m: 4.48,
      width_m: 2.15,
      clearHeight_m: 2.52,
      kneeWall_m: null,
      floorArea_m2: 9.6,
      wallArea_m2: 16.8,
      note: 'Smještena ispod međukata galerije (svijetla visina 2.52 m); zapadni prozor iznad sudopera 112 × 99 cm.'
    },
    existing: [
      'Linijska kuhinja uz zapadni zid (X ∈ [-4.35, -3.65], Y ∈ [-5.01, -0.53 m]): donje fronte beton-siva, visoka kolona pećnice antracit (68 × 96 × 223 cm), samostojeći inox hladnjak (79 × 68 × 202 cm).',
      'Hrastova radna ploča d = 6 cm (290 × 71 cm) s crnim sudoperom (48 × 63 cm) i indukcijom (48 × 60 cm).',
      'Gornji antracit element 55 × 103 × 67 cm i 2 bijele otvorene police sjeverno od prozora.'
    ],
    redesign: {
      summary: 'Zamjena fronti i radne ploče u Japandi paletu: mat kadulja-zelene donje fronte, prirodni hrast na visokoj koloni i gornjim elementima, kamena ploča i zidna obloga od mat travertina.',
      finishes: [
        { element: 'Pod', material: 'Troslojni hrastov parket riblja kost (kontinuitet prizemlja)', spec: 'Vodootporna uljna zaštita oko mokre zone', qty: 10.6, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Zidna obloga (backsplash)', material: 'Mat travertin porculan/kamen', spec: 'Ploče d = 20 mm, h = 56 cm između ploče i elemenata', qty: 2.4, unit: 'm²', note: '+15 % za izreze oko prozora i utičnica' },
        { element: 'Zidovi i podgled galerije', material: 'Periva mineralna boja (NCS S 1505-Y30R)', spec: 'Paropropusna mat disperzija otporna na masnoću', qty: 14.4, unit: 'm²', note: 'Uključuje podgled galerije iznad kuhinje' }
      ],
      furniture: [
        { item: 'Donji kuhinjski niz (5 elemenata, fronte)', dims: '290 × 68 × 94 cm', material: 'MDF lakirani mat u boji kadulje (NCS S 4010-G50Y, #7d8a6a)', position: 'Zapadni zid Y ∈ [-4.06, -1.16 m]', note: 'Skriveni J-profil (bez ručkica), zadržavanje korpusa ako su ispravni' },
        { item: 'Radna ploča od travertina', dims: '290 × 71 × 3 cm', material: 'Impregnirani mat travertin (prirodni ili sinterirani kamen)', position: 'Zapadni zid h = 94 cm od poda', note: 'Izrezi za podpultni sudoper (48 × 63 cm) i indukciju (48 × 60 cm)' },
        { item: 'Visoka kolona za pećnicu + gornji ormarići', dims: '96 × 68 × 223 cm (kolona) / 103 × 55 × 67 cm (gornji)', material: 'Prirodni furnir svijetli hrast, mat lak', position: 'Jugozapadni kut Y ∈ [-5.01, -4.04 m]', note: 'Bočna obloga u hrastu do stropa galerije' },
        { item: 'Otvorene hrastove police', dims: '58 × 25 × 3 cm (2 kom)', material: 'Masivni hrast, uljen', position: 'Sjeverno od prozora Y ∈ [-1.78, -1.20 m], h = 168 i 198 cm', note: 'Skriveni metalni nosači u zidu' }
      ],
      lighting: [
        { item: 'Podormarićna LED linijska traka', spec: '14 W/m, 2700 K, CRI > 92, IP44 aluminijski profil s mliječnim difuzorom', qty: 1.05, mount: 'Donji rub gornjeg elementa (h ≈ 152 cm)', circuit: 'Krug 2 — dodirni/zidni prekidač uz radnu plohu' },
        { item: 'Stropna spot/nadgradna rasvjeta (prijedlog)', spec: '2× 10 W LED, 2700 K, CRI > 90, mat bijela/crna', qty: 2, mount: 'Podgled galerije ispred kuhinje (h = 2.52 m)', circuit: 'Krug 3 — glavni prekidač kuhinje' }
      ],
      electrical: [
        { item: 'Radne duple utičnice iznad ploče', qty: 4, height_cm: 115, position: 'Zapadni zid iznad radne ploče (Y ≈ -1.60 i -3.10 m)', note: 'Izrezi u oblozi od travertina' },
        { item: 'Priključak indukcijske ploče (3-fazni)', qty: 1, height_cm: 60, position: 'Iza donjeg elementa kuhanja (Y ≈ -3.52 m)', note: 'Kabel 5×2.5 mm², osigurač 3×16 A' },
        { item: 'Priključci pećnice, perilice i hladnjaka', qty: 3, height_cm: 45, position: 'Iza visoke kolone i podnožja hladnjaka (Y ≈ -4.55 i -0.87 m)', note: 'Zasebni osigurači 16 A s lakim pristupom kroz susjedni korpus' }
      ],
      plumbing: [
        { item: 'Priključak sudopera i slavine (PPR + odvod Ø 50 mm)', spec: 'Kutni ventili 1/2" + priključak za perilicu posuđa', position: 'Zapadni zid ispod prozora (Y = -2.33 m)', height_cm: 52, note: 'Podpultni crni/kameni sudoper + jednoručna miješalica brušena mjed' }
      ],
      sequence: [
        'Demontirati postojeću radnu ploču, sudoper, gornje fronte i odspojiti uređaje.',
        'Pripremiti podžbukne elektro-utičnice i dovod za LED traku ispod gornjih elemenata.',
        'Ugraditi nove fronte u kadulja mat izvedbi i hrastove fronte kolone/gornjih ormara.',
        'Izmjeriti šablonu na licu mjesta, izrezati i montirati travertinsku ploču te zidnu oblogu.',
        'Spojiti slavinu u brušenoj mjedi, sifon, indukciju i testirati na nepropusnost.'
      ]
    },
    checks: [
      'Provjeriti točnu dubinu postojećih korpusa (68 cm) i dimenziju prozorske klupčice prije rezanja kamene obloge.',
      'Osigurati ventilacijski zazor (min. 200 cm²) iznad i iza hladnjaka te ugradbene pećnice.'
    ]
  },
  {
    stop: 2,
    code: '03',
    name: 'Blagovaonica',
    floor: 'Prizemlje — jugozapad (0.00 m)',
    openPlan: true,
    dims: {
      length_m: 3.6,
      width_m: 3.1,
      clearHeight_m: 5.95,
      kneeWall_m: null,
      floorArea_m2: 11.2,
      wallArea_m2: 14.0,
      note: 'Uz veliku južnu staklenu stijenu (224 × 228 cm) s pogledom u dvoetažno krovište.'
    },
    existing: [
      'Pravokutni blagovaonski stol od zlatnog hrasta (193 × 105 × 78 cm) na crnim čeličnim X-nogama.',
      '4 bijele prošivene stolice + 2 ružičaste baršunaste stolice.',
      '2 viseće bijele kupole na visini h = 1.68 m iznad stola; tamne žaluzine na južnom prozoru.'
    ],
    redesign: {
      summary: 'Organizacija oko monolitnog okruglog stola od travertina Ø 136 cm pod velikom papirnatom lampom (Akari), uz lanene rolete na južnoj stijeni.',
      finishes: [
        { element: 'Pod', material: 'Troslojni hrastov parket riblja kost', spec: 'Isti slog bez dilatacijskih lajsni prema boravku i kuhinji', qty: 12.3, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Zidne plohe oko južne stijene', material: 'Vapneni štuk NCS S 1505-Y30R', spec: 'Fina mineralna obrada do krovnih kosina', qty: 14.0, unit: 'm²', note: 'Obrada špaleta oko južnih stakala' }
      ],
      furniture: [
        { item: 'Okrugli blagovaonski stol (prijedlog)', dims: 'Ø 136 × 79 cm', material: 'Impregnirani mat travertin (ploča + stožasto postolje)', position: 'Središte blagovaonice (X = -1.86, Y = -3.23 m)', note: 'Težina 120–150 kg — provjeriti unos kroz ulazna vrata' },
        { item: 'Blagovaonske stolice', dims: '58 × 56 × 80 cm (6 kom)', material: 'Masivni hrast + tapecirano sjedalo u krem bouclé tkanini', position: 'Raspoređene radijalno oko okruglog stola', note: 'Slobodan prolaz min. 85 cm prema kuhinji i kaminu' },
        { item: 'Rimske lanene rolete', dims: '224 × 228 cm', material: 'Prirodni poludrapirani lan u toplom tonu zobi', position: 'Južna staklena stijena (X ∈ [-2.98, -0.74])', note: 'Zamjena tamnih aluminijskih žaluzina' }
      ],
      lighting: [
        { item: 'Viseća papirnata lampa (Akari stil)', spec: 'Ø 76 cm, rižin papir + bambus/crni čelik, 1× E27 LED 12 W, 2700 K, CRI 95', qty: 1, mount: 'Ovjes s visine stropa (+5.70 m) točno iznad X = -1.86, Y = -3.23 m; donji rub sjenila na h = 1.60 m od poda', circuit: 'Krug 4 — postojeći izvod (ukinuti drugi izvod ili ujediniti u centralnu rozetu)' }
      ],
      electrical: [
        { item: 'Centralni stropni izvod rasvjete (spušteni ovjes 4.1 m)', qty: 1, height_cm: 570, position: 'Krovna kosina točno iznad središta stola (X = -1.86, Y = -3.23 m)', note: 'Potreban tekstilni kabel duljine min. 4.5 m s čeličnom sajlom ili čvrstim ovjesom' }
      ],
      plumbing: [],
      sequence: [
        'Demontirati dvije postojeće bijele kupole i pripremiti jedinstvenu rozetu iznad središta novog kružnog stola.',
        'Skinuti tamne žaluzine s južne stijene, obojiti špalete i montirati lanene rolete.',
        'Postaviti parket riblju kost, a nakon završnih ličilačkih radova unijeti i centrirati travertinski stol te montirati visilicu na visinu 160 cm od poda.'
      ]
    },
    checks: [
      'Zbog visine ovjesa (≈5.7 m) osigurati skelu u atriju zajedno s radovima na krovištu.',
      'Kod postavljanja travertinskog stola provjeriti ravnost podloge ispod stožaste baze.'
    ]
  },
  {
    stop: 3,
    code: '04',
    name: 'Kamin i južni zid',
    floor: 'Prizemlje — jug (0.00 m)',
    openPlan: true,
    dims: {
      length_m: 2.2,
      width_m: 1.8,
      clearHeight_m: 6.0,
      kneeWall_m: null,
      floorArea_m2: 4.0,
      wallArea_m2: 11.5,
      note: 'Dimnjački stup od opeke (136 × 23 × 598 cm) na južnom zidu s peći na pelete.'
    },
    existing: [
      'Vertikalni stup od crvene opeke visine 5.98 m s rustikalnom skulpturom od maslinovog drva na visini +3.34 m.',
      'Bordo peć na pelete (54 × 49 × 101 cm) s crnom dimovodnom cijevi promjera Ø 130 mm do visine +2.60 m.',
      'Dvije kromirane zidne lampe (gore/dolje) na dimnjaku na h = 1.62 m.'
    ],
    redesign: {
      summary: 'Dimnjak od opeke se izbijeljuje paropropusnom vapnenom lazurom (limewash), peć i zidne lampe prelaze u mat crnu, a uz južnu stijenu dodaje se veliko sobno stablo u terakoti.',
      finishes: [
        { element: 'Obloga dimnjaka', material: 'Vapnena lazura za opeku (limewash)', spec: '2 ruke razrijeđene mineralne vapnene boje, vidljiva tekstura fuge (#f2ece4)', qty: 11.0, unit: 'm²', note: 'Površina do visine sljemena (5.98 m) — izvoditi sa skele' },
        { element: 'Podloga oko peći (sigurnosna)', material: 'Kaljeno crno staklo ili kamena ploča (preporuka)', spec: 'Min. 70 × 70 cm ispod/ispred ložišta', qty: 1, unit: 'kom', note: 'Zaštita novog uljenog hrastovog parketa od žara' }
      ],
      furniture: [
        { item: 'Peć na pelete (dorada obloge)', dims: '54 × 49 × 101 cm', material: 'Termootporni mat crni lak (ili originalne mat crne stranice)', position: 'Ispred dimnjaka X = 0.02, Y = -4.42 m', note: 'Obvezno rastaviti bočne oplate i lakirati u komori termootpornom bojom do 300 °C' },
        { item: 'Velika biljka u terakota posudi', dims: 'Ø 48 × 125 cm', material: 'Terakota posuda + fikus/maslina (prijedlog)', position: 'Uz zapadnu stranu dimnjaka / južnu stijenu', note: 'Omekšava geometriju stijene' }
      ],
      lighting: [
        { item: 'Dvosmjerne zidne lampe (gore/dolje)', spec: 'Mat crni eloksirani aluminij, 2× GU10 LED 5 W, 2700 K, uski snop 36°', qty: 2, mount: 'Dimnjak X = ±0.44 m, visina h = 1.62 m od poda', circuit: 'Krug 5 — postojeći kablovi u dimnjaku' }
      ],
      electrical: [
        { item: 'Priključak peći na pelete (230 V + termostat)', qty: 1, height_cm: 30, position: 'Južni zid neposredno iza peći (X = 0.25, Y = -4.72 m)', note: 'Postojeća pozicija; provjeriti utikač i osigurač 16 A' }
      ],
      plumbing: [],
      sequence: [
        'Privremeno odspojiti dimovod i izvući/zaštititi peć na pelete.',
        'Otpremiti bočne oplate peći na termootporno lakiranje u mat crnu.',
        'Očistiti crvenu opeku od prašine, navlažiti podlogu i kistom nanijeti vapnenu lazuru (limewash) od vrha prema dnu.',
        'Zamijeniti kromirane lampe mat crnim cilindričnim svjetiljkama, postaviti staklenu/kamenu ploču ispod peći i vratiti peć uz ispitivanje brtvljenja dimovoda.'
      ]
    },
    checks: [
      'Provjeriti čistoću i brtvljenje dimovodne cijevi pri ponovnom spajanju peći.',
      'Ne lakirati peć dok nije potpuno hladna i odmašćena; koristiti isključivo atestiranu termootpornu boju.'
    ]
  },
  {
    stop: 4,
    code: '05',
    name: 'Dnevni boravak',
    floor: 'Prizemlje — jugoistok (0.00 m)',
    openPlan: true,
    dims: {
      length_m: 4.3,
      width_m: 3.55,
      clearHeight_m: 5.95,
      kneeWall_m: null,
      floorArea_m2: 15.3,
      wallArea_m2: 26.4,
      note: 'Istočni zid od tamnih dasaka (5.65 × 4.05 m) transformira se u akustični letvičasti zid.'
    },
    existing: [
      'Siva chesterfield L-garnitura (278 × 256 × 85 cm), pravokutni hrastov stolić (114 × 70 × 45 cm) i bež tepih.',
      'Asimetrična bijelo-hrastova TV komoda (237 × 51 × 69 cm) + TV 65" na zidu od tamnih rustikalnih dasaka.',
      'Karakteristična 4-smjerna X-zidna lampa na sjevernom dijelu istočnog zida.'
    ],
    redesign: {
      summary: 'Topli Japandi boravak s modularnom krem bouclé L-garniturom, mid-century kožnom foteljom, zidom od vertikalnih hrastovih letvica na crnom filcu i lebdećom TV komodom s donjim LED pranjem poda.',
      finishes: [
        { element: 'Pod', material: 'Troslojni hrastov parket riblja kost', spec: 'U kontinuitetu s blagovaonicom', qty: 16.8, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Istočni TV zid', material: 'Akustični paneli — hrastove letvice na crnom PET filcu', spec: 'Visina panela 405 cm (od 0.00 do +4.05 m), letvica 27 × 19 mm, razmak 13 mm, filc 9 mm', qty: 23.0, unit: 'm²', note: 'Obrada oko istočnog prozora stepeništa (70 × 185 cm); +8 % za ukrajanje' },
        { element: 'Stropne kosine i ostali zidovi', material: 'Vapneni štuk NCS S 1505-Y30R', spec: 'Mat izvedba', qty: 12.0, unit: 'm²', note: 'Stupovi i špalete' }
      ],
      furniture: [
        { item: 'Lebdeća TV komoda s LED utorom', dims: '210 × 41 × 32 cm', material: 'Furnir prirodni hrast + crna aluminijska nosiva šina', position: 'Istočni zid Y ∈ [-4.55, -2.45 m], montaža na visini h = 28–60 cm od poda', note: 'Izrađuje se po mjeri; integrirani kanal za 24 V LED traku na dnu' },
        { item: 'Modularna L-garnitura (prijedlog)', dims: '282 × 227 × 84 cm', material: 'Krem bouclé tkanina na niskom crnom soklu', position: 'Središte boravka X ∈ [-0.15, 2.67], Y ∈ [-3.55, -1.28 m]', note: 'Visina sjedišta 42 cm' },
        { item: 'Okrugli klub-stolić + pomoćni travertin', dims: 'Ø 92 × 33 cm + Ø 50 × 44 cm', material: 'Prirodni hrast (klub) / mat travertin (pomoćni)', position: 'Ispred garniture na vunenom tepihu', note: 'Tepih 276 × 225 cm (ravno tkanje, svijetla vuna)' },
        { item: 'Mid-century kožna lounge fotelja', dims: '85 × 88 × 82 cm', material: 'Tamni hrast/orah + konjak koža', position: 'Jugoistočni dio boravka X ≈ 2.68, Y ≈ -3.96 m', note: 'Zakrenuta prema centru druženja' }
      ],
      lighting: [
        { item: '3× viseće papirnate lampe različitih visina', spec: 'Ø 60, 48 i 42 cm, rižin papir, 3× E27 LED 10 W, 2700 K, dimabilno', qty: 3, mount: 'Visine sjenila od poda: +2.36 m, +2.54 m i +2.78 m iznad boravka', circuit: 'Krug 6 — postojeći stropni izvodi opalnih kugli (zamjena visilica)' },
        { item: 'Skrivena LED traka ispod TV komode', spec: '12 W/m, 2700 K, 24 V DC, l = 1.96 m u utoru komode', qty: 2.0, mount: 'Donja ploha TV komode (h = 27 cm od poda)', circuit: 'Krug 7 — prekidač uz ulaz u boravak ili pametni dimer (ukinuti X-lampu)' }
      ],
      electrical: [
        { item: 'TV zid — skriveni bužir Ø 50 mm + set utičnica iza TV-a', qty: 4, height_cm: 130, position: 'Istočni zid Y = -3.92 m (iza 65" TV-a)', note: '3× Schuko + 2× RJ45 LAN + 1× antena; HDMI kanal spušten u lebdeću komodu na h = 44 cm' },
        { item: 'Napajanje LED trake 24 V DC (skriveno u komodi)', qty: 1, height_cm: 44, position: 'Iza desnog polja TV komode', note: 'Trafo 60 W s pasivnim hlađenjem smješten unutar komode' }
      ],
      plumbing: [],
      sequence: [
        'Demontirati tamne daske, bijelo-hrastovu komodu i 4-smjernu X-zidnu lampu.',
        'Ukopati kabel za skrivenu LED traku i bužir Ø 50 mm od visine TV-a (130 cm) do visine komode (44 cm).',
        'Postaviti drvenu potkonstrukciju/oslonac na zid iza nosača TV-a i lebdeće komode (da vijci ne gnječe PET filc).',
        'Montirati akustične letvičaste panele od poda do +4.05 m s preciznim izrezima za prozorsku špaletu i elektro kutije.',
        'Objesiti tri papirnate lampe (zamjena za tri opalne kugle), montirati lebdeću TV komodu s LED trakom i unijeti garnituru.'
      ]
    },
    checks: [
      'OBAVEZNO ugraditi drvene odstojnike ili nosive profile kroz akustični filc izravno u zid prije vješanja TV nosača i komode.',
      'Izmjeriti visinu ovjesa triju papirnatih lampi kako ne bi ulazile u liniju pogleda s gornje galerije.'
    ]
  },
  {
    stop: 5,
    code: '06',
    name: 'Stepenište i vinoteka',
    floor: 'Prizemlje / uspon (0.00 → +2.74 m)',
    openPlan: true,
    dims: {
      length_m: 4.05,
      width_m: 1.05,
      clearHeight_m: 5.2,
      kneeWall_m: null,
      floorArea_m2: 4.3,
      wallArea_m2: 11.8,
      note: 'L-stepenište s 15 konzolnih hrastovih gazišta (visina stube ≈18.2 cm), podestom 109 × 100 cm i komodom ispod kraka.'
    },
    existing: [
      '15 hrastovih gazišta d = 55 mm na crnom čeličnom cik-cak nosaču; sajle Ø 4 mm i hrastovi rukohvati.',
      'Hrastova komoda s vinotekom (176 × 58 × 91 cm) ispod gornjeg kraka stepenica (X ∈ [1.16, 2.92 m]).',
      'Tamne zidne daske uz istočni krak stepenica oko prozora 70 × 185 cm.'
    ],
    redesign: {
      summary: 'Čelična konstrukcija i lebdeća gazišta ostaju kao grafička skulptura, istočni zid uz stepenište prelazi u hrastove letvice s filcom, a gazišta i komoda dobivaju jedinstvenu mat uljnu završnicu.',
      finishes: [
        { element: 'Gazišta i rukohvati (15 kom + podest)', material: 'Masivni hrast — brušenje i mat uljenje', spec: 'Bezbojni mat 2K lak ili tvrdo ulje za visoko opterećenje (protukliznost R10)', qty: 6.2, unit: 'm²', note: 'Gazišta širine 98 cm, dubine 28 cm' },
        { element: 'Sjeverni i istočni zid stepeništa', material: 'Vapneni štuk + nastavak hrastovih letvica na istoku', spec: 'Usklađeno sa zonom 05', qty: 11.8, unit: 'm²', note: 'Obrada spoja oko prozora 70 × 185 cm' }
      ],
      furniture: [
        { item: 'Postojeća hrastova komoda s vinotekom (osvježenje)', dims: '176 × 58 × 91 cm (vinoteka 46 × 55 × 79 cm)', material: 'Prirodni hrast + inox okvir hladnjaka za vino', position: 'Ispod gornjeg kraka (X ∈ [1.16, 2.92], Y ∈ [0.27, 0.85 m])', note: 'Očistiti i preuljiti u istom tonu kao gazišta i parket' }
      ],
      lighting: [
        { item: 'Diskretno podgazišno ili zidno usponsko svjetlo (opcija)', spec: '3× ugradbena 2 W LED 2700 K (ili postojeći snop iz galerije)', qty: 3, mount: 'Na h = 25 cm iznad svakog četvrtog gazišta', circuit: 'Izmjenični prekidač prizemlje ↔ galerija' }
      ],
      electrical: [
        { item: 'Utičnica za ugradbeni hladnjak za vino', qty: 1, height_cm: 30, position: 'Sjeverni zid ispod gornjeg kraka (X = 2.65, Y = 0.74 m)', note: 'Postojeća utičnica; provjeriti ispravnost i ventilaciju oko vinoteke' }
      ],
      plumbing: [],
      sequence: [
        'Demontirati tamne daske na istočnom zidu uz donji krak i podest.',
        'Zaštititi komodu i stepenište za vrijeme stropnih/zidnih radova na visini.',
        'Pobrusiti i mat uljiti sva hrastova gazišta (raditi naizmjenično ili izvan uporabe 24 h radi sušenja).'
      ]
    },
    checks: [
      'Provjeriti zategnutost četiriju paralelnih čeličnih sajli ograde i fiksaciju rukohvata.',
      'Kod postavljanja letvica na istočnom zidu paziti na čist zazor do konzolnih hrastovih gazišta.'
    ]
  },
  {
    stop: 6,
    code: '07',
    name: 'Krovište i drvene rešetke',
    floor: 'Međukat / potkrovlje (do +6.19 m)',
    openPlan: true,
    dims: {
      length_m: 8.56,
      width_m: 5.87,
      clearHeight_m: 3.17,
      kneeWall_m: null,
      floorArea_m2: 0.0,
      wallArea_m2: 58.0,
      note: 'Zračni prostor i vidljiva drvena krovna građa iznad prizemlja i galerije (površina poda već je iskazana u zonama 01–05 i 08).'
    },
    existing: [
      'Tri masivne hrastove rešetke (Truss_0, Truss_1, Truss_2 na Y = -3.55, -1.85 i -0.15 m) u boji medenog hrasta s crnim čeličnim čvornim limovima.',
      'Dvije uzdužne podrožnice (587 × 14 × 14 cm) na koti +5.85 m i bijeli kosi strop.',
      'Unutarnja jedinica klima uređaja na sjevernom zabatu (X = 0.05, Y = 0.78 m, h = +4.52 m od poda prizemlja).'
    ],
    redesign: {
      summary: 'Dramatičan Japandi kontrast: sve tri rešetke, podrožnice i gornji prozorski okviri boje se u duboki ebonizirani (gotovo crni) ton, dok kosi strop dobiva toplu čistu bijelu nijansu.',
      finishes: [
        { element: '3× krovne rešetke + 2× podrožnice', material: 'Ebonizirani hrast (tamna lazura/premaz)', spec: 'Lagano brušenje P120 + 2 sloja polutransparentne mat lazure crno-smeđeg tona (RAL 9005/8022)', qty: 26.0, unit: 'm²', note: 'Razvijena površina drva sve tri rešetke i podrožnica' },
        { element: 'Kosi strop krovišta i zabati', material: 'Mat disperzijska/vapnena boja (NCS S 0502-Y)', spec: '2 premaza s visokim stupnjem pokrivnosti', qty: 58.0, unit: 'm²', note: 'Rad s atestirane pokretne skele do visine 6.2 m' },
        { element: 'Gornji prozori (južni kosi + bočni)', material: 'Mat crno-smeđa lazura okvira + čelični čvorovi', spec: 'Obnova crnih čeličnih spojnica mat bojom za metal', qty: 1, unit: 'kpl', note: 'Bez oštećenja stakala' }
      ],
      furniture: [
        { item: 'Unutarnja klima jedinica (servis i maskiranje)', dims: '86 × 27 × 28 cm', material: 'Postojeća bijela jedinica (opcija: mat crna ili topla bijela folija)', position: 'Sjeverni zabat iznad galerije (h = +4.52 m od prizemlja)', note: 'Očistiti i servisirati prije završnog ličenja zabata' }
      ],
      lighting: [
        { item: 'Krovni/visinski ovjesi za lampe blagovaonice i boravka', spec: '4× stropna priključna mjesta s čeličnim rozetama u mat crnoj', qty: 4, mount: 'Kose plohe stropa na visini +5.65 do +5.95 m', circuit: 'Kabliranje izvesti dok je skela postavljena' }
      ],
      electrical: [
        { item: 'Izvodi rasvjete na kosom stropu i napajanje klime', qty: 5, height_cm: 570, position: 'Krovni greben iznad zone 03 i 05 + sjeverni zabat', note: 'Provjeriti dužinu svih kablova za papirnate visilice prije rastavljanja skele' }
      ],
      plumbing: [],
      sequence: [
        'Postaviti modularnu aluminijsku skelu u središtu atrija (zaštititi pod prizemlja OSB pločama).',
        'Pobrusiti krovne rešetke i podrožnice te prekriti okolne zidove i podove.',
        'Prvo obojiti bijelu/toplu bijelu površinu kosog stropa i zabata.',
        'Zatim u dva sloja nanijeti eboniziranu tamnu lazuru na hrastove grede i osvježiti mat crne čelične čvorne ploče.',
        'Montirati kablove za viseće lampe na točne pozicije blagovaonice i boravka prije spuštanja skele.'
      ]
    },
    checks: [
      'PAŽNJA: Vezna greda rešetke Truss_2 (Y = -0.15 m) nalazi se na samo +1.03 m iznad poda galerije — na prolazu iznad stepenica zaštititi i jasno označiti radni koridor.',
      'Sve visinske električne izvode završiti i testirati prije uklanjanja skele.'
    ]
  },
  {
    stop: 7,
    code: '08',
    name: 'Gornja galerija (radni kutak)',
    floor: 'Kat (+2.74 m)',
    openPlan: true,
    dims: {
      length_m: 4.04,
      width_m: 2.95,
      clearHeight_m: 2.95,
      kneeWall_m: 1.48,
      floorArea_m2: 12.1,
      wallArea_m2: 15.2,
      note: 'Zapadna galerija (X ∈ [-4.32, -0.28], Y ∈ [-2.10, 0.85 m]), s čeličnom ogradom h = 98 cm i prolazom 90 × 205 cm u Room 2.'
    },
    existing: [
      'Pod obložen hrastovim laminatom; crna čelična ograda visine 98 cm s drvenim gornjim rukohvatom i sajlama.',
      'Hrastov L-radni stol (179 × 63 × 81 cm + krak 89 × 79 × 81 cm) s crnom kožnom/mrežastom foteljom.',
      '4 lončanice uz istočnu ogradu; otvorena drvena vrata s hrastovim dovratnikom prema sjevernom krilu.'
    ],
    redesign: {
      summary: 'Smireni radni kutak u kontinuitetu s donjim prostorom: parket riblja kost, ebonizirani rukohvat ograde i okviri dovratnika prema sjevernom krilu, uz toplo vapneno ličenje zidova.',
      finishes: [
        { element: 'Pod galerije', material: 'Troslojni hrastov parket riblja kost', spec: 'Postava preko akustične podloge debljine 3 mm (smanjenje udarne buke prema kuhinji)', qty: 13.3, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Zidovi i zapadni nadozid', material: 'Vapneni štuk NCS S 1505-Y30R', spec: 'Mat izvedba do kosog stropa', qty: 15.2, unit: 'm²', note: 'Uključuje špalete sjevernih vrata prema Room 2' },
        { element: 'Rukohvat ograde i dovratnik Room 2', material: 'Ebonizirani hrast (lazura)', spec: 'Duljina rukohvata 7.0 m + dovratnik 90 × 205 cm', qty: 7.0, unit: 'm', note: 'Ton usklađen s krovnim rešetkama' }
      ],
      furniture: [
        { item: 'Hrastov radni L-stol (postojeći, uljenje)', dims: '179 × 63 × 81 cm + krak 89 × 79 × 81 cm', material: 'Prirodni hrast', position: 'Središte/zapad galerije (X ∈ [-3.96, -2.37], Y ∈ [-1.65, 0.14 m])', note: 'Lagano brušenje i zaštita bezbojnim mat uljem' },
        { item: 'Biljke u terakota/keramičkim posudama', dims: '4× Ø 38 cm', material: 'Terakota / mat kamenina', position: 'Uz istočnu ogradu galerije (Y ∈ [-2.05, -0.16 m])', note: 'Podmetači protiv curenja vode na parket' }
      ],
      lighting: [
        { item: 'Zidna/radna lampa na galeriji (prijedlog)', spec: '10 W LED, 2700 K, usmjereno svjetlo za radni stol', qty: 1, mount: 'Zapadni zid iznad radnog stola (h = 1.45 m) ili stolna lampa', circuit: 'Prekidač pri vrhu stepeništa' }
      ],
      electrical: [
        { item: 'Radne utičnice ispod/uz L-stol', qty: 4, height_cm: 30, position: 'Zapadni nadozid galerije (X = -4.25, Y ≈ -1.10 m)', note: 'Za monitor, računalo, punjače i stolnu lampu + RJ45 LAN' }
      ],
      plumbing: [],
      sequence: [
        'Demontirati postojeći laminat na galeriji i pregledati ravnost OSB/betonske podloge.',
        'Položiti zvučnu podlogu i parket riblju kost (uskladiti visinu s gornjom stubom i pragom vrata prema Room 2).',
        'Obojiti zidove vapnenim štukom i potamniti rukohvate ograde te okvir vrata za Room 2.'
      ]
    },
    checks: [
      'Provjeriti visinski spoj parketa s najgornjom stubom stepeništa i s drvenim pragom na pragu sobe 09.',
      'Provjeriti nosivost i učvršćenje stupića galerije na rubu ploče.'
    ]
  },
  {
    stop: 8,
    code: '09',
    name: 'Garderoba i radna soba (Room 2)',
    floor: 'Kat — sjeverno krilo (+2.73 m)',
    openPlan: false,
    dims: {
      length_m: 3.92,
      width_m: 3.36,
      clearHeight_m: 2.49,
      kneeWall_m: null,
      floorArea_m2: 13.2,
      wallArea_m2: 28.4,
      note: 'Središnja prolazna soba sjevernog krila (X ∈ [-1.45, 1.91], Y ∈ [0.96, 4.88 m]) s pristupom u kupaonicu i glavnu spavaću sobu.'
    },
    existing: [
      'Peterokrilni bijeli sjajni ugradbeni ormar (267 × 53 × 213 cm) s dekorativnim hrastovim letvicama na južnom boku (7 kom).',
      'Konjak kožna „Butterfly” fotelja i bačva-stolić „LEGENDS 1872” uz sjeverni prozor (67 × 61 cm, parapet 126 cm).',
      'Tamni wenge radni stol s 3 ladice (126 × 52 × 75 cm) na južnom zidu i vertikalno ogledalo (48 × 138 cm) pokraj vrata kupaonice.',
      'VAŽNO: Na južnom zidu (X ∈ [0.80, 1.38 m]) smještena su gornja i donja revizijska vrata elektro/razdjelnika grijanja.'
    ],
    redesign: {
      summary: 'Zamjena bijelih sjajnih fronti ormara toplim furnirom svijetlog hrasta s vertikalnim ručkicama i skrivenom gornjom LED linijom, parket riblja kost te bouclé lounge kutak uz prozor.',
      finishes: [
        { element: 'Pod', material: 'Troslojni hrastov parket riblja kost', spec: 'Postava preko ravne podloge, prag prema kupaonici s kamenom/mjed lajsnom', qty: 14.5, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Zidovi i strop', material: 'Vapneni štuk NCS S 1505-Y30R / strop mat bijela', spec: 'Revizijske ormariće na južnom zidu obojiti u boju zida radi stapanja', qty: 28.4, unit: 'm²', note: 'Obrada triju dovratnika (ulaz, kupaonica, spavaća)' }
      ],
      furniture: [
        { item: 'Nove fronte peterokrilnog ormara + LED kruna', dims: '267 × 53 × 213 cm (5 fronti po ~52.5 × 209 cm)', material: 'Furnir svijetli hrast mat + 5 vertikalnih crnih/mjed ručkica l = 60 cm', position: 'Istočni pregradni zid X ∈ [1.28, 1.81], Y ∈ [2.17, 4.84 m]', note: 'Postojeći korpus i bočne letvice se zadržavaju; dodati aluminijski LED profil iznad vrata' },
        { item: 'Lounge kutak uz prozor', dims: 'Tepih Ø 190 cm + stolić Ø 62 × 46 cm + fotelja 58 × 58 cm', material: 'Vuna (tepih), bijeli/travertin pomoćni stolić, bouclé ili postojeća kožna fotelja', position: 'Sjeverni prozor (X ∈ [-0.80, 0.40], Y ∈ [3.80, 4.70 m])', note: 'Stolić zamjenjuje metalnu bačvu ili ostaje po izboru' },
        { item: 'Radni stol s ladičarom (zadržati ili lakirati)', dims: '126 × 52 × 75 cm', material: 'Tamni hrast/wenge (ili zamjena u svijetli hrast)', position: 'Južni zid X ∈ [-0.48, 0.78], Y ∈ [1.20, 1.72 m]', note: 'Paziti na otvoreno pasivno krilo dvokrilnih vrata iza stola' },
        { item: 'Zidno ogledalo visokog formata', dims: '48 × 138 cm', material: 'Brušeni srebrni/crni aluminijski okvir', position: 'Zapadni zid uz vrata kupaonice (Y ∈ [1.34, 1.82 m], h = 45–183 cm)', note: 'Postojeća pozicija' }
      ],
      lighting: [
        { item: 'Stropna plafonjera s toplim sjenilom', spec: 'Ø 40 cm, 18 W LED, 2700 K, CRI > 90', qty: 1, mount: 'Središte stropa (X = 0.15, Y = 3.00, h = 2.49 m)', circuit: 'Krug 8 — prekidač na južnom zidu (X = 0.25, h = 105 cm)' },
        { item: 'LED linija iznad garderobnog ormara', spec: '10 W/m, 2700 K, 24 V DC, l = 2.61 m', qty: 2.65, mount: 'Gornji prednji rub ormara na h = 2.13 m', circuit: 'Prekidač uz ormar ili mikro-senzor na otvaranje vrata' }
      ],
      electrical: [
        { item: 'Glavni prekidač sobe + utičnica uz radni stol', qty: 2, height_cm: 105, position: 'Južni zid (X = 0.25) i zapadna niša (X = -1.28, Y = 3.02 m, h = 40 cm)', note: 'Postojeći antracit okviri' },
        { item: 'Revizijski elektroormar i podno grijanje (ZADRŽATI PRISTUP)', qty: 2, height_cm: 120, position: 'Južni zid X ∈ [0.80, 1.38 m] (h = 30 cm i h = 113–163 cm)', note: 'Ne zagraditi namještajem; dopušteno ličenje metalnih poklopaca bojom zida' }
      ],
      plumbing: [],
      sequence: [
        'Demontirati 5 bijelih sjajnih vrata ormara i laminat/podnu lajsnu.',
        'Provesti napajanje 24 V za gornju LED traku ormara s krovnog/stropnog izvoda.',
        'Ličiti zidove i revizijske poklopce u vapneni štuk.',
        'Postaviti parket riblju kost i prageve prema vratima.',
        'Montirati 5 novih hrastovih fronti na postojeće pante (soft-close), ručkice i LED profil.'
      ]
    },
    checks: [
      'PROVJERITI NA LICU MJESTA točne dimenzije postojećih 5 vrata ormara i raspored rupa za šarke prije izrade novih fronti.',
      'Osigurati da su revizijska vrata na južnom zidu uvijek slobodna za servisere.'
    ]
  },
  {
    stop: 9,
    code: '10',
    name: 'Spa kupaonica u potkrovlju (Room 2)',
    floor: 'Kat — zapad (+2.73 m)',
    openPlan: false,
    dims: {
      length_m: 3.72,
      width_m: 2.33,
      clearHeight_m: 2.49,
      kneeWall_m: 1.41,
      floorArea_m2: 8.4,
      wallArea_m2: 23.6,
      note: 'Zapadna soba pod kosinom krova (nadozid 1.41 m na zapadu; ravni strop 2.49 m na istoku), sjeverni prozor 97 × 112 cm.'
    },
    existing: [
      'Pod od pješčano-bež keramike i siva kamena zidna keramika (puna visina uz kadu i stup umivaonika; h = 99 cm uz WC).',
      'Polukružna kutna bijela akrilna kada (180 × 85 × 58 cm) s krom miješalicom i bijeli ljestvasti radijator (50 × 98 cm).',
      'Lebdeći ormarić umivaonika od rustikalnog hrasta (100 × 46 cm), okruglo ogledalo Ø 94 cm s kvadratnom LED kopčom, konzolni WC i bijela komoda s 3 ladice (87 × 52 × 86 cm).'
    ],
    redesign: {
      summary: 'Pretvorba u Japandi spa: mat travertin keramika velikog formata na podu i zidovima oko kade, sve armature i tipkalo WC-a u brušenoj mjedi, te okruglo ogledalo Ø 94 cm s toplim stražnjim halo LED svjetlom.',
      finishes: [
        { element: 'Hidroizolacija mokrih zona', material: 'Dvokomponentni polimercementni premaz + brtvene trake', spec: 'Cijeli pod + 15 cm na zidove + puna visina 2.49 m oko kade i tuš zone', qty: 24.0, unit: 'm²', note: '2 križna premaza prema DIN 18534' },
        { element: 'Podna keramika', material: 'Porculan efekt mat travertin (R10 protuklizno)', spec: 'Format 60 × 120 cm, uska fuga 2 mm u pješčanom tonu', qty: 9.5, unit: 'm²', note: '+12 % za rezanje oko kade i kosina' },
        { element: 'Zidna keramika i obloga kade', material: 'Porculan efekt mat travertin (isti dekor)', spec: 'Puna visina uz kadu i stup umivaonika (X = -1.33); poluvisina h = 99 cm iza WC-a i pod prozorom', qty: 16.5, unit: 'm²', note: 'Uključuje +12 % otpada i ukrajanje pod zapadnu kosinu' },
        { element: 'Zidovi i kosi strop iznad pločica', material: 'Kupaonska paropropusna mat boja (protiv gljivica)', spec: 'Topla bijela / vapneni štuk ton (#efe9df)', qty: 14.0, unit: 'm²', note: 'Spoj s pločicama izvesti akrilnim/silikonskim profilom' }
      ],
      furniture: [
        { item: 'Polukružna kutna kada (zadržati ili obložiti travertinom)', dims: '180 × 85 × 58 cm', material: 'Bijeli lijevani sanitarni akril + obloga od travertin pločica', position: 'Jugozapadni kut X ∈ [-3.68, -1.80], Y ∈ [1.16, 2.01 m]', note: 'Predvidjeti magnetski revizijski otvor 30 × 30 cm za pristup sifonu' },
        { item: 'Lebdeći kupaonski ormarić s umivaonikom', dims: '100 × 46 × 46 cm (gornji rub na h = 82.5 cm)', material: 'Furnir svijetlog hrasta za vlažne prostore + ploča mat kamen/keramika', position: 'Istočni stup Y ∈ [3.14, 4.16 m]', note: '2 duboke ladice s urezom za sifon' },
        { item: 'Okruglo halo ogledalo (zamjena LED kopče)', dims: 'Ø 94 cm', material: 'Kristalno ogledalo na podkonstrukciji s neizravnim LED vijencem', position: 'Iznad umivaonika (središte Y = 3.65, h = 153 cm od poda)', note: 'Podiže atmosferu i uklanja hladno radno svjetlo' },
        { item: 'Komoda s 3 ladice u sjeverozapadnom kutu', dims: '87 × 52 × 86 cm', material: 'Mat bež / bijela + drveni detalji (postojeća prebojati ili zadržati)', position: 'Sjeverozapadni kut X ∈ [-3.63, -2.76], Y ∈ [4.34, 4.86 m]', note: 'Uz zapadni nadozid h = 141 cm' }
      ],
      lighting: [
        { item: 'Neizravni LED halo krug iza ogledala', spec: '16 W LED traka, 2700 K, CRI > 92, IP44, integrirano u ogledalo Ø 94 cm', qty: 1, mount: 'Stup umivaonika (X = -1.33, Y = 3.65, h = 153 cm)', circuit: 'Prekidač kod vrata kupaonice' },
        { item: 'Stropna vodootporna plafonjera', spec: 'Ø 30 cm, 15 W LED, 3000 K (ili 2700 K), IP44, CRI > 90', qty: 1, mount: 'Ravni strop (X = -2.15, Y = 3.00, h = 2.49 m)', circuit: 'Glavni prekidač kupaonice izvan zone 2' }
      ],
      electrical: [
        { item: 'Izvod iza ogledala 230 V + IP44 utičnica uz umivaonik', qty: 2, height_cm: 145, position: 'Istočni stup umivaonika (Y = 3.45 i Y = 3.18 m)', note: 'Obavezna zaštita FID 30 mA i usklađenost s HRN HD 60364-7-701' },
        { item: 'Kupaonski ventilator (ako postoji kanal u ravnom stropu)', qty: 1, height_cm: 249, position: 'Istočni gornji ugao', note: 'S tajmerom za odvlaživanje nakon kupanja' }
      ],
      plumbing: [
        { item: 'Zidna miješalica za kadu + ručni tuš (brušena mjed)', spec: 'Podžbukno tijelo ili nadžbukna baterija s razmakom 150 mm, PVD brušena mjed', position: 'Južni zid iznad kade (X = -2.62, Y = 1.18 m)', height_cm: 78, note: 'Zamjena postojeće kromirane armature' },
        { item: 'Stojeća/zidna miješalica umivaonika (brušena mjed)', spec: 'Jednoručna baterija visoka/standardna PVD brušena mjed + click-clack sifon', position: 'Umivaonik X = -1.41, Y = 3.65 m', height_cm: 83, note: 'Dovod 2× kutni ventil 1/2", odvod Ø 40 mm na h = 55 cm' },
        { item: 'Konzolna WC školjka + tipkalo u brušenoj mjedi', spec: 'Rimless WC školjka na postojećem ugradbenom vodokotliću, tipkalo brušena mjed', position: 'Sjeveroistočni kut X = -1.78, Y = 4.54 m', height_cm: 41, note: 'Obzid vodokotlića završiti travertinom (h = 99 cm)' },
        { item: 'Ljestvasti radijator za ručnike', spec: '50 × 98 cm, priključci dolje na razmaku 50 mm (zadržati ili lakirati u bijelu/mjed)', position: 'Zapadni nadozid X = -3.62, Y ∈ [2.15, 2.65 m]', height_cm: 25, note: 'Montaža na minimalnoj udaljenosti 4 cm od nove keramike' }
      ],
      sequence: [
        'Demontirati sanitarije, kadu/oblogu (ako se mijenja), postojeće pločice i ogledalo.',
        'Provjeriti nagibe odvoda kade i umivaonika te prilagoditi visinu električnog izvoda za halo ogledalo.',
        'Nanijeti temeljni premaz i 2 sloja hidroizolacije s brtvenim trakama na sve podne i zidne spojeve.',
        'Obloga podnim i zidnim travertin pločicama 60 × 120 cm (pažljivo ukrajanje pod kosinu krova i oko prozora).',
        'Fugiranje fleksibilnom masom + sanitarni silikon u kutovima.',
        'Montaža lebdećeg hrastovog ormarića, sanitarija u brušenoj mjedi, halo ogledala i testiranje brtvljenja.'
      ]
    },
    checks: [
      'PROVJERITI NA LICU MJESTA razmak priključaka miješalice za kadu (standard 150 mm) prije narudžbe armature u brušenoj mjedi.',
      'Kod postavljanja pločica na kosi zid pažljivo pratiti nagib krova (od h = 141 cm na X = -3.68 do h = 249 cm na X = -2.40 m).',
      'Kompatibilnost novog tipkala u brušenoj mjedi s markom postojećeg ugradbenog vodokotlića (Geberit / Tece / Grohe).'
    ]
  },
  {
    stop: 10,
    code: '11',
    name: 'Glavna spavaća soba (Room 2)',
    floor: 'Kat — istok (+2.73 m)',
    openPlan: false,
    dims: {
      length_m: 3.72,
      width_m: 3.43,
      clearHeight_m: 2.49,
      kneeWall_m: 1.16,
      floorArea_m2: 12.8,
      wallArea_m2: 26.8,
      note: 'Istočna soba sjevernog krila (X ∈ [2.01, 5.44], Y ∈ [1.16, 4.88 m]); istočni nadozid 1.16 m ima suhu gips-kartonsku policu (dubina 11 cm).'
    },
    existing: [
      'Smeđe-sivi tapecirani bračni krevet (223 × 196 cm) s bijelom ladicom na izvlačenje i oker prekrivačem.',
      'Dva različita noćna ormarića (okrugli hrast + metalna žičana košara s crno-bakrenom lampom).',
      'Otvorena troetažna hrastova konzola (229 × 42 × 85.5 cm) na južnom zidu sa slikom suncokreta, obiteljskim okvirima i slanom lampom; kožna Butterfly fotelja u SZ kutu.'
    ],
    redesign: {
      summary: 'Smirena Japandi spavaća oaza: niski lebdeći hrastov krevet na crnom uvučenom postolju s krem bouclé uzglavljem, par hrastovih/travertinskih noćnih stolića, lanena posteljina i papirnate lampe 2700 K.',
      finishes: [
        { element: 'Pod', material: 'Troslojni hrastov parket riblja kost', spec: 'U kontinuitetu s garderobom bez praga', qty: 14.1, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Zidovi i istočni kaskadni nadozid', material: 'Vapneni štuk NCS S 1505-Y30R', spec: 'Fina mat izvedba na nadozidu (1.16 m) i gips-kartonskoj polici', qty: 26.8, unit: 'm²', note: 'Obrada oko sjevernog prozora 108 × 110 cm' }
      ],
      furniture: [
        { item: 'Lebdeći bračni krevet s bouclé uzglavljem (po mjeri/narudžbi)', dims: '223 × 196 cm (za madrac 180 × 200 cm), uzglavlje h = 111 cm', material: 'Okvir masivni/furnirani hrast na crnom uvučenom postolju + 6 segmenata krem bouclé uzglavlja', position: 'Uz istočni nadozid (X ∈ [3.15, 5.38], Y ∈ [2.50, 4.46 m])', note: 'Ukupna visina podnice + madraca ~58 cm od poda' },
        { item: 'Par cilindričnih noćnih stolića (prijedlog)', dims: '2× Ø 43 × 58 cm', material: 'Cilindar prirodni hrast + ploča bijeli mat travertin', position: 'Simetrično lijevo i desno od kreveta (Y = 2.22 i Y = 4.66 m)', note: 'Zamjena neusklađenih stolića' },
        { item: 'Vuneni tepih ispod kreveta', dims: '254 × 257 cm', material: 'Meka petljasta vuna u boji zobi', position: 'Ispod donje dvije trećine kreveta (X ∈ [2.78, 5.32], Y ∈ [2.15, 4.72 m])', note: 'Izlazi cca 40 cm lijevo, desno i pred podnožjem' },
        { item: 'Otvorena hrastova konzola (postojeća, uljenje)', dims: '229 × 42 × 85.5 cm', material: 'Masivni hrast + crna ili terakota vaza', position: 'Južni zid X ∈ [2.97, 5.26], Y ∈ [1.18, 1.58 m]', note: 'Zadržati; ostaviti otvoren pristup 4-strukoj utičnici u lijevom polju' }
      ],
      lighting: [
        { item: 'Sferna viseća papirnata lampa (Akari)', spec: 'Ø 60 cm, rižin papir, E27 LED 12 W, 2700 K, dimabilno', qty: 1, mount: 'Ravni strop (X = 3.55, Y = 3.15, h = 2.49 m; spuštena 52 cm)', circuit: 'Izmjenični krug 10 — prekidač na ulazu + kraj uzglavlja' },
        { item: '2× stolne lampe s rižinim sjenilom', spec: 'Ø 25 cm, E14 LED 6 W, 2700 K', qty: 2, mount: 'Na cilindričnim noćnim stolićima (h = 58 cm od poda)', circuit: 'Neovisni noćni priključak ili pametna žarulja' }
      ],
      electrical: [
        { item: 'Utičnice i izmjenični prekidači uz uzglavlje', qty: 2, height_cm: 55, position: 'Istočni nadozid Y = 2.22 i Y = 4.54 m (ispod kaskadne police)', note: 'Provjeriti postojeću utičnicu na Y = 4.54 m (h = 53 cm); dodati drugu stranu ako nedostaje' },
        { item: '4-struka utičnica uz hrastovu konzolu', qty: 1, height_cm: 64, position: 'Južni zid (X = 3.38, Y = 1.17 m) unutar lijevog otvora konzole', note: 'Postojeća instalacija; zamijeniti masku po želji' }
      ],
      plumbing: [],
      sequence: [
        'Ukloniti postojeći bračni krevet, noćne stoliće i laminat.',
        'Dodati/uskladiti utičnice i izmjenične prekidače uz obje strane kreveta u istočnom nadozidu.',
        'Izvesti gletanje i nanošenje vapnenog štuka (NCS S 1505-Y30R) uključujući gornju policu nadozida.',
        'Položiti parket riblju kost i završne lajsne.',
        'Postaviti veliki tepih, sastaviti lebdeći hrastov krevet s bouclé uzglavljem i postaviti lampe.'
      ]
    },
    checks: [
      'Provjeriti točnu dubinu slobodnog prolaza između ruba kreveta (X = 3.15 m) i konzole/vrata (slobodno ≥ 95 cm).',
      'Kod izrade bouclé uzglavlja (visina 111 cm od poda) voditi računa o ispupčenju gips-kartonske police istočnog nadozida na koti h = 116–130 cm.'
    ]
  }
];

export const BOQ = [
  // Podovi
  { category: 'Podovi', item: 'Demontaža postojećeg laminata, lajsni i podloga', spec: 'Uključuje sortiranje i odvoz na ovlašteno odlagalište', qty: 92.6, unit: 'm²', zones: ['01', '02', '03', '04', '05', '08', '09', '11'] },
  { category: 'Podovi', item: 'Priprema estriha, brušenje i impregnacija podloge', spec: 'Lokalno izravnavanje samonivelirajućom masom do 3 mm', qty: 92.6, unit: 'm²', zones: ['01', '02', '03', '04', '05', '08', '09', '11'] },
  { category: 'Podovi', item: 'Dobava i polaganje troslojnog hrastovog parketa — riblja kost', spec: 'Uljeni prirodni hrast, uključeno 2K elastično ljepilo i +10 % otpada', qty: 101.9, unit: 'm²', zones: ['01', '02', '03', '04', '05', '08', '09', '11'] },
  { category: 'Podovi', item: 'Akustična podloga na katu (galerija + sjeverno krilo)', spec: 'Podloga 3 mm za prigušenje udarnog zvuka ΔLw ≥ 18 dB', qty: 38.1, unit: 'm²', zones: ['08', '09', '11'] },
  { category: 'Podovi', item: 'Podne kutne lajsne od masivnog hrasta + prijelazni profili', spec: 'Profil 60 × 15 mm u tonu parketa, s montažom', qty: 68.0, unit: 'm', zones: ['01', '03', '05', '08', '09', '11'] },

  // Zidovi i stropovi
  { category: 'Zidovi i stropovi', item: 'Skela za dvoetažni atrij i krovište (najam, montaža, demontaža)', spec: 'Radna visina do 6.2 m uz zaštitu podova OSB pločama', qty: 1, unit: 'kpl', zones: ['01', '03', '04', '07'] },
  { category: 'Zidovi i stropovi', item: 'Impregnacija, gletanje i vapneni štuk (NCS S 1505-Y30R)', spec: '2 ruke mineralne vapnene boje u toplom bež tonu na zidove', qty: 159.2, unit: 'm²', zones: ['01', '02', '03', '05', '06', '08', '09', '11'] },
  { category: 'Zidovi i stropovi', item: 'Ličenje kosih i ravnih stropova toplom bijelom bojom (NCS S 0502-Y)', spec: 'Uključuje potkrovlje do sljemena i suhe zone kata', qty: 84.0, unit: 'm²', zones: ['07', '09', '10', '11'] },
  { category: 'Zidovi i stropovi', item: 'Izbijeljena vapnena lazura na dimnjaku od crvene opeke (limewash)', spec: 'Visina 5.98 m, paropropusna lazura u 2 sloja s vidljivom fugom', qty: 11.0, unit: 'm²', zones: ['04'] },
  { category: 'Zidovi i stropovi', item: 'Demontaža tamnih dasaka na istočnom zidu + zbrinjavanje', spec: 'Prizemlje i podest stepenica (5.65 × 4.05 m)', qty: 23.0, unit: 'm²', zones: ['05', '06'] },
  { category: 'Zidovi i stropovi', item: 'Akustični panel-zid — vertikalne hrastove letvice na crnom PET filcu', spec: 'Letvice 27 × 19 mm, razmak 13 mm, uključeno +8 % za izreze oko prozora', qty: 24.8, unit: 'm²', zones: ['05', '06'] },

  // Stolarija
  { category: 'Stolarija', item: 'Brušenje i ebonizirano lazurno močenje 3 krovnih rešetki i podrožnica', spec: 'Ton RAL 9005/8022 mat + osvježenje crnih čeličnih čvorova', qty: 26.0, unit: 'm²', zones: ['07'] },
  { category: 'Stolarija', item: 'Ebonizirana lazura na rukohvatu galerije i sjevernom dovratniku', spec: 'Rukohvat 7.0 m + dovratnik 90 × 205 cm + stepenišni prozor', qty: 1, unit: 'kpl', zones: ['01', '06', '08'] },
  { category: 'Stolarija', item: 'Brušenje i protuklizno mat uljenje 15 hrastovih gazišta stepenica + komode', spec: 'Stepenište 6.2 m² + hrastova komoda s vinotekom', qty: 1, unit: 'kpl', zones: ['06'] },

  // Keramika i kamen
  { category: 'Keramika i kamen', item: 'Polimercementna hidroizolacija u 2 sloja s kutnim brtvenim trakama', spec: 'Pod kupaonice, uzdignuća i zona kade do stropa', qty: 24.0, unit: 'm²', zones: ['10'] },
  { category: 'Keramika i kamen', item: 'Mat travertin porculan 60 × 120 cm — pod i zidovi kupaonice', spec: 'Uključeno +12 % otpada, C2TE S1 ljepilo, epoksi/fleksibilna fuga i silikon', qty: 26.0, unit: 'm²', zones: ['10'] },
  { category: 'Keramika i kamen', item: 'Kamena radna ploča i zidna obloga kuhinje od mat travertina (d = 20/30 mm)', spec: 'Ploča 290 × 71 cm s izrezima + obloga 2.4 m² s otvorima za utičnice', qty: 1, unit: 'kpl', zones: ['02'] },

  // Vodovod i sanitarije
  { category: 'Vodovod i sanitarije', item: 'Komplet armatura u PVD brušenoj mjedi (kada, umivaonik, kuhinja)', spec: 'Zidna miješalica kade + ručni tuš, slavina umivaonika, kuhinjska slavina + tipkalo WC-a', qty: 4, unit: 'kom', zones: ['02', '10'] },
  { category: 'Vodovod i sanitarije', item: 'Konzolna rimless WC školjka, crni kuhinjski sudoper i sifoni', spec: 'Montaža na postojeće priključke s ispitivanjem nepropusnosti', qty: 1, unit: 'kpl', zones: ['02', '10'] },

  // Namještaj po mjeri
  { category: 'Namještaj po mjeri', item: 'Zamjena kuhinjskih fronti (kadulja mat NCS S 4010-G50Y + furnir hrast)', spec: 'Donji elementi 290 cm (5 fronti), kolona pećnice 223 cm i gornji elementi + 2 police', qty: 1, unit: 'kpl', zones: ['02'] },
  { category: 'Namještaj po mjeri', item: 'Lebdeća hrastova TV komoda 210 × 41 × 32 cm s LED utorom', spec: 'Uključuje čeličnu zidnu nosivu šinu kroz akustični panel', qty: 1, unit: 'kom', zones: ['05'] },
  { category: 'Namještaj po mjeri', item: 'Nove fronte peterokrilnog garderobnog ormara 267 × 213 cm', spec: 'Furnir svijetli hrast mat, 5 crnih/mjed ručkica l = 60 cm, soft-close panti', qty: 5, unit: 'kom', zones: ['09'] },
  { category: 'Namještaj po mjeri', item: 'Lebdeći hrastov kupaonski ormarić 100 × 46 × 46 cm s 2 ladice', spec: 'Vodootporna izvedba s gornjom pločom od mat kamena', qty: 1, unit: 'kom', zones: ['10'] },
  { category: 'Namještaj po mjeri', item: 'Okruglo halo ogledalo Ø 94 cm s toplim LED pozadinskim svjetlom (IP44)', spec: '2700 K, ugradbena dubina 35 mm', qty: 1, unit: 'kom', zones: ['10'] },

  // Rasvjeta
  { category: 'Rasvjeta', item: 'Viseće papirnate lampe u stilu Akari (2700 K, CRI > 92)', spec: '1× Ø 76 cm (blagovaonica), 3× Ø 60/48/42 cm (boravak), 1× Ø 60 cm (spavaća)', qty: 5, unit: 'kom', zones: ['03', '05', '11'] },
  { category: 'Rasvjeta', item: 'Zidne, stropne i stolne svjetiljke (2700 K)', spec: '2× dimnjačne gore/dolje mat crne, 2× stolne papirnate, 2× stropne IP20/IP44, 2× spot kuhinja', qty: 8, unit: 'kom', zones: ['01', '02', '04', '09', '10', '11'] },
  { category: 'Rasvjeta', item: 'Linearne LED trake 2700 K, 24 V DC u aluminijskim profilima', spec: '1.05 m (kuhinja IP44), 1.96 m (TV komoda), 2.61 m (ormar) s napajanjima', qty: 5.7, unit: 'm', zones: ['02', '05', '09'] },

  // Elektro
  { category: 'Elektro', item: 'Skriveno kabliranje LED rasvjete, bužira TV Ø 50 mm i visinskih ovjesa', spec: 'Uključuje štemanje/uvlačenje vodiča, izvod za halo ogledalo i izmjenu maski prekidača', qty: 1, unit: 'kpl', zones: ['02', '03', '05', '07', '09', '10', '11'] },
  { category: 'Elektro', item: 'Termootporno mat crno lakiranje obloga peći na pelete', spec: 'Bočne oplate do 300 °C + kontrola dimovoda Ø 130 mm', qty: 1, unit: 'kpl', zones: ['04'] },

  // Dekor i tekstil (dobava opreme po dogovoru s investitorom)
  { category: 'Dekor i tekstil', item: 'Okrugli stol od travertina Ø 136 cm + 6× hrast/bouclé blagovaonskih stolica', spec: 'Unos i montaža na licu mjesta', qty: 1, unit: 'kpl', zones: ['03'] },
  { category: 'Dekor i tekstil', item: 'Krem bouclé L-garnitura 282 × 227 cm + kožna fotelja + hrast/travertin stolići', spec: 'Uključuje tkani vuneni tepih 276 × 225 cm', qty: 1, unit: 'kpl', zones: ['05'] },
  { category: 'Dekor i tekstil', item: 'Lebdeći hrastov bračni krevet 180 × 200 cm s bouclé uzglavljem + 2× noćni stolić', spec: 'Uključuje vuneni tepih 254 × 257 cm', qty: 1, unit: 'kpl', zones: ['11'] },
  { category: 'Dekor i tekstil', item: 'Lanene rimske rolete za južnu staklenu stijenu + vuneni tepih Ø 190 cm (soba 09)', spec: 'Mjerenje špalete na licu mjesta prije šivanja', qty: 1, unit: 'kpl', zones: ['03', '04', '09'] }
];

export const PLANS = [
  {
    id: 'prizemlje-redizajn',
    floor: 'Prizemlje',
    interior: 'redesign',
    title: 'Prizemlje (kota 0.00 m) — Redizajn ✦ Japandi Calm',
    image: './assets/plan_prizemlje_redizajn.png',
    widthPx: 1600,
    heightPx: 1432,
    world: { xMin: -4.75, xMax: 4.75, yMin: -5.4512, yMax: 3.0512 },
    rooms: [
      { code: '01', stop: 0, label: '01 Atrij', x: -0.05, y: 1.78 },
      { code: '02', stop: 1, label: '02 Kuhinja', x: -2.85, y: -1.65 },
      { code: '03', stop: 2, label: '03 Blagovaonica', x: -1.86, y: -3.23 },
      { code: '04', stop: 3, label: '04 Kamin', x: 0.02, y: -4.42 },
      { code: '05', stop: 4, label: '05 Boravak', x: 2.05, y: -2.95 },
      { code: '06', stop: 5, label: '06 Stepenište', x: 3.65, y: -0.95 }
    ],
    dims: [
      { x1: -4.35, y1: -5.0, x2: 4.25, y2: -5.0, text: '8.60 m (unutarnja širina)', offset: -0.26 },
      { x1: -4.35, y1: -5.0, x2: -4.35, y2: 0.94, text: '5.94 m', offset: 0.24 },
      { x1: -4.35, y1: -5.01, x2: -4.35, y2: -0.53, text: '4.48 m (kuhinjski niz)', offset: -0.48 },
      { x1: -2.54, y1: -3.91, x2: -1.18, y2: -3.91, text: 'Ø 1.36 m', offset: -0.25 },
      { x1: -0.65, y1: 2.65, x2: 0.95, y2: 2.65, text: '1.60 m', offset: 0.22 },
      { x1: 1.16, y1: 0.56, x2: 2.92, y2: 0.56, text: '1.76 m komoda', offset: -0.32 }
    ]
  },
  {
    id: 'kat-redizajn',
    floor: 'Kat & sjeverno krilo',
    interior: 'redesign',
    title: 'Kat (+2.74 m) & Sjeverno krilo (+2.73 m) — Redizajn ✦ Japandi Calm',
    image: './assets/plan_kat_redizajn.png',
    widthPx: 1600,
    heightPx: 1615,
    world: { xMin: -4.75, xMax: 5.95, yMin: -5.4502, yMax: 5.3502 },
    rooms: [
      { code: '08', stop: 7, label: '08 Galerija', x: -2.35, y: -0.55 },
      { code: '09', stop: 8, label: '09 Garderoba', x: -0.15, y: 2.55 },
      { code: '10', stop: 9, label: '10 Kupaonica', x: -2.55, y: 3.05 },
      { code: '11', stop: 10, label: '11 Spavaća soba', x: 3.72, y: 3.45 }
    ],
    dims: [
      { x1: -3.68, y1: 4.88, x2: -1.35, y2: 4.88, text: '2.33 m', offset: 0.26 },
      { x1: -1.45, y1: 4.88, x2: 1.91, y2: 4.88, text: '3.36 m', offset: 0.26 },
      { x1: 2.01, y1: 4.88, x2: 5.44, y2: 4.88, text: '3.43 m', offset: 0.26 },
      { x1: 5.44, y1: 1.16, x2: 5.44, y2: 4.88, text: '3.72 m', offset: -0.28 },
      { x1: -4.32, y1: -2.1, x2: -0.28, y2: -2.1, text: '4.04 m (galerija)', offset: -0.28 },
      { x1: -4.32, y1: -2.1, x2: -4.32, y2: 0.85, text: '2.95 m', offset: 0.24 },
      { x1: 1.55, y1: 2.17, x2: 1.55, y2: 4.84, text: '2.67 m ormar', offset: 0.55 }
    ]
  },
  {
    id: 'prizemlje-postojece',
    floor: 'Prizemlje',
    interior: 'current',
    title: 'Prizemlje (kota 0.00 m) — Postojeće stanje (LiDAR 1:1)',
    image: './assets/plan_prizemlje_postojece.png',
    widthPx: 1600,
    heightPx: 1432,
    world: { xMin: -4.75, xMax: 4.75, yMin: -5.4512, yMax: 3.0512 },
    rooms: [
      { code: '01', stop: 0, label: '01 Atrij', x: -0.05, y: 1.78 },
      { code: '02', stop: 1, label: '02 Kuhinja', x: -2.85, y: -1.65 },
      { code: '03', stop: 2, label: '03 Blagovaonica', x: -1.86, y: -3.23 },
      { code: '04', stop: 3, label: '04 Kamin', x: 0.02, y: -4.42 },
      { code: '05', stop: 4, label: '05 Boravak', x: 2.05, y: -2.95 },
      { code: '06', stop: 5, label: '06 Stepenište', x: 3.65, y: -0.95 }
    ],
    dims: [
      { x1: -4.35, y1: -5.0, x2: 4.25, y2: -5.0, text: '8.60 m (unutarnja širina)', offset: -0.26 },
      { x1: -4.35, y1: -5.0, x2: -4.35, y2: 0.94, text: '5.94 m', offset: 0.24 },
      { x1: -4.35, y1: -5.01, x2: -4.35, y2: -0.53, text: '4.48 m', offset: -0.48 },
      { x1: -2.39, y1: -4.2, x2: -1.34, y2: -4.2, text: '1.05 × 1.93 m stol', offset: -0.25 },
      { x1: -0.65, y1: 2.65, x2: 0.95, y2: 2.65, text: '1.60 m', offset: 0.22 }
    ]
  },
  {
    id: 'kat-postojece',
    floor: 'Kat & sjeverno krilo',
    interior: 'current',
    title: 'Kat (+2.74 m) & Sjeverno krilo (+2.73 m) — Postojeće stanje (LiDAR 1:1)',
    image: './assets/plan_kat_postojece.png',
    widthPx: 1600,
    heightPx: 1615,
    world: { xMin: -4.75, xMax: 5.95, yMin: -5.4502, yMax: 5.3502 },
    rooms: [
      { code: '08', stop: 7, label: '08 Galerija', x: -2.35, y: -0.55 },
      { code: '09', stop: 8, label: '09 Garderoba', x: -0.15, y: 2.55 },
      { code: '10', stop: 9, label: '10 Kupaonica', x: -2.55, y: 3.05 },
      { code: '11', stop: 10, label: '11 Spavaća soba', x: 3.72, y: 3.45 }
    ],
    dims: [
      { x1: -3.68, y1: 4.88, x2: -1.35, y2: 4.88, text: '2.33 m', offset: 0.26 },
      { x1: -1.45, y1: 4.88, x2: 1.91, y2: 4.88, text: '3.36 m', offset: 0.26 },
      { x1: 2.01, y1: 4.88, x2: 5.44, y2: 4.88, text: '3.43 m', offset: 0.26 },
      { x1: 5.44, y1: 1.16, x2: 5.44, y2: 4.88, text: '3.72 m', offset: -0.28 },
      { x1: -4.32, y1: -2.1, x2: -0.28, y2: -2.1, text: '4.04 m', offset: -0.28 },
      { x1: -4.32, y1: -2.1, x2: -4.32, y2: 0.85, text: '2.95 m', offset: 0.24 }
    ]
  }
];
