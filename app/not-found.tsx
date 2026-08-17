import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="page-hero">
      <div className="container">
        <p className="eyebrow gold">404</p>
        <h1>Ukurasa haujapatikana.</h1>
        <p>The page you requested could not be found.</p>
        <Link className="btn btn-primary" href="/">Rudi mwanzo · Go home</Link>
      </div>
    </main>
  );
}
