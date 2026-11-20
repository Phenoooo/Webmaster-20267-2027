import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { courts } from "@/lib/courts";

export default function InformationPage() {
  return (
    <>
      <main>
        <section className="profile-hero mahogany-section">
          <SiteNav />
          <div className="profile-heading">
            <h1>AI literacy, <span>in session.</span></h1>
            <p>
              Courtroom scenarios make it practical to question AI, check its
              answers, and consider who is affected by the decisions it informs.
            </p>
          </div>
        </section>
        <section className="information-content ivory-section">
          <div className="information-intro">
            <h2>Learn to think alongside AI.</h2>
            <p>
              AI can be useful and still be incorrect, unclear, or unfair.
              Students should feel able to question it, check evidence, and take
              responsibility for their own decisions. Each short game offers a
              scenario, a choice, and a chance to reflect—no law background
              needed.
            </p>
          </div>
          <div className="information-skills">
            {courts.map((court) => (
              <article key={court.id}>
                <h3>{court.skill}</h3>
                <p>{court.description}</p>
              </article>
            ))}
          </div>
          <p className="image-credit">
            Home-page photograph:{" "}
            <a
              href="https://www.pexels.com/photo/courtroom-with-american-flags-in-usa-17630959/"
              target="_blank"
              rel="noreferrer"
            >
              Zachary Caraway via Pexels
            </a>
            . Gavel video:{" "}
            <a
              href="https://www.pexels.com/video/video-of-gavel-and-block-5637306/"
              target="_blank"
              rel="noreferrer"
            >
              Sora Shimazaki via Pexels
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
