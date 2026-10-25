import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, 'cache');
const OUTPUT_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'gita_data.json');
const OUTPUT_REPORT_PATH = path.join(__dirname, '..', 'src', 'data', 'validation_report.json');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}
const outDataDir = path.dirname(OUTPUT_DATA_PATH);
if (!fs.existsSync(outDataDir)) {
  fs.mkdirSync(outDataDir, { recursive: true });
}

// Chapter verse counts (Standard Bhagavad Gita = 701 total verses in Vedic Scriptures edition)
export const CHAPTER_METADATA = [
  {
    chapter_number: 1,
    verses_count: 47,
    name: "अर्जुनविषादयोग",
    translation: "Arjuna Visada Yoga",
    meaning: { en: "Arjuna's Dilemma", hi: "अर्जुन का संशय और विषाद" },
    summary: {
      en: "On the sacred battlefield of Kurukshetra, observing revered teachers and beloved family ready to fight, mighty warrior Arjuna is overcome with profound sorrow and surrenders to Lord Krishna seeking guidance.",
      hi: "कुरुक्षेत्र के धर्मक्षेत्र में अपने पूज्य गुरुजनों और परिजनों को युद्ध के लिए तत्पर देखकर अर्जुन विषादग्रस्त हो जाते हैं और मार्गदर्शन हेतु भगवान श्रीकृष्ण की शरण लेते हैं।"
    }
  },
  {
    chapter_number: 2,
    verses_count: 72,
    name: "सांख्ययोग",
    translation: "Sankhya Yoga",
    meaning: { en: "Transcendental Knowledge", hi: "गीता का सार व कर्मयोग" },
    summary: {
      en: "Lord Krishna reveals the eternal, indestructible nature of the soul (Atman), the duty of selfless action (Nishkama Karma), and describes the serene mind of the Sthitaprajna (one of steady wisdom).",
      hi: "भगवान श्रीकृष्ण आत्मा की अमरता, निष्काम कर्मयोग का मार्ग और स्थिरप्रज्ञ महापुरुष के लक्षण उद्घाटित करते हैं।"
    }
  },
  {
    chapter_number: 3,
    verses_count: 43,
    name: "कर्मयोग",
    translation: "Karma Yoga",
    meaning: { en: "Path of Selfless Service", hi: "कर्म का पावन मार्ग" },
    summary: {
      en: "Action is inevitable for all embodied beings. Lord Krishna teaches that actions performed selflessly as an offering to the Divine free the mind from bondage, without attachment to personal fruits.",
      hi: "कर्म से कोई विमुख नहीं रह सकता। भगवान निष्काम भाव से लोकसंग्रह और ईश्वरार्पण बुद्धि से कर्तव्य पालन की प्रेरणा देते हैं।"
    }
  },
  {
    chapter_number: 4,
    verses_count: 42,
    name: "ज्ञानकर्मसंन्यासयोग",
    translation: "Jnana Karma Sanyasa Yoga",
    meaning: { en: "Wisdom in Action", hi: "ज्ञान, कर्म और संन्यास" },
    summary: {
      en: "The divine origin of sacred wisdom, the avatar doctrine, and how supreme spiritual knowledge burns away all impurities and karma like fire.",
      hi: "दिव्य ज्ञान की परंपरा, अवतार का रहस्य और ज्ञान रूपी अग्नि से समस्त कर्मबंधनों के भस्म होने का उपदेश।"
    }
  },
  {
    chapter_number: 5,
    verses_count: 29,
    name: "कर्मसंन्यासयोग",
    translation: "Karma Sanyasa Yoga",
    meaning: { en: "Action and Renunciation", hi: "संन्यास और कर्मयोग का समन्वय" },
    summary: {
      en: "Both external renunciation and selfless action lead to liberation, but Karma Yoga performed with an unattached heart is gentler and leads directly to enduring peace.",
      hi: "कर्मसंन्यास और कर्मयोग दोनों ही कल्याणकारी हैं, किंतु अनासक्त कर्मयोग सुगम और शांतिप्रद है।"
    }
  },
  {
    chapter_number: 6,
    verses_count: 47,
    name: "आत्मसंयमयोग",
    translation: "Dhyana / Atmasamyama Yoga",
    meaning: { en: "The Path of Meditation", hi: "ध्यान और आत्मसंयम" },
    summary: {
      en: "The practice of meditation, mastery of the restless mind, equanimity in pleasure and pain, and the assurance that no genuine spiritual seeker ever perishes.",
      hi: "मन को वश में करने की कला, ध्यान का यथार्थ अभ्यास और यह आश्वासन कि शुभ कर्म करने वाले का कभी पतन नहीं होता।"
    }
  },
  {
    chapter_number: 7,
    verses_count: 30,
    name: "ज्ञानविज्ञानयोग",
    translation: "Jnana Vijnana Yoga",
    meaning: { en: "Knowledge of Ultimate Reality", hi: "ज्ञान और विज्ञान का रहस्य" },
    summary: {
      en: "Krishna reveals His lower material nature and higher spiritual energy, the four kinds of seekers who turn to the Divine, and devotion to the Supreme Being.",
      hi: "प्रकृति के गूढ़ रहस्य, भगवान की परा और अपरा शक्तियां, तथा चार प्रकार के भक्तों का वर्णन।"
    }
  },
  {
    chapter_number: 8,
    verses_count: 28,
    name: "अक्षरब्रह्मयोग",
    translation: "Aksara Brahma Yoga",
    meaning: { en: "The Eternal Reality", hi: "अक्षर परब्रह्म का स्मरण" },
    summary: {
      en: "The significance of consciousness at the moment of departure, continuous remembrance of the Supreme, and the path that leads beyond the cycles of rebirth.",
      hi: "अंतिम समय में भगवत्स्मरण का महत्व, निरंतर साधना और पुनर्जन्म से परे परम पद की प्राप्ति।"
    }
  },
  {
    chapter_number: 9,
    verses_count: 34,
    name: "राजविद्याराजगुह्ययोग",
    translation: "Raja Vidya Raja Guhya Yoga",
    meaning: { en: "Sovereign Secret Wisdom", hi: "परम गोपनीय ज्ञान" },
    summary: {
      en: "The royal secret of universal divinity, divine protection for the devoted ('Yoga-kshema'), and the sacred truth that even a leaf, flower, or drop of water offered with love is accepted by God.",
      hi: "परम पावन राजविद्या, भक्तों के योग-क्षेम का वहन और प्रेमपूर्वक अर्पित पत्र-पुष्प-फल-जल की ईश्वरीय स्वीकृति।"
    }
  },
  {
    chapter_number: 10,
    verses_count: 42,
    name: "विभूतियोग",
    translation: "Vibhuti Yoga",
    meaning: { en: "Divine Opulence and Splendor", hi: "ईश्वर की अनंत विभूतियां" },
    summary: {
      en: "Lord Krishna enumerates His divine manifestations throughout creation—the radiant sun, the silence of sacred vows, the intelligence of the wise, and the soul in all hearts.",
      hi: "समस्त सृष्टि में भगवान के दिव्य ऐश्वर्य, विभूतियों और प्रत्येक प्राणी के हृदय में स्थित आत्मतत्व का दर्शन।"
    }
  },
  {
    chapter_number: 11,
    verses_count: 55,
    name: "विश्वरूपदर्शनयोग",
    translation: "Visvarupa Darsana Yoga",
    meaning: { en: "The Cosmic Vision", hi: "विराट विश्वरूप दर्शन" },
    summary: {
      en: "Bestowing divine sight upon Arjuna, Lord Krishna reveals His awe-inspiring Cosmic Form embracing all worlds, stars, time, destruction, and eternal splendor.",
      hi: "अर्जुन को दिव्य दृष्टि प्रदान कर भगवान का अपने अनंत, असीम और विस्मयकारी विश्वरूप का प्रकटीकरण।"
    }
  },
  {
    chapter_number: 12,
    verses_count: 20,
    name: "भक्तियोग",
    translation: "Bhakti Yoga",
    meaning: { en: "The Path of Devotion", hi: "भक्ति का अमृत मार्ग" },
    summary: {
      en: "The qualities of true devotion: freedom from malice, kindness to all creatures, equanimity in praise and blame, and complete surrender of heart and mind to God.",
      hi: "अनन्य प्रेम, द्वेषरहित समता, करुणा और भगवान के प्रिय भक्त के श्रेष्ठतम गुणों का अमृतोपम वर्णन।"
    }
  },
  {
    chapter_number: 13,
    verses_count: 35,
    name: "क्षेत्रक्षेत्रज्ञविभागयोग",
    translation: "Ksetra Ksetrajna Vibhaga Yoga",
    meaning: { en: "The Field and its Knower", hi: "शरीर (क्षेत्र) और आत्मा (क्षेत्रज्ञ)" },
    summary: {
      en: "Distinguishing the body (the field of experience) from the conscious observer (the soul and Supreme Soul within all bodies), leading to pure spiritual perception.",
      hi: "शरीर रूपी क्षेत्र और आत्मा रूपी क्षेत्रज्ञ का यथार्थ भेद, तथा ज्ञान के अनिवार्य सद्गुण।"
    }
  },
  {
    chapter_number: 14,
    verses_count: 27,
    name: "गुणत्रयविभागयोग",
    translation: "Gunatraya Vibhaga Yoga",
    meaning: { en: "The Three Modes of Nature", hi: "सत्व, रज और तम तीनों गुण" },
    summary: {
      en: "An analysis of the three primal qualities of nature—Sattva (harmony), Rajas (passion), and Tamas (inertia)—and how to transcend them into steady spiritual poise (Gunatita).",
      hi: "प्रकृति के तीन गुणों के प्रभाव और उनसे परे उठकर गुणातीत बनने की साधना।"
    }
  },
  {
    chapter_number: 15,
    verses_count: 20,
    name: "पुरुषोत्तमयोग",
    translation: "Purusottama Yoga",
    meaning: { en: "The Supreme Divine Person", hi: "परम पुरुषोत्तम तत्व" },
    summary: {
      en: "The cosmic inverted Ashvattha tree of material existence, the nature of consciousness moving through bodies, and the transcendent Supreme Being who upholds all creation.",
      hi: "संसार रूपी अश्वत्थ वृक्ष का छेदन और क्षर-अक्षर से परे परम पुरुषोत्तम की महिमा।"
    }
  },
  {
    chapter_number: 16,
    verses_count: 24,
    name: "दैवासुरसम्पद्विभागयोग",
    translation: "Daivasura Sampad Vibhaga Yoga",
    meaning: { en: "Divine and Demonic Natures", hi: "दैवी और आसुरी संपदा" },
    summary: {
      en: "A clear contrast between uplifting divine virtues (fearlessness, compassion, generosity, truth) and destructive traits (arrogance, greed, wrath) with scripture as life's compass.",
      hi: "अभय, दया और सत्य आदि दैवी गुणों तथा दंभ, क्रोध और लोभ रूपी आसुरी विकारों का स्पष्ट अंतर।"
    }
  },
  {
    chapter_number: 17,
    verses_count: 28,
    name: "श्रद्धात्रयविभागयोग",
    translation: "Sraddhatraya Vibhaga Yoga",
    meaning: { en: "The Threefold Faith", hi: "श्रद्धा, आहार और तप के तीन रूप" },
    summary: {
      en: "Faith, food preferences, charity, and austerity examined through the three qualities of nature, culminating in the sacred triple designation: Om Tat Sat.",
      hi: "मनुष्य की श्रद्धा, आहार, यज्ञ और दान का त्रिविध स्वरूप, तथा 'ॐ तत् सत्' का पावन महामंत्र।"
    }
  },
  {
    chapter_number: 18,
    verses_count: 78,
    name: "मोक्षसंन्यासयोग",
    translation: "Moksa Sanyasa Yoga",
    meaning: { en: "Liberation through Surrender", hi: "मोक्ष और शरणागति का परम रहस्य" },
    summary: {
      en: "The ultimate synthesis of duty, wisdom, and surrender. Lord Krishna delivers His crowning promise: 'Surrender all duties to Me alone; I shall liberate you from all sorrow. Grieve not.'",
      hi: "समस्त गीता का सार: सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। संपूर्ण समर्पण और परम अभय का ईश्वरीय वचन।"
    }
  }
];

function cleanText(txt) {
  if (!txt) return '';
  return txt.replace(/\r\n/g, '\n').trim();
}

function isValid(txt) {
  if (!txt) return false;
  const lower = txt.toLowerCase();
  if (lower.includes('did not comment')) return false;
  return txt.trim().length > 3;
}

const COUPLET_HINDI = {
  "12:3": "परन्तु जो मनुष्य अनिर्देश्य, अव्यक्त, सर्वव्यापी, अचिन्त्य, कूटस्थ, अचल और ध्रुव अक्षर ब्रह्म की उपासना करते हैं—",
  "12:18": "जो शत्रु और मित्र में तथा मान और अपमान में सम है, सर्दी-गर्मी और सुख-दुःख में सम है तथा आसक्ति से रहित है—"
};

const COUPLET_ENGLISH = {
  "12:3": "Yet those who worship the Imperishable, the Indefinable, the Unmanifest, the Omnipresent, the Inconceivable, the Immutable, the Immovable, and the Eternal—",
  "12:18": "He who is the same toward friend and foe, in honor and dishonor, who is indifferent to heat and cold, pleasure and pain, and free from all attachments—"
};

function cleanHindiTranslation(verseObj, key) {
  if (COUPLET_HINDI[key]) return COUPLET_HINDI[key];

  const candidates = [
    verseObj?.tej?.ht,
    verseObj?.rams?.ht,
    verseObj?.chinmay?.hc
  ];

  for (const c of candidates) {
    if (isValid(c)) {
      let clean = c.replace(/^।।\d+[\.\-]\d+।।\s*/, '').trim();
      clean = clean.replace(/\(टिप्पणी[^\)]*\)/g, '').trim();
      if (isValid(clean)) return clean;
    }
  }
  return '';
}

function cleanEnglishTranslation(verseObj, key) {
  if (COUPLET_ENGLISH[key]) return COUPLET_ENGLISH[key];

  const candidates = [
    verseObj?.purohit?.et,
    verseObj?.siva?.et,
    verseObj?.adi?.et,
    verseObj?.gambir?.et,
    verseObj?.san?.et,
    verseObj?.prabhu?.et
  ];

  for (const c of candidates) {
    if (isValid(c)) {
      let clean = c.replace(/^\d+[\.\-]\d+\s*/, '').trim();
      if (isValid(clean)) return clean;
    }
  }
  return '';
}

async function fetchVerseWithRetry(ch, v, retries = 3) {
  const cacheFile = path.join(CACHE_DIR, `${ch}_${v}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      return data;
    } catch (e) {
      // corrupt cache, refetch
    }
  }

  const url = `https://vedicscriptures.github.io/slok/${ch}/${v}/`;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const json = await res.json();
        fs.writeFileSync(cacheFile, JSON.stringify(json, null, 2), 'utf8');
        return json;
      }
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw new Error(`Failed to fetch chapter ${ch} verse ${v}`);
}

async function runPipeline() {
  console.log('--- Gita Sadhana Scripture Import Pipeline ---');
  const allChapters = [];
  const report = {
    generatedAt: new Date().toISOString(),
    totalChapters: CHAPTER_METADATA.length,
    expectedVerses: 701,
    importedVerses: 0,
    missingVerses: [],
    misalignedTranslations: [],
    sources: {
      sanskrit: "Bhagavad Gita Traditional Devanagari Recension",
      hindi: "Swami Tejomayananda / Swami Ramsukhdas (Central Chinmaya Mission Trust & Gita Press)",
      english: "Shri Purohit Swami (1935) & Swami Sivananda (Divine Life Society)",
      license: "Public Domain / Cultural Heritage Educational Fair Use"
    },
    chapters: []
  };

  // Build task list
  const tasks = [];
  for (const chMeta of CHAPTER_METADATA) {
    for (let v = 1; v <= chMeta.verses_count; v++) {
      tasks.push({ ch: chMeta.chapter_number, v });
    }
  }

  console.log(`Ingesting ${tasks.length} verses across ${CHAPTER_METADATA.length} chapters...`);

  // Concurrency pool of 15
  const CONCURRENCY = 15;
  const resultsMap = new Map();
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const current = tasks[index++];
      try {
        const raw = await fetchVerseWithRetry(current.ch, current.v);
        resultsMap.set(`${current.ch}:${current.v}`, raw);
      } catch (e) {
        console.error(`Error fetching ${current.ch}:${current.v}:`, e.message);
        report.missingVerses.push(`${current.ch}:${current.v}`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  // Assemble and validate
  let totalVersesImported = 0;

  for (const chMeta of CHAPTER_METADATA) {
    const chapterVerses = [];
    for (let v = 1; v <= chMeta.verses_count; v++) {
      const key = `${chMeta.chapter_number}:${v}`;
      const raw = resultsMap.get(key);
      if (!raw) {
        continue;
      }

      const sanskrit = cleanText(raw.slok);
      const transliteration = cleanText(raw.transliteration);
      const hindi = cleanHindiTranslation(raw, key);
      const english = cleanEnglishTranslation(raw, key);

      if (!sanskrit) {
        report.misalignedTranslations.push({ key, issue: "Missing Sanskrit" });
      }
      if (!hindi) {
        report.misalignedTranslations.push({ key, issue: "Missing Hindi" });
      }
      if (!english) {
        report.misalignedTranslations.push({ key, issue: "Missing English" });
      }

      chapterVerses.push({
        id: `${chMeta.chapter_number}:${v}`,
        chapter: chMeta.chapter_number,
        verse: v,
        sanskrit: sanskrit,
        transliteration: transliteration,
        hindi: hindi,
        english: english,
        wordMeaning: raw?.siva?.ec ? cleanText(raw.siva.ec) : undefined
      });
      totalVersesImported++;
    }

    allChapters.push({
      chapter_number: chMeta.chapter_number,
      name: chMeta.name,
      translation: chMeta.translation,
      meaning: chMeta.meaning,
      summary: chMeta.summary,
      verses_count: chMeta.verses_count,
      verses: chapterVerses
    });

    report.chapters.push({
      chapter_number: chMeta.chapter_number,
      title: chMeta.translation,
      sanskrit_title: chMeta.name,
      expected: chMeta.verses_count,
      imported: chapterVerses.length,
      complete: chapterVerses.length === chMeta.verses_count
    });
  }

  report.importedVerses = totalVersesImported;

  const dataset = {
    title: "Srimad Bhagavad Gita",
    version: "1.0.0",
    languages: ["Sanskrit", "Hindi", "English"],
    total_chapters: allChapters.length,
    total_verses: totalVersesImported,
    attribution: report.sources,
    chapters: allChapters
  };

  fs.writeFileSync(OUTPUT_DATA_PATH, JSON.stringify(dataset, null, 2), 'utf8');
  fs.writeFileSync(OUTPUT_REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');

  console.log(`Successfully compiled Gita Sadhana Scripture Dataset!`);
  console.log(`- Verses: ${totalVersesImported} / ${report.expectedVerses}`);
  console.log(`- Chapters: ${allChapters.length}`);
  console.log(`- Output data: ${OUTPUT_DATA_PATH}`);
  console.log(`- Validation report: ${OUTPUT_REPORT_PATH}`);
}

runPipeline().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
