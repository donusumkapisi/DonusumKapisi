import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { Listing, Offer } from "@donusum-kapisi/db";
import { formatPriceRange } from "@/lib/format";

const OFFER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Yeni Teklif",
  INTERESTED: "İlgileniliyor",
  DECLINED: "İlgilenilmedi",
  WITHDRAWN: "Geri Çekildi",
};

export type OfferForPdf = Offer & {
  contractor: { name: string | null };
  rating: { averageRating: number | null; reviewCount: number };
};

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  meta: { fontSize: 10, color: "#5b7a8a", marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 8, marginTop: 8 },
  table: { display: "flex", flexDirection: "column" },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#163449",
    paddingBottom: 6,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eaf4f7",
    paddingVertical: 8,
  },
  colContractor: { width: "30%", fontWeight: 700 },
  colPrice: { width: "25%" },
  colRating: { width: "20%" },
  colStatus: { width: "25%" },
  headerCell: { fontWeight: 700, fontSize: 10 },
  note: { marginTop: 4, fontSize: 9, color: "#5b7a8a" },
  empty: { fontSize: 11, color: "#5b7a8a", marginTop: 12 },
  footer: { marginTop: 24, fontSize: 9, color: "#5b7a8a" },
});

function OffersPdfDocument({ listing, offers }: { listing: Listing; offers: OfferForPdf[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.meta}>
          İlan No: {listing.listingNumber} · {listing.district}, {listing.province} ·{" "}
          {formatPriceRange(listing.priceMin, listing.priceMax)}
        </Text>

        <Text style={styles.sectionTitle}>Gelen Teklifler ({offers.length})</Text>

        {offers.length === 0 ? (
          <Text style={styles.empty}>Bu ilana henüz teklif verilmemiş.</Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.headerRow}>
              <Text style={[styles.colContractor, styles.headerCell]}>Müteahhit</Text>
              <Text style={[styles.colPrice, styles.headerCell]}>Teklif</Text>
              <Text style={[styles.colRating, styles.headerCell]}>Puan</Text>
              <Text style={[styles.colStatus, styles.headerCell]}>Durum</Text>
            </View>
            {offers.map((offer) => (
              <View key={offer.id} style={styles.row}>
                <View style={styles.colContractor}>
                  <Text>{offer.contractor.name ?? "Müteahhit"}</Text>
                  {offer.note && <Text style={styles.note}>{offer.note}</Text>}
                </View>
                <Text style={styles.colPrice}>
                  {formatPriceRange(offer.priceMin, offer.priceMax)}
                </Text>
                <Text style={styles.colRating}>
                  {offer.rating.reviewCount > 0
                    ? `${offer.rating.averageRating?.toFixed(1)} (${offer.rating.reviewCount})`
                    : "—"}
                </Text>
                <Text style={styles.colStatus}>{OFFER_STATUS_LABELS[offer.status] ?? offer.status}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          DönüşümKapısı · {new Date().toLocaleDateString("tr-TR")} tarihinde oluşturuldu.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderOffersPdf(listing: Listing, offers: OfferForPdf[]): Promise<Buffer> {
  return renderToBuffer(<OffersPdfDocument listing={listing} offers={offers} />);
}
