import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import type { ListingDTO, ListingStatus, OfferStatus, UserRole } from "@donusum-kapisi/shared";
import {
  api,
  type ContactQueueEntry,
  type ContractorProfileWithUser,
  type ListingWithOwner,
  type OfferWithListing,
} from "@/src/lib/api";
import { useAuth } from "@/src/lib/auth-context";
import { formatPriceRange, type Colors } from "@/src/lib/theme";
import { useColors } from "@/src/lib/theme-context";
import { Button } from "@/src/components/button";
import { TextField } from "@/src/components/text-field";
import { PageHero } from "@/src/components/page-hero";
import { StatusBadge, useToneColors, type StatusTone } from "@/src/components/status-badge";
import { ReviewForm } from "@/src/components/review-form";
import { SavedSearchesList } from "@/src/components/saved-searches-list";
import { PortfolioManager } from "@/src/components/portfolio-manager";
import { AppointmentCard } from "@/src/components/appointment-card";
import { ProposeAppointmentForm } from "@/src/components/propose-appointment-form";
import { downloadAndShareOffersPdf } from "@/src/lib/pdf";
import { NotificationPreferencesSection } from "@/src/components/notification-preferences-section";
import { OfferComparisonModal } from "@/src/components/offer-comparison-modal";
import { AdminAnalyticsSection } from "@/src/components/admin-analytics-section";
import { AdminMaintenanceSection } from "@/src/components/admin-maintenance-section";

const OFFER_STATUS_TONES: Record<OfferStatus, StatusTone> = {
  PENDING: "warning",
  INTERESTED: "positive",
  DECLINED: "negative",
  WITHDRAWN: "neutral",
};

const LISTING_STATUS_TONES: Record<ListingStatus, StatusTone> = {
  PENDING: "warning",
  APPROVED: "positive",
  REJECTED: "negative",
  CLOSED: "neutral",
};

const ROLE_LABEL_KEYS: Record<UserRole, string> = {
  HOMEOWNER: "panel.roleHomeowner",
  CONTRACTOR: "panel.roleContractor",
  ADMIN: "panel.roleAdmin",
};

const logo = require("../../../assets/logo.png");

function getInitials(value: string) {
  const initials = value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "?";
}

export default function PanelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const colors = useColors();
  const styles = useStyles();

  if (isAuthLoading) {
    return <ActivityIndicator style={{ marginTop: 32 }} color={colors.turquoise} />;
  }

  if (!user) {
    return (
      <View style={styles.screen}>
        <View style={[styles.lockedHero, { paddingTop: insets.top + 40 }]}>
          <View style={styles.lockedLogoCircle}>
            <Image source={logo} style={styles.lockedLogo} resizeMode="contain" />
          </View>
          <Text style={styles.lockedHeroTitle}>{t("panel.lockedTitle")}</Text>
          <Text style={styles.lockedHeroSubtitle}>{t("panel.lockedSubtitle")}</Text>
        </View>

        <View style={styles.lockedCard}>
          <Button title={t("panel.login")} icon="log-in-outline" onPress={() => router.push("/(auth)/giris")} />
          <Button
            title={t("panel.register")}
            variant="outline"
            icon="person-add-outline"
            onPress={() => router.push("/(auth)/kayit")}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <PageHero
        title={t("panel.greeting", { name: user.name ?? user.email })}
        subtitle={t(ROLE_LABEL_KEYS[user.role])}
        compact
        left={
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.name ?? user.email)}</Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.container}>
        {user.role === "HOMEOWNER" ? (
          <HomeownerPanel />
        ) : user.role === "CONTRACTOR" ? (
          <ContractorPanel />
        ) : (
          <AdminPanel />
        )}
      </ScrollView>
    </View>
  );
}

function HomeownerPanel() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useStyles();
  const toneColors = useToneColors();
  const [listings, setListings] = useState<ListingDTO[]>([]);
  const [offers, setOffers] = useState<OfferWithListing[]>([]);
  const [reviewingOfferId, setReviewingOfferId] = useState<string | null>(null);
  const [downloadingPdfFor, setDownloadingPdfFor] = useState<string | null>(null);
  const [comparingListingNumber, setComparingListingNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [listingsRes, offersRes] = await Promise.all([api.myListings(), api.myOffers()]);
    setListings(listingsRes.listings);
    setOffers(offersRes.offers);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function respond(offerId: string, status: OfferStatus) {
    await api.updateOfferStatus(offerId, status);
    load();
  }

  async function downloadPdf(listingNumber: string) {
    setDownloadingPdfFor(listingNumber);
    try {
      await downloadAndShareOffersPdf(listingNumber);
    } catch {
      // Kullanıcı paylaşımı iptal etmiş veya indirme başarısız olmuş olabilir; sessizce yut.
    } finally {
      setDownloadingPdfFor(null);
    }
  }

  if (isLoading) return <ActivityIndicator color={colors.turquoise} style={{ marginTop: 24 }} />;

  const pendingOfferCount = offers.filter((offer) => offer.status === "PENDING").length;
  const comparisonOffers = offers
    .filter((offer) => offer.listing.listingNumber === comparingListingNumber)
    .map((offer) => ({
      id: offer.id,
      contractorName: offer.contractor.name,
      priceMin: offer.priceMin,
      priceMax: offer.priceMax,
      durationMonths: offer.durationMonths,
      status: offer.status,
      rating: offer.contractorRating,
    }));

  return (
    <View style={{ gap: 24 }}>
      <View style={styles.statsRow}>
        <StatTile icon="business-outline" value={listings.length} label={t("panel.statMyListings")} />
        <StatTile icon="mail-unread-outline" value={pendingOfferCount} label={t("panel.statPendingOffers")} />
      </View>

      <View>
        <View style={styles.sectionHeader}>
          <SectionTitle icon="business-outline" title={t("panel.myListingsTitle")} />
          <Button
            title={t("panel.newListing")}
            size="sm"
            icon="add"
            onPress={() => router.push("/(tabs)/ilan-ver")}
          />
        </View>

        {listings.length === 0 ? (
          <EmptyState icon="business-outline" text={t("panel.noListingsYet")} />
        ) : (
          <View style={{ gap: 10 }}>
            {listings.map((listing) => {
              const listingOffers = offers.filter(
                (offer) => offer.listing.listingNumber === listing.listingNumber
              );
              const hasOffers = listingOffers.length > 0;
              return (
                <View
                  key={listing.id}
                  style={[styles.card, { borderLeftColor: toneColors[LISTING_STATUS_TONES[listing.status]] }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardMeta}>
                      #{listing.listingNumber} · {listing.district}, {listing.province}
                    </Text>
                    <Text style={styles.cardTitle}>{listing.title}</Text>
                    <Text style={styles.subtitleLeft}>
                      👁 {t("panel.viewCount", { count: listing.viewCount })}
                    </Text>
                    {hasOffers && (
                      <Pressable
                        style={styles.pdfLink}
                        onPress={() => downloadPdf(listing.listingNumber)}
                        disabled={downloadingPdfFor === listing.listingNumber}
                      >
                        {downloadingPdfFor === listing.listingNumber ? (
                          <ActivityIndicator size="small" color={colors.turquoise} />
                        ) : (
                          <Ionicons name="download-outline" size={13} color={colors.turquoise} />
                        )}
                        <Text style={styles.pdfLinkText}>PDF Olarak İndir</Text>
                      </Pressable>
                    )}
                    {listingOffers.length >= 2 && (
                      <Pressable
                        style={styles.pdfLink}
                        onPress={() => setComparingListingNumber(listing.listingNumber)}
                      >
                        <Ionicons name="git-compare-outline" size={13} color={colors.turquoise} />
                        <Text style={styles.pdfLinkText}>Teklifleri Karşılaştır</Text>
                      </Pressable>
                    )}
                  </View>
                  <StatusBadge
                    label={t(`status.listing.${listing.status}`)}
                    tone={LISTING_STATUS_TONES[listing.status]}
                  />
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View>
        <SectionTitle icon="mail-outline" title={t("panel.incomingOffersTitle")} style={{ marginBottom: 10 }} />
        {offers.length === 0 ? (
          <EmptyState icon="mail-outline" text={t("panel.noOffersYet")} />
        ) : (
          <View style={{ gap: 10 }}>
            {offers.map((offer) => (
              <View
                key={offer.id}
                style={[styles.offerCard, { borderLeftColor: toneColors[OFFER_STATUS_TONES[offer.status]] }]}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.cardTitle}>{offer.listing.title}</Text>
                  <StatusBadge
                    label={t(`status.offer.${offer.status}`)}
                    tone={OFFER_STATUS_TONES[offer.status]}
                  />
                </View>
                <Pressable
                  style={styles.contractorRow}
                  onPress={() => router.push(`/muteahhit/${offer.contractor.id}`)}
                >
                  <Text style={styles.contractorName}>
                    {offer.contractor.name ?? t("panel.defaultContractorName")}
                  </Text>
                  {offer.contractorRating.reviewCount > 0 && (
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color={colors.ctaOrange} />
                      <Text style={styles.ratingText}>
                        {offer.contractorRating.averageRating?.toFixed(1)}
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Text style={styles.offerPrice}>
                  {formatPriceRange(offer.priceMin, offer.priceMax)}
                </Text>
                {offer.note && <Text style={styles.subtitleLeft}>{offer.note}</Text>}
                {offer.appointment && (
                  <AppointmentCard appointment={offer.appointment} onUpdated={load} />
                )}
                {(offer.status === "PENDING" || offer.status === "INTERESTED") && (
                  <View style={styles.actionsRow}>
                    {offer.status === "PENDING" && (
                      <Button
                        title={t("panel.interested")}
                        size="sm"
                        icon="checkmark"
                        onPress={() => respond(offer.id, "INTERESTED")}
                      />
                    )}
                    <Button
                      title={t("panel.notInterested")}
                      size="sm"
                      variant="danger"
                      icon="close"
                      onPress={() => respond(offer.id, "DECLINED")}
                    />
                  </View>
                )}

                {offer.contactResolvedAt && !offer.hasReview && (
                  <>
                    {reviewingOfferId === offer.id ? (
                      <ReviewForm
                        offerId={offer.id}
                        onSubmitted={() => {
                          setReviewingOfferId(null);
                          load();
                        }}
                      />
                    ) : (
                      <View style={styles.actionsRow}>
                        <Button
                          title={t("panel.review")}
                          size="sm"
                          variant="outline"
                          icon="star-outline"
                          onPress={() => setReviewingOfferId(offer.id)}
                        />
                      </View>
                    )}
                  </>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <SavedSearchesList />
      <NotificationPreferencesSection />

      <OfferComparisonModal
        visible={comparingListingNumber !== null}
        offers={comparisonOffers}
        onClose={() => setComparingListingNumber(null)}
      />
    </View>
  );
}

function ContractorPanel() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useStyles();
  const toneColors = useToneColors();
  const [offers, setOffers] = useState<OfferWithListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const response = await api.myOffers();
    setOffers(response.offers);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function withdraw(offerId: string) {
    await api.updateOfferStatus(offerId, "WITHDRAWN");
    load();
  }

  if (isLoading) return <ActivityIndicator color={colors.turquoise} style={{ marginTop: 24 }} />;

  const activeCount = offers.filter(
    (offer) => offer.status === "PENDING" || offer.status === "INTERESTED"
  ).length;

  return (
    <View style={{ gap: 24 }}>
      <ContractorProfileSection />

      <PortfolioManager />

      <View style={styles.statsRow}>
        <StatTile icon="pricetags-outline" value={offers.length} label={t("panel.statTotalOffers")} />
        <StatTile icon="flash-outline" value={activeCount} label={t("panel.statActiveOffers")} />
      </View>

      <View>
        <View style={styles.sectionHeader}>
          <SectionTitle icon="pricetags-outline" title={t("panel.myOffersTitle")} />
          <Button
            title={t("panel.browseListings")}
            size="sm"
            icon="search-outline"
            onPress={() => router.push("/(tabs)/ilanlar")}
          />
        </View>

        {offers.length === 0 ? (
          <EmptyState icon="pricetags-outline" text={t("panel.noOffersMadeYet")} />
        ) : (
          <View style={{ gap: 10 }}>
            {offers.map((offer) => (
              <View
                key={offer.id}
                style={[styles.offerCard, { borderLeftColor: toneColors[OFFER_STATUS_TONES[offer.status]] }]}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.cardMeta}>#{offer.listing.listingNumber}</Text>
                  <StatusBadge
                    label={t(`status.offer.${offer.status}`)}
                    tone={OFFER_STATUS_TONES[offer.status]}
                  />
                </View>
                <Text style={styles.cardTitle}>{offer.listing.title}</Text>
                <Text style={styles.subtitleLeft}>
                  {t("panel.yourOffer", { price: formatPriceRange(offer.priceMin, offer.priceMax) })}
                </Text>
                {offer.appointment && (
                  <AppointmentCard appointment={offer.appointment} onUpdated={load} />
                )}
                {offer.status !== "WITHDRAWN" && (
                  <View style={styles.actionsRow}>
                    <Button
                      title={t("panel.withdraw")}
                      size="sm"
                      variant="danger"
                      icon="arrow-undo-outline"
                      onPress={() => withdraw(offer.id)}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <SavedSearchesList />
      <NotificationPreferencesSection />
    </View>
  );
}

function ContractorProfileSection() {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useStyles();
  const [profile, setProfile] = useState<{
    companyName: string | null;
    about: string | null;
    documentUrls: string[];
    verified: boolean;
  } | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [about, setAbout] = useState("");
  const [documents, setDocuments] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const response = await api.getContractorProfile();
    setProfile(response.profile);
    setCompanyName(response.profile?.companyName ?? "");
    setAbout(response.profile?.about ?? "");
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function pickDocuments() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setDocuments((prev) => [...prev, ...result.assets]);
    }
  }

  async function save() {
    setIsSaving(true);
    setSaved(false);
    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("about", about);
      documents.forEach((doc, index) => {
        formData.append(
          "documents",
          {
            uri: doc.uri,
            name: `document-${index}.jpg`,
            type: doc.mimeType ?? "image/jpeg",
          } as unknown as Blob
        );
      });

      await api.updateContractorProfile(formData);
      setDocuments([]);
      setSaved(true);
      load();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <SectionTitle icon="briefcase-outline" title={t("panel.myProfileTitle")} />
        {profile?.verified && <StatusBadge label={t("panel.documentsVerified")} tone="positive" />}
      </View>

      <View style={{ gap: 12 }}>
        <TextField label={t("panel.labelCompanyName")} value={companyName} onChangeText={setCompanyName} />
        <TextField label={t("panel.labelAbout")} value={about} onChangeText={setAbout} multiline />

        <Pressable style={styles.documentPicker} onPress={pickDocuments}>
          <Ionicons name="cloud-upload-outline" size={18} color={colors.turquoise} />
          <Text style={styles.documentPickerText}>{t("panel.addDocuments")}</Text>
        </Pressable>

        {documents.length > 0 && (
          <View style={styles.documentRow}>
            {documents.map((doc) => (
              <Image key={doc.uri} source={{ uri: doc.uri }} style={styles.documentThumb} />
            ))}
          </View>
        )}

        {profile && profile.documentUrls.length > 0 && (
          <View style={styles.documentRow}>
            {profile.documentUrls.map((url) => (
              <Image key={url} source={{ uri: url }} style={styles.documentThumb} />
            ))}
          </View>
        )}

        {saved && <Text style={styles.savedText}>{t("panel.profileUpdated")}</Text>}

        <Button title={t("panel.save")} size="sm" icon="save-outline" loading={isSaving} onPress={save} />
      </View>
    </View>
  );
}

function AdminPanel() {
  const { t } = useTranslation();
  const colors = useColors();
  const styles = useStyles();
  const toneColors = useToneColors();
  const [listings, setListings] = useState<ListingWithOwner[]>([]);
  const [contactQueue, setContactQueue] = useState<ContactQueueEntry[]>([]);
  const [contractors, setContractors] = useState<ContractorProfileWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [listingsRes, queueRes, contractorsRes] = await Promise.all([
      api.adminListings(),
      api.adminContactQueue(),
      api.adminContractors(),
    ]);
    setListings(listingsRes.listings);
    setContactQueue(queueRes.offers);
    setContractors(contractorsRes.contractors);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function setStatus(listingNumber: string, status: ListingStatus) {
    await api.updateListingStatus(listingNumber, status);
    load();
  }

  async function resolveContact(offerId: string) {
    await api.resolveOfferContact(offerId);
    load();
  }

  async function toggleVerified(profileId: string, verified: boolean) {
    await api.verifyContractor(profileId, verified);
    load();
  }

  if (isLoading) return <ActivityIndicator color={colors.turquoise} style={{ marginTop: 24 }} />;

  const pendingCount = listings.filter((listing) => listing.status === "PENDING").length;

  return (
    <View style={{ gap: 24 }}>
      <View style={styles.statsRow}>
        <StatTile icon="time-outline" value={pendingCount} label={t("panel.statPendingApproval")} />
        <StatTile icon="call-outline" value={contactQueue.length} label={t("panel.statContactPending")} />
      </View>

      <AdminAnalyticsSection />

      <AdminMaintenanceSection />

      <View>
        <SectionTitle icon="call-outline" title={t("panel.contactPendingTitle")} style={{ marginBottom: 10 }} />

        {contactQueue.length === 0 ? (
          <EmptyState icon="checkmark-done-outline" text={t("panel.noContactPending")} />
        ) : (
          <View style={{ gap: 10 }}>
            {contactQueue.map((offer) => (
              <View key={offer.id} style={[styles.offerCard, { borderLeftColor: toneColors.positive }]}>
                <Text style={styles.cardMeta}>
                  #{offer.listing.listingNumber} · {formatPriceRange(offer.priceMin, offer.priceMax)}
                </Text>
                <Text style={styles.cardTitle}>{offer.listing.title}</Text>
                <Text style={styles.subtitleLeft}>
                  {t("panel.ownerLabel", {
                    name: offer.listing.owner.name,
                    email: offer.listing.owner.email,
                  })}
                  {offer.listing.owner.phone ? ` · ${offer.listing.owner.phone}` : ""}
                </Text>
                <Text style={styles.subtitleLeft}>
                  {t("panel.contractorLabel", {
                    name: offer.contractor.name,
                    email: offer.contractor.email,
                  })}
                  {offer.contractor.phone ? ` · ${offer.contractor.phone}` : ""}
                </Text>
                {offer.appointment && (
                  <AppointmentCard appointment={offer.appointment} onUpdated={load} />
                )}
                <View style={styles.actionsRow}>
                  <Button
                    title={t("panel.markDone")}
                    size="sm"
                    icon="checkmark-circle-outline"
                    onPress={() => resolveContact(offer.id)}
                  />
                </View>
                <ProposeAppointmentForm offerId={offer.id} onProposed={load} />
              </View>
            ))}
          </View>
        )}
      </View>

      <View>
        <SectionTitle icon="briefcase-outline" title={t("panel.contractorApprovalsTitle")} style={{ marginBottom: 10 }} />

        {contractors.length === 0 ? (
          <EmptyState icon="briefcase-outline" text={t("panel.noContractorsYet")} />
        ) : (
          <View style={{ gap: 10 }}>
            {contractors.map((contractor) => (
              <View
                key={contractor.id}
                style={[
                  styles.offerCard,
                  { borderLeftColor: contractor.verified ? toneColors.positive : toneColors.warning },
                ]}
              >
                <View style={styles.sectionHeader}>
                  <Text style={styles.cardTitle}>{contractor.companyName || contractor.user.name}</Text>
                  {contractor.verified && <StatusBadge label={t("panel.verified")} tone="positive" />}
                </View>
                <Text style={styles.subtitleLeft}>{contractor.user.email}</Text>
                {contractor.documentUrls.length > 0 && (
                  <View style={styles.documentRow}>
                    {contractor.documentUrls.map((url) => (
                      <Image key={url} source={{ uri: url }} style={styles.documentThumb} />
                    ))}
                  </View>
                )}
                <View style={styles.actionsRow}>
                  <Button
                    title={contractor.verified ? t("panel.removeVerification") : t("panel.verify")}
                    size="sm"
                    variant={contractor.verified ? "outline" : "primary"}
                    icon={contractor.verified ? "close-circle-outline" : "checkmark-circle-outline"}
                    onPress={() => toggleVerified(contractor.id, !contractor.verified)}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View>
        <SectionTitle icon="shield-checkmark-outline" title={t("panel.listingApprovalsTitle")} style={{ marginBottom: 10 }} />

        {listings.length === 0 ? (
          <EmptyState icon="albums-outline" text={t("panel.noListingsInSystem")} />
        ) : (
          <View style={{ gap: 10 }}>
            {listings.map((listing) => (
              <View
                key={listing.id}
                style={[styles.offerCard, { borderLeftColor: toneColors[LISTING_STATUS_TONES[listing.status]] }]}
              >
                <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                  <View style={styles.adminThumb}>
                    {listing.coverImageUrl ? (
                      <Image source={{ uri: listing.coverImageUrl }} style={styles.adminThumbImage} />
                    ) : (
                      <Ionicons name="business-outline" size={20} color={colors.turquoise} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardMeta}>
                      #{listing.listingNumber} · {listing.district}, {listing.province}
                    </Text>
                    <Text style={styles.cardTitle}>{listing.title}</Text>
                    <Text style={styles.subtitleLeft}>
                      {listing.owner.name} · {listing.owner.email}
                    </Text>
                  </View>
                  <StatusBadge
                    label={t(`status.listing.${listing.status}`)}
                    tone={LISTING_STATUS_TONES[listing.status]}
                  />
                </View>
                <View style={styles.actionsRow}>
                  {listing.status === "PENDING" && (
                    <>
                      <Button
                        title={t("panel.approve")}
                        size="sm"
                        icon="checkmark-circle-outline"
                        onPress={() => setStatus(listing.listingNumber, "APPROVED")}
                      />
                      <Button
                        title={t("panel.reject")}
                        size="sm"
                        variant="danger"
                        icon="close-circle-outline"
                        onPress={() => setStatus(listing.listingNumber, "REJECTED")}
                      />
                    </>
                  )}
                  {listing.status === "APPROVED" && (
                    <Button
                      title={t("panel.close")}
                      size="sm"
                      variant="outline"
                      icon="lock-closed-outline"
                      onPress={() => setStatus(listing.listingNumber, "CLOSED")}
                    />
                  )}
                  {listing.status === "REJECTED" && (
                    <Button
                      title={t("panel.reapprove")}
                      size="sm"
                      icon="refresh-outline"
                      onPress={() => setStatus(listing.listingNumber, "APPROVED")}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function StatTile({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
}) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <View style={styles.statTile}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={16} color={colors.turquoise} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionTitle({
  icon,
  title,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  style?: object;
}) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <View style={[styles.sectionTitleRow, style]}>
      <Ionicons name={icon} size={16} color={colors.turquoise} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function EmptyState({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={24} color={colors.inkMuted} />
      <Text style={styles.subtitle}>{text}</Text>
    </View>
  );
}

function useStyles() {
  const colors = useColors();
  return useMemo(() => createStyles(colors), [colors]);
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  container: { padding: 20, paddingTop: 24, gap: 24 },
  lockedHero: {
    backgroundColor: colors.deep,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  lockedLogoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockedLogo: { width: 34, height: 34 },
  lockedHeroTitle: {
    marginTop: 16,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "500",
    color: colors.onDark,
    textAlign: "center",
  },
  lockedHeroSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
  },
  lockedCard: {
    marginTop: -22,
    marginHorizontal: 20,
    backgroundColor: colors.paper,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: colors.ink,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  subtitle: { fontSize: 13, color: colors.inkMuted, textAlign: "center" },
  subtitleLeft: { fontSize: 13, color: colors.inkMuted },
  pdfLink: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 },
  pdfLinkText: { fontSize: 12, fontWeight: "600", color: colors.turquoise },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: { fontSize: 16, fontWeight: "800", color: colors.onDark },
  statsRow: { flexDirection: "row", gap: 10 },
  statTile: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.paper,
    padding: 14,
    gap: 4,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0fb4a51a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statValue: { fontSize: 22, fontWeight: "800", color: colors.ink },
  statLabel: { fontSize: 11, color: colors.inkMuted, fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.ink },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    borderLeftWidth: 4,
    backgroundColor: colors.paper,
    padding: 14,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  offerCard: {
    borderRadius: 18,
    borderLeftWidth: 4,
    backgroundColor: colors.paper,
    padding: 14,
    gap: 6,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  adminThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.mist,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  adminThumbImage: { width: "100%", height: "100%" },
  cardMeta: { fontSize: 11, color: colors.inkMuted },
  cardTitle: { fontSize: 15, fontWeight: "700", color: colors.ink },
  offerPrice: { fontSize: 14, fontWeight: "700", color: colors.turquoise },
  actionsRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  contractorRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  contractorName: { fontSize: 13, fontWeight: "600", color: colors.ink },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 12, fontWeight: "600", color: colors.ctaOrange },
  empty: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: colors.mist,
  },
  documentPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.turquoise,
    backgroundColor: colors.mist,
    padding: 12,
  },
  documentPickerText: { fontSize: 13, color: colors.turquoise, fontWeight: "600", flexShrink: 1 },
  documentRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  documentThumb: { width: 56, height: 56, borderRadius: 10, backgroundColor: colors.mist },
  savedText: { fontSize: 13, color: colors.turquoise },
  });
}
