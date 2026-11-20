import type { ReactNode } from "react";
import Link from "next/link";
import CourtArtwork from "@/components/CourtArtwork";
import { courts, type CourtId } from "@/lib/courts";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";

export default function CourtPage({
  courtId,
  children,
}: {
  courtId: CourtId;
  children: ReactNode;
}) {
  const court = courts.find((item) => item.id === courtId);

  if (!court) {
    throw new Error(`Unknown court: ${courtId}`);
  }

  return (
    <main>
      <section className="court-detail-hero mahogany-section">
        <SiteNav />
        <div className="court-detail-heading">
          <div>
            <h1>{court.name}</h1>
            <p className="court-tagline">{court.tagline}</p>
            <p className="court-intro">{court.description}</p>
          </div>
          <CourtArtwork
            courtId={court.id}
            className="court-detail-art"
            variant="detail"
          />
        </div>
      </section>
      <section className="court-detail-content ivory-section">
        <div className="case-file">
          <div className="case-file-copy">{children}</div>
          <div className="case-file-actions">
            <Link href="/games" className="button button-green">
              Choose another court <span aria-hidden="true">→</span>
            </Link>
            <Link href="/" className="text-link">Back to home</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
