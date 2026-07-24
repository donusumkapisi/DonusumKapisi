import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Örnek ilan seti — kentsel dönüşüm için gerçekçi m² / yaş / fiyat bandı.
 * Fiyatlar toplam proje / müteahhit teklif bandı (TRY), daire satış fiyatı değil.
 */
const SAMPLE_LISTINGS = [
  {
    listingNumber: "701245893",
    title: "Kadıköy Fikirtepe'de 4 Katlı, 8 Daireli Apartman",
    description:
      "Fikirtepe dönüşüm aksına yakın, ana caddeye cepheli 8 bağımsız bölümlü apartman. Zemin etüdü mevcut; kat mülkiyeti tesisli. Toplam yaklaşık 640 m² oturum alanı.",
    province: "İstanbul",
    district: "Kadıköy",
    squareMeters: 640,
    buildingAge: 42,
    floorCount: 4,
    unitCount: 8,
    priceMin: 38_000_000,
    priceMax: 46_000_000,
    coverImageUrl: "/listings/kadikoy-eski-bina.jpg",
    photos: ["/listings/kadikoy-eski-bina.jpg", "/listings/bina-apartman.jpg"],
    latitude: 40.9925,
    longitude: 29.0587,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "712893456",
    title: "Beşiktaş Levazım'da 5 Katlı Köşe Bina",
    description:
      "Levazım'da köşe parsel, 5 kat / 10 daire. Deniz tarafına yakın, ulaşım kolay. Riskli yapı stokuna uygun dönüşüm adayı; tapu müstakil.",
    province: "İstanbul",
    district: "Beşiktaş",
    squareMeters: 980,
    buildingAge: 48,
    floorCount: 5,
    unitCount: 10,
    priceMin: 72_000_000,
    priceMax: 88_000_000,
    coverImageUrl: "/listings/bina-besiktas.jpg",
    photos: ["/listings/bina-besiktas.jpg", "/listings/bina-gokdelen.jpg"],
    latitude: 41.0654,
    longitude: 29.0142,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "723456781",
    title: "Üsküdar Altunizade'de 3 Katlı Bahçeli Bina",
    description:
      "Altunizade'de sakin sokakta, bahçeli 3 kat / 6 daire. Metro bus hattına yürüme mesafesi. Temel ve çatı bakım gerektiriyor; dönüşüm için ideal ölçek.",
    province: "İstanbul",
    district: "Üsküdar",
    squareMeters: 520,
    buildingAge: 39,
    floorCount: 3,
    unitCount: 6,
    priceMin: 34_000_000,
    priceMax: 41_000_000,
    coverImageUrl: "/listings/bina-uskudar.jpg",
    photos: ["/listings/bina-uskudar.jpg", "/listings/bina-villa.jpg"],
    latitude: 41.0218,
    longitude: 29.0416,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "734567892",
    title: "Şişli Bomonti'de 6 Katlı İşlek Cadde Üzeri",
    description:
      "Bomonti civarı, işlek caddeye bakan 6 kat / 12 dairelik apartman. Ticari zemin + konut üst katlar. Dönüşüm sonrası karma kullanım potansiyeli yüksek.",
    province: "İstanbul",
    district: "Şişli",
    squareMeters: 1100,
    buildingAge: 44,
    floorCount: 6,
    unitCount: 12,
    priceMin: 68_000_000,
    priceMax: 82_000_000,
    coverImageUrl: "/listings/bina-sisli.jpg",
    photos: ["/listings/bina-sisli.jpg", "/listings/bina-cephe.jpg"],
    latitude: 41.0602,
    longitude: 28.9847,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "745678903",
    title: "Maltepe Başıbüyük'te 4 Katlı Site İçi Bina",
    description:
      "Başıbüyük'te site düzeninde 4 kat / 8 daire. Otopark ve bahçe ortak alanı mevcut. Deprem yönetmeliği öncesi yapı; güçlendirme yerine dönüşüm tercih ediliyor.",
    province: "İstanbul",
    district: "Maltepe",
    squareMeters: 720,
    buildingAge: 36,
    floorCount: 4,
    unitCount: 8,
    priceMin: 28_000_000,
    priceMax: 34_000_000,
    coverImageUrl: "/listings/bina-maltepe.jpg",
    photos: ["/listings/bina-maltepe.jpg", "/listings/bina-konut.jpg"],
    latitude: 40.9456,
    longitude: 29.1554,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "756789014",
    title: "Kartal Yakacık'ta 5 Katlı Deniz Tarafı Apartman",
    description:
      "Yakacık'ta denize yakın konumda 5 kat / 10 daire. Marmaray ve metro erişimi güçlü. Mevcut daireler dolu; kat karşılığı görüşmeye açık.",
    province: "İstanbul",
    district: "Kartal",
    squareMeters: 880,
    buildingAge: 41,
    floorCount: 5,
    unitCount: 10,
    priceMin: 32_000_000,
    priceMax: 39_000_000,
    coverImageUrl: "/listings/bina-apartman.jpg",
    photos: ["/listings/bina-apartman.jpg", "/listings/bina-modern.jpg"],
    latitude: 40.8889,
    longitude: 29.1856,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "767890125",
    title: "Çankaya Kızılay Yakını 3 Katlı Müstakil Bina",
    description:
      "Kızılay'a yakın sakin sokakta, bahçeli 3 kat / 6 daireli müstakil tapulu bina. Metroya ~10 dk yürüme. Ankara dönüşüm projeleri için uygun ölçek.",
    province: "Ankara",
    district: "Çankaya",
    squareMeters: 420,
    buildingAge: 38,
    floorCount: 3,
    unitCount: 6,
    priceMin: 14_000_000,
    priceMax: 17_500_000,
    coverImageUrl: "/listings/ankara-yeni-bina.jpg",
    photos: ["/listings/ankara-yeni-bina.jpg", "/listings/bina-villa.jpg"],
    latitude: 39.9208,
    longitude: 32.8541,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "778901236",
    title: "Keçiören Etlik'te 4 Katlı, 8 Daireli Apartman",
    description:
      "Etlik'te yerleşik mahallede 4 kat / 8 daire. Okul ve sağlık tesislerine yakın. Yapı yaşı 40+; güçlendirme maliyeti yüksek, dönüşüm gündemde.",
    province: "Ankara",
    district: "Keçiören",
    squareMeters: 610,
    buildingAge: 43,
    floorCount: 4,
    unitCount: 8,
    priceMin: 12_500_000,
    priceMax: 15_500_000,
    coverImageUrl: "/listings/bina-cephe.jpg",
    photos: ["/listings/bina-cephe.jpg", "/listings/bina-konut.jpg"],
    latitude: 39.9786,
    longitude: 32.8625,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "789012347",
    title: "Konak Alsancak Yakını Deniz Manzaralı Apartman",
    description:
      "Alsancak'a yakın, kısmi deniz manzaralı 5 kat / 10 daire. Kat mülkiyeti tesisli, daireler dolu. İzmir kıyı bandında dönüşüm talebi yüksek bölge.",
    province: "İzmir",
    district: "Konak",
    squareMeters: 850,
    buildingAge: 45,
    floorCount: 5,
    unitCount: 10,
    priceMin: 26_000_000,
    priceMax: 32_000_000,
    coverImageUrl: "/listings/izmir-insaat.jpg",
    photos: ["/listings/izmir-insaat.jpg", "/listings/bina-gokdelen.jpg"],
    latitude: 38.4322,
    longitude: 27.1428,
    status: "APPROVED" as const,
  },
  {
    listingNumber: "790123458",
    title: "Karşıyaka Bostanlı'da 3 Katlı Sakin Sokak Binası",
    description:
      "Bostanlı'da sakin iç sokakta 3 kat / 6 daire. İskele ve çarşıya yakın. Bahçe kullanımı mevcut; aile mülkiyeti, ortak karar ile dönüşüme hazır.",
    province: "İzmir",
    district: "Karşıyaka",
    squareMeters: 480,
    buildingAge: 37,
    floorCount: 3,
    unitCount: 6,
    priceMin: 18_000_000,
    priceMax: 22_500_000,
    coverImageUrl: "/listings/bina-modern.jpg",
    photos: ["/listings/bina-modern.jpg", "/listings/bina-maltepe.jpg"],
    latitude: 38.4612,
    longitude: 27.0984,
    status: "APPROVED" as const,
  },
];

async function main() {
  const deletedOffers = await prisma.offer.deleteMany({});
  const deletedListings = await prisma.listing.deleteMany({});
  console.log(`Silindi: ${deletedListings.count} ilan, ${deletedOffers.count} teklif.`);

  const owner = await prisma.user.upsert({
    where: { email: "ornek.ilan@donusumkapisi.com" },
    update: { name: "Örnek İlan Sahibi", role: "HOMEOWNER" },
    create: {
      email: "ornek.ilan@donusumkapisi.com",
      name: "Örnek İlan Sahibi",
      role: "HOMEOWNER",
    },
  });

  for (const listing of SAMPLE_LISTINGS) {
    await prisma.listing.create({
      data: { ...listing, ownerId: owner.id },
    });
  }

  console.log(`Eklendi: ${SAMPLE_LISTINGS.length} onaylı örnek ilan.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
