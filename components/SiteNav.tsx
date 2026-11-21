import Link from "next/link";
import AcquittalBrand from "@/components/AcquittalBrand";

export default function SiteNav() {
  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-brand" aria-label="Acquittal home">
          <span className="brand-mark" aria-hidden="true">§</span>
          <AcquittalBrand />
        </Link>
        <nav aria-label="Main navigation" className="site-nav-links">
          <Link href="/games">Courts</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/information">Info</Link>
        </nav>
      </div>
    </header>
  );
}
