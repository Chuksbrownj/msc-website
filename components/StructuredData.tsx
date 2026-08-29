import { SITE_CONFIG } from "@/lib/constants";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    description: SITE_CONFIG.description,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
