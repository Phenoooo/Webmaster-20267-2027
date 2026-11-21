import Image from "next/image";
import Link from "next/link";
import { courts } from "@/lib/courts";
import AcquittalBrand from "@/components/AcquittalBrand";
import CourtArtwork from "./CourtArtwork";
import Footer from "./Footer";
import RevealOnScroll from "./RevealOnScroll";
import SiteNav from "./SiteNav";

const reflectionRows = [
  [
    "Now I check where the answer came from before I trust it.",
    "AI can sound certain and still get the details wrong.",
    "I look for evidence, not just a convincing explanation.",
    "Facts need to be verified before I repeat them.",
  ],
  [
    "I got a better result when I explained who the answer was for.",
    "Being specific helped me get a response I could actually use.",
    "I learned to tell AI what format and detail I needed.",
    "Adding context made the answer clearer.",
  ],
  [
    "I hadn't thought about who might be left out of the data.",
    "AI can help with ideas, but people have to own the decision.",
    "I ask what information I should keep private now.",
    "It matters who is affected, not just whether the tool works.",
  ],
];

export default function CourtsHome() {
  return (
    <main>
      <section className="home-hero mahogany-section">
        <SiteNav />
        <RevealOnScroll className="hero-photo-reveal">
          <div className="hero-photo" aria-hidden="true" />
        </RevealOnScroll>
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>
              Question the answer.
              <span>Make your case.</span>
            </h1>
            <p className="hero-description">
              Step into the courtroom to practice asking better questions,
              checking evidence, and making thoughtful choices with AI.
            </p>
            <Link href="#courts" className="button button-green">
              Explore the games <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-intro ivory-section">
        <RevealOnScroll className="home-intro-inner">
          <div className="intro-video-frame">
            <Image
              className="intro-video"
              src="/pexels-shox-37732186.jpg"
              alt=""
              fill
              sizes="(max-width: 650px) 100vw, 48vw"
              aria-hidden="true"
            />
          </div>
          <div className="intro-copy">
            <h2>AI is on the case. <span>You are the judge.</span></h2>
            <p>
              <AcquittalBrand /> is an interactive AI learning portal designed for
              high school students. It turns questions about artificial
              intelligence into an engaging, hands-on experience.
            </p>
            <p>
              Explore the fundamentals of AI, discover practical tools, and
              learn how to use AI effectively and ethically.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <section id="courts" className="home-courts mahogany-section">
        <div className="section-heading">
          <h2>Three cases. <span>Three choices.</span></h2>
          <p>Step into the court</p>
        </div>
        <RevealOnScroll className="home-court-grid">
          {courts.map((court) => (
            <Link
              key={court.id}
              href={court.href}
              className={`home-court-card home-court-card-${court.id}`}
            >
              <CourtArtwork courtId={court.id} />
              <div className="home-card-copy">
                <h3>{court.name}</h3>
                <p>{court.description}</p>
                <span className="text-link">Enter the court <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </RevealOnScroll>
        <div className="all-courts-cta">
          <Link href="/games" className="button button-green">
            See all courts <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="home-information ivory-section">
        <RevealOnScroll className="home-information-inner">
          <div className="home-information-copy">
            <p className="eyebrow">How it works</p>
            <h2>Learn with AI.<span>Think for yourself.</span></h2>
            <p>
              AI has changed our everyday lives, but it shouldn’t be replacing our own human judgement. These cases give you a practical way to improve your judgement in this new world that we live in.
            </p>
            <Link href="/information" className="button button-green">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
          <figure className="information-photo">
            <div
              className="gavel-illustration"
              role="img"
              aria-label="An animated judge's gavel striking a sound block"
            >
              <Image
                className="gavel-illustration-block"
                src="/judge-gavel-isolated-3d-render-free-png.webp"
                alt=""
                fill
                sizes="(max-width: 650px) 125vw, 53vw"
                aria-hidden="true"
              />
              <Image
                className="gavel-illustration-hammer"
                src="/judge-gavel-isolated-3d-render-free-png.webp"
                alt=""
                fill
                sizes="(max-width: 650px) 125vw, 53vw"
                aria-hidden="true"
              />
            </div>
            <figcaption>Good judgment starts with a good question.</figcaption>
          </figure>
        </RevealOnScroll>
      </section>

      <section id="voices" className="home-voices ivory-section">
        <div className="voices-heading">
          <h2>Community <span>voices</span></h2>
          <p>(Non factual information)</p>
          <p>Reflections from prior students who’ve tried us out</p>
        </div>
        <RevealOnScroll className="voice-marquee">
          {reflectionRows.map((row, rowIndex) => (
            <div className={`voice-lane voice-lane-${rowIndex + 1}`} key={rowIndex}>
              <div className="voice-lane-track">
                {[0, 1].map((copyIndex) => (
                  <div
                    className="voice-lane-group"
                    aria-hidden={copyIndex === 1}
                    key={copyIndex}
                  >
                    {row.map((reflection, reflectionIndex) => (
                      <article
                        className="voice-card"
                        key={`${copyIndex}-${reflectionIndex}`}
                      >
                        <span className="quote-mark" aria-hidden="true">“</span>
                        <p>{reflection}</p>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </RevealOnScroll>
      </section>
      <Footer />
    </main>
  );
}
