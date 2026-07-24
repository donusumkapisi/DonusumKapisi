import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_LISTINGS = [
  {
    listingNumber: "705118234",
    title: "Kadıköy'de 4 Katlı, 8 Daireli Apartman",
    description:
      "Fikirtepe dönüşüm bölgesine yakın, ana caddeye cepheli, 8 bağımsız bölümlü apartman. Zemin etüdü mevcut.",
    province: "İstanbul",
    district: "Kadıköy",
    squareMeters: 640,
    buildingAge: 42,
    floorCount: 4,
    unitCount: 8,
    priceMin: 18_000_000,
    priceMax: 22_000_000,
    coverImageUrl: "/listings/kadikoy-eski-bina.jpg",
    status: "APPROVED" as const,
  },
  {
    listingNumber: "612847395",
    title: "Çankaya'da Bahçeli 3 Katlı Bina",
    description:
      "Sakin bir sokakta, bahçeli, 6 daireli müstakil tapulu bina. Metro hattına 10 dakika yürüme mesafesinde.",
    province: "Ankara",
    district: "Çankaya",
    squareMeters: 420,
    buildingAge: 38,
    floorCount: 3,
    unitCount: 6,
    priceMin: 9_500_000,
    priceMax: 11_500_000,
    coverImageUrl: "/listings/ankara-yeni-bina.jpg",
    status: "APPROVED" as const,
  },
  {
    listingNumber: "834092176",
    title: "Konak'ta Deniz Manzaralı 5 Katlı Apartman",
    description:
      "Alsancak'a yakın, deniz manzaralı, 10 daireli apartman. Kat mülkiyeti tesisli, tüm daireler dolu.",
    province: "İzmir",
    district: "Konak",
    squareMeters: 850,
    buildingAge: 45,
    floorCount: 5,
    unitCount: 10,
    priceMin: 24_000_000,
    priceMax: 28_000_000,
    coverImageUrl: "/listings/izmir-insaat.jpg",
    status: "APPROVED" as const,
  },
  {
    listingNumber: "491027658",
    title: "Osmangazi'de Sanayi Yakını 2 Katlı Bina",
    description:
      "Sanayi bölgesine yakın, 4 daireli, hisseli tapulu bina. Onay sürecinde.",
    province: "Bursa",
    district: "Osmangazi",
    squareMeters: 310,
    buildingAge: 35,
    floorCount: 2,
    unitCount: 4,
    priceMin: 5_200_000,
    priceMax: 6_400_000,
    status: "PENDING" as const,
  },
];

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "ornek.ilan@donusumkapisi.com" },
    update: {},
    create: {
      email: "ornek.ilan@donusumkapisi.com",
      name: "Örnek İlan Sahibi",
      role: "HOMEOWNER",
    },
  });

  for (const listing of SAMPLE_LISTINGS) {
    await prisma.listing.upsert({
      where: { listingNumber: listing.listingNumber },
      update: listing,
      create: { ...listing, ownerId: owner.id },
    });
  }

  console.log(`Seeded ${SAMPLE_LISTINGS.length} sample listings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
