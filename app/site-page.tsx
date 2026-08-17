import { getPage, type Language, type PageName } from "./page-data";
import SiteClient from "./site-client";

export default function SitePage({ language, page }: { language: Language; page: PageName }) {
  const content = getPage(language, page);

  return (
    <>
      {content.jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: content.jsonLd }} />
      ) : null}
      <div className={content.bodyClass} dangerouslySetInnerHTML={{ __html: content.body }} />
      <SiteClient language={language} />
    </>
  );
}
