import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const PALETTE = [
  "#D97757", "#4F46E5", "#059669", "#DC2626", "#7C3AED",
  "#0891B2", "#EA580C", "#65A30D", "#DB2777", "#2563EB",
];

function avatarDataUri(initials, colorIndex) {
  const bg = PALETTE[colorIndex % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
    <circle cx="64" cy="64" r="64" fill="${bg}"/>
    <text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" fill="#ffffff" font-weight="600">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// initials are Latin-transliteration based, independent of the display name's script
const testimonials = [
  {
    name: "Priya Sharma", initials: "PS", city: "Indore",
    package_name: "Ujjain to Omkareshwar Jyotirlinga Darshan", fleet_name: "Toyota Innova Crysta",
    travel_date: "2026-07-12",
    experience:
      "We booked the Omkareshwar day trip for my parents' anniversary. The Innova was spotless and the driver, Rakesh, was patient with all our temple stops. Darshan queue management at Omkareshwar was smooth because he knew the local timings well. Reached back in Ujjain by 8pm as promised. Will book again for our Maheshwar trip.",
  },
  {
    name: "Arjun Mehta", initials: "AM", city: "Mumbai",
    package_name: "Ujjain to Maheshwar Narmada Ghat & Fort", fleet_name: "Maruti Suzuki Ertiga",
    travel_date: "2026-08-03",
    experience:
      "Came down from Mumbai for a short MP trip and added the Maheshwar day package. Loved the ghats in the evening light, exactly like in the pictures. Car was AC and comfortable for the 2 hour drive each way. Only small suggestion — add a short tea break stop, otherwise everything was well organised.",
  },
  {
    name: "Sunita Verma", initials: "SV", city: "Bhopal",
    package_name: "Ujjain to Indore City & Temple Trip", fleet_name: "Maruti Suzuki Ertiga",
    travel_date: "2026-06-21",
    experience:
      "Used this for a one-way drop from Ujjain to Indore airport along with a quick Khajrana Ganesh darshan on the way. Pickup was exactly on time which mattered a lot since I had a flight. Driver helped with my luggage too. Smooth experience overall.",
  },
  {
    name: "Rohit Malhotra", initials: "RM", city: "Delhi",
    package_name: "Omkareshwar – Ujjain – Mandu – Maheshwar Circuit", fleet_name: "Force Traveller",
    travel_date: "2026-09-14",
    experience:
      "Did the full 3 day Malwa circuit with my in-laws, 7 of us in the Traveller. Mandu's monuments were a nice surprise, we didn't expect the architecture to be this impressive. Maheshwar fort visit on day 3 was the highlight for the family. Driver stayed with us the whole 3 days and was genuinely helpful with hotel check-ins too.",
  },
  {
    name: "Kavita Joshi", initials: "KJ", city: "Pune",
    package_name: "Ujjain to Omkareshwar Jyotirlinga Darshan", fleet_name: "Toyota Innova Crysta",
    travel_date: "2026-07-29",
    experience:
      "Second Jyotirlinga we've covered through Jyotirling Connect after Mahakaleshwar last year. Omkareshwar trip was well timed for the evening aarti. Vehicle had good legroom for my mother who has knee pain. Minor delay of 15 minutes at pickup but driver called ahead to inform, so no issue.",
  },
  {
    name: "Vikram Singh", initials: "VS", city: "Jaipur",
    package_name: null, fleet_name: "Maruti Suzuki Ertiga",
    travel_date: "2026-08-18",
    experience:
      "Booked the Ertiga directly for a Ujjain local sightseeing day, not a fixed package. Team adjusted the itinerary when we wanted extra time at Kal Bhairav temple. Appreciated the flexibility instead of being locked into a rigid schedule.",
  },
  {
    name: "Anjali Deshmukh", initials: "AD", city: "Nagpur",
    package_name: "Omkareshwar – Ujjain – Mandu – Maheshwar Circuit", fleet_name: "Force Traveller",
    travel_date: "2026-09-02",
    experience:
      "Group of 9 from our society travelled together for the Malwa circuit. Three days, three very different experiences — Jyotirlinga darshan, Mandu's old city, and Maheshwar ghats. Coordination between hotel stays and the vehicle was handled well by the office, they called us a day before each leg to confirm timing.",
  },
  {
    name: "राजेश पाटील", initials: "RP", city: "नासिक",
    package_name: "Ujjain to Omkareshwar Jyotirlinga Darshan", fleet_name: "Toyota Innova Crysta",
    travel_date: "2026-07-05",
    experience:
      "मेरे पूरे परिवार के साथ ओंकारेश्वर दर्शन के लिए यह ट्रिप बुक की थी। गाड़ी समय पर आई, ड्राइवर बहुत विनम्र था और रास्ते में सारी जानकारी देता रहा। दर्शन के समय लाइन में भी मदद मिली। नर्मदा घाट पर शाम की आरती देखना एक यादगार अनुभव रहा।",
  },
  {
    name: "मीना यादव", initials: "MY", city: "लखनऊ",
    package_name: "Ujjain to Maheshwar Narmada Ghat & Fort", fleet_name: "Maruti Suzuki Ertiga",
    travel_date: "2026-08-09",
    experience:
      "महेश्वर का किला और घाट देखने का बहुत मन था, यह ट्रिप उम्मीद से भी अच्छी रही। गाड़ी एसी थी इसलिए गर्मी में भी आराम रहा। हथकरघा बाजार में साड़ी खरीदने के लिए ड्राइवर ने अच्छी दुकान भी सुझाई। धन्यवाद ज्योतिर्लिंग कनेक्ट टीम को।",
  },
  {
    name: "सुरेश कुमार", initials: "SK", city: "पटना",
    package_name: "Ujjain to Indore City & Temple Trip", fleet_name: "Maruti Suzuki Ertiga",
    travel_date: "2026-06-27",
    experience:
      "इंदौर से उज्जैन वापसी के लिए यह सर्विस ली थी। समय का बहुत पक्का था, स्टेशन पर ट्रेन पकड़नी थी वो भी आराम से पकड़ ली। रास्ते में खजराना गणेश मंदिर भी दिखा दिया, बिना किसी एक्स्ट्रा पैसे के। अच्छी सर्विस है।",
  },
  {
    name: "पूजा अग्रवाल", initials: "PA", city: "कानपुर",
    package_name: "Omkareshwar – Ujjain – Mandu – Maheshwar Circuit", fleet_name: "Force Traveller",
    travel_date: "2026-09-20",
    experience:
      "3 दिन की मांडू-ओंकारेश्वर-महेश्वर ट्रिप हमारे परिवार के 8 लोगों के लिए बुक की थी। मांडू की पुरानी इमारतें देखकर बहुत अच्छा लगा, बच्चों को भी मज़ा आया। ड्राइवर पूरे 3 दिन साथ रहा और होटल तक सामान भी उठाने में मदद की।",
  },
  {
    name: "दीपक चौहान", initials: "DC", city: "ग्वालियर",
    package_name: "Ujjain to Omkareshwar Jyotirlinga Darshan", fleet_name: "Toyota Innova Crysta",
    travel_date: "2026-07-17",
    experience:
      "ओंकारेश्वर ज्योतिर्लिंग दर्शन के लिए यह एक दिन की ट्रिप ली थी, बहुत सुव्यवस्थित रही। गाड़ी साफ-सुथरी और आरामदायक थी। बस दर्शन में लाइन थोड़ी लंबी थी पर यह मंदिर प्रशासन की वजह से था, कंपनी की तरफ से कोई कमी नहीं थी।",
  },
  {
    name: "नेहा तिवारी", initials: "NT", city: "वाराणसी",
    package_name: "Ujjain to Maheshwar Narmada Ghat & Fort", fleet_name: "Maruti Suzuki Ertiga",
    travel_date: "2026-08-24",
    experience:
      "काशी से आकर मालवा क्षेत्र घूमने का प्लान बनाया था। महेश्वर का किला और नर्मदा घाट देखकर मन शांत हो गया। टीम ने पूरी ट्रिप बहुत अच्छे से प्लान की, कोई दिक्कत नहीं आई।",
  },
  {
    name: "अमित गुप्ता", initials: "AG", city: "रतलाम",
    package_name: null, fleet_name: "Force Traveller",
    travel_date: "2026-09-08",
    experience:
      "ऑफिस के 12 लोगों के साथ उज्जैन में टीम आउटिंग के लिए ट्रैवलर बुक की थी। गाड़ी बड़ी और आरामदायक थी, ड्राइवर भी अनुभवी लगा। समय पर पिकअप और ड्रॉप दोनों हुआ।",
  },
  {
    name: "Rahul Bhatt", initials: "RB", city: "Surat",
    package_name: "Ujjain to Omkareshwar Jyotirlinga Darshan", fleet_name: "Toyota Innova Crysta",
    travel_date: "2026-07-22",
    experience:
      "Omkareshwar wala trip kiya tha last month, bahut hi smooth raha. Driver bhai time ke bahut pakke the, jo time bola gaya tha wahi pickup hua. Darshan ke baad Narmada ghat pe thoda extra time bhi diya rukne ke liye, feel nahi hua ki rush karaya ja raha hai. Overall paisa vasool trip.",
  },
  {
    name: "Simran Kaur", initials: "SK", city: "Chandigarh",
    package_name: "Omkareshwar – Ujjain – Mandu – Maheshwar Circuit", fleet_name: "Force Traveller",
    travel_date: "2026-09-27",
    experience:
      "3 din ka Malwa circuit tour kiya apni family ke saath, total 6 log the. Mandu dekh ke sach me surprise hua kitna beautiful architecture hai, pehle pata nahi tha. Maheshwar ke ghat pe sunset dekha wo moment abhi bhi yaad hai. Gaadi aur driver dono top class the, 3 din koi complain nahi.",
  },
  {
    name: "Manoj Tripathi", initials: "MT", city: "Jabalpur",
    package_name: "Ujjain to Indore City & Temple Trip", fleet_name: "Maruti Suzuki Ertiga",
    travel_date: "2026-06-30",
    experience:
      "Indore jana tha ek official kaam se, Ujjain se same day trip book kiya tha. Khajrana temple bhi cover ho gaya aur Sarafa bazaar me shaam ko khana bhi khaya, driver ne hi bataya wahan jaane ke liye. Time management solid tha, koi delay nahi hua.",
  },
  {
    name: "Priyanka Nair", initials: "PN", city: "Bengaluru",
    package_name: "Ujjain to Maheshwar Narmada Ghat & Fort", fleet_name: "Maruti Suzuki Ertiga",
    travel_date: "2026-08-15",
    experience:
      "Bangalore se Ujjain aayi thi apne parents ke saath, unhone Maheshwar dekhne ki wish rakhi thi. Fort aur ghat dono bahut peaceful lage. Car AC thi toh garmi me bhi comfortable raha. Booking process bhi WhatsApp pe hi ho gaya tha, bahut easy tha.",
  },
  {
    name: "Sandeep Rawat", initials: "SR", city: "Dehradun",
    package_name: "Ujjain to Omkareshwar Jyotirlinga Darshan", fleet_name: "Toyota Innova Crysta",
    travel_date: "2026-07-08",
    experience:
      "First time Madhya Pradesh aaya tha Jyotirlinga darshan ke liye. Omkareshwar trip bahut well organised thi, driver ne route ke baare me bhi bataya aur mandir ki history bhi share ki raaste me. Innova bahut comfortable thi lambi drive ke liye.",
  },
  {
    name: "Tasneem Sheikh", initials: "TS", city: "Bhopal",
    package_name: "Omkareshwar – Ujjain – Mandu – Maheshwar Circuit", fleet_name: "Force Traveller",
    travel_date: "2026-09-10",
    experience:
      "Humne apni 3 generation family trip ke liye yeh 3 din ka circuit liya tha, dadi se lekar bachchon tak sab the. Driver bahut saaf-suthra tareeke se gaadi maintain kar rahe the aur sabka khayal rakha, especially dadi ka jab chadhna-utarna hota tha. Mandu aur Maheshwar dono jagah time sahi tha, rush nahi tha kahin bhi.",
  },
];

async function run() {
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    const avatar = avatarDataUri(t.initials, i);

    const row = {
      name: t.name,
      city: t.city,
      location: t.city,
      email: null,
      phone: null,
      package_name: t.package_name,
      fleet_name: t.fleet_name,
      travel_date: t.travel_date,
      experience: t.experience,
      message: t.experience,
      rating: 5,
      overall_rating: 5,
      driver_rating: 5,
      vehicle_rating: 5,
      support_rating: 5,
      darshan_rating: 5,
      recommendation: "yes",
      profile_image_url: avatar,
      image_url: avatar,
      consent_to_publish: false,
      is_approved: false,
      status: "pending",
      admin_notes:
        "SEEDED PLACEHOLDER CONTENT — generated for UI/design preview only. Do NOT approve/publish as a real customer testimonial.",
    };

    const { error } = await supabase.from("testimonials").insert([row]);
    if (error) {
      console.error(`FAILED: ${t.name}`, error.message);
    } else {
      console.log(`INSERTED (pending, unpublished): ${t.name}`);
    }
  }
}

run().then(() => console.log("Done."));
