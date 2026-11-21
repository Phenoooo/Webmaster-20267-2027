import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { courts } from "@/lib/courts";

const imageSources = [
  {
    title: "Law background with a judge's mallet and wooden gavel",
    source: "Freepik",
    url: "https://img.freepik.com/premium-photo/law-background-mallet-judge-wooden-gavel-courtroom_343283-3649.jpg",
  },
  {
    title:
      "Formal pose of a professional man in detailed black silhouette for business designs",
    source: "Vecteezy",
    url: "https://www.vecteezy.com/vector-art/61111471-formal-pose-of-a-professional-man-in-detailed-black-silhouette-for-business-designs",
  },
  {
    title: "Wooden interior of a courthouse",
    source: "Pexels",
    url: "https://www.pexels.com/photo/wooden-interior-of-a-courthouse-14766052/",
  },
  {
    title: "Male lawyer working on a laptop in an office",
    source: "Pexels",
    url: "https://www.pexels.com/photo/male-lawyer-working-on-laptop-in-office-5668791/",
  },
  {
    title: "Courtroom with American flags in the USA",
    source: "Pexels",
    url: "https://www.pexels.com/photo/courtroom-with-american-flags-in-usa-17630959/",
  },
  {
    title: "Professional lawyer writing on a notebook",
    source: "Pexels",
    url: "https://www.pexels.com/photo/professional-lawyer-writing-on-a-notebook-8112113/",
  },
  {
    title: "Furniture in a courthouse",
    source: "Pexels",
    url: "https://www.pexels.com/photo/furniture-in-courthouse-6077089/",
  },
  {
    title: "Court scales and smoking pipe",
    source: "Pexels",
    url: "https://www.pexels.com/photo/court-scales-and-smoking-pipe-7781900/",
  },
  {
    title: "Antique legislative books in Bern library",
    source: "Pexels",
    url: "https://www.pexels.com/photo/antique-legislative-books-in-bern-library-36207460/",
  },
  {
    title: "Judgement scale and gavel in a judge's office",
    source: "Pexels",
    url: "https://www.pexels.com/photo/judgement-scale-and-gavel-in-judge-office-5669602/",
  },
  {
    title: "Woman university tutor in black traditional outfit in a library",
    source: "Pexels",
    url: "https://www.pexels.com/photo/woman-university-tutor-in-black-traditional-outfit-in-library-6077122/",
  },
  {
    title: "Law book next to a suitcase",
    source: "Pexels",
    url: "https://www.pexels.com/photo/law-book-next-to-a-suitcase-8731031/",
  },
  {
    title: "Person holding a gavel",
    source: "Pexels",
    url: "https://www.pexels.com/photo/person-holding-a-gavel-6077422/",
  },
  {
    title: "Judge's wooden gavel on a desk close-up",
    source: "Pexels",
    url: "https://www.pexels.com/photo/judge-s-wooden-gavel-on-desk-close-up-37732186/",
  },
  {
    title: "A woman sitting at a table",
    source: "Pexels",
    url: "https://www.pexels.com/photo/a-woman-sitting-at-the-table-6077294/",
  },
  {
    title: "Gavel transparent PNG",
    source: "Robert Hambright",
    url: "https://asktheman.xyz/#google_vignette",
  },
];

export default function InformationPage() {
  return (
    <>
      <main>
        <section className="profile-hero mahogany-section">
          <SiteNav />
          <div className="profile-heading">
            <h1>
              Learn to think <span>alongside AI</span>
            </h1>
            <p>
              AI can be useful and still be incorrect, unclear, or unfair.
              Students should feel able to question it, check evidence, and take
              responsibility for their own decisions. Each short game offers a
              scenario, a choice, and a chance to reflect.
            </p>
          </div>
        </section>
        <section className="information-content ivory-section">
          <div className="information-intro">
            <h2>Learn to think alongside AI</h2>
            <p>
              AI can be useful and still be incorrect, unclear, or unfair.
              Students should feel able to question it, check evidence, and take
              responsibility for their own decisions. Each short game offers a
              scenario, a choice, and a chance to reflect.
            </p>
          </div>
          <div className="information-skills">
            {courts.map((court) => (
              <article key={court.id}>
                <h3>{court.skill}</h3>
                <p>{court.skillDescription}</p>
              </article>
            ))}
          </div>
          <p className="information-summary">
            We’re teaching students these fundamental skills by simulating
            courtroom cases. You’ll use AI to help, decide if it’s being used
            responsibly, or consider when it goes wrong.
          </p>

          <section
            className="image-sources"
            aria-labelledby="image-sources-heading"
          >
            <h2 id="image-sources-heading">Image sources</h2>
            <ul className="image-source-list">
              {imageSources.map((image) => (
                <li key={image.url}>
                  <a href={image.url} target="_blank" rel="noreferrer">
                    {image.title}
                  </a>{" "}
                  via {image.source}
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
