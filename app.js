/* ═══════════════════════════════════════════════════════════
   app.js — Traduction Contrôle Frontière
   Handles: data, rendering, navigation, TTS, copy
═══════════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────────
   1. DATA
───────────────────────────────────────────────────────── */

const CATEGORIES = [
  { key: "motif",       label: "Motif de voyage",  icon: "✈️",  color: "#2E6A58" },
  { key: "duree",       label: "Durée de séjour",  icon: "📅",  color: "#B07D20" },
  { key: "lieux",       label: "Lieux de séjour",  icon: "📍",  color: "#2A5A88" },
  { key: "subsistance", label: "Subsistance",       icon: "💳",  color: "#8B3A2A" },
  { key: "autre",       label: "Autre",             icon: "📋",  color: "#5A3A8B" },
];

/** French source phrases — same for every language */
const FR_PHRASES = {
  motif: [
    "Pourquoi venez-vous en Belgique ?",
    "Pour rendre visite à de la famille ?",
    "Pour faire du tourisme ?",
    "Pour le travail ?",
    "Montrez-moi votre contrat de travail ou votre invitation.",
    "Quel est le but de votre visite ?",
  ],
  duree: [
    "Combien de temps restez-vous en Europe ?",
    "Jours ?",
    "Semaines ?",
    "Mois ?",
    "Avez-vous un billet retour ?",
    "Montrez-moi votre billet retour.",
  ],
  lieux: [
    "Où allez-vous loger ?",
    "Avez-vous une réservation d'hôtel ?",
    "Montrez-moi votre réservation.",
    "Quelle est votre adresse en Belgique ?",
    "Chez qui allez-vous loger ?",
    "Dans quelle ville allez-vous ?",
  ],
  subsistance: [
    "Combien d'argent avez-vous sur vous ?",
    "Avez-vous de l'argent liquide ?",
    "Avez-vous une carte bancaire ?",
    "Qui finance votre séjour ?",
    "Montrez-moi vos moyens financiers.",
  ],
  autre: [
    "Montrez-moi votre passeport.",
    "Avez-vous un visa ?",
    "Avez-vous déjà été refoulé à la frontière ?",
    "Avez-vous des bagages à déclarer ?",
    "Veuillez me suivre.",
    "Attendez ici.",
  ],
};

/**
 * Language list.
 * Each entry: { slug, name, native, flag, region, ttsLang, rtl?, t:{...} }
 * t = translations map, keys matching FR_PHRASES keys.
 */
const LANGUAGES = [
  {
    slug: "anglais", name: "Anglais", native: "English", flag: "🇬🇧",
    region: "europe", ttsLang: "en-GB",
    t: {
      motif:       ["Why are you coming to Belgium?", "To visit your family?", "For tourism?", "For work?", "Show me your employment contract or invitation.", "What is the purpose of your visit?"],
      duree:       ["How long are you staying in Europe?", "Days?", "Weeks?", "Months?", "Do you have a return ticket?", "Show me your return ticket."],
      lieux:       ["Where are you going to stay?", "Do you have a hotel reservation?", "Show me your reservation.", "What is your address in Belgium?", "Who are you going to stay with?", "Which city are you going to?"],
      subsistance: ["How much money do you have on you?", "Do you have cash?", "Do you have a bank card?", "Who is financing your stay?", "Show me your financial means."],
      autre:       ["Show me your passport.", "Do you have a visa?", "Have you ever been turned back at the border?", "Do you have any luggage to declare?", "Please follow me.", "Wait here."],
    },
  },
  {
    slug: "allemand", name: "Allemand", native: "Deutsch", flag: "🇩🇪",
    region: "europe", ttsLang: "de-DE",
    t: {
      motif:       ["Warum kommen Sie nach Belgien?", "Um Ihre Familie zu besuchen?", "Für den Tourismus?", "Für die Arbeit?", "Zeigen Sie mir Ihren Arbeitsvertrag oder Ihre Einladung.", "Was ist der Zweck Ihres Besuchs?"],
      duree:       ["Wie lange bleiben Sie in Europa?", "Tage?", "Wochen?", "Monate?", "Haben Sie ein Rückflugticket?", "Zeigen Sie mir Ihr Rückflugticket."],
      lieux:       ["Wo werden Sie übernachten?", "Haben Sie eine Hotelreservierung?", "Zeigen Sie mir Ihre Reservierung.", "Was ist Ihre Adresse in Belgien?", "Bei wem werden Sie wohnen?", "In welche Stadt fahren Sie?"],
      subsistance: ["Wie viel Geld haben Sie bei sich?", "Haben Sie Bargeld?", "Haben Sie eine Bankkarte?", "Wer finanziert Ihren Aufenthalt?", "Zeigen Sie mir Ihre finanziellen Mittel."],
      autre:       ["Zeigen Sie mir Ihren Reisepass.", "Haben Sie ein Visum?", "Wurden Sie schon einmal an der Grenze zurückgewiesen?", "Haben Sie Gepäck zu verzollen?", "Bitte folgen Sie mir.", "Warten Sie hier."],
    },
  },
  {
    slug: "albanais", name: "Albanais", native: "Shqip", flag: "🇦🇱",
    region: "europe", ttsLang: "sq-AL",
    t: {
      motif:       ["Pse vini në Belgjikë?", "Të vizitoni familjen tuaj?", "Për turizëm?", "Për punë?", "Tregomëni kontratën tuaj të punës ose ftesën.", "Cili është qëllimi i vizitës suaj?"],
      duree:       ["Sa kohë qëndroni në Europë?", "Ditë?", "Javë?", "Muaj?", "A keni biletë kthimi?", "Tregomëni biletën tuaj të kthimit."],
      lieux:       ["Ku do të qëndroni?", "A keni rezervim hoteli?", "Tregomëni rezervimin tuaj.", "Cila është adresa juaj në Belgjikë?", "Tek kush do të qëndroni?", "Në cilin qytet po shkoni?"],
      subsistance: ["Sa para keni me vete?", "A keni para në dorë?", "A keni kartë bankare?", "Kush financon qëndrimin tuaj?", "Tregomëni mjetet tuaja financiare."],
      autre:       ["Tregomëni pasaportën tuaj.", "A keni vizë?", "A jeni kthyer ndonjëherë në kufi?", "A keni bagazhe për të deklaruar?", "Ju lutem ndiqmëni.", "Prisni këtu."],
    },
  },
  {
    slug: "arabe", name: "Arabe", native: "العربية", flag: "🇸🇦",
    region: "moyen-orient", ttsLang: "ar-SA", rtl: true,
    t: {
      motif:       ["لماذا تأتي إلى بلجيكا؟", "لزيارة عائلتك؟", "للسياحة؟", "للعمل؟", "أرني عقد عملك أو دعوتك.", "ما هو الغرض من زيارتك؟"],
      duree:       ["كم من الوقت ستبقى في أوروبا؟", "أيام؟", "أسابيع؟", "أشهر؟", "هل معك تذكرة عودة؟", "أرني تذكرة عودتك."],
      lieux:       ["أين ستقيم؟", "هل لديك حجز فندقي؟", "أرني حجزك.", "ما هو عنوانك في بلجيكا؟", "عند من ستقيم؟", "أي مدينة ستذهب إليها؟"],
      subsistance: ["كم من المال معك؟", "هل معك نقود سائلة؟", "هل معك بطاقة مصرفية؟", "من يموّل إقامتك؟", "أرني وسائلك المالية."],
      autre:       ["أرني جواز سفرك.", "هل لديك تأشيرة؟", "هل سبق أن رُدِدت على الحدود؟", "هل لديك أمتعة للإعلان عنها؟", "من فضلك اتبعني.", "انتظر هنا."],
    },
  },
  {
    slug: "bosniaque", name: "Bosniaque", native: "Bosanski", flag: "🇧🇦",
    region: "europe", ttsLang: "bs-BA",
    t: {
      motif:       ["Zašto dolazite u Belgiju?", "Da posjetite svoju porodicu?", "Za turizam?", "Za posao?", "Pokažite mi ugovor o radu ili pozivnicu.", "Koja je svrha vaše posjete?"],
      duree:       ["Koliko dugo ostajete u Evropi?", "Dani?", "Sedmice?", "Mjeseci?", "Imate li povratnu kartu?", "Pokažite mi povratnu kartu."],
      lieux:       ["Gdje ćete odsjesti?", "Imate li rezervaciju hotela?", "Pokažite mi rezervaciju.", "Koja je vaša adresa u Belgiji?", "Kod koga ćete boraviti?", "U koji grad idete?"],
      subsistance: ["Koliko novca imate sa sobom?", "Imate li gotovinu?", "Imate li bankovnu karticu?", "Ko finansira vaš boravak?", "Pokažite mi finansijska sredstva."],
      autre:       ["Pokažite mi putovnicu.", "Imate li vizu?", "Jeste li ikad vraćeni na granici?", "Imate li prtljag za carinjenje?", "Molim vas pratite me.", "Čekajte ovdje."],
    },
  },
  {
    slug: "chinois", name: "Chinois", native: "中文", flag: "🇨🇳",
    region: "asie", ttsLang: "zh-CN",
    t: {
      motif:       ["您为什么来比利时？", "是来探亲的吗？", "是来旅游的吗？", "是来工作的吗？", "请出示您的劳动合同或邀请函。", "您此行的目的是什么？"],
      duree:       ["您在欧洲停留多长时间？", "天？", "周？", "月？", "您有返程票吗？", "请出示您的返程票。"],
      lieux:       ["您打算住在哪里？", "您有酒店预订吗？", "请出示您的预订记录。", "您在比利时的地址是什么？", "您将住在谁那里？", "您要去哪个城市？"],
      subsistance: ["您随身携带多少钱？", "您有现金吗？", "您有银行卡吗？", "谁资助您的旅行？", "请出示您的财务证明。"],
      autre:       ["请出示您的护照。", "您有签证吗？", "您以前被遣返过吗？", "您有需要申报的行李吗？", "请跟我来。", "请在这里等候。"],
    },
  },
  {
    slug: "espagnol", name: "Espagnol", native: "Español", flag: "🇪🇸",
    region: "amerique", ttsLang: "es-ES",
    t: {
      motif:       ["¿Por qué viene a Bélgica?", "¿Para visitar a su familia?", "¿Por turismo?", "¿Por trabajo?", "Muéstreme su contrato de trabajo o invitación.", "¿Cuál es el motivo de su visita?"],
      duree:       ["¿Cuánto tiempo se queda en Europa?", "¿Días?", "¿Semanas?", "¿Meses?", "¿Tiene billete de vuelta?", "Muéstreme su billete de vuelta."],
      lieux:       ["¿Dónde va a alojarse?", "¿Tiene reserva de hotel?", "Muéstreme su reserva.", "¿Cuál es su dirección en Bélgica?", "¿Con quién va a alojarse?", "¿A qué ciudad va?"],
      subsistance: ["¿Cuánto dinero lleva encima?", "¿Lleva dinero en efectivo?", "¿Tiene tarjeta bancaria?", "¿Quién financia su estancia?", "Muéstreme sus medios económicos."],
      autre:       ["Muéstreme su pasaporte.", "¿Tiene visado?", "¿Ha sido rechazado en la frontera alguna vez?", "¿Tiene equipaje que declarar?", "Por favor sígame.", "Espere aquí."],
    },
  },
  {
    slug: "georgien", name: "Géorgien", native: "ქართული", flag: "🇬🇪",
    region: "europe", ttsLang: "ka-GE",
    t: {
      motif:       ["რატომ მოდიხართ ბელგიაში?", "ოჯახის სანახავად?", "ტურიზმისთვის?", "სამუშაოდ?", "მაჩვენეთ შრომის ხელშეკრულება ან მოწვევა.", "რა მიზნით სტუმრობთ?"],
      duree:       ["რამდენ ხანს დარჩებით ევროპაში?", "დღე?", "კვირა?", "თვე?", "გაქვთ დაბრუნების ბილეთი?", "მაჩვენეთ დაბრუნების ბილეთი."],
      lieux:       ["სად დარჩებით?", "გაქვთ სასტუმროს დაჯავშნა?", "მაჩვენეთ დაჯავშნა.", "რა არის თქვენი მისამართი ბელგიაში?", "ვისთან დარჩებით?", "რომელ ქალაქში მიდიხართ?"],
      subsistance: ["რამდენი ფული გაქვთ თან?", "გაქვთ ნაღდი ფული?", "გაქვთ საბანკო ბარათი?", "ვინ აფინანსებს თქვენს ყოფნას?", "მაჩვენეთ ფინანსური საშუალებები."],
      autre:       ["მაჩვენეთ პასპორტი.", "გაქვთ ვიზა?", "ოდესმე გაბრუნეს საზღვარზე?", "გაქვთ ბარგი სადეკლარაციო?", "გთხოვთ გამომყვეთ.", "დაელოდეთ აქ."],
    },
  },
  {
    slug: "grec", name: "Grec", native: "Ελληνικά", flag: "🇬🇷",
    region: "europe", ttsLang: "el-GR",
    t: {
      motif:       ["Γιατί έρχεστε στο Βέλγιο;", "Για να επισκεφθείτε την οικογένειά σας;", "Για τουρισμό;", "Για εργασία;", "Δείξτε μου το συμβόλαιο εργασίας ή την πρόσκλησή σας.", "Ποιος είναι ο σκοπός της επίσκεψής σας;"],
      duree:       ["Πόσο καιρό θα μείνετε στην Ευρώπη;", "Μέρες;", "Εβδομάδες;", "Μήνες;", "Έχετε εισιτήριο επιστροφής;", "Δείξτε μου το εισιτήριο επιστροφής."],
      lieux:       ["Πού θα μείνετε;", "Έχετε κράτηση ξενοδοχείου;", "Δείξτε μου την κράτησή σας.", "Ποια είναι η διεύθυνσή σας στο Βέλγιο;", "Σε ποιον θα μείνετε;", "Σε ποια πόλη πηγαίνετε;"],
      subsistance: ["Πόσα χρήματα έχετε μαζί σας;", "Έχετε μετρητά;", "Έχετε τραπεζική κάρτα;", "Ποιος χρηματοδοτεί τη διαμονή σας;", "Δείξτε μου τα οικονομικά σας μέσα."],
      autre:       ["Δείξτε μου το διαβατήριό σας.", "Έχετε βίζα;", "Σας έχουν επιστρέψει ποτέ στα σύνορα;", "Έχετε αποσκευές να δηλώσετε;", "Παρακαλώ ακολουθήστε με.", "Περιμένετε εδώ."],
    },
  },
  {
    slug: "hebreux", name: "Hébreux", native: "עברית", flag: "🇮🇱",
    region: "moyen-orient", ttsLang: "he-IL", rtl: true,
    t: {
      motif:       ["למה אתה בא לבלגיה?", "לבקר את משפחתך?", "לתיירות?", "לעבודה?", "הראה לי את חוזה העבודה או ההזמנה שלך.", "מה מטרת ביקורך?"],
      duree:       ["כמה זמן אתה נשאר באירופה?", "ימים?", "שבועות?", "חודשים?", "יש לך כרטיס חזרה?", "הראה לי את כרטיס החזרה."],
      lieux:       ["איפה תשהה?", "יש לך הזמנת מלון?", "הראה לי את ההזמנה.", "מה כתובתך בבלגיה?", "אצל מי תשהה?", "לאיזו עיר אתה נוסע?"],
      subsistance: ["כמה כסף יש לך איתך?", "יש לך מזומן?", "יש לך כרטיס אשראי?", "מי מממן את שהייתך?", "הראה לי את האמצעים הכספיים שלך."],
      autre:       ["הראה לי את הדרכון שלך.", "יש לך ויזה?", "האם נדחית אי פעם בגבול?", "יש לך כבודה להצהיר עליה?", "בבקשה ללכת איתי.", "חכה כאן."],
    },
  },
  {
    slug: "italien", name: "Italien", native: "Italiano", flag: "🇮🇹",
    region: "europe", ttsLang: "it-IT",
    t: {
      motif:       ["Perché viene in Belgio?", "Per visitare la famiglia?", "Per turismo?", "Per lavoro?", "Mi mostri il contratto di lavoro o l'invito.", "Qual è lo scopo della sua visita?"],
      duree:       ["Quanto tempo resta in Europa?", "Giorni?", "Settimane?", "Mesi?", "Ha un biglietto di ritorno?", "Mi mostri il biglietto di ritorno."],
      lieux:       ["Dove alloggerà?", "Ha una prenotazione alberghiera?", "Mi mostri la prenotazione.", "Qual è il suo indirizzo in Belgio?", "Da chi alloggerà?", "In quale città va?"],
      subsistance: ["Quanti soldi ha con sé?", "Ha contanti?", "Ha una carta bancaria?", "Chi finanzia il suo soggiorno?", "Mi mostri i suoi mezzi finanziari."],
      autre:       ["Mi mostri il passaporto.", "Ha un visto?", "È mai stato respinto alla frontiera?", "Ha bagagli da dichiarare?", "Per favore mi segua.", "Aspetti qui."],
    },
  },
  {
    slug: "macedonien", name: "Macédonien", native: "Македонски", flag: "🇲🇰",
    region: "europe", ttsLang: "mk-MK",
    t: {
      motif:       ["Зошто доаѓате во Белгија?", "Да ја посетите вашата фамилија?", "За туризам?", "За работа?", "Покажете ми го вашиот договор за работа или покана.", "Која е целта на вашата посета?"],
      duree:       ["Колку долго останувате во Европа?", "Денови?", "Недели?", "Месеци?", "Имате ли повратна карта?", "Покажете ми ја повратната карта."],
      lieux:       ["Каде ќе престојувате?", "Имате ли резервација во хотел?", "Покажете ми ја резервацијата.", "Каква е вашата адреса во Белгија?", "Кај кого ќе престојувате?", "Во кој град одите?"],
      subsistance: ["Колку пари имате со себе?", "Имате ли готовина?", "Имате ли банкарска картичка?", "Кој го финансира вашиот престој?", "Покажете ми ги финансиските средства."],
      autre:       ["Покажете ми го пасошот.", "Имате ли виза?", "Дали некогаш сте биле вратени на границата?", "Имате ли багаж за пријавување?", "Ве молам следете ме.", "Почекајте тука."],
    },
  },
  {
    slug: "neerlandais", name: "Néerlandais", native: "Nederlands", flag: "🇳🇱",
    region: "europe", ttsLang: "nl-NL",
    t: {
      motif:       ["Waarom komt u naar België?", "Om uw familie te bezoeken?", "Voor toerisme?", "Voor werk?", "Toon mij uw arbeidscontract of uitnodiging.", "Wat is het doel van uw bezoek?"],
      duree:       ["Hoe lang blijft u in Europa?", "Dagen?", "Weken?", "Maanden?", "Heeft u een retourticket?", "Toon mij uw retourticket."],
      lieux:       ["Waar gaat u verblijven?", "Heeft u een hotelreservering?", "Toon mij uw reservering.", "Wat is uw adres in België?", "Bij wie gaat u verblijven?", "Naar welke stad gaat u?"],
      subsistance: ["Hoeveel geld heeft u bij u?", "Heeft u contant geld?", "Heeft u een bankpas?", "Wie financiert uw verblijf?", "Toon mij uw financiële middelen."],
      autre:       ["Toon mij uw paspoort.", "Heeft u een visum?", "Bent u ooit teruggestuurd aan de grens?", "Heeft u bagage om aan te geven?", "Volgt u mij alstublieft.", "Wacht hier."],
    },
  },
  {
    slug: "persan", name: "Persan (Farsi)", native: "فارسی", flag: "🇮🇷",
    region: "moyen-orient", ttsLang: "fa-IR", rtl: true,
    t: {
      motif:       ["چرا به بلژیک می‌آیید؟", "برای دیدار با خانواده‌تان؟", "برای گردشگری؟", "برای کار؟", "قرارداد کار یا دعوتنامه‌تان را نشان دهید.", "هدف از سفر شما چیست؟"],
      duree:       ["چه مدت در اروپا می‌مانید؟", "روز؟", "هفته؟", "ماه؟", "بلیت برگشت دارید؟", "بلیت برگشتتان را نشان دهید."],
      lieux:       ["کجا اقامت خواهید داشت؟", "رزرو هتل دارید؟", "رزروتان را نشان دهید.", "آدرس شما در بلژیک چیست؟", "پیش چه کسی اقامت خواهید داشت؟", "به کدام شهر می‌روید؟"],
      subsistance: ["چه مقدار پول همراه دارید؟", "پول نقد دارید؟", "کارت بانکی دارید؟", "چه کسی هزینه اقامت شما را می‌پردازد؟", "مدارک مالی‌تان را نشان دهید."],
      autre:       ["پاسپورت‌تان را نشان دهید.", "ویزا دارید؟", "آیا تا به حال از مرز برگردانده شده‌اید؟", "بار یا کالایی برای اظهار دارید؟", "لطفاً همراه من بیایید.", "اینجا منتظر بمانید."],
    },
  },
  {
    slug: "portugais", name: "Portugais", native: "Português", flag: "🇵🇹",
    region: "amerique", ttsLang: "pt-PT",
    t: {
      motif:       ["Por que vem à Bélgica?", "Para visitar a sua família?", "Para fazer turismo?", "Para trabalhar?", "Mostre-me o seu contrato de trabalho ou convite.", "Qual é o motivo da sua visita?"],
      duree:       ["Quanto tempo vai ficar na Europa?", "Dias?", "Semanas?", "Meses?", "Tem bilhete de regresso?", "Mostre-me o seu bilhete de regresso."],
      lieux:       ["Onde vai ficar alojado?", "Tem reserva de hotel?", "Mostre-me a sua reserva.", "Qual é a sua morada na Bélgica?", "Em casa de quem vai ficar?", "A que cidade vai?"],
      subsistance: ["Quanto dinheiro tem consigo?", "Tem dinheiro em espécie?", "Tem um cartão bancário?", "Quem financia a sua estadia?", "Mostre-me os seus meios financeiros."],
      autre:       ["Mostre-me o seu passaporte.", "Tem visto?", "Alguma vez foi recusado na fronteira?", "Tem bagagem a declarar?", "Por favor siga-me.", "Aguarde aqui."],
    },
  },
  {
    slug: "roumain", name: "Roumain", native: "Română", flag: "🇷🇴",
    region: "europe", ttsLang: "ro-RO",
    t: {
      motif:       ["De ce veniți în Belgia?", "Să vă vizitați familia?", "Pentru turism?", "Pentru muncă?", "Arătați-mi contractul de muncă sau invitația.", "Care este scopul vizitei dvs.?"],
      duree:       ["Cât timp rămâneți în Europa?", "Zile?", "Săptămâni?", "Luni?", "Aveți bilet de retur?", "Arătați-mi biletul de retur."],
      lieux:       ["Unde veți fi cazat?", "Aveți o rezervare la hotel?", "Arătați-mi rezervarea.", "Care este adresa dvs. în Belgia?", "La cine veți sta?", "În ce oraș mergeți?"],
      subsistance: ["Câți bani aveți la dvs.?", "Aveți bani lichizi?", "Aveți un card bancar?", "Cine vă finanțează șederea?", "Arătați-mi mijloacele financiare."],
      autre:       ["Arătați-mi pașaportul.", "Aveți viză?", "Ați fost vreodată întors la frontieră?", "Aveți bagaje de declarat?", "Vă rog urmați-mă.", "Așteptați aici."],
    },
  },
  {
    slug: "russe", name: "Russe", native: "Русский", flag: "🇷🇺",
    region: "europe", ttsLang: "ru-RU",
    t: {
      motif:       ["Почему вы приезжаете в Бельгию?", "Навестить семью?", "Для туризма?", "По работе?", "Покажите мне трудовой договор или приглашение.", "Какова цель вашего визита?"],
      duree:       ["Как долго вы остаётесь в Европе?", "Дней?", "Недель?", "Месяцев?", "У вас есть обратный билет?", "Покажите мне обратный билет."],
      lieux:       ["Где вы будете жить?", "У вас есть бронирование отеля?", "Покажите мне бронирование.", "Какой у вас адрес в Бельгии?", "У кого вы будете жить?", "В какой город вы едете?"],
      subsistance: ["Сколько денег у вас с собой?", "У вас есть наличные?", "У вас есть банковская карта?", "Кто финансирует ваше пребывание?", "Покажите мне ваши финансовые средства."],
      autre:       ["Покажите мне паспорт.", "У вас есть виза?", "Вас когда-нибудь разворачивали на границе?", "У вас есть багаж для декларирования?", "Пожалуйста следуйте за мной.", "Подождите здесь."],
    },
  },
  {
    slug: "serbe", name: "Serbe", native: "Српски", flag: "🇷🇸",
    region: "europe", ttsLang: "sr-RS",
    t: {
      motif:       ["Зашто долазите у Белгију?", "Да посетите своју породицу?", "За туризам?", "За посао?", "Покажите ми уговор о раду или позивницу.", "Која је сврха ваше посете?"],
      duree:       ["Колико дуго остајете у Европи?", "Дана?", "Недеља?", "Месеци?", "Имате ли повратну карту?", "Покажите ми повратну карту."],
      lieux:       ["Где ћете одсести?", "Имате ли резервацију хотела?", "Покажите ми резервацију.", "Која је ваша адреса у Белгији?", "Код кога ћете боравити?", "У ком граду идете?"],
      subsistance: ["Колико новца имате са собом?", "Имате ли готовину?", "Имате ли банковну картицу?", "Ко финансира ваш боравак?", "Покажите ми финансијска средства."],
      autre:       ["Покажите ми пасош.", "Имате ли визу?", "Јесте ли икад враћени на граници?", "Имате ли пртљаг за царињење?", "Молим вас пратите ме.", "Чекајте овде."],
    },
  },
  {
    slug: "turc", name: "Turc", native: "Türkçe", flag: "🇹🇷",
    region: "europe", ttsLang: "tr-TR",
    t: {
      motif:       ["Belçika'ya neden geliyorsunuz?", "Ailenizi ziyaret etmek için mi?", "Turizm için mi?", "İş için mi?", "İş sözleşmenizi veya davetiyenizi gösterin.", "Ziyaretinizin amacı nedir?"],
      duree:       ["Avrupa'da ne kadar kalacaksınız?", "Gün mü?", "Hafta mı?", "Ay mı?", "Dönüş biletiniz var mı?", "Dönüş biletinizi gösterin."],
      lieux:       ["Nerede kalacaksınız?", "Otel rezervasyonunuz var mı?", "Rezervasyonunuzu gösterin.", "Belçika'daki adresiniz nedir?", "Kimin yanında kalacaksınız?", "Hangi şehre gidiyorsunuz?"],
      subsistance: ["Yanınızda ne kadar para var?", "Nakit paranız var mı?", "Banka kartınız var mı?", "Konaklamanızı kim finanse ediyor?", "Mali imkânlarınızı gösterin."],
      autre:       ["Pasaportunuzu gösterin.", "Vizeniz var mı?", "Daha önce hiç sınırdan geri çevrildiyiniz mi?", "Beyan edecek bagajınız var mı?", "Lütfen beni takip edin.", "Burada bekleyin."],
    },
  },
  {
    slug: "ukrainien", name: "Ukrainien", native: "Українська", flag: "🇺🇦",
    region: "europe", ttsLang: "uk-UA",
    t: {
      motif:       ["Чому ви приїжджаєте до Бельгії?", "Відвідати сім'ю?", "Для туризму?", "По роботі?", "Покажіть мені трудовий договір або запрошення.", "Яка мета вашого візиту?"],
      duree:       ["Як довго ви залишаєтесь в Європі?", "Днів?", "Тижнів?", "Місяців?", "У вас є зворотній квиток?", "Покажіть мені зворотній квиток."],
      lieux:       ["Де ви будете жити?", "У вас є бронювання готелю?", "Покажіть мені бронювання.", "Яка ваша адреса в Бельгії?", "У кого ви будете жити?", "В яке місто ви їдете?"],
      subsistance: ["Скільки грошей у вас із собою?", "У вас є готівка?", "У вас є банківська картка?", "Хто фінансує ваше перебування?", "Покажіть мені фінансові засоби."],
      autre:       ["Покажіть мені паспорт.", "У вас є віза?", "Вас коли-небудь розвертали на кордоні?", "У вас є багаж для декларування?", "Будь ласка слідуйте за мною.", "Зачекайте тут."],
    },
  },
];

/* ─────────────────────────────────────────────────────────
   2. STATE
───────────────────────────────────────────────────────── */

const state = {
  currentLang:   null,   // language object or null
  currentCat:    "motif",
  currentRegion: "all",
  playingIdx:    null,   // index of the phrase being spoken
};

/* ─────────────────────────────────────────────────────────
   3. DOM REFERENCES
───────────────────────────────────────────────────────── */

const $ = id => document.getElementById(id);

const DOM = {
  screenHome:       $("screen-home"),
  screenPhrases:    $("screen-phrases"),
  topbarHome:       $("topbar-home"),
  topbarPhrases:    $("topbar-phrases"),
  btnBack:          $("btn-back"),
  langName:         $("topbar-lang-name"),
  langNative:       $("topbar-lang-native"),
  langFlag:         $("topbar-lang-flag"),
  searchInput:      $("search-input"),
  searchClear:      $("search-clear"),
  filterBar:        $("filter-bar"),
  langGrid:         $("lang-grid"),
  catTabs:          $("cat-tabs"),
  phraseList:       $("phrase-list"),
};

/* ─────────────────────────────────────────────────────────
   4. NAVIGATION
───────────────────────────────────────────────────────── */

function goHome() {
  stopSpeech();
  state.currentLang = null;
  state.playingIdx  = null;

  DOM.screenHome.classList.add("active");
  DOM.screenHome.classList.remove("hidden");
  DOM.screenPhrases.classList.add("hidden");
  DOM.screenPhrases.classList.remove("active");

  DOM.topbarHome.classList.remove("hidden");
  DOM.topbarPhrases.classList.add("hidden");
}

function goToPhrases(lang) {
  state.currentLang = lang;
  state.currentCat  = "motif";
  state.playingIdx  = null;

  // Update topbar
  DOM.langName.textContent   = lang.name;
  DOM.langNative.textContent = lang.native;
  DOM.langFlag.textContent   = lang.flag;

  DOM.topbarHome.classList.add("hidden");
  DOM.topbarPhrases.classList.remove("hidden");

  DOM.screenHome.classList.remove("active");
  DOM.screenHome.classList.add("hidden");
  DOM.screenPhrases.classList.remove("hidden");
  DOM.screenPhrases.classList.add("active");

  renderCatTabs();
  renderPhrases();
  DOM.phraseList.scrollTop = 0;
}

/* ─────────────────────────────────────────────────────────
   5. RENDER — HOME
───────────────────────────────────────────────────────── */

function renderFilters() {
  const regions = [
    ["all",          "Toutes"],
    ["europe",       "Europe"],
    ["moyen-orient", "Moyen-Orient"],
    ["asie",         "Asie"],
    ["amerique",     "Amériques"],
  ];

  DOM.filterBar.innerHTML = regions
    .map(([key, label]) => `
      <button
        class="chip${state.currentRegion === key ? " active" : ""}"
        data-region="${key}">
        ${label}
      </button>`)
    .join("");
}

function renderGrid() {
  const query = DOM.searchInput.value.trim().toLowerCase();

  const filtered = LANGUAGES.filter(lang => {
    const matchRegion = state.currentRegion === "all" || lang.region === state.currentRegion;
    const matchSearch = lang.name.toLowerCase().includes(query)
                     || lang.native.toLowerCase().includes(query);
    return matchRegion && matchSearch;
  });

  if (filtered.length === 0) {
    DOM.langGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Aucune langue trouvée</p>
      </div>`;
    return;
  }

  DOM.langGrid.innerHTML = filtered
    .map(lang => `
      <div class="lang-card" role="listitem" data-slug="${lang.slug}">
        <span class="lc-flag" aria-hidden="true">${lang.flag}</span>
        <div class="lc-info">
          <div class="lc-name">${lang.name}</div>
          <div class="lc-native">${lang.native}</div>
        </div>
        <span class="lc-arrow" aria-hidden="true">›</span>
      </div>`)
    .join("");
}

/* ─────────────────────────────────────────────────────────
   6. RENDER — PHRASES
───────────────────────────────────────────────────────── */

function renderCatTabs() {
  DOM.catTabs.innerHTML = CATEGORIES
    .map(cat => {
      const isActive = cat.key === state.currentCat;
      const borderStyle = isActive ? `border-bottom-color:${cat.color}` : "";
      return `
        <button
          class="ctab${isActive ? " active" : ""}"
          style="${borderStyle}"
          data-cat="${cat.key}"
          data-color="${cat.color}">
          ${cat.icon} ${cat.label}
        </button>`;
    })
    .join("");
}

function renderPhrases() {
  const lang     = state.currentLang;
  const catKey   = state.currentCat;
  const frList   = FR_PHRASES[catKey];
  const trList   = lang.t[catKey] || [];
  const isRtl    = !!lang.rtl;

  DOM.phraseList.innerHTML = frList
    .map((frText, idx) => {
      const trText   = trList[idx] || "—";
      const rtlClass = isRtl ? " rtl" : "";

      return `
        <div class="pcard">
          <div class="pcard-fr">
            <span class="pcard-fr-flag" aria-hidden="true">🇫🇷</span>
            <span class="pcard-fr-text">${frText}</span>
          </div>
          <div class="pcard-tr">
            <div class="pcard-tr-text${rtlClass}">${trText}</div>
          </div>
          <div class="pcard-actions">
            <button
              class="btn-speak idle"
              data-idx="${idx}"
              data-text="${escapeAttr(trText)}"
              aria-label="Lire la phrase">
              <span class="spk-icon" aria-hidden="true">🔊</span>
              Écouter
            </button>
            <button
              class="btn-copy"
              id="btn-copy-${idx}"
              data-text="${escapeAttr(trText)}"
              data-idx="${idx}"
              aria-label="Copier la phrase">
              📋
            </button>
          </div>
        </div>`;
    })
    .join("");
}

/* ─────────────────────────────────────────────────────────
   7. TEXT-TO-SPEECH
───────────────────────────────────────────────────────── */

function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  state.playingIdx = null;
  updateSpeakButtons();
}

function speakPhrase(text, idx) {
  if (!window.speechSynthesis) return;

  // Toggle off if already playing this one
  if (state.playingIdx === idx) {
    stopSpeech();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance   = new SpeechSynthesisUtterance(text);
  utterance.lang    = state.currentLang.ttsLang;
  utterance.rate    = 0.88;
  utterance.pitch   = 1;

  utterance.onstart = () => {
    state.playingIdx = idx;
    updateSpeakButtons();
  };

  utterance.onend = utterance.onerror = () => {
    state.playingIdx = null;
    updateSpeakButtons();
  };

  window.speechSynthesis.speak(utterance);
}

function updateSpeakButtons() {
  document.querySelectorAll(".btn-speak").forEach(btn => {
    const idx       = parseInt(btn.dataset.idx, 10);
    const isPlaying = idx === state.playingIdx;

    btn.className   = "btn-speak " + (isPlaying ? "playing" : "idle");
    btn.innerHTML   = isPlaying
      ? '<span class="spk-icon" aria-hidden="true">⏹</span> Lecture…'
      : '<span class="spk-icon" aria-hidden="true">🔊</span> Écouter';
  });
}

/* ─────────────────────────────────────────────────────────
   8. COPY TO CLIPBOARD
───────────────────────────────────────────────────────── */

function copyPhrase(text, idx) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }

  const btn = document.getElementById("btn-copy-" + idx);
  if (!btn) return;

  btn.textContent = "✓";
  btn.classList.add("copied");

  setTimeout(() => {
    btn.textContent = "📋";
    btn.classList.remove("copied");
  }, 1500);
}

/* ─────────────────────────────────────────────────────────
   9. HELPERS
───────────────────────────────────────────────────────── */

/** Escape a string for use inside an HTML attribute */
function escapeAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ─────────────────────────────────────────────────────────
   10. EVENT LISTENERS — delegated for performance
───────────────────────────────────────────────────────── */

// Back button
DOM.btnBack.addEventListener("click", goHome);

// Search input
DOM.searchInput.addEventListener("input", () => {
  const hasValue = DOM.searchInput.value.length > 0;
  DOM.searchClear.classList.toggle("hidden", !hasValue);
  renderGrid();
});

// Search clear
DOM.searchClear.addEventListener("click", () => {
  DOM.searchInput.value = "";
  DOM.searchClear.classList.add("hidden");
  renderGrid();
});

// Filter chips (delegated)
DOM.filterBar.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.currentRegion = chip.dataset.region;
  renderFilters();
  renderGrid();
});

// Language cards (delegated)
DOM.langGrid.addEventListener("click", e => {
  const card = e.target.closest(".lang-card");
  if (!card) return;
  const lang = LANGUAGES.find(l => l.slug === card.dataset.slug);
  if (lang) goToPhrases(lang);
});

// Category tabs (delegated)
DOM.catTabs.addEventListener("click", e => {
  const tab = e.target.closest(".ctab");
  if (!tab) return;
  stopSpeech();
  state.currentCat = tab.dataset.cat;
  renderCatTabs();
  renderPhrases();
  DOM.phraseList.scrollTop = 0;
});

// Phrase list — speak & copy (delegated)
DOM.phraseList.addEventListener("click", e => {
  const speakBtn = e.target.closest(".btn-speak");
  if (speakBtn) {
    speakPhrase(speakBtn.dataset.text, parseInt(speakBtn.dataset.idx, 10));
    return;
  }

  const copyBtn = e.target.closest(".btn-copy");
  if (copyBtn) {
    copyPhrase(copyBtn.dataset.text, parseInt(copyBtn.dataset.idx, 10));
  }
});

// Stop speech when app loses focus
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopSpeech();
});

/* ─────────────────────────────────────────────────────────
   11. INIT
───────────────────────────────────────────────────────── */

renderFilters();
renderGrid();
