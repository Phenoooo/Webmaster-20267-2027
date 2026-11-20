import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-brand" aria-label="The AI Courtroom home">
          <span className="brand-mark" aria-hidden="true">§</span>
          <span>The AI <strong>Courtroom</strong></span>
        </Link>
        <nav aria-label="Main navigation" className="site-nav-links">
          <Link href="/information">Information</Link>
          <Link href="/profile">Dashboard</Link>
          <Link href="/games">All games</Link>
        </nav>
      </div>
    </header>
  );
}
