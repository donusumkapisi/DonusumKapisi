import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "kadikoy-fikirtepe-kentsel-donusum-rehberi-2026",
    title: "Kadıköy Fikirtepe'de Kentsel Dönüşüm: Bina Sahipleri İçin 2026 Süreç Rehberi",
    excerpt:
      "Fikirtepe ve çevresinde binası riskli yapı kapsamına giren mülk sahipleri için başvurudan teslime kadar adım adım kentsel dönüşüm rehberi.",
    metaDescription:
      "Kadıköy Fikirtepe'de kentsel dönüşüm süreci nasıl işler? Riskli yapı tespiti, müteahhit seçimi ve hak sahipliği adımlarını 2026 güncel rehberiyle öğrenin.",
    category: "ilce-rehberleri",
    province: "İstanbul",
    district: "Kadıköy",
    tags: ["kadıköy", "fikirtepe", "riskli yapı", "istanbul kentsel dönüşüm"],
    body: `Kadıköy'ün Fikirtepe, Merdivenköy ve Eğitim mahalleleri, İstanbul'un en yoğun kentsel dönüşüm bölgeleri arasında yer alıyor. 1970-1980'ler arasında hızlı ve çoğu zaman denetimsiz inşa edilen apartmanların büyük bölümü, güncel deprem yönetmeliğinin gerisinde kalıyor. Bu rehberde Fikirtepe ve çevresinde bina sahibi olan okuyucularımız için sürecin tamamını adım adım anlatıyoruz.

## Fikirtepe'de kentsel dönüşümü öne çıkaran nedenler

Bölgedeki binaların büyük kısmı 40 yaşın üzerinde ve zemin etüdü olmadan inşa edilmiş. Ana ulaşım aksına ve Fikirtepe metro bağlantısına yakınlık, bölgeyi müteahhitler için de cazip kılıyor; bu da bina sahiplerine görece daha yüksek kat karşılığı oranları ve nakit teklif imkanı sağlıyor.

## Adım adım süreç

### 1. Riskli yapı tespiti

Süreç, Çevre, Şehircilik ve İklim Değişikliği Bakanlığı'nca lisanslandırılmış bir kuruluşa yaptırılan teknik incelemeyle başlar. Zemin ve taşıyıcı sistem raporu hazırlanır, sonuç tapu kütüğüne "riskli yapı" şerhi olarak işlenir.

### 2. Kat maliklerinin karar süreci

9 Kasım 2023 tarihli yönetmelik değişikliği sonrası, dönüşüm kararı için kat maliklerinin salt çoğunluğunun (2/3 değil, yarıdan bir fazlasının) onayı yeterli hale geldi. Bu değişiklik, Fikirtepe gibi çok sayıda hissedarlı binalarda süreci ciddi şekilde hızlandırdı.

### 3. Müteahhit tekliflerinin karşılaştırılması

Bölgede kat karşılığı oranları genellikle %35-45 aralığında değişiyor; tam değer arsa payına, yola cephesine ve imar durumuna göre belirleniyor. [Birden fazla doğrulanmış müteahhitten teklif almak](/blog/guvenilir-muteahhit-nasil-secilir-kentsel-donusum), hem hak sahibi payını hem de teslim süresini netleştirmek için kritik.

### 4. Sözleşme ve teminat

Noter onaylı kat karşılığı inşaat sözleşmesinde teslim tarihi, gecikme cezası, teminat mektubu ve geçici konut/kira yardımı maddelerinin açıkça yazılması gerekir.

### 5. Yıkım, inşaat ve teslim

Tahliye sonrası yıkım ruhsatı alınır, inşaat başlar. Ortalama teslim süresi bölgede 18-24 ay arasında değişiyor.

## Fikirtepe'de sık sorulan sorular

### Fikirtepe'de kentsel dönüşüm ne kadar sürer?

Riskli yapı tespitinden teslime kadar ortalama süre, hak sahibi sayısına ve belediye süreçlerine bağlı olarak 20-30 ay arasında değişiyor.

### Kira yardımı kim tarafından ödenir?

Devlet desteğinden yararlanan binalarda kira yardımı Bakanlık tarafından, bazı projelerde ise müteahhit tarafından karşılanabilir; bu detayın sözleşmede net olarak belirtilmesi gerekir.

### Tüm kat malikleri anlaşmazsa süreç durur mu?

Hayır. Salt çoğunluk kararı sonrası anlaşmayan hak sahiplerinin payı, Bakanlık tarafından açık artırmayla satılabilir.

Farklı şehirlerdeki süreçleri karşılaştırmak isterseniz [Ankara Çankaya](/blog/ankara-cankaya-kentsel-donusum-basvuru-rehberi) ve [İzmir Konak](/blog/izmir-konak-kentsel-donusum-riskli-yapi-rehberi) bölge rehberlerimize de göz atabilirsiniz.

Kadıköy ve Fikirtepe'de binanız için doğrulanmış müteahhitlerden teklif almak isterseniz, [DönüşümKapısı üzerinden ücretsiz ilan oluşturabilir](/ilan-ver), teklifleri güvenle karşılaştırabilirsiniz.`,
  },
  {
    slug: "ankara-cankaya-kentsel-donusum-basvuru-rehberi",
    title: "Ankara Çankaya'da Kentsel Dönüşüm Başvurusu Nasıl Yapılır? Adım Adım Rehber",
    excerpt:
      "Çankaya'da eski binası olan mülk sahipleri için riskli yapı başvurusu, belediye süreci ve müteahhit seçimini kapsayan detaylı yol haritası.",
    metaDescription:
      "Ankara Çankaya'da kentsel dönüşüm başvurusu nasıl yapılır, hangi belgeler gerekir? 2026 güncel süreç, maliyet ve müteahhit seçimi rehberi.",
    category: "ilce-rehberleri",
    province: "Ankara",
    district: "Çankaya",
    tags: ["çankaya", "ankara kentsel dönüşüm", "riskli yapı başvurusu"],
    body: `Ankara'nın en eski yerleşim bölgelerinden Çankaya'da, özellikle Bahçelievler, Emek ve Öveçler çevresinde 35 yaşın üzerindeki binaların sayısı hızla artıyor. İstanbul dışındaki büyükşehirlerde kentsel dönüşüm konusu genellikle göz ardı ediliyor, oysa Çankaya'da da süreç aynı mevzuata (6306 sayılı Kanun) tabi.

## Çankaya'da sürecin İstanbul'dan farkı

Ankara Büyükşehir Belediyesi ve ilgili il müdürlükleri, başvuruları genellikle daha az yoğunlukla değerlendirdiği için işlem süreleri kimi zaman İstanbul'a göre daha kısa sürebiliyor. Ancak bölgede uzman müteahhit sayısının azlığı, doğru firmayı bulmayı zorlaştırıyor.

## Başvuru için gerekli belgeler

- Tapu senedi veya tapu kayıt örneği
- Kimlik fotokopisi (tüm hissedarlar için)
- Yapı ruhsatı veya yapı kullanma izin belgesi (varsa)
- Bina fotoğrafları

## Adım adım süreç

### 1. Lisanslı kuruluşla zemin ve yapı incelemesi

Çankaya Kaymakamlığı'na bağlı yetkili birime veya lisanslı özel kuruluşlara başvurularak teknik rapor hazırlatılır.

### 2. Riskli yapı kararının tapuya işlenmesi

Rapor onaylandıktan sonra 10 iş günü içinde tapu kütüğüne işlenir ve tüm hissedarlara e-Devlet üzerinden bildirim yapılır.

### 3. Müteahhit araştırması ve teklif toplama

Çankaya'da kat karşılığı oranları imar durumuna göre %30-40 arasında değişiyor. [Referanslı, tamamlanmış proje geçmişi olan müteahhitlerle görüşmek](/blog/guvenilir-muteahhit-nasil-secilir-kentsel-donusum) büyük önem taşıyor.

### 4. Sözleşme imzalama ve tahliye

Sözleşmede teslim tarihi, kira yardımı ve cezai şart maddeleri mutlaka yazılı olmalı.

## Sık sorulan sorular

### Çankaya'da kentsel dönüşümde devlet desteği var mı?

Riskli yapı sahipleri, kira yardımı ve faizsiz kredi desteğinden Bakanlık'ın belirlediği koşullarla yararlanabiliyor; başvuru il müdürlüğü üzerinden yapılıyor.

### Bina tek malikliyse süreç daha mı hızlı işler?

Evet, tek malikli binalarda kat malikleri kurulu kararı gerekmediği için süreç genellikle 3-6 ay daha kısa sürüyor.

İstanbul veya İzmir'de de binanız varsa [Kadıköy Fikirtepe](/blog/kadikoy-fikirtepe-kentsel-donusum-rehberi-2026) ve [İzmir Konak](/blog/izmir-konak-kentsel-donusum-riskli-yapi-rehberi) rehberlerimiz de işinize yarayabilir.

Çankaya'da binanız için güvenilir, doğrulanmış müteahhitlerden teklif almak istiyorsanız [DönüşümKapısı'nda ücretsiz ilan vererek](/ilan-ver) süreci başlatabilirsiniz.`,
  },
  {
    slug: "izmir-konak-kentsel-donusum-riskli-yapi-rehberi",
    title: "İzmir Konak'ta Kentsel Dönüşüm: Riskli Yapı Tespitinden Teslime Tüm Süreç",
    excerpt:
      "Konak ve Alsancak çevresinde deniz manzaralı eski binalarda kentsel dönüşüm süreci, maliyetler ve müteahhit seçimi hakkında kapsamlı rehber.",
    metaDescription:
      "İzmir Konak'ta kentsel dönüşüm süreci nasıl işler? Riskli yapı tespiti, kat karşılığı oranları ve müteahhit seçimiyle ilgili 2026 rehberi.",
    category: "ilce-rehberleri",
    province: "İzmir",
    district: "Konak",
    tags: ["konak", "izmir kentsel dönüşüm", "alsancak"],
    body: `6 Şubat depremlerinin ardından İzmir'de de kentsel dönüşüm talebi hızla arttı. Özellikle Konak'ın Alsancak, Güzelyalı ve Karataş mahallelerinde, deniz manzaralı ama yapısal olarak riskli çok sayıda apartman bulunuyor.

## Konak'ta binaların risk profili

Bölgedeki binaların çoğu 1999 öncesi yönetmeliğe göre inşa edildi ve zemin etüdü bulunmuyor. 2020 İzmir depreminde bazı binalarda oluşan hasar, bölge sakinlerinin dönüşüm konusundaki farkındalığını artırdı.

## Süreç nasıl işler?

### 1. Zemin ve yapı incelemesi

Lisanslı bir kuruluş binanın taşıyıcı sistemini ve zemin yapısını inceler, riskli yapı raporunu hazırlar.

### 2. Tapuya şerh ve bildirim

Rapor onaylandıktan sonra tapuya işlenir, tüm hissedarlara resmi bildirim yapılır.

### 3. Kat maliklerinin anlaşması

Salt çoğunluk kararıyla dönüşüm süreci başlatılabilir; anlaşmayan hissedarların payı ihaleyle devredilebilir.

### 4. Müteahhit seçimi ve kat karşılığı oranı

Konak'ta deniz manzaralı parsellerde kat karşılığı oranları, konumun değerine bağlı olarak %40'a kadar çıkabiliyor. Manzara ve konum primi, teklif karşılaştırmasında en belirleyici faktör; [teklifleri karşılaştırırken nelere dikkat etmeniz gerektiğini rehberimizden okuyabilirsiniz](/blog/guvenilir-muteahhit-nasil-secilir-kentsel-donusum).

### 5. İnşaat ve teslim

Yıkım ruhsatı sonrası inşaat başlar; bölgede ortalama teslim süresi 20-26 ay arasında.

## Sık sorulan sorular

### Deniz manzaralı binalarda kat karşılığı oranı neden daha yüksek?

Manzara ve merkezi konum, dairelerin satış değerini artırdığı için müteahhitler bu parsellerde bina sahiplerine daha yüksek oran veya ek daire teklif edebiliyor.

### İzmir'de kira yardımı başvurusu nereden yapılır?

Çevre, Şehircilik ve İklim Değişikliği İl Müdürlüğü üzerinden, riskli yapı kararı tapuya işlendikten sonra başvuru yapılabiliyor.

Riskli yapı tespitinin hukuki çerçevesini ve itiraz hakkını [6306 sayılı Kanun rehberimizde](/blog/riskli-yapi-tespiti-nasil-yapilir-6306-sayili-kanun) detaylı bulabilirsiniz; İstanbul veya Ankara'da binası olan okuyucularımız [Kadıköy](/blog/kadikoy-fikirtepe-kentsel-donusum-rehberi-2026) ve [Çankaya](/blog/ankara-cankaya-kentsel-donusum-basvuru-rehberi) rehberlerine göz atabilir.

Konak'ta binanız için doğrulanmış müteahhitlerden teklif toplamak isterseniz [DönüşümKapısı üzerinden ücretsiz ilan oluşturabilirsiniz](/ilan-ver).`,
  },
  {
    slug: "riskli-yapi-tespiti-nasil-yapilir-6306-sayili-kanun",
    title: "Riskli Yapı Tespiti Nasıl Yapılır? 6306 Sayılı Kanun Kapsamında 2026 Süreci",
    excerpt:
      "6306 sayılı Kanun kapsamında riskli yapı tespiti kimler tarafından yapılır, hangi belgeler gerekir ve itiraz hakkı nasıl kullanılır?",
    metaDescription:
      "Riskli yapı tespiti nasıl yapılır, kimler başvurabilir, itiraz süreci nasıl işler? 6306 sayılı Kanun kapsamında adım adım 2026 rehberi.",
    category: "surec-ve-mevzuat",
    tags: ["6306 sayılı kanun", "riskli yapı tespiti", "kentsel dönüşüm mevzuatı"],
    body: `"Afet Riski Altındaki Alanların Dönüştürülmesi Hakkında Kanun" olarak bilinen 6306 sayılı Kanun, Türkiye'deki kentsel dönüşümün temel yasal çerçevesini oluşturuyor. Bu yazıda, riskli yapı tespitinin nasıl yapıldığını, kimlerin başvurabileceğini ve itiraz hakkının nasıl kullanılacağını adım adım anlatıyoruz.

## Riskli yapı tespiti nedir?

Riskli yapı tespiti, bir binanın zemin yapısı veya taşıyıcı sistemi nedeniyle can ve mal kaybına yol açma riski taşıyıp taşımadığını belirleyen teknik bir incelemedir. Sonuç, resmi bir rapor halinde ilgili idareye sunulur.

## Kimler başvurabilir?

- Bina maliklerinden herhangi biri, hisse oranına bakılmaksızın tek başına başvurabilir.
- Kanuni temsilciler ve vekiller de yetki belgesiyle başvuru yapabilir.
- Bazı durumlarda belediye veya Bakanlık resen (kendiliğinden) tespit başlatabilir.

## Süreç adımları

### 1. Lisanslı kuruluşa başvuru

Başvuru, Çevre, Şehircilik ve İklim Değişikliği Bakanlığı'nca yetkilendirilmiş inşaat mühendisliği büroları, yapı denetim şirketleri veya bazı belediyelere yapılır.

### 2. Teknik inceleme ve raporlama

Karot numunesi alma, zemin sondajı ve taşıyıcı sistem analizi içeren teknik çalışma sonucunda rapor hazırlanır.

### 3. İdari onay ve tapu şerhi

Eksiksiz bulunan rapor, ilgili müdürlükçe onaylanır ve en geç 10 iş günü içinde tapu kütüğüne "riskli yapı" olarak işlenir.

### 4. Tebligat

Tebligat, e-Devlet üzerinden maliklere, binaya asılan tutanakla ve Bakanlık internet sitesinde ilanla üç farklı yoldan yapılır.

## İtiraz hakkı nasıl kullanılır?

Raporun gerçeği yansıtmadığını düşünen hak sahipleri, tebligat tarihinden itibaren 15 gün içinde teknik heyet incelemesi talep edebilir; bu süreç sonuçlanmadan yıkım işlemi başlatılamaz. İtirazın reddi halinde idare mahkemesinde dava açma hakkı saklıdır.

Riskli yapı kararı kesinleştikten sonraki en kritik adım [güvenilir bir müteahhit seçmektir](/blog/guvenilir-muteahhit-nasil-secilir-kentsel-donusum) — sürecin çoğu mağduriyeti burada yaşanıyor. Bölgenize özel süreç detayları için [ilçe ve bölge rehberlerimize](/blog/kategori/ilce-rehberleri) de göz atabilirsiniz.

## Sık sorulan sorular

### Riskli yapı tespiti ücretli mi?

Evet, teknik inceleme masrafları başvuru sahibi tarafından karşılanır; ancak bazı belediyeler düşük gelirli hak sahipleri için destek sağlayabiliyor.

### Tespit sonrası bina hemen mi yıkılır?

Hayır. Tespit sonrası kat maliklerinin anlaşma süreci, müteahhit seçimi ve tahliye aşamaları tamamlanmadan yıkım yapılmaz.

### Rapor kaç yıl geçerlidir?

Riskli yapı kararı süresiz olarak tapuya işlenir ve dönüşüm tamamlanana kadar geçerliliğini korur.

Riskli yapı tespiti tamamlanan binanız için doğrulanmış müteahhitlerden teklif almak isterseniz, [DönüşümKapısı'nda ücretsiz ilan oluşturabilirsiniz](/ilan-ver).`,
  },
  {
    slug: "guvenilir-muteahhit-nasil-secilir-kentsel-donusum",
    title: "Güvenilir Müteahhit Nasıl Seçilir? Kentsel Dönüşümde Dolandırılmamak İçin 10 Kritik Kontrol",
    excerpt:
      "Kentsel dönüşümde en çok mağduriyet müteahhit seçiminde yaşanıyor. İşte imza öncesi mutlaka kontrol edilmesi gereken 10 kritik madde.",
    metaDescription:
      "Kentsel dönüşümde güvenilir müteahhit nasıl seçilir? Sözleşme öncesi kontrol edilmesi gereken 10 kritik madde ve dolandırılmamak için ipuçları.",
    category: "muteahhit-secimi",
    tags: ["güvenilir müteahhit", "müteahhit seçimi", "kat karşılığı sözleşmesi"],
    body: `Kentsel dönüşüm sürecindeki en büyük mağduriyetlerin çoğu, yanlış müteahhit seçiminden kaynaklanıyor. Yarım kalan inşaatlar, teslim edilmeyen daireler ve kaybedilen kira yardımları, sözleşme öncesi yapılmayan basit kontrollerin bedeli oluyor. Sürecin hukuki çerçevesini [riskli yapı tespiti rehberimizde](/blog/riskli-yapi-tespiti-nasil-yapilir-6306-sayili-kanun) bulabilirsiniz; bu yazıda ise imza atmadan önce mutlaka yapılması gereken 10 kontrolü sıralıyoruz.

## 1. Ticaret sicil kaydını doğrulayın

Firmanın ticaret sicil numarasını ve kuruluş tarihini Ticaret Sicil Gazetesi üzerinden kontrol edin. Yeni kurulmuş, geçmişi olmayan firmalarla büyük projelere girmek risklidir.

## 2. Tamamlanmış proje geçmişini yerinde görün

Sadece render görselleriyle değil, firmanın daha önce teslim ettiği en az 2-3 projeyi yerinde gezin ve o binalardaki kat maliklerinden referans alın.

## 3. YAMBİS üzerinden müteahhit sorgulaması yapın

Çevre, Şehircilik ve İklim Değişikliği Bakanlığı'nın Yapı Denetim ve Müteahhit Bilgi Sistemi'nden firmanın yetki belgesi ve varsa aldığı idari yaptırımları sorgulayın.

## 4. Mali yeterliliği araştırın

Firmanın banka referans mektubu veya teminat mektubu verebilme kapasitesi, projeyi finanse edebileceğinin en somut göstergesidir.

## 5. Teslim tarihini ve cezai şartı sözleşmeye yazdırın

Sözlü verilen "18 ayda biter" sözü hukuken bağlayıcı değildir. Teslim tarihi, gecikme halinde günlük/aylık cezai şart olarak noter sözleşmesine yazılmalıdır.

## 6. Kira yardımının kim tarafından karşılanacağını netleştirin

Kira yardımının Bakanlık mı yoksa müteahhit tarafından mı ödeneceği, hangi ayda başlayıp hangi ayda biteceği açıkça belirtilmelidir.

## 7. Teminat mektubu veya ipotek talep edin

Özellikle büyük ölçekli projelerde, müteahhitten banka teminat mektubu veya arsaya ipotek konulmasını talep etmek, yarım kalma riskine karşı en güçlü korumadır.

## 8. Metraj ve malzeme listesini sözleşmeye ekleyin

"Birinci sınıf malzeme" gibi muğlak ifadeler yerine, kullanılacak malzemelerin marka ve model bazında listelenmesi, teslim sonrası anlaşmazlıkları önler.

## 9. Kat karşılığı oranını bağımsız bir uzmana teyit ettirin

Emsal (inşaat alanı) hesaplaması ve hak sahibi payı, bölgedeki emsal projelerle karşılaştırılarak bağımsız bir gayrimenkul değerleme uzmanına teyit ettirilmelidir.

## 10. Birden fazla teklifi yazılı olarak karşılaştırın

Tek firmayla görüşüp karar vermek yerine, en az 3 doğrulanmış müteahhitten yazılı teklif almak, hem fiyat hem de süreç şeffaflığı açısından pazarlık gücü sağlar.

## Sık sorulan sorular

### Müteahhit teslimi geciktirirse ne yapılabilir?

Sözleşmede cezai şart maddesi varsa, gecikme süresi boyunca günlük/aylık tazminat talep edilebilir; teminat mektubu varsa nakde çevrilebilir.

### Doğrulanmış müteahhit ne anlama gelir?

DönüşümKapısı gibi platformlarda "doğrulanmış" ibaresi, firmanın ticaret sicil kaydı, yetki belgesi ve tamamlanmış proje referanslarının platform tarafından kontrol edildiği anlamına gelir; [doğrulanmış müteahhit listesini burada inceleyebilirsiniz](/muteahhitler).

Binanız için doğrulanmış müteahhitlerden güvenle teklif almak isterseniz, [DönüşümKapısı'nda ücretsiz ilan oluşturarak](/ilan-ver) süreci başlatabilirsiniz.`,
  },
];

async function main() {
  const author = await prisma.user.upsert({
    where: { email: "icerik@donusumkapisi.com" },
    update: {},
    create: {
      email: "icerik@donusumkapisi.com",
      name: "DönüşümKapısı Editör",
      role: "ADMIN",
    },
  });

  for (const post of POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...post, published: true },
      create: { ...post, published: true, authorId: author.id },
    });
  }

  console.log(`Seeded ${POSTS.length} long-tail blog posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
