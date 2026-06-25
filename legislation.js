"use strict";

// ── DONNÉES (source: aide-mémoire SPF Intérieur, jan. 2026)
// pp=PP normaux, sv=Services/Spéciaux, dip=Diplomatique
// transit=visa transit aéroportuaire
// bio=visa obligatoire si PP NON biométrique
// 0=non requis, 1=requis
const PAYS_VISA = [
  {pays:"AFGHANISTAN",         code:"AFG", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"AFRIQUE DU SUD",      code:"ZAF", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"ALBANIE",             code:"ALB", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"ALGERIE",             code:"DZA", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"ALLEMAGNE",           code:"DEU", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"ANDORRE",             code:"AND", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"ANGOLA",              code:"AGO", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"ANTIGUA EN BARBUDA",  code:"ATG", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"ARABIE SAOUDITE",     code:"SAU", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"ARGENTINE",           code:"ARG", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"ARMENIE",             code:"ARM", pp:1, sv:1, dip:0, transit:0, bio:true,  note:""},
  {pays:"AUSTRALIE",           code:"AUS", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"AUTRICHE",            code:"AUT", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"AZERBAIDJAN",         code:"AZE", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"BAHAMAS",             code:"BHS", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"BAHREIN",             code:"BHR", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"BANGLADESH",          code:"BGD", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"BARBADE",             code:"BRB", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"BELGIQUE",            code:"BEL", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"BELIZE",              code:"BLZ", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"BENIN",               code:"BEN", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"BHOUTAN",             code:"BTN", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"BIELORUSSIE",         code:"BLR", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"BOLIVIE",             code:"BOL", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"BOSNIE-HERZEGOVINE",  code:"BIH", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"BOTSWANA",            code:"BWA", pp:0, sv:0, dip:0, transit:1, bio:false, note:""},
  {pays:"BRESIL",              code:"BRA", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"BRUNEI",              code:"BRN", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"BULGARIE",            code:"BGR", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"BURKINA FASO",        code:"BFA", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"BURUNDI",             code:"BDI", pp:1, sv:1, dip:0, transit:1, bio:false, note:"VTA applicable à partir du 01/08/2026 (art. 3.2 Code des visas). Exemption VTA : PP diplomatiques, de service et spéciaux."},
  {pays:"CAMBODGE",            code:"KHM", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"CAMEROUN",            code:"CMR", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"CANADA",              code:"CAN", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"CAP VERT",            code:"CPV", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"CHILI",               code:"CHL", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"CHINE",               code:"CHN", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"CHYPRE",              code:"CYP", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"COLOMBIE",            code:"COL", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"COMORES",             code:"COM", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"CONGO (REP.)",        code:"COG", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"COREE DU NORD",       code:"PRK", pp:1, sv:1, dip:1, transit:1, bio:false, note:""},
  {pays:"COREE DU SUD",        code:"KOR", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"COSTA RICA",          code:"CRI", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"COTE D'IVOIRE",       code:"CIV", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"CROATIE",             code:"HRV", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"CUBA",                code:"CUB", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"DANEMARK",            code:"DNK", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"DJIBOUTI",            code:"DJI", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"DOMINIQUE",           code:"DMA", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"EGYPTE",              code:"EGY", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"EMIRATS ARABES UNIS", code:"ARE", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"EQUATEUR",            code:"ECU", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"ERYTHREE",            code:"ERI", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"ESPAGNE",             code:"ESP", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"ESTONIE",             code:"EST", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"ETHIOPIE",            code:"ETH", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"FIJI",                code:"FJI", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"FINLANDE",            code:"FIN", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"FRANCE",              code:"FRA", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"GABON",               code:"GAB", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"GAMBIE",              code:"GMB", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"GEORGIE",             code:"GEO", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"GHANA",               code:"GHA", pp:1, sv:1, dip:0, transit:1, bio:false, note:"(*)"},
  {pays:"GRANDE BRETAGNE",     code:"GBR", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"GRECE",               code:"GRC", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"GRENADE",             code:"GRD", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"GUATEMALA",           code:"GTM", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"GUINEE EQUATORIALE",  code:"GNQ", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"GUINEE",              code:"GIN", pp:1, sv:1, dip:0, transit:1, bio:false, note:"(*)"},
  {pays:"GUINEE-BISSAU",       code:"GNB", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"GUYANA",              code:"GUY", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"HAITI",               code:"HTI", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"HONDURAS",            code:"HND", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"HONG KONG (SAR)",     code:"HKG", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"HONGRIE",             code:"HUN", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"ILES MARSHALL",       code:"MHL", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"ILES SALOMON",        code:"SLB", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"INDE",                code:"IND", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"INDONESIE",           code:"IDN", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"IRAN",                code:"IRN", pp:1, sv:1, dip:1, transit:1, bio:false, note:""},
  {pays:"IRAQ",                code:"IRQ", pp:1, sv:1, dip:0, transit:1, bio:false, note:"⚠️ Vérif n°PP"},
  {pays:"IRLANDE",             code:"IRL", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"ISLANDE",             code:"ISL", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"ISRAEL",              code:"ISR", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"ITALIE",              code:"ITA", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"JAMAIQUE",            code:"JAM", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"JAPON",               code:"JPN", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"JORDANIE",            code:"JOR", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"KAZAKHSTAN",          code:"KAZ", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"KENYA",               code:"KEN", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"KIRGHIZIE",           code:"KGZ", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"KIRIBATI",            code:"KIR", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"KOSOVO",              code:"RKS", pp:0, sv:0, dip:0, transit:0, bio:true,  note:"Libre depuis 01/01/2024"},
  {pays:"KOWEIT",              code:"KWT", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"LAOS",                code:"LAO", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"LESOTHO",             code:"LSO", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"LETTONIE",            code:"LTU", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"LIBAN",               code:"LBN", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"LIBERIA",             code:"LBR", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"LIBYE",               code:"LBY", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"LIECHTENSTEIN",       code:"LIE", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"LITUANIE",            code:"LVA", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"LUXEMBOURG",          code:"LUX", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"MACAO (SAR)",         code:"MAC", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"MACEDOINE DU NORD",   code:"MKD", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"MADAGASCAR",          code:"MDG", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"MALAISIE",            code:"MYS", pp:0, sv:0, dip:0, transit:1, bio:false, note:""},
  {pays:"MALAWI",              code:"MWI", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"MALDIVES",            code:"MDV", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"MALI",                code:"MLI", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"MALTE",               code:"MLT", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"MAROC",               code:"MAR", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"MAURICE",             code:"MUS", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"MAURITANIE",          code:"MRT", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"MEXIQUE",             code:"MEX", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"MICRONESIE",          code:"FSM", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"MOLDAVIE",            code:"MDA", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"MONACO",              code:"MCO", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"MONGOLIE",            code:"MNG", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"MONTENEGRO",          code:"MNE", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"MOZAMBIQUE",          code:"MOZ", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"MYANMAR/BIRMANIE",    code:"MMR", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"NAMIBIE",             code:"NAM", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"NAURU",               code:"NRU", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"NEPAL",               code:"NPL", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"NICARAGUA",           code:"NIC", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"NIGER",               code:"NER", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"NIGERIA",             code:"NGA", pp:1, sv:1, dip:0, transit:1, bio:false, note:"(*)"},
  {pays:"NORVEGE",             code:"NOR", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"NOUVELLE ZELANDE",    code:"NZL", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"OMAN",                code:"OMN", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"OUGANDA",             code:"UGA", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"OUZBEKISTAN",         code:"UZB", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"PAKISTAN",            code:"PAK", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"PALAU",               code:"PLW", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"PALESTINE",           code:"PSE", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"PANAMA",              code:"PAN", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"PAPOUASIE-N-GUINEE",  code:"PNG", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"PARAGUAY",            code:"PRY", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"PAYS-BAS",            code:"NLD", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"PEROU",               code:"PER", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"PHILIPPINES",         code:"PHL", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"POLOGNE",             code:"POL", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"PORTUGAL",            code:"PRT", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"QATAR",               code:"QAT", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"REP. CENTRAFRICAINE", code:"CAF", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"REP. DEM. CONGO",     code:"CGO", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"REP. DOMINICAINE",    code:"DOM", pp:0, sv:0, dip:0, transit:1, bio:false, note:""},
  {pays:"REP. TCHEQUE",        code:"CZE", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"ROUMANIE",            code:"ROU", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"RUSSIE",              code:"RUS", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"RWANDA",              code:"RWA", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"SAINT-KITTS-ET-NEVIS",code:"KNA", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SAINTE-LUCIE",        code:"LCA", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SAINT-VINCENT",       code:"VCT", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SALVADOR",            code:"SLV", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SAMOA",               code:"WSM", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SAN MARIN",           code:"SMR", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SAO TOME ET PRINCIPE",code:"STP", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"SENEGAL",             code:"SEN", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"SERBIE",              code:"SRB", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"SEYCHELLES",          code:"SYC", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SIERRA LEONE",        code:"SLE", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"SINGAPOUR",           code:"SGP", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SLOVAQUIE",           code:"SVK", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"SLOVENIE",            code:"SVN", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"SOMALIE",             code:"SOM", pp:1, sv:1, dip:1, transit:1, bio:false, note:""},
  {pays:"SOUDAN",              code:"SDN", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"SRI LANKA",           code:"LKA", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"SUD SOUDAN",          code:"SSD", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"SUEDE",               code:"SWE", pp:0, sv:0, dip:0, transit:0, bio:false, note:"UE"},
  {pays:"SUISSE",              code:"CHE", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"SURINAME",            code:"SUR", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"SWAZILAND",           code:"SWZ", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"SYRIE",               code:"SYR", pp:1, sv:1, dip:1, transit:1, bio:false, note:""},
  {pays:"TADJIKISTAN",         code:"TJK", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"TAIWAN",              code:"TWN", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"TANZANIE",            code:"TZA", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"TCHAD",               code:"TCD", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"THAILANDE",           code:"THA", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"TIMOR ORIENTAL",      code:"TLS", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"TOGO",                code:"TGO", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"TONGA",               code:"TON", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"TRINIDAD ET TOBAGO",  code:"TTO", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"TUNISIE",             code:"TUN", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
  {pays:"TURKMENISTAN",        code:"TKM", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"TURQUIE",             code:"TUR", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"TUVALU",              code:"TUV", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"UKRAINE",             code:"UKR", pp:0, sv:0, dip:0, transit:0, bio:true,  note:""},
  {pays:"URUGUAY",             code:"URY", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"USA",                 code:"USA", pp:0, sv:0, dip:0, transit:0, bio:false, note:""},
  {pays:"VANUATU",             code:"VUT", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"VATICAN",             code:"VAT", pp:0, sv:0, dip:0, transit:1, bio:false, note:""},
  {pays:"VENEZUELA",           code:"VEN", pp:0, sv:0, dip:0, transit:1, bio:false, note:""},
  {pays:"VIETNAM",             code:"VNM", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"YEMEN",               code:"YEM", pp:1, sv:1, dip:1, transit:1, bio:false, note:""},
  {pays:"ZAMBIE",              code:"ZMB", pp:1, sv:1, dip:0, transit:0, bio:false, note:""},
  {pays:"ZIMBABWE",            code:"ZWE", pp:1, sv:1, dip:0, transit:1, bio:false, note:""},
];

// ── RENDU CELLULES
function cellVisa(val) {
  return val === 1
    ? '<span style="color:#c0392b;font-weight:700;">🔴</span>'
    : '<span style="color:#1a6632;">✅</span>';
}

function cellBio(bio) {
  return bio
    ? '<span style="color:#856404;font-size:.75rem;font-weight:600;">🪪 PP bio requis</span>'
    : '';
}

function buildNote(p) {
  const parts = [];
  if (p.bio)         parts.push('<span style="color:#856404;font-size:.75rem;">🪪 PP biométrique requis</span>');
  if (p.note)        parts.push(`<span style="font-size:.75rem;color:var(--muted);">${p.note}</span>`);
  return parts.join('<br>');
}

function renderTable(data) {
  const tbody = document.getElementById("visa-tbody");
  const count = document.getElementById("visa-count");
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:20px;">Aucun résultat</td></tr>';
    count.textContent = "0 pays";
    return;
  }
  count.textContent = data.length + " pays";
  tbody.innerHTML = data.map(p => `
    <tr${p.bio ? ' style="background:#fffbf0;"' : ''}>
      <td><strong>${p.pays}</strong></td>
      <td><code style="font-size:.8rem;background:#f0f4ff;padding:2px 6px;border-radius:4px;">${p.code}</code></td>
      <td style="text-align:center;">${cellVisa(p.pp)}</td>
      <td style="text-align:center;">${cellVisa(p.sv)}</td>
      <td style="text-align:center;">${cellVisa(p.dip)}</td>
      <td style="text-align:center;">${cellVisa(p.transit)}</td>
      <td>${buildNote(p)}</td>
    </tr>`).join("");
}

function filterVisa(q) {
  const s = q.trim().toLowerCase();
  const filtered = s
    ? PAYS_VISA.filter(p =>
        p.pays.toLowerCase().includes(s) ||
        p.code.toLowerCase().includes(s))
    : PAYS_VISA;
  renderTable(filtered);
}

// ── ONGLETS
document.getElementById("tab-bar").addEventListener("click", e => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  const key = tab.dataset.tab;
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("active", t.dataset.tab === key));
  document.querySelectorAll(".tab-content").forEach(c =>
    c.classList.toggle("active", c.id === "tab-" + key));
  if (key === "visa") renderTable(PAYS_VISA);
  if (key === "subsistance") renderIata(IATA_DATA);
});

// ── INIT
renderTable(PAYS_VISA);
// ── DONNÉES IATA
const IATA_DATA = [
  {ville:"Tirana",           code:"TIA",     region:"Europe"},
  {ville:"Vienne",           code:"VIE",     region:"Europe"},
  {ville:"Sofia",            code:"SOF",     region:"Europe"},
  {ville:"Varna",            code:"VAR",     region:"Europe"},
  {ville:"Paphos",           code:"PFO",     region:"Europe"},
  {ville:"Dubrovnik",        code:"DBV",     region:"Europe"},
  {ville:"Zagreb",           code:"ZAG",     region:"Europe"},
  {ville:"Cracovie",         code:"KRK",     region:"Europe"},
  {ville:"Varsovie",         code:"WAW/WMI", region:"Europe"},
  {ville:"Wroclaw",          code:"WRO",     region:"Europe"},
  {ville:"Katowice",         code:"KTW",     region:"Europe"},
  {ville:"Poznan",           code:"POZ",     region:"Europe"},
  {ville:"Podgorica",        code:"TGD",     region:"Europe"},
  {ville:"Chisinau",         code:"RMO",     region:"Europe"},
  {ville:"Marseille",        code:"MRS",     region:"Europe"},
  {ville:"Toulouse",         code:"TLS",     region:"Europe"},
  {ville:"Nice",             code:"NCE",     region:"Europe"},
  {ville:"Nantes",           code:"NTE",     region:"Europe"},
  {ville:"Nimes",            code:"FNI",     region:"Europe"},
  {ville:"Perpignan",        code:"PGF",     region:"Europe"},
  {ville:"Rodez",            code:"RDZ",     region:"Europe"},
  {ville:"Lourdes (Tarbes)", code:"LDE",     region:"Europe"},
  {ville:"Bologne",          code:"BLQ",     region:"Europe"},
  {ville:"Brindisi",         code:"BDS",     region:"Europe"},
  {ville:"Cagliari",         code:"CAG",     region:"Europe"},
  {ville:"Catane",           code:"CTA",     region:"Europe"},
  {ville:"Alghero",          code:"AHO",     region:"Europe"},
  {ville:"Genes",            code:"GOA",     region:"Europe"},
  {ville:"Agadir",           code:"AGA",     region:"Afrique"},
  {ville:"Fes",              code:"FEZ",     region:"Afrique"},
  {ville:"Marrakech",        code:"RAK",     region:"Afrique"},
  {ville:"Nador",            code:"NDR",     region:"Afrique"},
  {ville:"Oujda",            code:"OUD",     region:"Afrique"},
  {ville:"Rabat",            code:"RBA",     region:"Afrique"},
  {ville:"Tanger",           code:"TNG",     region:"Afrique"},
  {ville:"Istanbul",         code:"SAW",     region:"Moyen-Orient"},
  {ville:"Kutaisi",          code:"KUT",     region:"Moyen-Orient"},
  {ville:"Amman Queen Alia", code:"AMM",     region:"Moyen-Orient"}
];

function renderIata(data) {
  var tbody = document.getElementById("iata-tbody");
  var count = document.getElementById("iata-count");
  if (!tbody) return;
  count.textContent = data.length + " villes";
  var html = "";
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var color = d.region === "Europe" ? "#1C2B4A" : d.region === "Afrique" ? "#2A6050" : "#8B3A2A";
    html += "<tr>";
    html += "<td><strong>" + d.ville + "</strong></td>";
    html += "<td><code style=\"font-size:.85rem;background:#f0f4ff;padding:2px 8px;border-radius:4px;font-weight:700;\">" + d.code + "</code></td>";
    html += "<td><span style=\"font-size:.75rem;font-weight:500;color:" + color + ";\">" + d.region + "</span></td>";
    html += "</tr>";
  }
  tbody.innerHTML = html;
}

function filterIata(q) {
  var s = q.trim().toLowerCase();
  var filtered = s ? IATA_DATA.filter(function(d) {
    return d.ville.toLowerCase().indexOf(s) > -1 ||
           d.code.toLowerCase().indexOf(s) > -1 ||
           d.region.toLowerCase().indexOf(s) > -1;
  }) : IATA_DATA;
  renderIata(filtered);
}

renderTable(PAYS_VISA);
renderIata(IATA_DATA);
