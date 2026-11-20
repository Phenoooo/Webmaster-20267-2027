import Link from "next/link";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";

export default function ProfilePage() {
  return (
    <>
      <main>
        <section className="profile-hero mahogany-section">
          <SiteNav />
          <div className="profile-heading">
            <h1>Student <span>profile</span></h1>
            <p>
              Your courtroom record will grow as you complete simulations and
              build skills in verification, prompting, and ethical judgment.
            </p>
          </div>
        </section>
        <section className="profile-content ivory-section">
          <div className="profile-card">
            <h2>Ready to make your first case?</h2>
            <p>
              These self-guided games help you practice asking better questions,
              checking evidence, and keeping people in view.
            </p>
            <Link href="/games" className="button button-green">
              Choose a court <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}