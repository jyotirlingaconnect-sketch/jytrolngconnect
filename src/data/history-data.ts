export type Language = "en" | "hi";

export interface DestinationContent {
  id: string;
  image: string;
  en: LocalizedContent;
  hi: LocalizedContent;
}

export interface LocalizedContent {
  name: string;
  overview: string;
  history: string;
  mythology: string;
  architecture: string;
  facts: { label: string; value: string }[];
  visitorInfo: {
    bestTime: string;
    timings: string;
    dressCode?: string;
  };
}

export const historyDestinations: DestinationContent[] = [
  {
    id: "mahakaleshwar",
    image: "/history/mahakaleshwar.webp",
    en: {
      name: "Mahakaleshwar Temple",
      overview: "One of the twelve Jyotirlingas, Mahakaleshwar in Ujjain is a revered sanctuary dedicated to Lord Shiva, known for its powerful spiritual aura and the unique Bhasma Aarti.",
      history: "The Mahakaleshwar temple has a deeply rooted history in ancient texts like the Puranas. It was historically patronized by many dynasties including the Guptas, Parmars, and later entirely reconstructed by the Marathas under Ranoji Shinde in the 18th century after historical invasions. It has stood as a central pillar of Sanatana Dharma for millennia.",
      mythology: "According to the Shiva Purana, Lord Shiva appeared here in his Mahakal form to rescue his devotees from a demon named Dushana. He defeated the demon and agreed to reside in the city eternally as a Jyotirlinga, protecting his followers from untimely death and spiritual ignorance.",
      architecture: "The present five-storied structure showcases beautiful Maratha, Bhumija, and Chalukyan architectural styles. The temple's towering shikhara (spire) features intricate sculptural work. Notably, the idol of Mahakaleshwar is Dakshinamurti, meaning it uniquely faces the south, a feature found only in this Jyotirlinga.",
      facts: [
        { label: "Location", value: "Ujjain, Madhya Pradesh" },
        { label: "River", value: "Shipra" },
        { label: "Key Ritual", value: "Bhasma Aarti" },
      ],
      visitorInfo: {
        bestTime: "October to March",
        timings: "4:00 AM to 11:00 PM (Bhasma Aarti begins at 4:00 AM)",
        dressCode: "Traditional Indian attire required for Bhasma Aarti.",
      },
    },
    hi: {
      name: "महाकालेश्वर मंदिर",
      overview: "उज्जैन में स्थित महाकालेश्वर बारह ज्योतिर्लिंगों में से एक है। भगवान शिव को समर्पित यह मंदिर अपनी शक्तिशाली आध्यात्मिक आभा और अद्वितीय भस्म आरती के लिए विश्व प्रसिद्ध है।",
      history: "महाकालेश्वर मंदिर का इतिहास पुराणों जैसे प्राचीन ग्रंथों में गहराई से निहित है। गुप्त, परमार और बाद में 18वीं शताब्दी में मराठों (विशेषकर राणोजी शिंदे) द्वारा इसे संरक्षित और पुनर्निर्मित किया गया। यह सहस्राब्दियों से सनातन धर्म के एक केंद्रीय स्तंभ के रूप में खड़ा है।",
      mythology: "शिव पुराण के अनुसार, भगवान शिव अपने भक्तों को दूषण नामक राक्षस से बचाने के लिए यहां महाकाल रूप में प्रकट हुए थे। उन्होंने राक्षस को हराया और अपने अनुयायियों को अकाल मृत्यु से बचाने के लिए एक ज्योतिर्लिंग के रूप में हमेशा के लिए शहर में रहने के लिए सहमत हुए।",
      architecture: "वर्तमान पांच मंजिला संरचना सुंदर मराठा, भूमिजा और चालुक्य स्थापत्य शैली को प्रदर्शित करती है। मंदिर के विशाल शिखर पर जटिल मूर्तिकला है। विशेष रूप से, महाकालेश्वर की मूर्ति दक्षिणामूर्ति है, जिसका अर्थ है कि यह दक्षिण की ओर है, जो केवल इसी ज्योतिर्लिंग में पाई जाने वाली एक विशेषता है।",
      facts: [
        { label: "स्थान", value: "उज्जैन, मध्य प्रदेश" },
        { label: "नदी", value: "क्षिप्रा" },
        { label: "प्रमुख अनुष्ठान", value: "भस्म आरती" },
      ],
      visitorInfo: {
        bestTime: "अक्टूबर से मार्च",
        timings: "सुबह 4:00 बजे से रात 11:00 बजे तक (भस्म आरती सुबह 4:00 बजे)",
        dressCode: "भस्म आरती के लिए पारंपरिक भारतीय परिधान अनिवार्य है।",
      },
    },
  },
  {
    id: "kal-bhairav",
    image: "/history/kal-bhairav.webp",
    en: {
      name: "Kal Bhairav Temple",
      overview: "Located on the banks of the Shipra River, the Kal Bhairav Temple is a prominent center for the Shaivite sect, famous for the unique offering of liquor to the deity.",
      history: "The original temple is believed to have been built by King Bhadrasen. The current Maratha-style structure was built over the remains of an older temple. Kal Bhairav has always been central to the Aghora and Kapalika sects of Shaivism who practiced esoteric rituals.",
      mythology: "Kal Bhairav is the fierce manifestation of Lord Shiva, associated with annihilation and the protection of the city. According to local belief, Kal Bhairav is the guardian deity of Ujjain, and it is traditionally required to offer him prayers when visiting the city.",
      architecture: "The temple's architecture is a testament to the Maratha influence in Ujjain. The central sanctum houses a striking stone idol of Kal Bhairav covered in vermilion (sindoor) with a silver face. The temple courtyard displays ancient intricate carvings.",
      facts: [
        { label: "Deity", value: "Lord Kal Bhairav" },
        { label: "Unique Offering", value: "Liquor (Madira)" },
        { label: "Location", value: "Ujjain" },
      ],
      visitorInfo: {
        bestTime: "October to March",
        timings: "5:00 AM to 10:00 PM",
      },
    },
    hi: {
      name: "काल भैरव मंदिर",
      overview: "क्षिप्रा नदी के तट पर स्थित काल भैरव मंदिर शैव संप्रदाय का एक प्रमुख केंद्र है, जो देवता को मदिरा चढ़ाने की अनूठी परंपरा के लिए प्रसिद्ध है।",
      history: "माना जाता है कि मूल मंदिर का निर्माण राजा भद्रसेन ने करवाया था। वर्तमान मराठा शैली की संरचना एक पुराने मंदिर के अवशेषों पर बनाई गई थी। काल भैरव हमेशा से शैव धर्म के अघोर और कापालिक संप्रदायों के केंद्र रहे हैं।",
      mythology: "काल भैरव भगवान शिव के उग्र रूप हैं, जो विनाश और शहर की रक्षा से जुड़े हैं। स्थानीय मान्यताओं के अनुसार, काल भैरव उज्जैन के रक्षक देवता (कोतवाल) हैं, और उज्जैन दर्शन से पहले उनकी पूजा करना आवश्यक माना जाता है।",
      architecture: "मंदिर की वास्तुकला उज्जैन में मराठा प्रभाव का प्रमाण है। गर्भगृह में काल भैरव की एक आकर्षक पत्थर की मूर्ति है जो सिंदूर से ढकी हुई है और उनका मुख चांदी का है।",
      facts: [
        { label: "देवता", value: "भगवान काल भैरव" },
        { label: "अनूठा प्रसाद", value: "मदिरा" },
        { label: "स्थान", value: "उज्जैन" },
      ],
      visitorInfo: {
        bestTime: "अक्टूबर से मार्च",
        timings: "सुबह 5:00 बजे से रात 10:00 बजे तक",
      },
    },
  },
  {
    id: "omkareshwar",
    image: "/history/omkareshwar.webp",
    en: {
      name: "Omkareshwar Temple",
      overview: "Set on the sacred Om-shaped Mandhata island in the Narmada River, Omkareshwar is a serene and magnificent Jyotirlinga that draws millions of pilgrims every year.",
      history: "The region has witnessed the rule of several grand empires including the Paramaras and the Holkars. Queen Ahilyabai Holkar made significant contributions to the temple's preservation and the construction of the ghats during the 18th century.",
      mythology: "Legends say that the Vindhya mountain prayed to Lord Shiva here to absolve himself of his sins. Pleased with his devotion, Shiva appeared and split the lingam into two parts—one half is Omkareshwar (Lord of Omkara) and the other is Mamleshwar (Amaleshwar).",
      architecture: "Built in the traditional North Indian Nagara style, the temple features beautifully carved pillars, a massive shikara, and extensive murals. The multi-storied temple complex clings to the edge of the island cliff, offering breathtaking views of the Narmada River.",
      facts: [
        { label: "Island Shape", value: "Symbol 'Om'" },
        { label: "River", value: "Narmada" },
        { label: "Status", value: "Jyotirlinga" },
      ],
      visitorInfo: {
        bestTime: "September to March",
        timings: "5:00 AM to 9:30 PM",
        dressCode: "Modest and traditional clothing recommended.",
      },
    },
    hi: {
      name: "ओंकारेश्वर मंदिर",
      overview: "नर्मदा नदी में पवित्र 'ॐ' आकार के मांधाता द्वीप पर स्थित, ओंकारेश्वर एक शांत और भव्य ज्योतिर्लिंग है जो हर साल लाखों तीर्थयात्रियों को आकर्षित करता है।",
      history: "इस क्षेत्र ने परमार और होल्कर सहित कई भव्य साम्राज्यों का शासन देखा है। 18वीं शताब्दी के दौरान रानी अहिल्याबाई होल्कर ने मंदिर के संरक्षण और घाटों के निर्माण में महत्वपूर्ण योगदान दिया था।",
      mythology: "पौराणिक कथाओं के अनुसार, विंध्य पर्वत ने अपने पापों से मुक्त होने के लिए यहां भगवान शिव की तपस्या की थी। उनकी भक्ति से प्रसन्न होकर, शिव प्रकट हुए और लिंगम को दो भागों में विभाजित किया- एक आधा ओंकारेश्वर है और दूसरा ममलेश्वर।",
      architecture: "पारंपरिक उत्तर भारतीय नागर शैली में निर्मित, मंदिर में खूबसूरती से नक्काशीदार खंभे, एक विशाल शिखर और भित्ति चित्र हैं। बहुमंजिला मंदिर परिसर द्वीप की चट्टान के किनारे पर स्थित है, जो नर्मदा नदी का लुभावना दृश्य प्रस्तुत करता है।",
      facts: [
        { label: "द्वीप का आकार", value: "'ॐ' प्रतीक" },
        { label: "नदी", value: "नर्मदा" },
        { label: "दर्जा", value: "ज्योतिर्लिंग" },
      ],
      visitorInfo: {
        bestTime: "सितंबर से मार्च",
        timings: "सुबह 5:00 बजे से रात 9:30 बजे तक",
        dressCode: "मर्यादित और पारंपरिक कपड़े पहनना उचित है।",
      },
    },
  },
  {
    id: "mamleshwar",
    image: "/history/mamleshwar.webp",
    en: {
      name: "Mamleshwar Temple",
      overview: "Located on the southern bank of the Narmada River, Mamleshwar is the spiritual twin of Omkareshwar, holding equal status as half of the fourth Jyotirlinga.",
      history: "Also known as Amareshwar, this ancient temple is a protected monument by the Archaeological Survey of India (ASI). Historical records from the 11th-century Paramara dynasty feature inscriptions praising the glory of this temple.",
      mythology: "It is firmly believed that a pilgrimage to Omkareshwar is incomplete without visiting the Mamleshwar temple. According to the Shiva Purana, the spiritual essence of the Jyotirlinga is equally distributed between the two temples.",
      architecture: "The temple reflects the intricate Bhumija style of architecture, characteristic of the Paramara period. Its stone walls are adorned with beautiful carvings of deities, floral motifs, and ancient Sanskrit inscriptions.",
      facts: [
        { label: "Status", value: "Protected ASI Monument" },
        { label: "Also Known As", value: "Amareshwar" },
        { label: "Location", value: "South Bank of Narmada" },
      ],
      visitorInfo: {
        bestTime: "September to March",
        timings: "5:30 AM to 9:00 PM",
      },
    },
    hi: {
      name: "ममलेश्वर मंदिर",
      overview: "नर्मदा नदी के दक्षिणी तट पर स्थित, ममलेश्वर ओंकारेश्वर का आध्यात्मिक जुड़वां है, जो चौथे ज्योतिर्लिंग के आधे हिस्से के रूप में समान दर्जा रखता है।",
      history: "अमरेश्वर के नाम से भी जाना जाने वाला यह प्राचीन मंदिर भारतीय पुरातत्व सर्वेक्षण (ASI) द्वारा संरक्षित स्मारक है। 11वीं सदी के परमार राजवंश के ऐतिहासिक अभिलेखों में इस मंदिर की महिमा की प्रशंसा करने वाले शिलालेख हैं।",
      mythology: "यह दृढ़ता से माना जाता है कि ममलेश्वर मंदिर के दर्शन के बिना ओंकारेश्वर की तीर्थयात्रा अधूरी है। शिव पुराण के अनुसार, ज्योतिर्लिंग का आध्यात्मिक सार दोनों मंदिरों के बीच समान रूप से वितरित है।",
      architecture: "मंदिर परमार काल की विशेषता वाली जटिल भूमिजा स्थापत्य शैली को दर्शाता है। इसकी पत्थर की दीवारें देवताओं की सुंदर नक्काशी, पुष्प रूपांकनों और प्राचीन संस्कृत शिलालेखों से सजी हैं।",
      facts: [
        { label: "दर्जा", value: "संरक्षित ASI स्मारक" },
        { label: "अन्य नाम", value: "अमरेश्वर" },
        { label: "स्थान", value: "नर्मदा का दक्षिणी तट" },
      ],
      visitorInfo: {
        bestTime: "सितंबर से मार्च",
        timings: "सुबह 5:30 बजे से रात 9:00 बजे तक",
      },
    },
  },
  {
    id: "maheshwar",
    image: "/history/maheshwar.webp",
    en: {
      name: "Maheshwar Fort",
      overview: "Rising majestically over the Narmada River, Maheshwar Fort is a stunning blend of history, architecture, and spirituality, deeply associated with Queen Ahilyabai Holkar.",
      history: "Maheshwar was the glorious capital of the Malwa during the Maratha Holkar reign in the late 18th century. Rajmata Ahilyabai Holkar governed her kingdom from this fort, building numerous temples, ghats, and establishing a flourishing handloom weaving industry (Maheshwari sarees) that survives to this day.",
      mythology: "Mentioned as 'Mahishmati' in the epics Ramayana and Mahabharata, Maheshwar has always been a city of immense spiritual prominence. Legend has it that King Sahasrarjun, who had a thousand arms, once stopped the flow of the Narmada river here.",
      architecture: "The 18th-century fort features robust walls and exquisite balconies reflecting Maratha and Rajput architectural brilliance. Inside, the Ahilya Bai Temple and her personal chhatri (cenotaph) stand as masterpieces of delicate stone carving.",
      facts: [
        { label: "Historical Name", value: "Mahishmati" },
        { label: "Built By", value: "Ahilyabai Holkar" },
        { label: "Famous For", value: "Maheshwari Sarees & Ghats" },
      ],
      visitorInfo: {
        bestTime: "October to March",
        timings: "7:00 AM to 7:00 PM",
      },
    },
    hi: {
      name: "महेश्वर किला",
      overview: "नर्मदा नदी के ऊपर भव्य रूप से स्थित, महेश्वर किला इतिहास, वास्तुकला और आध्यात्मिकता का एक शानदार मिश्रण है, जो महारानी अहिल्याबाई होल्कर से गहराई से जुड़ा हुआ है।",
      history: "महेश्वर 18वीं शताब्दी के उत्तरार्ध में मराठा होल्कर शासन के दौरान मालवा की गौरवशाली राजधानी थी। राजमाता अहिल्याबाई होल्कर ने इस किले से अपने राज्य पर शासन किया, कई मंदिरों, घाटों का निर्माण किया, और महेश्वरी साड़ियों के उद्योग की स्थापना की।",
      mythology: "रामायण और महाभारत महाकाव्यों में 'माहिष्मती' के रूप में वर्णित, महेश्वर हमेशा अत्यधिक आध्यात्मिक महत्व का शहर रहा है। किंवदंती है कि राजा सहस्रार्जुन, जिनकी एक हजार भुजाएँ थीं, ने एक बार यहाँ नर्मदा नदी के प्रवाह को रोक दिया था।",
      architecture: "18वीं शताब्दी के इस किले में मराठा और राजपूत वास्तुकला की शानदार झलक दिखती है। अंदर, अहिल्या बाई मंदिर और उनकी व्यक्तिगत छतरी (स्मारक) पत्थर की नक्काशी की उत्कृष्ट कृतियों के रूप में खड़ी हैं।",
      facts: [
        { label: "ऐतिहासिक नाम", value: "माहिष्मती" },
        { label: "निर्माता", value: "अहिल्याबाई होल्कर" },
        { label: "प्रसिद्धि", value: "महेश्वरी साड़ियां और घाट" },
      ],
      visitorInfo: {
        bestTime: "अक्टूबर से मार्च",
        timings: "सुबह 7:00 बजे से शाम 7:00 बजे तक",
      },
    },
  },
  {
    id: "mandu",
    image: "/history/mandu.webp",
    en: {
      name: "Mandu Fort",
      overview: "An ancient fortress city renowned for its Afghan architecture, Mandu stands as a grand testament to the romance between Prince Baz Bahadur and Rani Roopmati.",
      history: "Mandu flourished in the 15th and 16th centuries under the Paramara kings and later the Sultans of Malwa. It became a sprawling fort city adorned with palaces, mosques, and lakes. It was historically named 'Shadiabad' (The City of Joy) by Emperor Alauddin Khalji.",
      mythology: "While Mandu is mostly historical, local folklore is deeply intertwined with the romantic legend of Baz Bahadur, the last independent ruler of Mandu, and his beautiful Hindu consort, Roopmati. It is said she would only eat after viewing the Narmada river, prompting the construction of the Roopmati Pavilion.",
      architecture: "Mandu boasts India's finest Afghan architecture. Key monuments include the massive Jama Masjid, the marble tomb of Hoshang Shah (which inspired the Taj Mahal), the Jahaz Mahal (Ship Palace) floating between two lakes, and the Hindola Mahal.",
      facts: [
        { label: "Key Attraction", value: "Jahaz Mahal" },
        { label: "Architectural Style", value: "Afghan" },
        { label: "Famous Story", value: "Baz Bahadur & Rani Roopmati" },
      ],
      visitorInfo: {
        bestTime: "July to March (Monsoon is incredibly scenic)",
        timings: "8:00 AM to 6:00 PM",
      },
    },
    hi: {
      name: "माण्डू किला",
      overview: "अफगान वास्तुकला के लिए प्रसिद्ध एक प्राचीन किलेदार शहर, माण्डू राजकुमार बाज़ बहादुर और रानी रूपमती के बीच रोमांस के एक भव्य प्रमाण के रूप में खड़ा है।",
      history: "माण्डू 15वीं और 16वीं शताब्दी में परमार राजाओं और बाद में मालवा के सुल्तानों के अधीन फला-फूला। यह महलों, मस्जिदों और झीलों से सजा एक विशाल किला शहर बन गया। ऐतिहासिक रूप से इसे सम्राट अलाउद्दीन खिलजी द्वारा 'शादियाबाद' (आनंद का शहर) नाम दिया गया था।",
      mythology: "माण्डू में बाज़ बहादुर और उनकी सुंदर रानी रूपमती की रोमांटिक किंवदंती गहराई से जुड़ी हुई है। कहा जाता है कि वह नर्मदा नदी के दर्शन के बाद ही भोजन करती थीं, जिसके कारण रूपमती मंडप का निर्माण हुआ।",
      architecture: "माण्डू में भारत की बेहतरीन अफगान वास्तुकला है। प्रमुख स्मारकों में विशाल जामा मस्जिद, होशंग शाह का संगमरमर का मकबरा (जिसने ताजमहल को प्रेरित किया), दो झीलों के बीच तैरता हुआ जहाज महल और हिंडोला महल शामिल हैं।",
      facts: [
        { label: "मुख्य आकर्षण", value: "जहाज महल" },
        { label: "स्थापत्य शैली", value: "अफगान" },
        { label: "प्रसिद्ध कहानी", value: "बाज़ बहादुर और रानी रूपमती" },
      ],
      visitorInfo: {
        bestTime: "जुलाई से मार्च (मानसून में विशेष सुंदर)",
        timings: "सुबह 8:00 बजे से शाम 6:00 बजे तक",
      },
    },
  },
  {
    id: "khajrana",
    image: "/history/khajrana.webp",
    en: {
      name: "Khajrana Ganesh Temple",
      overview: "One of the most revered and visited temples in Indore, Khajrana Ganesh is a center of deep faith where devotees come to seek blessings for prosperity and success.",
      history: "The temple was built by the great Maratha Queen Ahilyabai Holkar in the year 1735. According to historical records, the idol of Lord Ganesha was originally hidden in a well to protect it from Aurangzeb's iconoclastic invasions, before being retrieved and enshrined by the Queen.",
      mythology: "Local belief holds that a local priest, Pandit Mangal Bhatt, had a dream wherein Lord Ganesha instructed him to excavate the idol from a specific well. The Holkar queen funded the excavation and constructed the temple. Today, it is firmly believed that any wish made here (mannat) is fulfilled by the deity.",
      architecture: "The temple has evolved into a vast complex over the centuries. The main idol consists of a large, beautiful vermilion-coated murti of Lord Ganesha with silver eyes. The sprawling courtyard houses numerous smaller shrines dedicated to other Hindu deities.",
      facts: [
        { label: "Deity", value: "Lord Ganesha" },
        { label: "Built By", value: "Ahilyabai Holkar (1735)" },
        { label: "Significance", value: "Wish-fulfilling Shrine" },
      ],
      visitorInfo: {
        bestTime: "All year round (Especially Wednesdays)",
        timings: "5:00 AM to 11:00 PM",
      },
    },
    hi: {
      name: "खजराना गणेश मंदिर",
      overview: "इंदौर में सबसे अधिक पूजनीय और देखे जाने वाले मंदिरों में से एक, खजराना गणेश गहरी आस्था का केंद्र है जहाँ भक्त समृद्धि और सफलता का आशीर्वाद लेने आते हैं।",
      history: "इस मंदिर का निर्माण महान मराठा महारानी अहिल्याबाई होल्कर ने वर्ष 1735 में करवाया था। ऐतिहासिक अभिलेखों के अनुसार, औरंगजेब के आक्रमणों से बचाने के लिए भगवान गणेश की मूर्ति को मूल रूप से एक कुएं में छिपा दिया गया था, जिसे बाद में महारानी द्वारा निकालकर स्थापित किया गया।",
      mythology: "स्थानीय मान्यता के अनुसार, एक स्थानीय पुजारी, पंडित मंगल भट्ट को एक सपना आया था जिसमें भगवान गणेश ने उन्हें एक विशिष्ट कुएं से मूर्ति निकालने का निर्देश दिया था। आज, यह दृढ़ता से माना जाता है कि यहां मांगी गई कोई भी मन्नत देवता द्वारा पूरी की जाती है।",
      architecture: "मंदिर सदियों में एक विशाल परिसर में विकसित हो गया है। मुख्य मूर्ति में चांदी की आंखों के साथ भगवान गणेश की एक बड़ी, सुंदर सिंदूर लेपित मूर्ति है। विशाल प्रांगण में अन्य हिंदू देवताओं को समर्पित कई छोटे मंदिर हैं।",
      facts: [
        { label: "देवता", value: "भगवान गणेश" },
        { label: "निर्माता", value: "अहिल्याबाई होल्कर (1735)" },
        { label: "महत्व", value: "मन्नत पूरी करने वाला मंदिर" },
      ],
      visitorInfo: {
        bestTime: "पूरे वर्ष (विशेषकर बुधवार)",
        timings: "सुबह 5:00 बजे से रात 11:00 बजे तक",
      },
    },
  },
];
