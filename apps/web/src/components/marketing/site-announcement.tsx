import { SiteAnnouncementBanner } from "@/components/marketing/site-announcement-banner";
import { getLatestPublishedAnnouncement } from "@/lib/announcements";

export async function SiteAnnouncement() {
  try {
    const announcement = await getLatestPublishedAnnouncement();
    if (!announcement) return null;
    return <SiteAnnouncementBanner announcement={announcement} />;
  } catch {
    // Announcement lookup must never take down the rest of the site.
    return null;
  }
}
