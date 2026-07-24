import {
  TURKISH_DISTRICTS_BY_PROVINCE,
  TURKISH_PROVINCES,
} from "@donusum-kapisi/shared";

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("tr-TR");
}

function keyOf(province: string, district: string): string {
  return `${normalize(province)}|${normalize(district)}`;
}

/**
 * Mid-market demolish+rebuild contractor cost TRY/m² by province (2025–2026).
 * Every TURKISH_PROVINCES entry is listed explicitly.
 */
export const PROVINCE_BASE: Record<string, number> = {
  Adana: 36_000,
  Adıyaman: 29_000,
  Afyonkarahisar: 31_000,
  Ağrı: 27_000,
  Aksaray: 30_000,
  Amasya: 31_000,
  Ankara: 46_000,
  Antalya: 43_000,
  Ardahan: 27_000,
  Artvin: 30_000,
  Aydın: 38_000,
  Balıkesir: 36_000,
  Bartın: 31_000,
  Batman: 29_000,
  Bayburt: 27_000,
  Bilecik: 32_000,
  Bingöl: 27_000,
  Bitlis: 27_000,
  Bolu: 34_000,
  Burdur: 30_000,
  Bursa: 42_000,
  Çanakkale: 38_000,
  Çankırı: 29_000,
  Çorum: 31_000,
  Denizli: 36_000,
  Diyarbakır: 33_000,
  Düzce: 34_000,
  Edirne: 33_000,
  Elazığ: 31_000,
  Erzincan: 29_000,
  Erzurum: 30_000,
  Eskişehir: 38_000,
  Gaziantep: 37_000,
  Giresun: 32_000,
  Gümüşhane: 27_000,
  Hakkari: 27_000,
  Hatay: 35_000,
  Iğdır: 27_000,
  Isparta: 31_000,
  İstanbul: 58_000,
  İzmir: 47_000,
  Kahramanmaraş: 33_000,
  Karabük: 32_000,
  Karaman: 30_000,
  Kars: 27_000,
  Kastamonu: 30_000,
  Kayseri: 35_000,
  Kırıkkale: 31_000,
  Kırklareli: 33_000,
  Kırşehir: 30_000,
  Kilis: 29_000,
  Kocaeli: 44_000,
  Konya: 35_000,
  Kütahya: 31_000,
  Malatya: 32_000,
  Manisa: 35_000,
  Mardin: 31_000,
  Mersin: 37_000,
  Muğla: 46_000,
  Muş: 27_000,
  Nevşehir: 32_000,
  Niğde: 30_000,
  Ordu: 33_000,
  Osmaniye: 31_000,
  Rize: 34_000,
  Sakarya: 40_000,
  Samsun: 35_000,
  Siirt: 28_000,
  Sinop: 31_000,
  Sivas: 30_000,
  Şanlıurfa: 32_000,
  Şırnak: 28_000,
  Tekirdağ: 41_000,
  Tokat: 30_000,
  Trabzon: 34_000,
  Tunceli: 28_000,
  Uşak: 31_000,
  Van: 30_000,
  Yalova: 40_000,
  Yozgat: 29_000,
  Zonguldak: 33_000,
};

const FALLBACK_PROVINCE_BASE = 30_000;

/** Typical metropolitan / provincial-center district names → mild uplift. */
const CENTER_DISTRICT_NAMES = new Set(
  [
    "Merkez",
    "Odunpazarı",
    "Tepebaşı",
    "Selçuklu",
    "Meram",
    "Karatay",
    "İlkadım",
    "Ortahisar",
    "Artuklu",
    "Haliliye",
    "Onikişubat",
    "Battalgazi",
    "Yunusemre",
    "Şehzadeler",
    "Efeler",
    "Altıeylül",
    "Karesi",
    "Merkezefendi",
    "Pamukkale",
    "Süleymanpaşa",
    "İzmit",
    "Adapazarı",
    "Melikgazi",
    "Kocasinan",
    "Şahinbey",
    "Şehitkamil",
    "Bağlar",
    "Yenişehir",
    "Kayapınar",
    "Sur",
    "Eyyübiye",
    "Karaköprü",
    "Dulkadiroğlu",
    "Antakya",
    "Defne",
    "Akdeniz",
    "Toroslar",
    "Mezitli",
    "Seyhan",
    "Çukurova",
    "Yüreğir",
    "Sarıçam",
    "Canik",
    "Atakum",
    "Altınordu",
    "İpekyolu",
    "Tuşba",
    "Menteşe",
  ].map((d) => normalize(d))
);

type TierEntry = { province: string; district: string; multiplier: number };

/**
 * Curated district multipliers for major urban / coastal markets.
 * Ultra ~1.32–1.40, high ~1.15–1.22, mid ~1.05–1.10, low ~0.88–0.95.
 */
const CURATED_TIERS: TierEntry[] = [
  // ——— İstanbul (all 39) ———
  { province: "İstanbul", district: "Beşiktaş", multiplier: 1.38 },
  { province: "İstanbul", district: "Sarıyer", multiplier: 1.36 },
  { province: "İstanbul", district: "Kadıköy", multiplier: 1.35 },
  { province: "İstanbul", district: "Bakırköy", multiplier: 1.32 },
  { province: "İstanbul", district: "Adalar", multiplier: 1.34 },
  { province: "İstanbul", district: "Şişli", multiplier: 1.28 },
  { province: "İstanbul", district: "Beyoğlu", multiplier: 1.26 },
  { province: "İstanbul", district: "Üsküdar", multiplier: 1.24 },
  { province: "İstanbul", district: "Ataşehir", multiplier: 1.22 },
  { province: "İstanbul", district: "Beykoz", multiplier: 1.22 },
  { province: "İstanbul", district: "Maltepe", multiplier: 1.18 },
  { province: "İstanbul", district: "Fatih", multiplier: 1.18 },
  { province: "İstanbul", district: "Zeytinburnu", multiplier: 1.16 },
  { province: "İstanbul", district: "Başakşehir", multiplier: 1.16 },
  { province: "İstanbul", district: "Kağıthane", multiplier: 1.15 },
  { province: "İstanbul", district: "Eyüp", multiplier: 1.14 },
  { province: "İstanbul", district: "Beylikdüzü", multiplier: 1.14 },
  { province: "İstanbul", district: "Kartal", multiplier: 1.12 },
  { province: "İstanbul", district: "Ümraniye", multiplier: 1.1 },
  { province: "İstanbul", district: "Pendik", multiplier: 1.08 },
  { province: "İstanbul", district: "Tuzla", multiplier: 1.08 },
  { province: "İstanbul", district: "Bahçelievler", multiplier: 1.08 },
  { province: "İstanbul", district: "Avcılar", multiplier: 1.06 },
  { province: "İstanbul", district: "Küçükçekmece", multiplier: 1.06 },
  { province: "İstanbul", district: "Bayrampaşa", multiplier: 1.05 },
  { province: "İstanbul", district: "Güngören", multiplier: 1.05 },
  { province: "İstanbul", district: "Bağcılar", multiplier: 1.04 },
  { province: "İstanbul", district: "Gaziosmanpaşa", multiplier: 1.04 },
  { province: "İstanbul", district: "Esenler", multiplier: 1.02 },
  { province: "İstanbul", district: "Sancaktepe", multiplier: 1.02 },
  { province: "İstanbul", district: "Çekmeköy", multiplier: 1.02 },
  { province: "İstanbul", district: "Büyükçekmece", multiplier: 1.0 },
  { province: "İstanbul", district: "Esenyurt", multiplier: 0.98 },
  { province: "İstanbul", district: "Sultangazi", multiplier: 0.97 },
  { province: "İstanbul", district: "Sultanbeyli", multiplier: 0.96 },
  { province: "İstanbul", district: "Arnavutköy", multiplier: 0.94 },
  { province: "İstanbul", district: "Şile", multiplier: 0.92 },
  { province: "İstanbul", district: "Silivri", multiplier: 0.9 },
  { province: "İstanbul", district: "Çatalca", multiplier: 0.88 },

  // ——— Ankara ———
  { province: "Ankara", district: "Çankaya", multiplier: 1.28 },
  { province: "Ankara", district: "Yenimahalle", multiplier: 1.14 },
  { province: "Ankara", district: "Keçiören", multiplier: 1.1 },
  { province: "Ankara", district: "Etimesgut", multiplier: 1.12 },
  { province: "Ankara", district: "Mamak", multiplier: 1.04 },
  { province: "Ankara", district: "Altındağ", multiplier: 1.06 },
  { province: "Ankara", district: "Sincan", multiplier: 1.02 },
  { province: "Ankara", district: "Pursaklar", multiplier: 1.0 },
  { province: "Ankara", district: "Gölbaşı", multiplier: 1.08 },
  { province: "Ankara", district: "Çubuk", multiplier: 0.95 },
  { province: "Ankara", district: "Polatlı", multiplier: 0.94 },
  { province: "Ankara", district: "Kahramankazan", multiplier: 0.96 },
  { province: "Ankara", district: "Akyurt", multiplier: 0.94 },
  { province: "Ankara", district: "Elmadağ", multiplier: 0.93 },
  { province: "Ankara", district: "Beypazarı", multiplier: 0.92 },
  { province: "Ankara", district: "Haymana", multiplier: 0.9 },
  { province: "Ankara", district: "Şereflikoçhisar", multiplier: 0.9 },
  { province: "Ankara", district: "Nallıhan", multiplier: 0.9 },
  { province: "Ankara", district: "Kızılcahamam", multiplier: 0.94 },
  { province: "Ankara", district: "Kalecik", multiplier: 0.9 },
  { province: "Ankara", district: "Ayaş", multiplier: 0.91 },
  { province: "Ankara", district: "Bala", multiplier: 0.9 },
  { province: "Ankara", district: "Çamlıdere", multiplier: 0.9 },
  { province: "Ankara", district: "Güdül", multiplier: 0.9 },
  { province: "Ankara", district: "Evren", multiplier: 0.88 },

  // ——— İzmir ———
  { province: "İzmir", district: "Karşıyaka", multiplier: 1.26 },
  { province: "İzmir", district: "Konak", multiplier: 1.22 },
  { province: "İzmir", district: "Bornova", multiplier: 1.18 },
  { province: "İzmir", district: "Çeşme", multiplier: 1.32 },
  { province: "İzmir", district: "Urla", multiplier: 1.24 },
  { province: "İzmir", district: "Güzelbahçe", multiplier: 1.2 },
  { province: "İzmir", district: "Narlıdere", multiplier: 1.18 },
  { province: "İzmir", district: "Balçova", multiplier: 1.16 },
  { province: "İzmir", district: "Bayraklı", multiplier: 1.1 },
  { province: "İzmir", district: "Buca", multiplier: 1.06 },
  { province: "İzmir", district: "Gaziemir", multiplier: 1.08 },
  { province: "İzmir", district: "Karabağlar", multiplier: 1.04 },
  { province: "İzmir", district: "Çiğli", multiplier: 1.04 },
  { province: "İzmir", district: "Seferihisar", multiplier: 1.12 },
  { province: "İzmir", district: "Foça", multiplier: 1.14 },
  { province: "İzmir", district: "Dikili", multiplier: 1.06 },
  { province: "İzmir", district: "Menderes", multiplier: 1.02 },
  { province: "İzmir", district: "Menemen", multiplier: 1.0 },
  { province: "İzmir", district: "Torbalı", multiplier: 0.98 },
  { province: "İzmir", district: "Kemalpaşa", multiplier: 0.98 },
  { province: "İzmir", district: "Aliağa", multiplier: 0.98 },
  { province: "İzmir", district: "Selçuk", multiplier: 1.06 },
  { province: "İzmir", district: "Ödemiş", multiplier: 0.94 },
  { province: "İzmir", district: "Tire", multiplier: 0.94 },
  { province: "İzmir", district: "Bergama", multiplier: 0.95 },
  { province: "İzmir", district: "Bayındır", multiplier: 0.92 },
  { province: "İzmir", district: "Kiraz", multiplier: 0.9 },
  { province: "İzmir", district: "Kınık", multiplier: 0.9 },
  { province: "İzmir", district: "Beydağ", multiplier: 0.9 },
  { province: "İzmir", district: "Karaburun", multiplier: 1.1 },

  // ——— Antalya ———
  { province: "Antalya", district: "Konyaaltı", multiplier: 1.24 },
  { province: "Antalya", district: "Muratpaşa", multiplier: 1.2 },
  { province: "Antalya", district: "Kepez", multiplier: 1.06 },
  { province: "Antalya", district: "Alanya", multiplier: 1.16 },
  { province: "Antalya", district: "Kaş", multiplier: 1.22 },
  { province: "Antalya", district: "Kemer", multiplier: 1.18 },
  { province: "Antalya", district: "Manavgat", multiplier: 1.08 },
  { province: "Antalya", district: "Serik", multiplier: 1.02 },
  { province: "Antalya", district: "Aksu", multiplier: 1.0 },
  { province: "Antalya", district: "Döşemealtı", multiplier: 1.02 },
  { province: "Antalya", district: "Kumluca", multiplier: 0.98 },
  { province: "Antalya", district: "Finike", multiplier: 0.96 },
  { province: "Antalya", district: "Gazipaşa", multiplier: 0.98 },
  { province: "Antalya", district: "Demre", multiplier: 0.96 },
  { province: "Antalya", district: "Elmalı", multiplier: 0.92 },
  { province: "Antalya", district: "Korkuteli", multiplier: 0.92 },
  { province: "Antalya", district: "Akseki", multiplier: 0.9 },
  { province: "Antalya", district: "Gündoğmuş", multiplier: 0.9 },
  { province: "Antalya", district: "İbradı", multiplier: 0.9 },

  // ——— Bursa ———
  { province: "Bursa", district: "Nilüfer", multiplier: 1.22 },
  { province: "Bursa", district: "Osmangazi", multiplier: 1.14 },
  { province: "Bursa", district: "Yıldırım", multiplier: 1.06 },
  { province: "Bursa", district: "Mudanya", multiplier: 1.16 },
  { province: "Bursa", district: "Gemlik", multiplier: 1.08 },
  { province: "Bursa", district: "İnegöl", multiplier: 1.04 },
  { province: "Bursa", district: "Gürsu", multiplier: 1.02 },
  { province: "Bursa", district: "Kestel", multiplier: 1.0 },
  { province: "Bursa", district: "Orhangazi", multiplier: 0.98 },
  { province: "Bursa", district: "Mustafakemalpaşa", multiplier: 0.94 },
  { province: "Bursa", district: "Karacabey", multiplier: 0.94 },
  { province: "Bursa", district: "Yenişehir", multiplier: 0.94 },
  { province: "Bursa", district: "İznik", multiplier: 0.96 },
  { province: "Bursa", district: "Orhaneli", multiplier: 0.9 },
  { province: "Bursa", district: "Keles", multiplier: 0.9 },
  { province: "Bursa", district: "Harmancık", multiplier: 0.9 },
  { province: "Bursa", district: "Büyükorhan", multiplier: 0.88 },

  // ——— Muğla ———
  { province: "Muğla", district: "Bodrum", multiplier: 1.38 },
  { province: "Muğla", district: "Marmaris", multiplier: 1.28 },
  { province: "Muğla", district: "Fethiye", multiplier: 1.24 },
  { province: "Muğla", district: "Datça", multiplier: 1.22 },
  { province: "Muğla", district: "Menteşe", multiplier: 1.08 },
  { province: "Muğla", district: "Milas", multiplier: 1.06 },
  { province: "Muğla", district: "Ortaca", multiplier: 1.1 },
  { province: "Muğla", district: "Dalaman", multiplier: 1.04 },
  { province: "Muğla", district: "Köyceğiz", multiplier: 1.02 },
  { province: "Muğla", district: "Ula", multiplier: 1.0 },
  { province: "Muğla", district: "Seydikemer", multiplier: 0.98 },
  { province: "Muğla", district: "Yatağan", multiplier: 0.94 },
  { province: "Muğla", district: "Kavaklıdere", multiplier: 0.92 },

  // ——— Kocaeli ———
  { province: "Kocaeli", district: "İzmit", multiplier: 1.12 },
  { province: "Kocaeli", district: "Gebze", multiplier: 1.14 },
  { province: "Kocaeli", district: "Başiskele", multiplier: 1.1 },
  { province: "Kocaeli", district: "Kartepe", multiplier: 1.08 },
  { province: "Kocaeli", district: "Gölcük", multiplier: 1.06 },
  { province: "Kocaeli", district: "Darıca", multiplier: 1.08 },
  { province: "Kocaeli", district: "Çayırova", multiplier: 1.06 },
  { province: "Kocaeli", district: "Derince", multiplier: 1.04 },
  { province: "Kocaeli", district: "Körfez", multiplier: 1.02 },
  { province: "Kocaeli", district: "Karamürsel", multiplier: 1.0 },
  { province: "Kocaeli", district: "Dilovası", multiplier: 0.96 },
  { province: "Kocaeli", district: "Kandıra", multiplier: 0.92 },

  // ——— Tekirdağ ———
  { province: "Tekirdağ", district: "Süleymanpaşa", multiplier: 1.1 },
  { province: "Tekirdağ", district: "Çorlu", multiplier: 1.12 },
  { province: "Tekirdağ", district: "Çerkezköy", multiplier: 1.08 },
  { province: "Tekirdağ", district: "Kapaklı", multiplier: 1.04 },
  { province: "Tekirdağ", district: "Ergene", multiplier: 1.02 },
  { province: "Tekirdağ", district: "Marmaraereğlisi", multiplier: 1.06 },
  { province: "Tekirdağ", district: "Şarköy", multiplier: 1.04 },
  { province: "Tekirdağ", district: "Saray", multiplier: 0.96 },
  { province: "Tekirdağ", district: "Muratlı", multiplier: 0.96 },
  { province: "Tekirdağ", district: "Malkara", multiplier: 0.94 },
  { province: "Tekirdağ", district: "Hayrabolu", multiplier: 0.92 },

  // ——— Sakarya ———
  { province: "Sakarya", district: "Adapazarı", multiplier: 1.1 },
  { province: "Sakarya", district: "Serdivan", multiplier: 1.12 },
  { province: "Sakarya", district: "Erenler", multiplier: 1.06 },
  { province: "Sakarya", district: "Arifiye", multiplier: 1.04 },
  { province: "Sakarya", district: "Sapanca", multiplier: 1.16 },
  { province: "Sakarya", district: "Karasu", multiplier: 1.04 },
  { province: "Sakarya", district: "Hendek", multiplier: 0.98 },
  { province: "Sakarya", district: "Akyazı", multiplier: 0.96 },
  { province: "Sakarya", district: "Geyve", multiplier: 0.94 },
  { province: "Sakarya", district: "Pamukova", multiplier: 0.94 },
  { province: "Sakarya", district: "Ferizli", multiplier: 0.94 },
  { province: "Sakarya", district: "Kaynarca", multiplier: 0.94 },
  { province: "Sakarya", district: "Kocaali", multiplier: 0.96 },
  { province: "Sakarya", district: "Karapürçek", multiplier: 0.92 },
  { province: "Sakarya", district: "Söğütlü", multiplier: 0.92 },
  { province: "Sakarya", district: "Taraklı", multiplier: 0.9 },

  // ——— Yalova ———
  { province: "Yalova", district: "Merkez", multiplier: 1.1 },
  { province: "Yalova", district: "Çınarcık", multiplier: 1.12 },
  { province: "Yalova", district: "Çiftlikköy", multiplier: 1.06 },
  { province: "Yalova", district: "Armutlu", multiplier: 1.08 },
  { province: "Yalova", district: "Altınova", multiplier: 1.0 },
  { province: "Yalova", district: "Termal", multiplier: 1.04 },

  // ——— Aydın ———
  { province: "Aydın", district: "Efeler", multiplier: 1.08 },
  { province: "Aydın", district: "Kuşadası", multiplier: 1.22 },
  { province: "Aydın", district: "Didim", multiplier: 1.18 },
  { province: "Aydın", district: "Söke", multiplier: 1.02 },
  { province: "Aydın", district: "Nazilli", multiplier: 1.0 },
  { province: "Aydın", district: "İncirliova", multiplier: 0.98 },

  // ——— Balıkesir ———
  { province: "Balıkesir", district: "Altıeylül", multiplier: 1.06 },
  { province: "Balıkesir", district: "Karesi", multiplier: 1.06 },
  { province: "Balıkesir", district: "Edremit", multiplier: 1.12 },
  { province: "Balıkesir", district: "Ayvalık", multiplier: 1.16 },
  { province: "Balıkesir", district: "Bandırma", multiplier: 1.08 },
  { province: "Balıkesir", district: "Erdek", multiplier: 1.1 },
  { province: "Balıkesir", district: "Burhaniye", multiplier: 1.06 },
  { province: "Balıkesir", district: "Gönen", multiplier: 0.98 },

  // ——— Mersin ———
  { province: "Mersin", district: "Yenişehir", multiplier: 1.12 },
  { province: "Mersin", district: "Mezitli", multiplier: 1.1 },
  { province: "Mersin", district: "Akdeniz", multiplier: 1.06 },
  { province: "Mersin", district: "Toroslar", multiplier: 1.04 },
  { province: "Mersin", district: "Erdemli", multiplier: 1.06 },
  { province: "Mersin", district: "Tarsus", multiplier: 1.02 },
  { province: "Mersin", district: "Silifke", multiplier: 0.98 },
  { province: "Mersin", district: "Anamur", multiplier: 0.96 },

  // ——— Adana ———
  { province: "Adana", district: "Çukurova", multiplier: 1.14 },
  { province: "Adana", district: "Seyhan", multiplier: 1.1 },
  { province: "Adana", district: "Yüreğir", multiplier: 1.04 },
  { province: "Adana", district: "Sarıçam", multiplier: 1.06 },
  { province: "Adana", district: "Ceyhan", multiplier: 0.98 },
  { province: "Adana", district: "Kozan", multiplier: 0.96 },

  // ——— Gaziantep ———
  { province: "Gaziantep", district: "Şehitkamil", multiplier: 1.12 },
  { province: "Gaziantep", district: "Şahinbey", multiplier: 1.1 },
  { province: "Gaziantep", district: "Nizip", multiplier: 0.98 },
  { province: "Gaziantep", district: "Oğuzeli", multiplier: 0.96 },

  // ——— Konya ———
  { province: "Konya", district: "Selçuklu", multiplier: 1.12 },
  { province: "Konya", district: "Meram", multiplier: 1.1 },
  { province: "Konya", district: "Karatay", multiplier: 1.08 },
  { province: "Konya", district: "Ereğli", multiplier: 0.98 },
  { province: "Konya", district: "Akşehir", multiplier: 0.96 },
  { province: "Konya", district: "Beyşehir", multiplier: 0.98 },

  // ——— Eskişehir ———
  { province: "Eskişehir", district: "Tepebaşı", multiplier: 1.12 },
  { province: "Eskişehir", district: "Odunpazarı", multiplier: 1.1 },

  // ——— Kayseri ———
  { province: "Kayseri", district: "Melikgazi", multiplier: 1.1 },
  { province: "Kayseri", district: "Kocasinan", multiplier: 1.08 },
  { province: "Kayseri", district: "Talas", multiplier: 1.12 },
  { province: "Kayseri", district: "Hacılar", multiplier: 1.02 },
  { province: "Kayseri", district: "Develi", multiplier: 0.96 },

  // ——— Denizli ———
  { province: "Denizli", district: "Merkezefendi", multiplier: 1.1 },
  { province: "Denizli", district: "Pamukkale", multiplier: 1.08 },
  { province: "Denizli", district: "Honaz", multiplier: 0.98 },
  { province: "Denizli", district: "Çivril", multiplier: 0.94 },

  // ——— Manisa ———
  { province: "Manisa", district: "Yunusemre", multiplier: 1.08 },
  { province: "Manisa", district: "Şehzadeler", multiplier: 1.06 },
  { province: "Manisa", district: "Turgutlu", multiplier: 1.0 },
  { province: "Manisa", district: "Akhisar", multiplier: 0.98 },
  { province: "Manisa", district: "Salihli", multiplier: 0.98 },

  // ——— Hatay ———
  { province: "Hatay", district: "Antakya", multiplier: 1.08 },
  { province: "Hatay", district: "Defne", multiplier: 1.06 },
  { province: "Hatay", district: "İskenderun", multiplier: 1.1 },
  { province: "Hatay", district: "Arsuz", multiplier: 1.08 },
  { province: "Hatay", district: "Dörtyol", multiplier: 1.0 },
  { province: "Hatay", district: "Samandağ", multiplier: 0.98 },

  // ——— Samsun ———
  { province: "Samsun", district: "İlkadım", multiplier: 1.1 },
  { province: "Samsun", district: "Atakum", multiplier: 1.12 },
  { province: "Samsun", district: "Canik", multiplier: 1.04 },
  { province: "Samsun", district: "Tekkeköy", multiplier: 1.0 },
  { province: "Samsun", district: "Bafra", multiplier: 0.98 },
  { province: "Samsun", district: "Çarşamba", multiplier: 0.96 },

  // ——— Trabzon ———
  { province: "Trabzon", district: "Ortahisar", multiplier: 1.1 },
  { province: "Trabzon", district: "Akçaabat", multiplier: 1.04 },
  { province: "Trabzon", district: "Yomra", multiplier: 1.02 },
  { province: "Trabzon", district: "Of", multiplier: 0.96 },

  // ——— Diyarbakır ———
  { province: "Diyarbakır", district: "Bağlar", multiplier: 1.08 },
  { province: "Diyarbakır", district: "Kayapınar", multiplier: 1.1 },
  { province: "Diyarbakır", district: "Yenişehir", multiplier: 1.06 },
  { province: "Diyarbakır", district: "Sur", multiplier: 1.04 },
  { province: "Diyarbakır", district: "Ergani", multiplier: 0.96 },
  { province: "Diyarbakır", district: "Bismil", multiplier: 0.94 },

  // ——— Şanlıurfa ———
  { province: "Şanlıurfa", district: "Haliliye", multiplier: 1.08 },
  { province: "Şanlıurfa", district: "Eyyübiye", multiplier: 1.06 },
  { province: "Şanlıurfa", district: "Karaköprü", multiplier: 1.1 },
  { province: "Şanlıurfa", district: "Siverek", multiplier: 0.96 },
  { province: "Şanlıurfa", district: "Viranşehir", multiplier: 0.94 },

  // ——— Kahramanmaraş ———
  { province: "Kahramanmaraş", district: "Onikişubat", multiplier: 1.08 },
  { province: "Kahramanmaraş", district: "Dulkadiroğlu", multiplier: 1.06 },
  { province: "Kahramanmaraş", district: "Elbistan", multiplier: 0.98 },
  { province: "Kahramanmaraş", district: "Afşin", multiplier: 0.96 },

  // ——— Malatya ———
  { province: "Malatya", district: "Battalgazi", multiplier: 1.08 },
  { province: "Malatya", district: "Yeşilyurt", multiplier: 1.06 },

  // ——— Mardin ———
  { province: "Mardin", district: "Artuklu", multiplier: 1.1 },
  { province: "Mardin", district: "Midyat", multiplier: 1.04 },
  { province: "Mardin", district: "Kızıltepe", multiplier: 1.0 },
  { province: "Mardin", district: "Nusaybin", multiplier: 0.96 },

  // ——— Van ———
  { province: "Van", district: "İpekyolu", multiplier: 1.08 },
  { province: "Van", district: "Tuşba", multiplier: 1.04 },
  { province: "Van", district: "Edremit", multiplier: 1.06 },
  { province: "Van", district: "Erciş", multiplier: 0.96 },

  // ——— Ordu / Rize / Çanakkale coastal ———
  { province: "Ordu", district: "Altınordu", multiplier: 1.08 },
  { province: "Ordu", district: "Ünye", multiplier: 1.02 },
  { province: "Ordu", district: "Fatsa", multiplier: 1.0 },
  { province: "Rize", district: "Merkez", multiplier: 1.08 },
  { province: "Rize", district: "Çayeli", multiplier: 1.0 },
  { province: "Rize", district: "Ardeşen", multiplier: 0.98 },
  { province: "Çanakkale", district: "Merkez", multiplier: 1.1 },
  { province: "Çanakkale", district: "Ayvacık", multiplier: 1.14 },
  { province: "Çanakkale", district: "Bozcaada", multiplier: 1.28 },
  { province: "Çanakkale", district: "Gökçeada", multiplier: 1.16 },
  { province: "Çanakkale", district: "Gelibolu", multiplier: 1.04 },

  // ——— Erzurum ———
  { province: "Erzurum", district: "Yakutiye", multiplier: 1.08 },
  { province: "Erzurum", district: "Palandöken", multiplier: 1.1 },
  { province: "Erzurum", district: "Aziziye", multiplier: 1.04 },
];

/** Built at module load: curated overrides + heuristic for every district. */
const DISTRICT_MULTIPLIERS: Map<string, number> = (() => {
  const map = new Map<string, number>();

  for (const entry of CURATED_TIERS) {
    map.set(keyOf(entry.province, entry.district), entry.multiplier);
  }

  for (const province of TURKISH_PROVINCES) {
    const districts = TURKISH_DISTRICTS_BY_PROVINCE[province] ?? [];
    for (const district of districts) {
      const k = keyOf(province, district);
      if (map.has(k)) continue;
      if (CENTER_DISTRICT_NAMES.has(normalize(district)) || normalize(district) === "merkez") {
        map.set(k, 1.06);
      } else {
        map.set(k, 0.96);
      }
    }
  }

  return map;
})();

function provinceBase(province: string): number {
  const exact = PROVINCE_BASE[province];
  if (typeof exact === "number") return exact;

  const normalized = normalize(province);
  for (const [name, value] of Object.entries(PROVINCE_BASE)) {
    if (normalize(name) === normalized) return value;
  }
  return FALLBACK_PROVINCE_BASE;
}

function districtMultiplier(province: string, district: string): number {
  const k = keyOf(province, district);
  const curated = DISTRICT_MULTIPLIERS.get(k);
  if (typeof curated === "number") return curated;

  if (CENTER_DISTRICT_NAMES.has(normalize(district)) || normalize(district) === "merkez") {
    return 1.06;
  }
  return 0.96;
}

/** Mid-market demolish+rebuild contractor cost TRY/m² for province+district (2026). */
export function getRebuildCostPerSqm(province: string, district: string): number {
  return Math.round(provinceBase(province) * districtMultiplier(province, district));
}

/** Hard floor (~82% of mid) used to reject absurdly low AI outputs. */
export function getRebuildCostFloorPerSqm(province: string, district: string): number {
  return Math.round(getRebuildCostPerSqm(province, district) * 0.82);
}
