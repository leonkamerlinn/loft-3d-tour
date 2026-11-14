// Tehnički podaci i troškovnik za izvođače radova ("majstore")
// Svi brojevi potječu iz 1:1 LiDAR + građevinskih nacrta + Blender geometrije (01_loft_postojece_stanje.blend i 02_loft_redizajn_japandi.blend).
// Čisti ES modul bez ovisnosti o DOM-u (zajednički za index.html #spec-drawer i majstor.html).

export const PROJECT = {
  title: 'Kuća Banfi 201A (Po + Pr + Pk + 3D Vrt) — Tehnička mapa i troškovnik za izvođače',
  subtitle: 'Cjelovita 1:1 arhitektonska rekonstrukcija i projekt uređenja „Japandi Calm” (k.č. 2480/3, k.o. Štrigova)',
  version: '2.0',
  date: '13. 11. 2026.',
  units: 'm / cm / m²',
  accuracy: 'Građevinski nacrti Po+Pr+Pk + 3× Apple LiDAR RoomPlan 1:1 skena + fotogrametrijska kalibracija (±1–2 cm)',
  disclaimer: 'Sve mjere izvedene su iz 1:1 arhitektonskog i LiDAR 3D modela. Izvođač (stolar, keramičar, električar, vodoinstalater, vrtlar) dužan je prije narudžbe materijala i izrade opreme po mjeri izvršiti kontrolnu izmjeru na gradilištu.',
  overall: {
    footprint: '10.09 × 10.18 m (parcela 34.4 × 30.1 m)',
    ridge: '+6.19 m (ukupna visina Po → sljeme 8.92 m)',
    netFloorArea_m2: 248.4,
    floors: [
      {
        name: 'Vrt, prilaz i vanjski ulaz (-2.73 → 0.00 m)',
        zones: '01–03',
        area_m2: 68.5,
        height: 'Otvoreni okoliš • vanjsko stubište 16×17.1 cm • trijem +0.00 m'
      },
      {
        name: 'Podrum — Po (-2.73 m)',
        zones: '10–11',
        area_m2: 75.9,
        height: '2.43 m čista visina ispod ab ploče (-5.73 → -3.30 m)'
      },
      {
        name: 'Prizemlje — Pr (0.00 m)',
        zones: '04–09',
        area_m2: 101.5,
        height: '2.53 m (galerija & sjeverno krilo) / do +6.19 m u sljemenu'
      },
      {
        name: 'Potkrovlje & galerija — Pk (+2.73 / +2.74 m)',
        zones: '12–15',
        area_m2: 71.0,
        height: '2.49 m ravni strop sjevera (nadozidi 1.16–1.48 m) / 3.45 m galerija'
      }
    ]
  },
  siteSequence: [
    '1. Zaštita gradilišta, demontaža pokretne opreme, tamnih zidnih dasaka boravka, starih kuhinjskih i garderobnih fronti te stare rasvjete.',
    '2. Vanjski građevinsko-vrtni radovi: priprema podloge prilaza i 2P parkinga, obrada vanjskog stubišta (-2.73 → 0.00 m), ugradnja ograde od kaljenog stakla i nosača cedrove pergole u zapadnom 3D vrtu.',
    '3. Grubi elektroinstalaterski i strojarski radovi kroz Po+Pr+Pk: kabliranje LED napajanja 24 V DC, TV bužira Ø 50 mm, podnog/dizalica topline razvoda u kotlovnici (zona 10) i vrtnih rasvjetnih stupića 230 V / 24 V.',
    '4. Hidroizolacija u dva sloja s brtvenim trakama i keramički radovi u kupaonici Pr (walk-in tuš, zona 09), spa kupaonici Pk (mat travertin, zona 14), podrumu (R10 tehnički porculan) i jugoistočnom balkonu (R11).',
    '5. Skela u dvoetažnom atriju: brušenje i ebonizirano lazurno močenje središnje krovne dvostruke stolice, dviju uzdužnih podrožnica P1 i istočne nazidnice (bez nosača na sjevernom zidu), ličenje kosih stropova i bijela vapnena lazura dimnjaka.',
    '6. Fina glet-obrada i toplo vapneno ličenje zidova (NCS S 1505-Y30R) u prizemlju, sjevernom krilu Pr, podrumskim hodnicima, galeriji i sobama potkrovlja.',
    '7. Niveliranje podloga i polaganje troslojnog hrastovog parketa riblja kost (atriju, kuhinji, blagovaonici, boravku, sobama 1 i 2 Pr, galeriji, garderobi i glavnoj spavaćoj sobi Pk).',
    '8. Montaža akustičnog zida od hrastovih letvica na istočnom zidu, kuhinje u kadulji i travertinu, fronti ormara, stolarije radne sobe i opreme vešeraja/garaže.',
    '9. Fina montaža sanitarija u brušenoj mjedi, rasvjetnih tijela (Akari visilice s bijelim stropnim rozetama, plafonjere, vrtni stupići 2700 K) i ispitivanje instalacija.',
    '10. Montaža vanjskog lounge namještaja ispod pergole, sadnja ukrasnih trava i lavande, unos unutarnjeg pokretnog namještaja i završno čišćenje.'
  ]
};

export const ZONES = [
  {
    stop: 0,
    code: '01',
    name: 'Eksterijer, prilaz Banfi i 2P parkiralište',
    floor: 'Okoliš / prilaz (-2.73 m)',
    openPlan: true,
    dims: {
      length_m: 14.5,
      width_m: 5.8,
      clearHeight_m: 8.92,
      kneeWall_m: null,
      floorArea_m2: 42.0,
      wallArea_m2: 96.0,
      note: 'Asfaltni cestovni odvojak Banfi, betonsko-kockasti prilaz s istočne strane do južnog 2P parkirnog platoa (-2.73 m) i pristup garaži.'
    },
    existing: [
      'Uređen istočni kolni prilaz širine 3.2 m od ceste Banfi uz sjeverni i istočni rub kuće prema donjem južnom platou (-2.73 m).',
      'Južni parkirni prostor 2P ispred sekcijskih garažnih vrata (540 × 220 cm) i donjeg dijela vanjskog stubišta.',
      'Dvostrešni krov s ugrađenim krovnim prozorima, tamni kameni sokl suterena i bijela žbukana fasada gornjih etaža.'
    ],
    redesign: {
      summary: 'Arhitektonsko usklađenje pročelja i prilaza u Japandi duh: mineralna fasada u toplom pješčanom tonu, tamni kameni sokl podruma, opločnik velikog formata i nenametljiva vanjska rasvjeta prilaza.',
      finishes: [
        { element: 'Prilazni plato i 2P parking', material: 'Betonski opločnik velikog formata / drenirajući kamen', spec: 'Nosivost za osobna vozila (d = 8 cm na posteljici), pad 1.5 % od kuće', qty: 42.0, unit: 'm²', note: 'S ugrađenom linijskom kanalom rešetkom ispred garaže' },
        { element: 'Sokl suterena / podruma', material: 'Fasadni tamni prirodni/dekorativni kamen', spec: 'Hidroizolirana obloga visine 2.85 m oko garaže i radne sobe', qty: 36.0, unit: 'm²', note: 'Zaštitna okapna aluminijska letva na prijelazu u žbuku' },
        { element: 'Fasadna silikatno-silikonska žbuka', material: 'Topla mineralno-bijela žbuka (NCS S 0804-Y20R)', spec: 'Pranje, temeljni premaz i 2 sloja završne fasadne boje', qty: 96.0, unit: 'm²', note: 'Uključuje špalete južnih i sjevernih prozora' }
      ],
      furniture: [
        { item: 'Poštanski sandučić i kućni broj „201A”', dims: '40 × 12 × 32 cm', material: 'Mat antracit prašno lakirani čelik + LED pozadina', position: 'Ulazni stupić uz istočni rub prilaza cesti Banfi', note: 'Otporno na UV i smrzavanje (IP54)' }
      ],
      lighting: [
        { item: 'Fasadne zidne svjetiljke prilaza i garaže', spec: '2× 10 W LED gore/dolje, 2700 K, IP65, mat antracit', qty: 4, mount: 'Bočni stupovi garažnih vrata i jugoistočni ugao (h = 2.15 m)', circuit: 'Krug E1 — sumračni senzor + prekidač u hodniku garaže' }
      ],
      electrical: [
        { item: 'Priprema punjača električnog vozila (Wallbox 11 kW)', qty: 1, height_cm: 135, position: 'Vanjski ili unutarnji zid uz istočni dovratnik garaže', note: 'Kabel 5×6 mm² direktno iz glavnog razvodnog ormara' },
        { item: 'Kabel za motorni pogon sekcijskih garažnih vrata', qty: 1, height_cm: 245, position: 'Strop garaže po središnjoj osi vrata (Y = -2.80 m)', note: 'Postojeći dovod s utičnicom na stropu' }
      ],
      plumbing: [
        { item: 'Oborinska linijska rešetka ispred praga garaže', spec: 'Pocink/lijevano željezo D400, l = 5.60 m, priključak na upojni zdenac', position: 'Uzduž garažnog praga (Y = -5.20 m)', height_cm: 0, note: 'Sprječava prodor oborinske vode u garažu' }
      ],
      sequence: [
        'Pregledati nagib prilaza i očistiti/ugraditi linijsku oborinsku rešetku ispred garažnih vrata.',
        'Sanirati i oprati kameni sokl suterena te izvesti fasadno bojenje toplom mineralno-bijelom bojom.',
        'Položiti završni opločnik na 2P platou i montirati vanjsku rasvjetu te pripremu za punjač vozila.'
      ]
    },
    checks: [
      'Provjeriti čiste padove opločnika od fasade i praga garaže prema kanaliću odvodnje.',
      'Uskladiti boju vanjske stolarije i aluminijskih okapnica s antracit garažnim vratima.'
    ]
  },
  {
    stop: 1,
    code: '02',
    name: '3D Vrt, pergola i vrtna staza',
    floor: 'Vrtni plato (±0.00 m)',
    openPlan: true,
    dims: {
      length_m: 6.4,
      width_m: 4.8,
      clearHeight_m: 2.65,
      kneeWall_m: null,
      floorArea_m2: 18.5,
      wallArea_m2: 0.0,
      note: 'Zapadni vrtni plato u ravnini s ulaznim trijemom (kotirano ±0.00 m), povezan travnatim koračnim pločama s trijemom.'
    },
    existing: [
      'Zapadni dio parcele uz ulazni trijem uređen kao travnata terasa na razini prizemlja s drvenom pergolom (3.8 × 3.8 m), vrtnim lounge sjedenjem i pješačkim kamenim pločama prema ulazu.',
      'Ukrasno bilje, niska grmolika vegetacija (lavanda, trave) i rubna stabla uz sjeverozapadnu među.'
    ],
    redesign: {
      summary: 'Smireni Japandi vrt: toplo nauljena cedrova ili ariš pergola iznad podesta od mat travertin ploča, vanjski lounge s lanenim/bouclé jastucima otpornim na vlagu i niskopodni topli LED stupići duž staze.',
      finishes: [
        { element: 'Terasa pod pergolom i koračne ploče', material: 'Mat vanjski travertin / protuklizni porculan d = 20 mm (R11)', spec: 'Ploče 80 × 80 cm u suhoj/polusuhoj posteljici od drobljenca', qty: 18.5, unit: 'm²', note: 'Uključuje 5 koračnih ploča od pergole prema ulaznom trijemu' },
        { element: 'Vrtna vegetacija i šljunčane gredice', material: 'Ukrasne trave (Pennisetum), lavanda, japanski javor i bijeli kulir', spec: 'Geotekstil ispod šljunka radi sprječavanja korova + rubnici', qty: 24.0, unit: 'm²', note: 'Priprema za navodnjavanje kap-po-kap' }
      ],
      furniture: [
        { item: 'Drvena pergola s lamelama', dims: '380 × 380 × 265 cm', material: 'Lamelirani sibirski ariš / cedar na skrivenim čeličnim stopama', position: 'Zapadni vrt (X ∈ [-11.5, -7.7], Y ∈ [-4.4, -0.6 m])', note: 'Uljenje prirodnim UV vanjskim uljem svake 2 sezone' },
        { item: 'Vanjska L-garnitura + niski vrtni stolić', dims: '240 × 180 × 72 cm + stol Ø 85 × 38 cm', material: 'Tikovina / termo-jasen + vodoodbojna lan/bouclé tkanina', position: 'Ispod pergole orijentirano prema kući i jugozapadu', note: 'Jastuci s navlakama na skidanje i brzosušećom spužvom' }
      ],
      lighting: [
        { item: 'Vrtni niskopodni stupići (bollards)', spec: '5× 5 W LED, 2700 K, IP65, mat antracit visine 55 cm', qty: 5, mount: 'Duž koračnih ploča od pergole do trijema i rubova gredica', circuit: 'Krug E2 — sumračni/tajmer prekidač uz glavna ulazna vrata' },
        { item: 'Ugradbena LED traka na gredama pergole', spec: '8 W/m, 2700 K, IP67, dimabilno', qty: 3.6, mount: 'Unutarnji utor gornje grede pergole', circuit: 'Krug E3 — daljinski ili zidni prekidač trijema' }
      ],
      electrical: [
        { item: 'Vanjska IP55 dupla utičnica na stupu pergole', qty: 2, height_cm: 40, position: 'Sjeveroistočni drveni stup pergole', note: 'FID 30 mA zaštita s prekidačem unutar kuće' }
      ],
      plumbing: [
        { item: 'Vrtna slavina i izvod za navodnjavanje kap-po-kap', spec: 'Mjerna/ispustna slavina s ispustom protiv smrzavanja', position: 'Zapadni fasadni sokl ispod kuhinjskog prozora', height_cm: 45, note: 'Ventil za zatvaranje zimi u podrumu' }
      ],
      sequence: [
        'Iskolčiti terasu pergole i iskopati temeljne stope stupova te rov za vrtnu rasvjetu i navodnjavanje.',
        'Montirati čelične ankere i drvenu konstrukciju pergole od cedra/ariša.',
        'Položiti drenažnu posteljicu, rubnjake i travertin R11 ploče terase te koračne ploče do trijema.',
        'Spojiti vanjske rasvjetne stupiće i dovršiti sadnju trajnica te šljunčane gredice.'
      ]
    },
    checks: [
      'Provjeriti nivelmanski priključak ploča na nivo ulaznog trijema (kotirano ±0.00 m bez praga spoticanja).',
      'Sva vanjska rasvjeta mora biti spojena preko FID sklopke osjetljivosti 30 mA.'
    ]
  },
  {
    stop: 2,
    code: '03',
    name: 'Vanjsko stubište i natkriveni ulazni trijem',
    floor: 'Ulazna sekvenca (-2.73 → 0.00 m)',
    openPlan: true,
    dims: {
      length_m: 6.2,
      width_m: 1.55,
      clearHeight_m: 2.55,
      kneeWall_m: null,
      floorArea_m2: 8.0,
      wallArea_m2: 14.0,
      note: '16 gazišta vanjskog stubišta (-2.73 → 0.00 m) s južnim podestom, staklenom ogradom i kosom nadstrešnicom nagiba 35° s pokrovom od crijepa ispred otvorenih glavnih vrata (106 × 216 cm).'
    },
    existing: [
      'Vanjsko armiranobetonsko stubište uz zapadnu fasadu (X ∈ [-5.90, -4.45 m]) sa 16 kamenih stuba od južnog platoa (-2.73 m) na podest trijema (0.00 m).',
      'Kosa ulazna nadstrešnica nagiba 35° s pokrovom od tamnog crijepa, drvenim rogovima, toplim cedrovim letvicama podgleda, zaštitnom staklenom ogradom i glavnim hrastovim vratima 106 × 216 cm.'
    ],
    redesign: {
      summary: 'Reprezentativni ulaz: protuklizna gazišta od plamenog granita ili debelog travertina R11, staklena ograda bez gornjih profila s antracit stupićima, letvičasti cedrov podgled s integriranim ulaznim spotovima i čisto obrađen ulazni portal.',
      finishes: [
        { element: 'Gazišta vanjskog stubišta i podest trijema', material: 'Plameni kamen / gres ploče R11 (protukliznost za kišu i snijeg)', spec: '16 gazišta 135 × 30 × 3 cm s okapnim utorom + podest 3.4 m²', qty: 8.0, unit: 'm²', note: 'Pad 1 % prema vanjskom rubu radi otjecanja kišnice' },
        { element: 'Podgled ulazne nadstrešnice', material: 'Cedrove letvice na crnom nosivom okviru', spec: 'Širina letvica 45 mm, razmak 15 mm, UV vanjsko mat ulje', qty: 3.8, unit: 'm²', note: 'Uključuje reviziju za ugradbene LED downlighte' }
      ],
      furniture: [
        { item: 'Zaštitna ograda stubišta i trijema', dims: 'l = 6.8 m, h = 100 cm', material: 'Kaljeno laminirano staklo 8.8.2 + mat antracit stezaljke i rukohvat', position: 'Zapadni vanjski rub stubišta i podesta trijema', note: 'Otvoreni prolaz prema vrtnoj stazi na zapadu trijema' },
        { item: 'Glavna ulazna vrata (servis i zaštita)', dims: '106 × 216 cm', material: 'Prirodni hrast (ili uljeni dekor) + inox rukohvat', position: 'Zapadni zid kuće Y ∈ [-0.38, +0.68 m], Z ∈ [-3.00, -0.84 m]', note: 'Zatečeno otvoreno krilo za nesmetan 1:1 ulaz' }
      ],
      lighting: [
        { item: 'Ugradbeni stropni spotovi ulazne nadstrešnice', spec: '2× 7 W LED, 2700 K, IP65, crni prsten', qty: 2, mount: 'Ugrađeni u cedrov podgled točno ispred ulaznih vrata', circuit: 'Senzor pokreta + prekidač u hodniku' },
        { item: 'Podstepenišna vanjska LED traka (opcija)', spec: '4.8 W/m, 2700 K, IP67 u aluminijskom profilu ispod nosa gazišta', qty: 16.0, mount: 'Donji okapni rub svakog gazišta', circuit: 'Sumračni senzor na 24 V DC napajanju' }
      ],
      electrical: [
        { item: 'Video portafon / tipkalo zvona + čitač', qty: 1, height_cm: 135, position: 'Lijevi dovratnik ulaza (Y = -0.58 m)', note: 'Povezan mrežnim/PoE kabelom s unutarnjim monitorom u hodniku' }
      ],
      plumbing: [],
      sequence: [
        'Provjeriti hidroizolaciju armiranobetonske konstrukcije vanjskog stubišta i trijema.',
        'Polaganje gazišta s okapnicama i ugradnja linijske podstepenišne LED rasvjete.',
        'Montaža čeličnih sidara i laminiranih staklenih panela ograde.',
        'Obrada cedrovog podgleda nadstrešnice, montaža LED spotova i video portafona.'
      ]
    },
    checks: [
      'Provjeriti čistoću praga glavnih ulaznih vrata prilikom spajanja s unutarnjim parketom riblja kost (zazor ≥ 18 mm).',
      'Osigurati protukliznost gazišta klase min. R11 za vanjske zimske uvjete.'
    ]
  },
  {
    stop: 3,
    code: '04',
    name: 'Ulazni hodnik i dvoetažni atrij',
    floor: 'Prizemlje (0.00 m)',
    openPlan: true,
    dims: {
      length_m: 3.8,
      width_m: 3.58,
      clearHeight_m: 6.19,
      kneeWall_m: null,
      floorArea_m2: 13.6,
      wallArea_m2: 24.5,
      note: 'Glavni ulazni portal s trostranim pogledom u dvoetažni loft (sljeme +6.19 m) i izravnom vezom na sjeverno krilo prizemlja.'
    },
    existing: [
      'Kontinuirani hrastov pod od glavnih vodoravno profiliranih mahagonij ulaznih vrata (s uskim vertikalnim prozirnim staklom i 3 inox panta na južnoj strani) kroz ulazni hodnik u atrij.',
      'Na sjevernom zidu ulaznog hodnika veliko vertikalno ogledalo u brušenom srebrnom okviru (86 × 178 cm) i antracit prekidači; na južnom zidu uvučena stolarska garderobna niša (124 × 68 cm) s gornjim mat bijelim ormarićem, hrastovom oblogom s kromiranom šipkom za jakne te hrastovom klupicom i 2 široke ladice za obuću.',
      'Bezokvirna pregrada od satiniranog mutnog stakla s nadsvjetlom, fiksnim južnim poljem i zaokretnim vratima s 5 horizontalnih prozirnih linija uz središnji bijeli nosivi stup s dvostrukim antracit prekidačima.',
      'Tamna wenge vrata u širokom hrastovom dovratniku prema sjevernom predsoblju, te u osi pogleda ispod čeličnog zubčastog nosača stepeništa tamni wenge korpus s hrastovim frontama, ugradbenom Whirlpool vinotekom i trokutastom dijagonalnom hrastovom policom za vino uz punovisinski prozor stepeništa (do 14 cm od poda).'
    ],
    redesign: {
      summary: 'Topla minimalistička ulazna zona: pod prelazi u hrastov parket riblja kost, zidovi dobivaju vapneni štuk, a dovratnik sjevernih vrata tamni ebonizirani ton.',
      finishes: [
        { element: 'Pod', material: 'Troslojni hrastov parket (riblja kost)', spec: 'Letvice 600 × 120 × 14 mm, prirodni uljeni hrast', qty: 15.0, unit: 'm²', note: 'Uključeno +10 % otpada za rezanje pod kutem' },
        { element: 'Zidovi ulaznog dijela', material: 'Vapneni štuk (prijedlog)', spec: 'Fina mineralna glet-masa + vapnena boja NCS S 1505-Y30R (#e9e1d3)', qty: 24.5, unit: 'm²', note: 'Bez otpada; uračunata impregnacija' },
        { element: 'Dovratnici ulaznog dijela', material: 'Ebonizirani hrast (lazura)', spec: 'Ton RAL 9005 mat lazura u 2 sloja na postojeći hrast', qty: 1, unit: 'kom', note: 'Svijetli otvor 90 × 208 cm' }
      ],
      furniture: [
        { item: 'Zidno ogledalo / vješalica (prijedlog)', dims: '60 × 4 × 160 cm', material: 'Masivni hrast + kristalno ogledalo', position: 'Sjeverozapadni zid uz ulaz (Y ≈ +0.75 m)', note: 'Prijedlog za odlaganje kaputa odmah pri ulasku' }
      ],
      lighting: [
        { item: 'Ugradbena stropna svjetiljka atrijskog prolaza', spec: '12 W LED, 2700 K, CRI > 90, IP20, mat bijela', qty: 1, mount: 'Podgled sjevernog mosta ispred vrata (h = 2.52 m)', circuit: 'Krug 1 — senzor ili izmjenični prekidač uz ulaz' }
      ],
      electrical: [
        { item: 'Glavni blok prekidača atrija + monitor portafona', qty: 2, height_cm: 120, position: 'Istočna strana međukatnog stupa i zid sjeverno od ulaznih vrata', note: 'Zamjena maski u mat antracit/crnu' },
        { item: 'Utičnica opća 230 V', qty: 1, height_cm: 30, position: 'Sjeverni zid uz ulaz u predsoblje', note: 'Za usisavač / održavanje' }
      ],
      plumbing: [],
      sequence: [
        'Zaštititi staklena vrata i demontirati stari laminat.',
        'Obnoviti/izravnati estrih, položiti impregnaciju i pripremiti podlogu za riblju kost u kontinuitetu s prizemljem.',
        'Izvesti gletanje i nanošenje toplog vapnenog štuka (NCS S 1505-Y30R).',
        'Pobrusiti i tonirati hrastov dovratnik u tamni ebonizirani hrast.'
      ]
    },
    checks: [
      'Provjeriti smjer polaganja riblje kosti da prati glavnu sjever–jug os atrija.',
      'Izmjeriti debljinu parketa + ljepila (≈16 mm) radi visine praga glavnih ulaznih vrata.'
    ]
  },
  {
    stop: 4,
    code: '05',
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
    stop: 5,
    code: '06',
    name: 'Blagovaonica i kamin na pelete',
    floor: 'Prizemlje — jugozapad i jug (0.00 m)',
    openPlan: true,
    dims: {
      length_m: 4.1,
      width_m: 3.4,
      clearHeight_m: 6.0,
      kneeWall_m: null,
      floorArea_m2: 15.2,
      wallArea_m2: 25.5,
      note: 'Blagovaonica uz južnu staklenu stijenu (224 × 228 cm) te 5.98 m visok dimnjački stup od opeke s peći na pelete.'
    },
    existing: [
      'Pravokutni blagovaonski stol od zlatnog hrasta (193 × 105 × 78 cm) na crnim X-nogama sa 4 bijele i 2 ružičaste baršunaste stolice pod dvjema visećim kupolama.',
      'Vertikalni stup od crvene opeke visine 5.98 m s drvenom skulpturom na +3.34 m i dvjema krom zidnim lampama (h = 1.62 m).',
      'Bordo peć na pelete (54 × 49 × 101 cm) s crnom dimovodnom cijevi Ø 130 mm do visine +2.60 m.'
    ],
    redesign: {
      summary: 'Okrugli travertinski stol Ø 136 cm s bouclé stolicama pod papirnatom Akari lampom Ø 76 cm; dimnjak dobiva vapnenu lazuru (limewash), peć i zidne lampe prelaze u mat crnu, a stijena dobiva lanene rolete.',
      finishes: [
        { element: 'Pod', material: 'Troslojni hrastov parket riblja kost', spec: 'Isti slog bez dilatacijskih lajsni prema boravku i kuhinji', qty: 16.5, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Zidne plohe oko južne stijene', material: 'Vapneni štuk NCS S 1505-Y30R', spec: 'Fina mineralna obrada do krovnih kosina', qty: 14.5, unit: 'm²', note: 'Obrada špaleta oko južnih stakala' },
        { element: 'Obloga dimnjaka', material: 'Vapnena lazura za opeku (limewash)', spec: '2 ruke mineralne vapnene boje s vidljivom teksturom fuge (#f2ece4)', qty: 11.0, unit: 'm²', note: 'Rad sa skele do sljemena (5.98 m)' }
      ],
      furniture: [
        { item: 'Okrugli blagovaonski stol', dims: 'Ø 136 × 79 cm', material: 'Impregnirani mat travertin (ploča + stožasto postolje)', position: 'Središte blagovaonice (X = -1.86, Y = -3.23 m)', note: 'Težina ~135 kg — zaštititi pod pri unosu' },
        { item: 'Blagovaonske stolice (6 kom)', dims: '58 × 56 × 80 cm', material: 'Masivni hrast + tapecirano sjedalo u krem bouclé tkanini', position: 'Radijalno oko okruglog stola', note: 'Slobodan prolaz min. 85 cm prema kuhinji i kaminu' },
        { item: 'Peć na pelete (mat crna obrada) + sigurnosno staklo', dims: '54 × 49 × 101 cm', material: 'Termootporni mat crni lak do 300 °C + kaljeno podno staklo 70 × 70 cm', position: 'Ispred dimnjaka (X = 0.02, Y = -4.42 m)', note: 'Zaštita parketa od žara' },
        { item: 'Rimske lanene rolete + terakota biljka', dims: '224 × 228 cm (rolete)', material: 'Prirodni poludrapirani lan u tonu zobi', position: 'Južna staklena stijena i ugao uz dimnjak', note: 'Zamjena tamnih žaluzina' }
      ],
      lighting: [
        { item: 'Viseća papirnata lampa (Akari stil)', spec: 'Ø 76 cm, rižin papir, 1× E27 LED 12 W, 2700 K, CRI 95', qty: 1, mount: 'Ovjes sa stropa (+5.70 m) na visinu sjenila h = 1.60 m iznad stola', circuit: 'Krug 4 — centralna rozeta iznad stola' },
        { item: 'Dvosmjerne zidne lampe na dimnjaku (gore/dolje)', spec: 'Mat crni aluminij, 2× GU10 LED 5 W, 2700 K, 36°', qty: 2, mount: 'Dimnjak X = ±0.44 m, h = 1.62 m', circuit: 'Krug 5 — postojeći kablovi u dimnjaku' }
      ],
      electrical: [
        { item: 'Centralni stropni izvod rasvjete (ovjes 4.1 m)', qty: 1, height_cm: 570, position: 'Krovna kosina iznad stola (X = -1.86, Y = -3.23 m)', note: 'Tekstilni kabel min. 4.5 m s čeličnom sajlom' },
        { item: 'Priključak peći na pelete (230 V + termostat)', qty: 1, height_cm: 30, position: 'Južni zid iza peći (X = 0.25, Y = -4.72 m)', note: 'Osigurač 16 A' }
      ],
      plumbing: [],
      sequence: [
        'Privremeno odspojiti dimovod i izvući/zaštititi peć na pelete; bočne oplate poslati na termootporno mat crno lakiranje.',
        'Demontirati dvije bijele kupole i pripremiti jedinstvenu rozetu za Akari lampu.',
        'Navlažiti opeku dimnjaka i kistom nanijeti vapnenu lazuru (limewash) sa skele.',
        'Položiti parket riblju kost, vratiti peć na kaljeno podno staklo te postaviti travertinski stol i rasvjetu.'
      ]
    },
    checks: [
      'Visinske radove na dimnjaku i stropnom ovjesu uskladiti s najmom skele za krovne rešetke (zona 12).',
      'Obavezno ispitati brtvljenje dimovoda Ø 130 mm nakon vraćanja peći.'
    ]
  },
  {
    stop: 6,
    code: '07',
    name: 'Dnevni boravak i TV zid',
    floor: 'Prizemlje — jugoistok (0.00 m)',
    openPlan: true,
    dims: {
      length_m: 4.3,
      width_m: 3.55,
      clearHeight_m: 5.95,
      kneeWall_m: null,
      floorArea_m2: 15.3,
      wallArea_m2: 26.4,
      note: 'Istočni zid od tamnih dasaka (5.65 × 4.05 m) postaje akustični zid od letvica; otvoreni balkonski portal na jugu vodi u zonu 08.'
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
        { element: 'Istočni TV zid', material: 'Akustični paneli — hrastove letvice na crnom PET filcu', spec: 'Visina panela 405 cm (0.00 → +4.05 m), letvica 27 × 19 mm, razmak 13 mm, filc 9 mm', qty: 23.0, unit: 'm²', note: 'Obrada oko istočnog prozora stepeništa (70 × 185 cm); +8 % za ukrajanje' },
        { element: 'Stropne kosine i ostali zidovi', material: 'Vapneni štuk NCS S 1505-Y30R', spec: 'Mat izvedba', qty: 12.0, unit: 'm²', note: 'Stupovi i špalete' }
      ],
      furniture: [
        { item: 'Lebdeća TV komoda s LED utorom', dims: '210 × 41 × 32 cm', material: 'Furnir prirodni hrast + crna aluminijska nosiva šina', position: 'Istočni zid Y ∈ [-4.55, -2.45 m], h = 28–60 cm od poda', note: 'Integrirani kanal za 24 V LED traku na dnu' },
        { item: 'Modularna L-garnitura', dims: '282 × 227 × 84 cm', material: 'Krem bouclé tkanina na niskom crnom soklu', position: 'Središte boravka X ∈ [-0.15, 2.67], Y ∈ [-3.55, -1.28 m]', note: 'Visina sjedišta 42 cm' },
        { item: 'Okrugli klub-stolić + pomoćni travertin + tepih', dims: 'Ø 92 × 33 cm + Ø 50 × 44 cm + tepih 276 × 225 cm', material: 'Prirodni hrast / mat travertin / vuna', position: 'Ispred garniture', note: 'Ostaviti čist prolaz od 90 cm prema balkonskim vratima' },
        { item: 'Mid-century kožna lounge fotelja', dims: '85 × 88 × 82 cm', material: 'Tamni orah + konjak koža', position: 'Jugoistočni dio boravka (X ≈ 2.68, Y ≈ -3.96 m)', note: 'Zakrenuta prema centru druženja' }
      ],
      lighting: [
        { item: '3× viseće papirnate lampe različitih visina', spec: 'Ø 60, 48 i 42 cm, rižin papir, 3× E27 LED 10 W, 2700 K, dimabilno', qty: 3, mount: 'Visine sjenila od poda: +2.36 m, +2.54 m i +2.78 m iznad boravka', circuit: 'Krug 6 — zamjena triju opalnih kugli' },
        { item: 'Skrivena LED traka ispod TV komode', spec: '12 W/m, 2700 K, 24 V DC, l = 1.96 m u utoru komode', qty: 2.0, mount: 'Donja ploha TV komode (h = 27 cm)', circuit: 'Krug 7 — pametni dimer' }
      ],
      electrical: [
        { item: 'TV zid — skriveni bužir Ø 50 mm + 3× Schuko + 2× LAN', qty: 4, height_cm: 130, position: 'Istočni zid Y = -3.92 m (iza 65" TV-a)', note: 'HDMI kanal spušten u lebdeću komodu na h = 44 cm' },
        { item: 'Napajanje LED trake 24 V DC (skriveno u komodi)', qty: 1, height_cm: 44, position: 'Iza desnog polja TV komode', note: 'Trafo 60 W s pasivnim hlađenjem' }
      ],
      plumbing: [],
      sequence: [
        'Demontirati tamne daske, bijelo-hrastovu komodu i X-zidnu lampu.',
        'Ukopati kabel za skrivenu LED traku i bužir Ø 50 mm od visine TV-a (130 cm) do visine komode (44 cm).',
        'Postaviti drvenu potkonstrukciju na zid iza nosača TV-a i lebdeće komode (da vijci ne gnječe PET filc).',
        'Montirati akustične letvičaste panele do +4.05 m i postaviti lebdeću TV komodu te Akari visilice.'
      ]
    },
    checks: [
      'OBAVEZNO ugraditi drvene odstojnike ili čeličnu nosivu šinu izravno u zid kroz akustični filc prije vješanja TV-a i komode.',
      'Sačuvati slobodan radijus otvaranja balkonskih vrata (zona 08) iza kožne fotelje.'
    ]
  },
  {
    stop: 7,
    code: '08',
    name: 'Jugoistočni balkon',
    floor: 'Prizemlje — vanjska terasa (+0.00 m)',
    openPlan: true,
    dims: {
      length_m: 5.9,
      width_m: 1.15,
      clearHeight_m: 3.1,
      kneeWall_m: null,
      floorArea_m2: 6.8,
      wallArea_m2: 4.5,
      note: 'Konzolni južni balkon iznad garaže i radne sobe (X ∈ [-2.95, +2.95], Y ∈ [-6.15, -5.00 m]), povezan otvorenim vratima s boravkom.'
    },
    existing: [
      'Betonska konzolna balkonska ploča s metalno-staklenom ogradom (h = 100 cm) i vanjskom keramikom.',
      'Izravan izlaz kroz balkonska vrata dnevnog boravka (X ∈ [1.80, 2.72 m]).'
    ],
    redesign: {
      summary: 'Čist i siguran konzolni balkon obložen vanjskim mat travertinom R11, s novom polimercementnom hidroizolacijom, okapnim profilom i laminiranom staklenom ogradom s antracit rukohvatom.',
      finishes: [
        { element: 'Hidroizolacija i pod balkona', material: 'Elastična 2K hidroizolacija + travertin porculan 60 × 60 cm (R11)', spec: 'Uključuje aluminijski okapni rubni profil i brtvenu traku uz prag vrata', qty: 7.5, unit: 'm²', note: 'Pad 1.5 % prema južnom rubu' },
        { element: 'Podgled balkona iznad garažnog praga', material: 'Fasadna žbuka s okapnicom', spec: 'Topla mineralna bijela (NCS S 0804-Y20R)', qty: 6.8, unit: 'm²', note: 'Sprečava podlijevanje kiše prema garažnim vratima' }
      ],
      furniture: [
        { item: 'Balkonska staklena ograda + kompaktni bistro set', dims: 'l = 8.2 m, h = 100 cm (ograda)', material: 'Kaljeno laminirano staklo 8.8.2 + antracit rukohvat + 2 tikove stolice', position: 'Duž južnog, zapadnog i istočnog ruba balkonske ploče', note: 'Sidrenje u čelo ploče da se ne probija gornja hidroizolacija' }
      ],
      lighting: [
        { item: 'Fasadne zidne svjetiljke uz balkonska vrata', spec: '2× 6 W LED, 2700 K, IP65, mat antracit', qty: 2, mount: 'Uz izlazna vrata boravka i južnu stijenu blagovaonice (h = 2.10 m)', circuit: 'Prekidač pokraj balkonskih vrata' }
      ],
      electrical: [
        { item: 'Vanjska IP55 utičnica uz balkonski izlaz', qty: 1, height_cm: 35, position: 'Zid lijevo od balkonskih vrata', note: 'Za prigodnu rasvjetu ili održavanje' }
      ],
      plumbing: [],
      sequence: [
        'Skinuti staru ogradu i keramiku do betonske ploče te provjeriti/izravnati pad 1.5 %.',
        'Ugraditi rubni okapni profil, 2 sloja elastične hidroizolacije i brtvenu traku uz vrata.',
        'Polaganje R11 travertin porculana na C2TE S1 fleksibilno ljepilo.',
        'Montirati staklenu ogradu bočnim sidrenjem u čelo ploče i vanjske zidne svjetiljke.'
      ]
    },
    checks: [
      'Sidriti stupiće ograde bočno u armiranobetonsko čelo ploče kako se ne bi probušila gornja hidroizolacija.',
      'Ispitati visinu praga balkonskih vrata u odnosu na debljinu vanjskih pločica.'
    ]
  },
  {
    stop: 8,
    code: '09',
    name: 'Sjeverno krilo prizemlja (Predsoblje, Soba 1, Kupaonica Pr, Soba 2)',
    floor: 'Prizemlje — sjever (0.00 m)',
    openPlan: false,
    dims: {
      length_m: 9.12,
      width_m: 3.92,
      clearHeight_m: 2.53,
      kneeWall_m: null,
      floorArea_m2: 40.9,
      wallArea_m2: 92.0,
      note: 'Predsoblje s U-stepeništem (7.9 m²), Soba 1 SZ (11.1 m²), Kupaonica Pr (5.1 m²) i Soba 2 SI (12.8 m²) u punom tlocrtnom obuhvatu sjevernog trakta prizemlja.'
    },
    existing: [
      'Sjeverno predsoblje povezuje dvoetažni atrij s unutarnjim dvokrakim U-stepeništem za podrum i ulazima u tri prostorije.',
      'Soba 1 SZ (krevet, pisaći stol, ormar), Kupaonica Pr s walk-in tušem i Soba 2 SI (bračni krevet, ormar i dva prozora).'
    ],
    redesign: {
      summary: 'Jedinstvena cjelina mirnog prizemnog spavaćeg trakta: troslojni hrastov parket riblja kost kroz predsoblje i obje sobe, vapneni štuk na zidovima, hrastove klupice i garderobe te walk-in tuš kupaonica u mat travertinu i brušenoj mjedi.',
      finishes: [
        { element: 'Podovi (Predsoblje, Soba 1, Soba 2)', material: 'Troslojni hrastov parket riblja kost + lajsne 60 mm', spec: 'Prijelazi bez pragova između hodnika i soba', qty: 38.5, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Zidovi i stropovi sjevernog trakta', material: 'Vapneni štuk NCS S 1505-Y30R / strop mat bijela', spec: 'Uključuje špalete stepenišnog prozora i svih vrata', qty: 76.0, unit: 'm²', note: 'Obrada 4 dovratnika' },
        { element: 'Kupaonica Pr — hidroizolacija i travertin', material: 'Dvokomponentna hidroizolacija + porculan mat travertin 60 × 120 cm', spec: 'Walk-in pod u razini s kanalicom + zidovi do stropa 2.53 m', qty: 24.5, unit: 'm²', note: 'R10 protukliznost u tuš zoni' }
      ],
      furniture: [
        { item: 'Predsoblje: hrastova klupica s bouclé jastukom + ogledalo', dims: '100 × 36 × 50 cm + 80 × 110 cm', material: 'Masivni hrast + lan/bouclé', position: 'Južni zid predsoblja (X ∈ [1.15, 2.15 m])', note: 'Prostran prolaz uz ogradu U-stubišta' },
        { item: 'Soba 1 SZ: krevet 90×200, radni stol 117×57 i ormar 121 cm', dims: 'Komplet za jednokrevetnu / radnu sobu', material: 'Prirodni hrast + lanena posteljina kadulja/zob + crni metal', position: 'Zapadni i sjeverni zid Sobe 1 (X ∈ [-3.68, +0.10], Y ∈ [2.70, 4.88 m])', note: 'Radni stol ispod sjevernog prozora' },
        { item: 'Soba 2 SI: bračni krevet 160×200, noćni ormarići i garderoba', dims: '205 × 170 cm + ormar 150 × 58 × 228 cm', material: 'Prirodni hrast + lan + mat bijeli/hrast ormar', position: 'Istočni i južni zid Sobe 2 (X ∈ [2.54, 5.44], Y ∈ [0.96, 4.88 m])', note: 'Dobra dnevna rasvjeta kroz sjeverni i JI prozor' },
        { item: 'Kupaonica Pr: lebdeći ormarić + ogledalo + walk-in staklo', dims: '80 × 44 × 42 cm + pregrada 111 × 199 cm', material: 'Hrast otporan na vlagu + kaljeno prozirno staklo 8 mm', position: 'Zapadni stup (Y ∈ [4.02, 4.84]) i SI kut tuša', note: 'Crni/mjed U-profil stakla tuša' }
      ],
      lighting: [
        { item: 'Stropne plafonjere (Predsoblje, Soba 1, Kupaonica IP44, Soba 2)', spec: '4× LED plafonjera Ø 32–40 cm, 2700 K, CRI > 90', qty: 4, mount: 'Središta svake prostorije (h = 2.53 m)', circuit: 'Zasebni krugovi i prekidači uz svaka vrata' },
        { item: 'Noćne stolne/zidne lampe Sobe 2 i ogledala Kupaonice Pr', spec: '2× 6 W 2700 K uz krevet + LED ogledalo 80 × 70 cm', qty: 3, mount: 'Uzglavlje Sobe 2 i umivaonik Kupaonice Pr', circuit: 'Prekidači uz uzglavlje i ulaz u kupaonicu' }
      ],
      electrical: [
        { item: 'Setovi utičnica 230 V, prekidača i UTP/LAN priključaka', qty: 12, height_cm: 30, position: 'Ispod radnog stola Sobe 1, obostrano uz krevet Sobe 2 i u predsoblju', note: 'IP44 utičnica uz ogledalo Kupaonice Pr na h = 115 cm' }
      ],
      plumbing: [
        { item: 'Walk-in tuš kanalica + podžbukna/nadžbukna miješalica brušena mjed', spec: 'Inox kanalica 80 cm u ravnini poda + kišna ruža Ø 25 cm', position: 'SI kut Kupaonice Pr (X ∈ [1.45, 2.40], Y ∈ [3.75, 4.86 m])', height_cm: 105, note: 'Pad estriha 2 % prema kanalici' },
        { item: 'Konzolna WC školjka + umivaonik s miješalicom', spec: 'Ugradbeni vodokotlić h = 115 cm, rimless školjka, tipkalo brušena mjed', position: 'Zapadni zid Kupaonice Pr (Y = 3.30 i Y = 4.43 m)', height_cm: 84, note: 'Odvod Ø 110 / Ø 50 mm provjeriti prije glazure' }
      ],
      sequence: [
        'Grubi vodovodni i elektro radovi u Kupaonici Pr i sobama sjevernog trakta.',
        'Hidroizolacija poda/zidova Kupaonice Pr, polaganje mat travertin porculana i walk-in stakla.',
        'Gletanje, vapneni štuk na zidovima i bojenje stropova svih 4 prostorija.',
        'Polaganje hrastovog parketa riblja kost, montaža dovratnika, sanitarija i rasvjete te unos namještaja.'
      ]
    },
    checks: [
      'Provjeriti čiste dimenzije špalete visokog prozora stubišta (-4.05 do -2.05 m) između prizemlja i podruma.',
      'Ispitati nagib tuš ploče Kupaonice Pr prema kanalici prije fugiranja.'
    ]
  },
  {
    stop: 9,
    code: '10',
    name: 'Podrum — unutarnje U-stubište, vešeraj i kotlovnica',
    floor: 'Podrum — sjever (-2.73 m)',
    openPlan: false,
    dims: {
      length_m: 9.12,
      width_m: 3.92,
      clearHeight_m: 2.43,
      kneeWall_m: null,
      floorArea_m2: 33.8,
      wallArea_m2: 88.0,
      note: 'Unutarnje dvokrako U-stepenište (16 stuba po 17.06 cm), donji predprostor, Vešeraj (11.1 m²) i Kotlovnica (16.5 m²) s dva sjeverna prozora u engleskim šahtovima i vanjskim vratima 80 × 220 cm.'
    },
    existing: [
      'Dvokrako U-stepenište od hrastovih gazišta s međupodestom (-1.365 m) i obostrano montiranim zidnim rukohvatima od prizemlja (0.00 m) do podruma (-2.73 m).',
      'Vešeraj na sjeverozapadu s perilicom, sušilicom, sudoperom od nehrđajućeg čelika i radnom pločom ispod sjevernog nadsvjetla 160 × 70 cm.',
      'Kotlovnica na sjeveroistoku s vanjskim vratima 80 × 220 cm (JI izlaz suterena), jedinicom dizalice topline, bojlerom/puferom 500 L, ekspanzijskom posudom i razdjelnikom podnog grijanja.'
    ],
    redesign: {
      summary: 'Čist i izdržljiv tehničko-gospodarski trakt: protuklizni tehnički porculan R10 na cijelom podu i soklu, uljeni hrastovi gazišni pragovi U-stubišta, perive zidne boje, radna ploha vešeraja i organizirana LED rasvjeta 4000 K.',
      finishes: [
        { element: 'Podovi podruma (Hodnik, Vešeraj, Kotlovnica)', material: 'Tehnički porculan R10 60 × 60 cm s podnom sokl-lajsnom h = 8 cm', spec: 'Svijetli toplo-sivi beton efekt otporan na vlagu i udarce', qty: 36.5, unit: 'm²', note: '+8 % otpada; podni sifon u kotlovnici i vešeraju' },
        { element: 'Zidovi i AB strop podruma', material: 'Periva paropropusna silikatna boja (NCS S 1002-Y)', spec: 'Otporno na vlagu u podrumu + obrada engleskih šahtova', qty: 88.0, unit: 'm²', note: 'Uključuje gornji dio prozorskih niša' },
        { element: 'Gazišta i rukohvati U-stubišta (16 stuba)', material: 'Masivni hrast — protuklizno mat uljenje R10', spec: 'Obostrani hrastovi rukohvati i metalna zaštitna ograda na prizemlju', qty: 1, unit: 'kpl', note: 'Čista visina spusta 2.73 m' }
      ],
      furniture: [
        { item: 'Vešeraj: radna ploča iznad perilice/sušilice + sudoper', dims: '207 × 68 × 90 cm + regal 123 × 42 × 195 cm', material: 'Kompakt / vodoodporni hrast + inox praonički sudoper + bijeli ormarić', position: 'Sjeverni i zapadni zid Vešeraja (X ∈ [-3.62, -1.55], Y ∈ [4.18, 4.86 m])', note: 'Prostor za perilicu i sušilicu širine 2× 65 cm ispod ploče' },
        { item: 'Kotlovnica: dizalica topline, pufer 500 L, ekspanzija i razdjelnik', dims: 'Kompletna toplinska stanica', material: 'Tvornička bijela + inox bakreni spremnik + crveni spremnik', position: 'Sjeveroistočni dio Kotlovnice (X ∈ [3.15, 5.35], Y ∈ [2.25, 4.85 m])', note: 'Ostaviti min. 90 cm servisnog pristupa ispred svih uređaja' }
      ],
      lighting: [
        { item: 'Linearne LED svjetiljke IP44 (Vešeraj & Kotlovnica)', spec: '2× 24 W LED letva l = 120 cm, 4000 K za jasan radni pregled', qty: 2, mount: 'Središte stropa Vešeraja i Kotlovnice (h = 2.43 m)', circuit: 'Prekidači uz svaka vrata' },
        { item: 'Zidna orijentacijska svjetla U-stubišta', spec: '3× 3 W ugradbeni LED step-light 2700 K', qty: 3, mount: 'Zid uz gornji, središnji i donji krak stubišta', circuit: 'Izmjenični prekidač Pr ↔ Po' }
      ],
      electrical: [
        { item: 'Zasebni 16 A krugovi za perilicu, sušilicu i 3-faznu dizalicu topline', qty: 4, height_cm: 120, position: 'Sjeverni zid Vešeraja + razvodni ormar Kotlovnice', note: 'Zaštitne utičnice IP44 s poklopcem' }
      ],
      plumbing: [
        { item: 'Priključci perilice, sušilice (kondenzat) i praoničkog sudopera', spec: '2× kombinirana slavina + sifon s nepovratnim ventilom', position: 'Sjeverni zid Vešeraja (Y = 4.82 m)', height_cm: 65, note: 'Podni sifon Ø 50 mm sa suhim zatvaračem mirisa' },
        { item: 'Razdjelnik podnog grijanja i hidraulička veza kotlovnice', spec: '12-kružni inox razdjelnik za Po+Pr+Pk, cirkulacijske pumpe i punjenje sustava', position: 'Istočni zid Kotlovnice (X = 5.32 m)', height_cm: 115, note: 'Obavezna tlačna proba 6 bar prije polaganja podnih obloga' }
      ],
      sequence: [
        'Ugraditi i tlačnim testom ispitati cjevovode kotlovnice, podnog grijanja i vešeraja.',
        'Polaganje R10 tehničkog porculana i soklova sa zaštitom podnih sifona.',
        'Bojenje podrumskih zidova i stropa paropropusnom perivom bojom.',
        'Montaža radne ploče vešeraja, praoničkog sudopera, vrata u antracitu te stepenišne LED rasvjete.'
      ]
    },
    checks: [
      'Provjeriti prohodnost engleskih šahtova ispred sjevernih prozora i funkcionalnost odvodnje dna šahta.',
      'Ispitati rad podnih sifona i tlačne ventile u kotlovnici.'
    ]
  },
  {
    stop: 10,
    code: '11',
    name: 'Podrum — garaža i radna prostorija',
    floor: 'Podrum — jug (-2.73 m)',
    openPlan: false,
    dims: {
      length_m: 8.6,
      width_m: 5.95,
      clearHeight_m: 2.43,
      kneeWall_m: null,
      floorArea_m2: 52.0,
      wallArea_m2: 68.0,
      note: 'Dvostruka Garaža SE (38.0 m², vrata 540 × 220 cm podignuta pod strop) i Radna prostorija / hobi studio SW (14.0 m²) s izravnim ostakljenim izlazom prema dvorištu.'
    },
    existing: [
      'Garaža sa širokim sekcijskim vratima 540 × 220 cm prema južnom 2P platou, radnim pultom uz istočni zid, regalom za alat na zapadu i bočnim pješačkim vratima.',
      'Radna prostorija zapadno od garaže s hrastovim radnim stolom, policama, radnom stolicom i ostakljenim vratima na uvučenom južnom pročelju.'
    ],
    redesign: {
      summary: 'Dvostruka garaža organizirana kao čista radionica s antracit radnim blokom i snažnom LED linijskom rasvjetom, dok se susjedna radna prostorija uređuje toplim hrastovim detaljima i vapnenim zidovima kao miran kućni ured ili atelier.',
      finishes: [
        { element: 'Pod garaže (visoko opterećenje)', material: 'Klinker / tehnički porculan debljine ≥ 10 mm (R10/R11)', spec: 'Otporno na ulje, sol i težinu vozila do 3.5 t; epoksidna fuga', qty: 41.0, unit: 'm²', note: 'Pad 0.5 % prema izlaznom pragu garažnih vrata' },
        { element: 'Pod radne prostorije (SW)', material: 'Toplo siva/hrast LVT ili keramika drvo-dekor + vuneni tepih', spec: 'Otporno na vlagu suterena i toplo na dodir za duži rad', qty: 15.4, unit: 'm²', note: 'Brisanje vlažnom krpom, prijelazna lajsna prema garaži' },
        { element: 'Zidovi i strop garaže i radne sobe', material: 'Periva lateks/silikatna boja (Garaža RAL 9010 / Radna NCS S 1505-Y30R)', spec: 'Lako perivi donji pojas do 1.4 m visine u garaži', qty: 68.0, unit: 'm²', note: 'Antracit sokl lajsna' }
      ],
      furniture: [
        { item: 'Radni stol / pult garaže + zidni regal', dims: '200 × 66 × 90 cm + regal 220 × 46 × 190 cm', material: 'Antracit čelični ormarići + masivna bukova/hrastova ploča 50 mm', position: 'Istočni i zapadni zid garaže', note: 'Ostavljena čista širina za dva automobila' },
        { item: 'Radna prostorija: hrastov stol, stolica i polica', dims: '180 × 70 × 76 cm + regal 42 × 40 × 185 cm', material: 'Masivni hrast + crni čelik + bouclé/tkanina stolica', position: 'Zapadni zid radne prostorije (X ∈ [-4.28, -3.58 m])', note: 'Dobro bočno prirodno svjetlo kroz južnu staklenu stijenu' }
      ],
      lighting: [
        { item: '4× linearne stropne LED svjetiljke garaže', spec: '4× 36 W LED, 4000 K, l = 130 cm, IP54', qty: 4, mount: 'Strop garaže lijevo i desno od vozila (h = 2.43 m)', circuit: 'Senzor otvaranja garažnih vrata + zidni prekidač' },
        { item: 'Topla stropna plafonjera radne prostorije', spec: 'Ø 32 cm, 18 W LED, 2700 K, CRI > 90', qty: 1, mount: 'Središte stropa radne sobe (X = -3.10, Y = -0.65 m)', circuit: 'Prekidač uz vrata iz garaže i izlazna vrata' }
      ],
      electrical: [
        { item: 'Radne duple utičnice iznad pulta u garaži i stola radne sobe', qty: 6, height_cm: 110, position: 'Istočni zid garaže iznad radne ploče + zapadni zid radne sobe', note: 'Poseban osigurač 16 A za kompresor / električni alat' }
      ],
      plumbing: [
        { item: 'Izvod hladne vode s umivaonikom za pranje ruku (opcija)', spec: 'Zidna slavina u SI kutu garaže', position: 'Uz zid kotlovnice (X = 3.80, Y = 0.65 m)', height_cm: 105, note: 'Ventil za zatvaranje zimi' }
      ],
      sequence: [
        'Pregledati i servisirati vodilice te pogon sekcijskih vrata 540 × 220 cm.',
        'Polaganje tehničkog porculana garaže i poda radne prostorije.',
        'Ličenje zidova i stropova te montaža antracit protupožarnih/sobno-tehničkih vrata.',
        'Ugradnja linearnih LED letvi, radnog bloka garaže i hrastovog namještaja radne sobe.'
      ]
    },
    checks: [
      'Provjeriti zazor otvorenih sekcijskih vrata pod stropom u odnosu na pozicije četiriju stropnih LED letvi.',
      'Osigurati čisto zatvaranje i brtvljenje vanjskih vrata radne sobe prema uvučenom južnom trijemu.'
    ]
  },
  {
    stop: 11,
    code: '12',
    name: 'Otvoreno L-stepenište i središnje krovište dvostruke stolice',
    floor: 'Uspon na kat (0.00 → +2.74 m / do +6.19 m)',
    openPlan: true,
    dims: {
      length_m: 8.56,
      width_m: 5.87,
      clearHeight_m: 5.2,
      kneeWall_m: null,
      floorArea_m2: 4.3,
      wallArea_m2: 69.8,
      note: 'Otvoreno L-stepenište (14 lebdećih gazišta bez čela, d = 50 mm, otvorena visina) s kontinuiranim rukohvatima u ogradu galerije + središnja drvena dvostruka stolica uz južni rub galerije (bez donjeg stupa i bez sajli), s kosnicima uz kosi strop, dvjema podrožnicama P1 do glatkog bijelog sjevernog zida, istočnom nazidnicom i 6 mm crnim U-nosačima / K-pločicama.'
    },
    existing: [
      'Otvoreno L-stepenište s lebdećim hrastovim gazištima bez čela i bez zatvorene visine (d = 50 mm) na središnjem/bočnom crnom čeličnom nosaču, s 5 crnih sajli ograde te zidnim i stubišnim rukohvatom kontinuirano spojenim u hrastov rukohvat galerije, plus komoda s vinotekom ispod kraka.',
      'Krovište sustava dvostruke stolice: jedna središnja vezna konstrukcija uz južni rub galerije (vezna greda, 2 popa, gornja rasponka i kosnici uz kosi strop; bez donjeg stupa i bez rešetke na sjevernom zidu), dvije kontinuirane podrožnice P1 do glatkog bijelog sjevernog nosivog zida i istočna nazidnica, spojene tankim 6 mm mat crnim U-nosačima i kutnim K-pločicama.',
      'Tri bijele viseće kugle s mat bijelim stropnim rozetama iznad boravka i galerije + unutarnja jedinica klime na sjevernom zabatu visoko pod ravnim stropom između podrožnica.'
    ],
    redesign: {
      summary: 'Skulpturalni vrhunac atrija: otvorena gazišta stepeništa se mat ulje i ostaju prozračna bez zatvorenih čela s kontinuiranim rukohvatima prema mostu galerije, dok se središnja konstrukcija dvostruke stolice uz južni rub galerije, obje podrožnice P1 i istočna nazidnica moče u duboki ebonizirani hrast uz 6 mm mat crne U-nosače i kutne K-pločice na toplom bijelom stropu.',
      finishes: [
        { element: '14 lebdećih gazišta bez čela + otvoreni podest i kontinuirani rukohvati', material: 'Masivni hrast — brušenje i mat protuklizno uljenje R10', spec: 'Gazišta 98 × 28 × 5 cm bez zatvorene visine + spoj u gornju letvu ograde galerije + komoda s vinotekom', qty: 6.2, unit: 'm²', note: 'Raditi naizmjenično radi održavanja prohodnosti' },
        { element: 'Središnja dvostruka stolica (južni rub galerije), podrožnice P1 i istočna nazidnica', material: 'Ebonizirani hrast (mat lazura RAL 9005/8022)', spec: 'Lagano brušenje P120 + 2 sloja polutransparentne mat lazure + 6 mm mat crni U-nosači i kutne K-pločice s vijcima', qty: 22.0, unit: 'm²', note: 'Rad na središnjoj stolici, podrožnicama i istočnoj nazidnici — izvođenje sa skele' },
        { element: 'Kosi strop krovišta i glatki sjeverni zabat', material: 'Mat vapnena/disperzijska boja (NCS S 0502-Y)', spec: '2 visoko pokrivna sloja na kosim plohama do sljemena +6.19 m', qty: 58.0, unit: 'm²', note: 'Zaštititi viseće svjetiljke i klimu na glatkom bijelom sjevernom zidu' }
      ],
      furniture: [
        { item: 'Postojeća hrastova komoda s vinotekom (osvježenje)', dims: '176 × 58 × 91 cm', material: 'Prirodni hrast + inox hladnjak za vino', position: 'Ispod gornjeg kraka stepeništa (X ∈ [1.16, 2.92], Y ∈ [0.27, 0.85 m])', note: 'Uskladiti ton ulja s parketom' },
        { item: 'Unutarnja jedinica klime (servis i maskiranje)', dims: '86 × 27 × 28 cm', material: 'Postojeća jedinica na glatkom sjevernom zabatu (h ≈ +5.67 m)', position: 'Visoko pod ravnim stropom između podrožnica P1, iznad vrata galerije', note: 'Očistiti prije završnog bojenja zabata' }
      ],
      lighting: [
        { item: 'Viseće svjetiljke atrija s mat bijelim stropnim rozetama', spec: '3× Akari viseće kugle od rižinog papira s toplim 2700 K LED žaruljama na bijelim stropnim rozetama', qty: 3, mount: 'Ravni greben i krovno polje iznad boravka/galerije', circuit: 'Postojeći rasvjetni krug boravak/atrij' },
        { item: 'Podgazišno/zidno usponsko svjetlo stepenica (opcija)', spec: '3× ugradbena 2 W LED 2700 K', qty: 3, mount: 'Sjeverni zid na h = 25 cm iznad gazišta', circuit: 'Izmjenični prekidač prizemlje ↔ galerija' }
      ],
      electrical: [
        { item: 'Kabliranje svih visećih lampi i mat bijelih stropnih rozeta u atriju', qty: 3, height_cm: 570, position: 'Krovni greben i pozicije ovjesnih rozeta iznad boravka i galerije', note: 'Izvesti sve visinske spojeve dok je skela montirana' }
      ],
      plumbing: [],
      sequence: [
        'Postaviti modularnu aluminijsku skelu u središtu atrija uz zaštitu poda i stepenica.',
        'Zaštititi viseće svjetiljke i klimu na sjevernom zidu, obojiti kosi strop i zabate toplom bijelom bojom.',
        'Pobrusiti i ebonizirati središnju dvostruku stolicu, obje podrožnice P1 i istočnu nazidnicu te obnoviti 6 mm mat crne U-nosače i K-pločice.',
        'Montirati 3× Akari visilice s 2700 K žaruljama i mat bijelim rozetama, demontirati skelu i završno mat uljiti lebdeća gazišta stepenica.'
      ]
    },
    checks: [
      'Provjeriti zategnutost sajli ograde stepeništa, vijčane spojeve 6 mm mat crnih U-nosača i K-pločica te kontinuirani spoj rukohvata u galeriju.',
      'Sjeverni nosivi zid iznad vrata galerije ostaje potpuno gladak i bijel (u njega ulaze isključivo 2 uzdužne podrožnice P1 lijevo i desno od klime pod ravnim stropom), dok je jedina dvostruka stolica postavljena uz južni rub galerije bez donjeg stupa.'
    ]
  },
  {
    stop: 12,
    code: '13',
    name: 'Most galerije i radni kutak',
    floor: 'Kat (+2.74 m)',
    openPlan: true,
    dims: {
      length_m: 4.47,
      width_m: 2.95,
      clearHeight_m: 2.95,
      kneeWall_m: 1.48,
      floorArea_m2: 12.6,
      wallArea_m2: 15.2,
      note: 'Zapadna galerija (X ∈ [-4.32, -0.28], Y ∈ [-2.10, 0.85 m]) povezana čistim otvorenim mostom s vrhom stepeništa, uvučeni krovni prozor 90 × 80 cm i dvokrilni portal u potkrovlje.'
    },
    existing: [
      'Hrastov laminat s potpuno čistim otvorenim mostom galerije; crna čelična ograda (h = 98 cm) s 5 horizontalnih sajli i neprekinutim hrastovim rukohvatom.',
      'Zaobljeni hrastov L-radni stol s rukom za monitor, Mac jedinicom i ergonomskom foteljom ispod krovnog prozora (špaleta 28 cm).',
      'Viseće biljke pothos u žardinjerama na ogradi te dvokrilna staklena vrata (R2_D1) prema sjevernom potkrovlju.'
    ],
    redesign: {
      summary: 'Mirni radni kutak i prolazni most: parket riblja kost na zvučnoj podlozi, ebonizirani rukohvat ograde i okvir dvokrilnih vrata te vapneni štuk zidova bez vizualnih prepreka.',
      finishes: [
        { element: 'Pod galerije i mosta', material: 'Troslojni hrastov parket riblja kost', spec: 'Postava preko akustične podloge 3 mm (ΔLw ≥ 18 dB prema kuhinji)', qty: 13.8, unit: 'm²', note: '+10 % rezanje; uskladiti kotu s vrhom L-stepeništa' },
        { element: 'Zidovi i zapadni nadozid', material: 'Vapneni štuk NCS S 1505-Y30R', spec: 'Mat izvedba do kosog stropa i oko krovnog prozora', qty: 15.2, unit: 'm²', note: 'Uključuje špalete portala' },
        { element: 'Rukohvat ograde i dovratnik vrata R2_D1', material: 'Ebonizirani hrast (lazura)', spec: 'Duljina rukohvata 7.0 m + dvokrilni dovratnik', qty: 7.0, unit: 'm', note: 'Ton usklađen s krovnim rešetkama' }
      ],
      furniture: [
        { item: 'Hrastov radni L-stol (postojeći, mat uljenje)', dims: '179 × 63 × 81 cm + krak 89 × 79 × 81 cm', material: 'Prirodni hrast', position: 'Zapadni rub galerije ispod krovnog prozora', note: 'Lagano brušenje i zaštita mat uljem' },
        { item: 'Biljke u žardinjerama / terakota posudama', dims: '4× posuda na ogradi', material: 'Hrast / terakota s podmetačima', position: 'Unutarnja strana ograde galerije', note: 'Zaštita parketa od zalijevanja' }
      ],
      lighting: [
        { item: 'Zidna/radna lampa na galeriji', spec: '10 W LED, 2700 K, usmjereno svjetlo', qty: 1, mount: 'Zapadni zid iznad L-stola (h = 1.45 m)', circuit: 'Prekidač pri vrhu stepeništa' }
      ],
      electrical: [
        { item: 'Radne utičnice ispod/uz L-stol + LAN', qty: 4, height_cm: 30, position: 'Zapadni nadozid galerije (X = -4.25, Y ≈ -1.10 m)', note: 'Postojeći priključci za računalo i monitor' }
      ],
      plumbing: [],
      sequence: [
        'Demontirati laminat na galeriji i mostu te provjeriti ravnost podloge.',
        'Položiti zvučnu podlogu i parket riblju kost u ravnini s gornjom stubom stepeništa.',
        'Obojiti zidove vapnenim štukom i ebonizirati rukohvate ograde te okvir vrata prema sjeveru.'
      ]
    },
    checks: [
      'Provjeriti čistoću prolaza preko mosta galerije (X ∈ [-0.55, +0.25]) i stabilnost stupića ograde na rubu ploče.',
      'Uskladiti prag između parketa galerije (+2.74 m) i garderobe sjevernog krila (+2.73 m).'
    ]
  },
  {
    stop: 13,
    code: '14',
    name: 'Spa kupaonica u potkrovlju',
    floor: 'Potkrovlje — zapad (+2.73 m)',
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
      'Lebdeći ormarić umivaonika od rustikalnog hrasta (100 × 46 cm), okruglo ogledalo Ø 94 cm s LED kopčom, konzolni WC i bijela komoda s 3 ladice.'
    ],
    redesign: {
      summary: 'Pretvorba u Japandi spa: mat travertin keramika 60 × 120 cm na podu i zidovima oko kade, sve armature i tipkalo WC-a u brušenoj mjedi, te okruglo ogledalo Ø 94 cm s toplim stražnjim halo LED svjetlom.',
      finishes: [
        { element: 'Hidroizolacija mokrih zona', material: 'Dvokomponentni polimercementni premaz + brtvene trake', spec: 'Cijeli pod + 15 cm na zidove + puna visina oko kade', qty: 24.0, unit: 'm²', note: '2 križna premaza prema DIN 18534' },
        { element: 'Podna keramika', material: 'Porculan efekt mat travertin (R10)', spec: 'Format 60 × 120 cm, uska fuga 2 mm', qty: 9.5, unit: 'm²', note: '+12 % za rezanje' },
        { element: 'Zidna keramika i obloga kade', material: 'Porculan efekt mat travertin', spec: 'Puna visina uz kadu i stup umivaonika; poluvisina h = 99 cm iza WC-a', qty: 16.5, unit: 'm²', note: 'Ukrajanje pod zapadnu kosinu' },
        { element: 'Zidovi i kosi strop iznad pločica', material: 'Kupaonska paropropusna mat boja', spec: 'Topla bijela / vapneni štuk (#efe9df)', qty: 14.0, unit: 'm²', note: 'Akrilni/silikonski prijelaz' }
      ],
      furniture: [
        { item: 'Polukružna kutna kada s oblogom travertina', dims: '180 × 85 × 58 cm', material: 'Sanitarni akril + obloga od travertin pločica', position: 'Jugozapadni kut X ∈ [-3.68, -1.80], Y ∈ [1.16, 2.01 m]', note: 'Predvidjeti magnetski revizijski otvor 30 × 30 cm za sifon' },
        { item: 'Lebdeći kupaonski ormarić s umivaonikom', dims: '100 × 46 × 46 cm', material: 'Furnir svijetlog hrasta + kamena ploča', position: 'Istočni stup Y ∈ [3.14, 4.16 m]', note: '2 duboke ladice s urezom za sifon' },
        { item: 'Okruglo halo ogledalo', dims: 'Ø 94 cm', material: 'Kristalno ogledalo s neizravnim toplim LED vijencem', position: 'Iznad umivaonika (h = 153 cm)', note: 'Zamjena radne LED kopče' },
        { item: 'Komoda s 3 ladice u SZ kutu', dims: '87 × 52 × 86 cm', material: 'Mat bež / bijela + drveni detalji', position: 'Sjeverozapadni kut uz nadozid h = 141 cm', note: 'Postojeća ili osvježena' }
      ],
      lighting: [
        { item: 'Neizravni LED halo krug iza ogledala', spec: '16 W LED traka, 2700 K, CRI > 92, IP44', qty: 1, mount: 'Stup umivaonika (h = 153 cm)', circuit: 'Prekidač kod vrata kupaonice' },
        { item: 'Stropna vodootporna plafonjera', spec: 'Ø 30 cm, 15 W LED, 2700 K, IP44', qty: 1, mount: 'Ravni strop (X = -2.15, Y = 3.00, h = 2.49 m)', circuit: 'Glavni prekidač izvan zone 2' }
      ],
      electrical: [
        { item: 'Izvod iza ogledala 230 V + IP44 utičnica uz umivaonik', qty: 2, height_cm: 145, position: 'Istočni stup umivaonika', note: 'Obavezna zaštita FID 30 mA (HRN HD 60364-7-701)' },
        { item: 'Kupaonski ventilator s tajmerom', qty: 1, height_cm: 249, position: 'Istočni gornji ugao', note: 'Za odvlaživanje potkrovlja' }
      ],
      plumbing: [
        { item: 'Zidna miješalica kade + umivaonika + tipkalo WC-a (brušena mjed)', spec: 'PVD brušena mjed, razmak priključaka kade 150 mm + click-clack sifon', position: 'Zidovi kade, umivaonika i WC-a', height_cm: 83, note: 'Provjeriti kompatibilnost tipkala s vodokotlićem' },
        { item: 'Konzolna WC školjka + ljestvasti radijator', spec: 'Rimless WC školjka (h = 41 cm) + radijator 50 × 98 cm', position: 'Sjeveroistočni kut i zapadni nadozid', height_cm: 41, note: 'Zazor radijatora min. 4 cm od nove keramike' }
      ],
      sequence: [
        'Demontirati sanitarije, oblogu kade, postojeće pločice i ogledalo.',
        'Pripremiti električni izvod iza ogledala i provjeriti odvode.',
        'Nanijeti 2 sloja hidroizolacije s brtvenim trakama i obložiti travertin pločicama 60 × 120 cm.',
        'Montirati lebdeći hrastov ormarić, armature u brušenoj mjedi i halo ogledalo.'
      ]
    },
    checks: [
      'Izmjeriti osni razmak postojećih izlaza za miješalicu kade (150 mm) prije narudžbe armature.',
      'Pratiti nagib zapadne kosine krova (h = 141 → 249 cm) prilikom ukrajanja pločica.'
    ]
  },
  {
    stop: 14,
    code: '15',
    name: 'Garderoba i glavna spavaća soba u potkrovlju',
    floor: 'Potkrovlje — središte i istok (+2.73 m)',
    openPlan: false,
    dims: {
      length_m: 7.52,
      width_m: 3.65,
      clearHeight_m: 2.49,
      kneeWall_m: 1.16,
      floorArea_m2: 26.0,
      wallArea_m2: 55.2,
      note: 'Povezana središnja garderoba (13.2 m², revizijska vrata na južnom zidu) i istočna glavna spavaća soba (12.8 m², nadozid 1.16 m sa suho-gipsanom policom).'
    },
    existing: [
      'Garderoba: peterokrilni bijeli sjajni ugradbeni ormar (267 × 53 × 213 cm) s hrastovim letvicama, konjak Butterfly fotelja, bačva-stolić „LEGENDS 1872” i wenge radni stol uz visoko ogledalo.',
      'Glavna spavaća soba: tapecirani bračni krevet (223 × 196 cm) s bijelom ladicom i oker prekrivačem, dva noćna stolića i otvorena hrastova konzola (229 × 42 × 85.5 cm) sa slikom suncokreta.'
    ],
    redesign: {
      summary: 'Toplo utočište potkrovlja: peterokrilni garderobni ormar dobiva fronte od svijetlog hrasta s gornjom LED krunom, kroz obje sobe teče parket riblja kost i vapneni štuk, a glavna soba dobiva lebdeći hrastov krevet s krem bouclé uzglavljem i papirnate lampe 2700 K.',
      finishes: [
        { element: 'Pod garderobe i spavaće sobe', material: 'Troslojni hrastov parket riblja kost', spec: 'Kontinuitet bez praga između garderobe i spavaće sobe', qty: 28.6, unit: 'm²', note: '+10 % rezanje' },
        { element: 'Zidovi, revizijski poklopci i istočni nadozid', material: 'Vapneni štuk NCS S 1505-Y30R / strop mat bijela', spec: 'Revizijske ormariće na južnom zidu garderobe obojiti u boju zida', qty: 55.2, unit: 'm²', note: 'Uključuje gornju policu istočnog nadozida (h = 1.16 m)' }
      ],
      furniture: [
        { item: '5× nove fronte garderobnog ormara + gornji LED profil', dims: '267 × 53 × 213 cm (5 fronti po ~52.5 × 209 cm)', material: 'Furnir svijetli hrast mat + 5 vertikalnih crnih ručkica l = 60 cm', position: 'Istočni pregradni zid garderobe (X ∈ [1.28, 1.81], Y ∈ [2.17, 4.84 m])', note: 'Zadržava se postojeći korpus; provjeriti raspored šarki' },
        { item: 'Lounge kutak uz prozor garderobe', dims: 'Tepih Ø 190 cm + travertin stolić Ø 62 cm + fotelja', material: 'Vuna / travertin / bouclé ili kožna fotelja', position: 'Sjeverni prozor garderobe', note: 'Slobodan pristup radnom stolu i ogledalu' },
        { item: 'Lebdeći bračni krevet s bouclé uzglavljem + 2× noćni stolić', dims: '223 × 196 cm (madrac 180 × 200) + 2× Ø 43 × 58 cm', material: 'Masivni hrast + krem bouclé uzglavlje + mat travertin ploče', position: 'Istočni nadozid spavaće sobe (X ∈ [3.15, 5.38], Y ∈ [2.50, 4.46 m])', note: 'Vuneni tepih 254 × 257 cm ispod kreveta' },
        { item: 'Otvorena hrastova konzola (postojeća, uljenje)', dims: '229 × 42 × 85.5 cm', material: 'Masivni hrast', position: 'Južni zid spavaće sobe (X ∈ [2.97, 5.26], Y ∈ [1.18, 1.58 m])', note: 'Ostaje otvoren pristup 4-strukoj utičnici' }
      ],
      lighting: [
        { item: '2× viseće Akari/lanene svjetiljke + LED kruna ormara + 2× stolne lampe', spec: 'Plafonjera garderobe Ø 40 cm, Akari sfera spavaće Ø 60 cm, 2× stolna papirnata 2700 K, LED 2.61 m', qty: 6, mount: 'Stropovi 2.49 m, gornji rub ormara (h = 2.13 m) i noćni stolići', circuit: 'Izmjenični krugovi na ulazu i uz uzglavlje kreveta' }
      ],
      electrical: [
        { item: 'Utičnice i izmjenični prekidači uz krevet + revizijski ormar (ZADRŽATI PRISTUP)', qty: 5, height_cm: 55, position: 'Istočni nadozid Y = 2.22 i 4.54 m + južni zid garderobe (h = 30 i 113–163 cm)', note: 'Revizijska vrata grijanja/elektro na južnom zidu garderobe ne smiju se zagraditi' }
      ],
      plumbing: [],
      sequence: [
        'Demontirati 5 sjajnih fronti ormara, stari bračni krevet i laminat u obje prostorije.',
        'Dodati noćne utičnice/prekidače i izvod za gornju LED liniju ormara.',
        'Izvesti gletanje i vapneni štuk na zidovima (uključujući metalne poklopce revizija).',
        'Položiti parket riblju kost, montirati 5 hrastovih fronti ormara, lebdeći krevet, tepihe i Akari rasvjetu.'
      ]
    },
    checks: [
      'Zadržati puni servisni pristup gornjem i donjem revizijskom ormariću na južnom zidu garderobe.',
      'Kod izrade bouclé uzglavlja (h = 111 cm) poštovati ispupčenje gips-kartonske police istočnog nadozida (h = 116–130 cm).'
    ]
  }
];

export const BOQ = [
  // Vanjsko uređenje i 3D vrt
  { category: 'Vanjsko uređenje i 3D vrt', item: 'Opločnik prilaznog platoa i 2P parkinga s oborinskom rešetkom', spec: 'Nosivi betonski/kameni opločnik d = 8 cm + linijska rešetka D400 l = 5.6 m ispred garaže', qty: 42.0, unit: 'm²', zones: ['01'] },
  { category: 'Vanjsko uređenje i 3D vrt', item: 'Pergola od sibirskog ariša/cedra + mat travertin R11 terasa i koračne ploče', spec: 'Konstrukcija 380 × 380 cm na čeličnim ankerima + travertin ploče 80 × 80 cm', qty: 18.5, unit: 'm²', zones: ['02'] },
  { category: 'Vanjsko uređenje i 3D vrt', item: 'Vrtni šljunčani pojas, rubnjaci i trajnice (trave, lavanda, javor)', spec: 'Geotekstil, bijeli/sivi kulir, sadnice i priprema kap-po-kap navodnjavanja', qty: 24.0, unit: 'm²', zones: ['02'] },
  { category: 'Vanjsko uređenje i 3D vrt', item: 'Vanjska lounge garnitura s vodoodbojnim bouclé jastucima i stolićem', spec: 'Tikovina / termo-jasen za zapadnu vrtnu terasu pod pergolom', qty: 1, unit: 'kpl', zones: ['02'] },

  // Fasada i vanjska stolarija
  { category: 'Fasada i vanjska stolarija', item: 'Fasadno pranje i bojenje toplom mineralno-bijelom bojom (NCS S 0804-Y20R)', spec: '2 sloja paropropusne silikatno-silikonske boje na gornjim etažama', qty: 96.0, unit: 'm²', zones: ['01', '03'] },
  { category: 'Fasada i vanjska stolarija', item: 'Sanacija i impregnacija kamenog sokla suterena/podruma', spec: 'Čišćenje i zaštitna okapna letva iznad garaže i radne sobe', qty: 36.0, unit: 'm²', zones: ['01', '11'] },
  { category: 'Fasada i vanjska stolarija', item: 'Gazišta vanjskog stubišta (16 kom) i podest trijema u plamenom kamenu/R11', spec: 'Ploče d = 30 mm s protukliznim brazdama i okapnicom', qty: 8.0, unit: 'm²', zones: ['03'] },
  { category: 'Fasada i vanjska stolarija', item: 'Cedrov letvičasti podgled ulazne nadstrešnice + staklena ograda stubišta i balkona', spec: 'Ariš/cedar podgled 3.8 m² + laminirano staklo 8.8.2 (ukupno l = 15.0 m)', qty: 1, unit: 'kpl', zones: ['03', '08'] },

  // Podrum i strojarske instalacije
  { category: 'Podrum i strojarske instalacije', item: 'Tehnički porculan R10 na podu garaže, vešeraja, kotlovnice i hodnika + sokl', spec: 'Format 60 × 60 cm visoke nosivosti s epoksidnim fugama', qty: 77.5, unit: 'm²', zones: ['10', '11'] },
  { category: 'Podrum i strojarske instalacije', item: 'Perive podrumske zidne/stropne boje + obrada engleskih šahtova', spec: 'Paropropusni premaz otporan na vlagu + obnova hrastovog U-stubišta (16 stuba)', qty: 156.0, unit: 'm²', zones: ['10', '11'] },
  { category: 'Podrum i strojarske instalacije', item: 'Servis toplinske stanice kotlovnice (dizalica topline, pufer 500 L, razdjelnik) + sifoni', spec: 'Tlačna proba podnog grijanja za Po+Pr+Pk i priključci perilice/sušilice', qty: 1, unit: 'kpl', zones: ['10'] },
  { category: 'Podrum i strojarske instalacije', item: 'Opremanje vešeraja, antracit radni pult garaže i radna soba SW', spec: 'Radna ploča 207 cm + praonički sudoper + radni stolovi i regali', qty: 1, unit: 'kpl', zones: ['10', '11'] },

  // Podovi
  { category: 'Podovi', item: 'Demontaža postojećeg laminata, lajsni i podloga u Pr i Pk', spec: 'Sortiranje i odvoz na ovlašteno odlagalište', qty: 131.1, unit: 'm²', zones: ['04', '05', '06', '07', '09', '13', '15'] },
  { category: 'Podovi', item: 'Priprema estriha, brušenje i izravnavanje do 3 mm', spec: 'Impregnacija i samonivelirajuća masa za riblju kost', qty: 131.1, unit: 'm²', zones: ['04', '05', '06', '07', '09', '13', '15'] },
  { category: 'Podovi', item: 'Dobava i polaganje troslojnog hrastovog parketa — riblja kost', spec: 'Uljeni prirodni hrast, 2K elastično ljepilo i +10 % otpada (Pr + Pk)', qty: 144.2, unit: 'm²', zones: ['04', '05', '06', '07', '09', '13', '15'] },
  { category: 'Podovi', item: 'Akustična podloga na katu (most, galerija, garderoba, spavaća)', spec: 'Podloga 3 mm za prigušenje udarnog zvuka ΔLw ≥ 18 dB', qty: 41.9, unit: 'm²', zones: ['13', '15'] },
  { category: 'Podovi', item: 'Podne kutne lajsne od masivnog hrasta + prijelazni profili', spec: 'Profil 60 × 15 mm u tonu parketa, s montažom', qty: 96.0, unit: 'm', zones: ['04', '06', '07', '09', '13', '15'] },

  // Zidovi i stropovi
  { category: 'Zidovi i stropovi', item: 'Skela za dvoetažni atrij i krovište (najam, montaža, demontaža)', spec: 'Radna visina do 6.2 m uz zaštitu podova OSB pločama', qty: 1, unit: 'kpl', zones: ['04', '06', '12'] },
  { category: 'Zidovi i stropovi', item: 'Impregnacija, gletanje i vapneni štuk (NCS S 1505-Y30R)', spec: '2 ruke mineralne vapnene boje na zidove Pr i Pk', qty: 235.2, unit: 'm²', zones: ['04', '05', '06', '07', '09', '13', '15'] },
  { category: 'Zidovi i stropovi', item: 'Ličenje kosih i ravnih stropova toplom bijelom bojom (NCS S 0502-Y)', spec: 'Potkrovlje do sljemena + suhe zone kata i sjevernog prizemlja', qty: 118.0, unit: 'm²', zones: ['09', '12', '14', '15'] },
  { category: 'Zidovi i stropovi', item: 'Izbijeljena vapnena lazura na dimnjaku od crvene opeke (limewash)', spec: 'Visina 5.98 m, paropropusna lazura u 2 sloja s vidljivom fugom', qty: 11.0, unit: 'm²', zones: ['06'] },
  { category: 'Zidovi i stropovi', item: 'Demontaža tamnih dasaka na istočnom zidu + akustični zid od hrastovih letvica', spec: 'Uklanjanje dasaka i montaža letvica 27 × 19 mm na crnom PET filcu (+8 %)', qty: 24.8, unit: 'm²', zones: ['07', '12'] },

  // Stolarija i krovište
  { category: 'Stolarija i krovište', item: 'Brušenje i ebonizirano lazurno močenje središnje dvostruke stolice, podrožnica P1 i istočne nazidnice', spec: 'Ton RAL 9005/8022 mat + 6 mm mat crni U-nosači i kutne K-pločice s vijcima', qty: 22.0, unit: 'm²', zones: ['12'] },
  { category: 'Stolarija i krovište', item: 'Ebonizirana lazura na rukohvatu galerije i sjevernim dovratnicima', spec: 'Rukohvat 7.0 m + dovratnici R2_D1 i Pr', qty: 1, unit: 'kpl', zones: ['04', '12', '13'] },
  { category: 'Stolarija i krovište', item: 'Brušenje i protuklizno mat uljenje 14 lebdećih gazišta L-stepenica + komode', spec: 'Otvorena gazišta bez čela + hrastova komoda s vinotekom', qty: 1, unit: 'kpl', zones: ['12'] },

  // Keramika i kamen
  { category: 'Keramika i kamen', item: 'Polimercementna hidroizolacija u 2 sloja (Kupaonica Pr, Spa Kupaonica Pk, Balkon SE)', spec: 'Podovi, uzdignuća, walk-in tuš i zona kade + brtvene trake', qty: 46.5, unit: 'm²', zones: ['08', '09', '14'] },
  { category: 'Keramika i kamen', item: 'Mat travertin porculan 60 × 120 cm (R10/R11) — Kupaonice Pr/Pk i Balkon SE', spec: 'Uključeno +12 % otpada, C2TE S1 ljepilo, epoksi/fleksibilna fuga i okapnice', qty: 53.0, unit: 'm²', zones: ['08', '09', '14'] },
  { category: 'Keramika i kamen', item: 'Kamena radna ploča i zidna obloga kuhinje od mat travertina (d = 20/30 mm)', spec: 'Ploča 290 × 71 cm s izrezima + obloga 2.4 m² s otvorima za utičnice', qty: 1, unit: 'kpl', zones: ['05'] },

  // Vodovod i sanitarije
  { category: 'Vodovod i sanitarije', item: 'Komplet armatura u PVD brušenoj mjedi (kada Pk, walk-in tuš Pr, 2× umivaonik, kuhinja)', spec: 'Uključuje 2× tipkala konzolnog WC-a u brušenoj mjedi', qty: 6, unit: 'kom', zones: ['05', '09', '14'] },
  { category: 'Vodovod i sanitarije', item: 'Sanitarije (2× rimless WC, tuš kanalica 80 cm + staklo, crni kuhinjski sudoper)', spec: 'Montaža s ispitivanjem nepropusnosti', qty: 1, unit: 'kpl', zones: ['05', '09', '14'] },

  // Namještaj po mjeri
  { category: 'Namještaj po mjeri', item: 'Zamjena kuhinjskih fronti (kadulja mat NCS S 4010-G50Y + furnir hrast)', spec: 'Donji elementi 290 cm, kolona pećnice 223 cm i gornji elementi + 2 police', qty: 1, unit: 'kpl', zones: ['05'] },
  { category: 'Namještaj po mjeri', item: 'Lebdeća hrastova TV komoda 210 × 41 × 32 cm s LED utorom', spec: 'Čelična zidna nosiva šina kroz akustični panel', qty: 1, unit: 'kom', zones: ['07'] },
  { category: 'Namještaj po mjeri', item: 'Nove fronte peterokrilnog garderobnog ormara 267 × 213 cm', spec: 'Furnir svijetli hrast mat, 5 crnih ručkica l = 60 cm, soft-close panti', qty: 5, unit: 'kom', zones: ['15'] },
  { category: 'Namještaj po mjeri', item: '2× lebdeća hrastova kupaonska ormarića (100 cm Pk + 80 cm Pr) i halo ogledala', spec: 'Vodootporni hrast s kamenom pločom + okruglo halo ogledalo Ø 94 cm (IP44)', qty: 2, unit: 'kpl', zones: ['09', '14'] },

  // Rasvjeta
  { category: 'Rasvjeta', item: 'Viseće papirnate lampe u stilu Akari (2700 K, CRI > 92)', spec: '1× Ø 76 cm (blagovaonica), 3× Ø 60/48/42 cm (boravak), 1× Ø 60 cm (spavaća)', qty: 5, unit: 'kom', zones: ['06', '07', '15'] },
  { category: 'Rasvjeta', item: 'Vanjski LED stupići, podgled trijema, fasadne lampe i stubišni step-lighti (2700 K)', spec: '5× vrtni stupić IP65, 2× spot trijem, 6× fasada IP65, 3× step-light Po', qty: 16, unit: 'kom', zones: ['01', '02', '03', '08', '10'] },
  { category: 'Rasvjeta', item: 'Viseće svjetiljke atrija s bijelim rozetama, linearne LED letve Po i unutarnje plafonjere/lampe', spec: '3× Akari/kugle s rozetama + 6× IP44 letva podruma + 8× plafonjere/zidne lampe Pr/Pk', qty: 17, unit: 'kom', zones: ['04', '05', '06', '09', '10', '11', '12', '14', '15'] },
  { category: 'Rasvjeta', item: 'Linearne LED trake 2700 K, 24 V DC u aluminijskim profilima', spec: 'Kuhinja (1.05 m), TV komoda (1.96 m), ormar (2.61 m), pergola (3.6 m), vanjske stube (16×)', qty: 18.0, unit: 'm', zones: ['02', '03', '05', '07', '15'] },

  // Elektro
  { category: 'Elektro', item: 'Skriveno kabliranje, TV bužir Ø 50 mm, priprema Wallbox 11 kW, portafon i ovjesi visećih lampi', spec: 'Kompletna prilagodba Po + Pr + Pk + Vrt s mjerenjem otpora izolacije i FID zaštite', qty: 1, unit: 'kpl', zones: ['01', '02', '03', '05', '07', '09', '10', '11', '12', '14', '15'] },
  { category: 'Elektro', item: 'Termootporno mat crno lakiranje obloga peći na pelete', spec: 'Bočne oplate do 300 °C + kontrola dimovoda Ø 130 mm', qty: 1, unit: 'kpl', zones: ['06'] },

  // Dekor i tekstil
  { category: 'Dekor i tekstil', item: 'Okrugli stol od travertina Ø 136 cm + 6× hrast/bouclé blagovaonskih stolica', spec: 'Unos i montaža na licu mjesta', qty: 1, unit: 'kpl', zones: ['06'] },
  { category: 'Dekor i tekstil', item: 'Krem bouclé L-garnitura 282 × 227 cm + kožna fotelja + hrast/travertin stolići + tepih', spec: 'Tkani vuneni tepih 276 × 225 cm', qty: 1, unit: 'kpl', zones: ['07'] },
  { category: 'Dekor i tekstil', item: 'Lebdeći hrastov bračni krevet 180 × 200 cm s bouclé uzglavljem + kreveti Sobe 1 i 2 Pr', spec: 'Uključuje vunene tepihe i noćne stoliće', qty: 1, unit: 'kpl', zones: ['09', '15'] },
  { category: 'Dekor i tekstil', item: 'Lanene rimske rolete za južnu staklenu stijenu i prozore spavaćih soba', spec: 'Mjerenje špaleta na licu mjesta prije šivanja', qty: 1, unit: 'kpl', zones: ['06', '09', '15'] }
];

export const PLANS = [
  {
    id: 'situacija-redizajn',
    floor: 'Situacija & 3D Vrt',
    interior: 'redesign',
    title: 'Situacija parcele i 3D Vrt (prilaz Banfi, 2P, pergola) — Redizajn ✦ Japandi Calm',
    image: './assets/plan_situacija_redizajn.png?v=11',
    widthPx: 1920,
    heightPx: 1680,
    world: { xMin: -16.5, xMax: 17.9, yMin: -16.05, yMax: 14.05 },
    rooms: [
      { code: '01', stop: 0, label: '01 Prilaz & 2P', x: 6.2, y: -6.8 },
      { code: '02', stop: 1, label: '02 Pergola & 3D Vrt', x: -9.8, y: -2.5 },
      { code: '03', stop: 2, label: '03 Trijem & stubište', x: -5.2, y: -3.0 },
      { code: '08', stop: 7, label: '08 Balkon SE', x: 0.0, y: -6.0 }
    ],
    dims: [
      { x1: -13.5, y1: -11.5, x2: 11.2, y2: -11.5, text: '24.7 m uređeni obuhvat parcele', offset: -0.6 },
      { x1: -4.5, y1: -5.1, x2: 5.59, y2: -5.1, text: '10.09 m', offset: -1.35 },
      { x1: 5.59, y1: -5.1, x2: 5.59, y2: 5.08, text: '10.18 m', offset: -0.9 }
    ]
  },
  {
    id: 'podrum-redizajn',
    floor: 'Podrum (-2.73 m)',
    interior: 'redesign',
    title: 'Podrum — Po (kota -2.73 m: Garaža, Radna, Vešeraj, Kotlovnica) — Redizajn ✦ Japandi Calm',
    image: './assets/plan_podrum_redizajn.png?v=11',
    widthPx: 1600,
    heightPx: 1480,
    world: { xMin: -7.0, xMax: 6.6, yMin: -6.49, yMax: 6.09 },
    rooms: [
      { code: '10', stop: 9, label: '10 U-stubište', x: -2.2, y: 1.75 },
      { code: '10', stop: 9, label: '10 Vešeraj', x: -1.8, y: 3.85 },
      { code: '10', stop: 9, label: '10 Kotlovnica', x: 3.1, y: 3.2 },
      { code: '11', stop: 10, label: '11 Garaža', x: 1.3, y: -2.2 },
      { code: '11', stop: 10, label: '11 Radna soba', x: -3.0, y: -0.9 }
    ],
    dims: [
      { x1: -1.72, y1: -4.9, x2: 4.24, y2: -4.9, text: '5.96 m garaža', offset: -0.45 },
      { x1: -1.46, y1: -5.05, x2: 3.94, y2: -5.05, text: '5.40 m garažna vrata', offset: -0.95 },
      { x1: -4.24, y1: -2.35, x2: -1.88, y2: -2.35, text: '2.36 m radna', offset: -0.4 },
      { x1: -3.68, y1: 4.88, x2: 0.58, y2: 4.88, text: '4.26 m vešeraj', offset: 0.35 },
      { x1: 0.7, y1: 4.88, x2: 5.44, y2: 4.88, text: '4.74 m kotlovnica', offset: 0.35 }
    ]
  },
  {
    id: 'prizemlje-redizajn',
    floor: 'Prizemlje (0.00 m)',
    interior: 'redesign',
    title: 'Prizemlje — Pr (kota 0.00 m: 3D Vrt, Trijem, Loft + Sjeverno krilo) — Redizajn ✦ Japandi Calm',
    image: './assets/plan_prizemlje_redizajn.png?v=11',
    widthPx: 1860,
    heightPx: 1340,
    world: { xMin: -12.3, xMax: 6.3, yMin: -7.2, yMax: 6.2 },
    rooms: [
      { code: '02', stop: 1, label: '02 Pergola & 3D Vrt', x: -9.6, y: -2.5 },
      { code: '03', stop: 2, label: '03 Ulazni trijem', x: -5.2, y: -0.2 },
      { code: '04', stop: 3, label: '04 Atrij', x: -1.2, y: 0.0 },
      { code: '05', stop: 4, label: '05 Kuhinja', x: -3.1, y: -2.3 },
      { code: '06', stop: 5, label: '06 Blagovaonica', x: -1.8, y: -3.6 },
      { code: '07', stop: 6, label: '07 Boravak', x: 1.8, y: -2.8 },
      { code: '08', stop: 7, label: '08 Balkon SE', x: 0.0, y: -5.7 },
      { code: '09', stop: 8, label: '09 Soba 1 SZ', x: -1.9, y: 3.8 },
      { code: '09', stop: 8, label: '09 Kupaonica Pr', x: 1.3, y: 3.8 },
      { code: '09', stop: 8, label: '09 Soba 2 SI', x: 4.0, y: 3.1 }
    ],
    dims: [
      { x1: -4.35, y1: -5.0, x2: 4.25, y2: -5.0, text: '8.60 m južni loft', offset: -0.42 },
      { x1: -2.95, y1: -6.1, x2: 2.95, y2: -6.1, text: '5.90 m balkon SE', offset: -0.45 },
      { x1: -3.68, y1: 4.88, x2: 0.1, y2: 4.88, text: '3.78 m Soba 1', offset: 0.32 },
      { x1: 0.2, y1: 4.88, x2: 2.42, y2: 4.88, text: '2.22 m Kup Pr', offset: 0.32 },
      { x1: 2.54, y1: 4.88, x2: 5.44, y2: 4.88, text: '2.90 m Soba 2', offset: 0.32 }
    ]
  },
  {
    id: 'kat-redizajn',
    floor: 'Potkrovlje (+2.73 m)',
    interior: 'redesign',
    title: 'Potkrovlje — Pk (kota +2.73 / +2.74 m: Galerija, Most, Kupaonica, Spavaća) — Redizajn ✦ Japandi Calm',
    image: './assets/plan_kat_redizajn.png?v=11',
    widthPx: 1600,
    heightPx: 1520,
    world: { xMin: -5.1, xMax: 6.3, yMin: -5.465, yMax: 5.365 },
    rooms: [
      { code: '12', stop: 11, label: '12 Stepenište & grede', x: 2.6, y: -0.8 },
      { code: '13', stop: 12, label: '13 Most & galerija', x: -2.2, y: -0.5 },
      { code: '14', stop: 13, label: '14 Kupaonica Pk', x: -2.55, y: 3.05 },
      { code: '15', stop: 14, label: '15 Garderoba', x: 0.3, y: 2.6 },
      { code: '15', stop: 14, label: '15 Spavaća soba', x: 3.75, y: 3.45 }
    ],
    dims: [
      { x1: -3.68, y1: 4.88, x2: -1.35, y2: 4.88, text: '2.33 m', offset: 0.26 },
      { x1: -1.45, y1: 4.88, x2: 1.91, y2: 4.88, text: '3.36 m', offset: 0.26 },
      { x1: 2.01, y1: 4.88, x2: 5.44, y2: 4.88, text: '3.43 m', offset: 0.26 },
      { x1: 5.44, y1: 1.16, x2: 5.44, y2: 4.88, text: '3.72 m', offset: -0.28 },
      { x1: -4.32, y1: -2.1, x2: -0.28, y2: -2.1, text: '4.04 m (galerija)', offset: -0.28 },
      { x1: -4.32, y1: -2.1, x2: -4.32, y2: 0.85, text: '2.95 m', offset: 0.24 }
    ]
  },
  {
    id: 'situacija-postojece',
    floor: 'Situacija & 3D Vrt',
    interior: 'current',
    title: 'Situacija parcele i 3D Vrt (prilaz Banfi, 2P, pergola) — Postojeće stanje (1:1)',
    image: './assets/plan_situacija_postojece.png?v=11',
    widthPx: 1920,
    heightPx: 1680,
    world: { xMin: -16.5, xMax: 17.9, yMin: -16.05, yMax: 14.05 },
    rooms: [
      { code: '01', stop: 0, label: '01 Prilaz & 2P', x: 6.2, y: -6.8 },
      { code: '02', stop: 1, label: '02 Pergola & 3D Vrt', x: -9.8, y: -2.5 },
      { code: '03', stop: 2, label: '03 Trijem & stubište', x: -5.2, y: -3.0 },
      { code: '08', stop: 7, label: '08 Balkon SE', x: 0.0, y: -6.0 }
    ],
    dims: [
      { x1: -13.5, y1: -11.5, x2: 11.2, y2: -11.5, text: '24.7 m uređeni obuhvat parcele', offset: -0.6 },
      { x1: -4.5, y1: -5.1, x2: 5.59, y2: -5.1, text: '10.09 m', offset: -1.35 },
      { x1: 5.59, y1: -5.1, x2: 5.59, y2: 5.08, text: '10.18 m', offset: -0.9 }
    ]
  },
  {
    id: 'podrum-postojece',
    floor: 'Podrum (-2.73 m)',
    interior: 'current',
    title: 'Podrum — Po (kota -2.73 m: Garaža, Radna, Vešeraj, Kotlovnica) — Postojeće stanje (1:1)',
    image: './assets/plan_podrum_postojece.png?v=11',
    widthPx: 1600,
    heightPx: 1480,
    world: { xMin: -7.0, xMax: 6.6, yMin: -6.49, yMax: 6.09 },
    rooms: [
      { code: '10', stop: 9, label: '10 U-stubište', x: -2.2, y: 1.75 },
      { code: '10', stop: 9, label: '10 Vešeraj', x: -1.8, y: 3.85 },
      { code: '10', stop: 9, label: '10 Kotlovnica', x: 3.1, y: 3.2 },
      { code: '11', stop: 10, label: '11 Garaža', x: 1.3, y: -2.2 },
      { code: '11', stop: 10, label: '11 Radna soba', x: -3.0, y: -0.9 }
    ],
    dims: [
      { x1: -1.72, y1: -4.9, x2: 4.24, y2: -4.9, text: '5.96 m garaža', offset: -0.45 },
      { x1: -1.46, y1: -5.05, x2: 3.94, y2: -5.05, text: '5.40 m garažna vrata', offset: -0.95 },
      { x1: -4.24, y1: -2.35, x2: -1.88, y2: -2.35, text: '2.36 m radna', offset: -0.4 },
      { x1: -3.68, y1: 4.88, x2: 0.58, y2: 4.88, text: '4.26 m vešeraj', offset: 0.35 },
      { x1: 0.7, y1: 4.88, x2: 5.44, y2: 4.88, text: '4.74 m kotlovnica', offset: 0.35 }
    ]
  },
  {
    id: 'prizemlje-postojece',
    floor: 'Prizemlje (0.00 m)',
    interior: 'current',
    title: 'Prizemlje — Pr (kota 0.00 m: 3D Vrt, Trijem, Loft + Sjeverno krilo) — Postojeće stanje (LiDAR 1:1)',
    image: './assets/plan_prizemlje_postojece.png?v=11',
    widthPx: 1860,
    heightPx: 1340,
    world: { xMin: -12.3, xMax: 6.3, yMin: -7.2, yMax: 6.2 },
    rooms: [
      { code: '02', stop: 1, label: '02 Pergola & 3D Vrt', x: -9.6, y: -2.5 },
      { code: '03', stop: 2, label: '03 Ulazni trijem', x: -5.2, y: -0.2 },
      { code: '04', stop: 3, label: '04 Atrij', x: -1.2, y: 0.0 },
      { code: '05', stop: 4, label: '05 Kuhinja', x: -3.1, y: -2.3 },
      { code: '06', stop: 5, label: '06 Blagovaonica', x: -1.8, y: -3.6 },
      { code: '07', stop: 6, label: '07 Boravak', x: 1.8, y: -2.8 },
      { code: '08', stop: 7, label: '08 Balkon SE', x: 0.0, y: -5.7 },
      { code: '09', stop: 8, label: '09 Soba 1 SZ', x: -1.9, y: 3.8 },
      { code: '09', stop: 8, label: '09 Kupaonica Pr', x: 1.3, y: 3.8 },
      { code: '09', stop: 8, label: '09 Soba 2 SI', x: 4.0, y: 3.1 }
    ],
    dims: [
      { x1: -4.35, y1: -5.0, x2: 4.25, y2: -5.0, text: '8.60 m južni loft', offset: -0.42 },
      { x1: -2.95, y1: -6.1, x2: 2.95, y2: -6.1, text: '5.90 m balkon SE', offset: -0.45 },
      { x1: -3.68, y1: 4.88, x2: 0.1, y2: 4.88, text: '3.78 m Soba 1', offset: 0.32 },
      { x1: 0.2, y1: 4.88, x2: 2.42, y2: 4.88, text: '2.22 m Kup Pr', offset: 0.32 },
      { x1: 2.54, y1: 4.88, x2: 5.44, y2: 4.88, text: '2.90 m Soba 2', offset: 0.32 }
    ]
  },
  {
    id: 'kat-postojece',
    floor: 'Potkrovlje (+2.73 m)',
    interior: 'current',
    title: 'Potkrovlje — Pk (kota +2.73 / +2.74 m: Galerija, Most, Kupaonica, Spavaća) — Postojeće stanje (LiDAR 1:1)',
    image: './assets/plan_kat_postojece.png?v=11',
    widthPx: 1600,
    heightPx: 1520,
    world: { xMin: -5.1, xMax: 6.3, yMin: -5.465, yMax: 5.365 },
    rooms: [
      { code: '12', stop: 11, label: '12 Stepenište & grede', x: 2.6, y: -0.8 },
      { code: '13', stop: 12, label: '13 Most & galerija', x: -2.2, y: -0.5 },
      { code: '14', stop: 13, label: '14 Kupaonica Pk', x: -2.55, y: 3.05 },
      { code: '15', stop: 14, label: '15 Garderoba', x: 0.3, y: 2.6 },
      { code: '15', stop: 14, label: '15 Spavaća soba', x: 3.75, y: 3.45 }
    ],
    dims: [
      { x1: -3.68, y1: 4.88, x2: -1.35, y2: 4.88, text: '2.33 m', offset: 0.26 },
      { x1: -1.45, y1: 4.88, x2: 1.91, y2: 4.88, text: '3.36 m', offset: 0.26 },
      { x1: 2.01, y1: 4.88, x2: 5.44, y2: 4.88, text: '3.43 m', offset: 0.26 },
      { x1: 5.44, y1: 1.16, x2: 5.44, y2: 4.88, text: '3.72 m', offset: -0.28 },
      { x1: -4.32, y1: -2.1, x2: -0.28, y2: -2.1, text: '4.04 m (galerija)', offset: -0.28 },
      { x1: -4.32, y1: -2.1, x2: -4.32, y2: 0.85, text: '2.95 m', offset: 0.24 }
    ]
  }
];
