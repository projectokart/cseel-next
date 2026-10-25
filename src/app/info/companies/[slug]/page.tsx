import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ROBOTICS_COMPANIES, 
  getCompanyBySlug,
  ContentBlock 
} from '@/data/roboticsCompaniesData';
import CompanyCarousel from '@/components/companies/CompanyCarousel';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Calendar, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  Cpu, 
  ExternalLink
} from 'lucide-react';

export async function generateStaticParams() {
  return ROBOTICS_COMPANIES.map((company) => ({
    slug: company.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const company = getCompanyBySlug(params.slug);
  if (!company) {
    return {
      title: 'Company Profile Not Found | Robotics Directory',
    };
  }

  const title = `${company.name} (${company.brandVariants[0]}) - Profile, Address, Lab Kits & Review | Indian School Robotics`;
  const description = company.shortDescription;
  const canonical = `https://cseel.org/info/companies/${company.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: company.seoKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Indian School Robotics & STEM Knowledge Hub',
      type: 'article',
      images: [
        {
          url: company.image.startsWith('http') ? company.image : `https://cseel.org${company.image}`,
          width: 1200,
          height: 630,
          alt: `${company.name} Banner`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [company.image.startsWith('http') ? company.image : `https://cseel.org${company.image}`],
    },
    other: {
      'business:contact_data:street_address': company.address.streetAddress,
      'business:contact_data:locality': company.address.locality,
      'business:contact_data:region': company.address.region,
      'business:contact_data:postal_code': company.address.postalCode,
      'business:contact_data:country_name': 'India',
    },
  };
}

export default function CompanyProfilePage({ params }: { params: { slug: string } }) {
  const company = getCompanyBySlug(params.slug);
  if (!company) {
    notFound();
  }

  // Fallback blocks if contentBlocks is empty
  const blocksToRender: ContentBlock[] = company.contentBlocks && company.contentBlocks.length > 0
    ? company.contentBlocks
    : [
        { type: 'header', level: 2, text: `About ${company.name}` },
        { type: 'paragraph', text: company.overview },
        {
          type: 'fact_box',
          title: 'Company Snapshot & Corporate Verification',
          items: [
            { label: 'Corporate Entity', value: company.name },
            { label: 'Headquarters', value: `${company.headquarters} (Postal Code: ${company.address.postalCode})` },
            { label: 'Founded Year', value: company.foundedYear },
            { label: 'Founders & Leadership', value: company.founders.join(', ') },
            { label: 'Official Portal', value: company.websiteUrl },
          ],
        },
        { type: 'header', level: 2, text: 'Core Solutions for K-12 Schools' },
        { type: 'bullets', items: company.coreOfferings },
        {
          type: 'header',
          level: 2,
          text: 'Notable Products & Hardware Kits',
        },
        {
          type: 'kits_grid',
          kits: company.keyProductsAndKits.map((k) => ({
            name: k.name,
            description: k.description,
            tag: 'Hardware Kit',
          })),
        },
        {
          type: 'header',
          level: 2,
          text: 'Key Institutional Strengths',
        },
        { type: 'bullets', items: company.strengths },
        {
          type: 'faq',
          faqs: company.faqs,
        },
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `https://cseel.org/info/companies/${company.slug}#organization`,
        "name": company.name,
        "alternateName": company.brandVariants,
        "url": company.websiteUrl,
        "description": company.shortDescription,
        "foundingDate": company.foundedYear,
        "founders": company.founders.map((f) => ({ "@type": "Person", "name": f })),
        "address": {
          "@type": "PostalAddress",
          "streetAddress": company.address.streetAddress,
          "addressLocality": company.address.locality,
          "addressRegion": company.address.region,
          "postalCode": company.address.postalCode,
          "addressCountry": company.address.country,
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `https://cseel.org/info/companies/${company.slug}#localbusiness`,
        "name": company.name,
        "url": company.websiteUrl,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": company.address.streetAddress,
          "addressLocality": company.address.locality,
          "addressRegion": company.address.region,
          "postalCode": company.address.postalCode,
          "addressCountry": company.address.country,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `https://cseel.org/info/companies/${company.slug}#faq`,
        "mainEntity": company.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-white min-h-screen text-slate-800">
        
        {/* 1. HERO BANNER: Authentic School/Lab Photo Clearly Visible with Clean White Centered Text (Image 3 Style) */}
        <section className="relative w-full overflow-hidden py-24 sm:py-36 px-6 text-center text-white border-b border-slate-200">
          {/* Authentic Real Photo Background - Clearly Visible! */}
          <img
            src={company.image}
            alt={company.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Clean, Subtle Dark Overlay (enough for white text contrast while keeping photo bright & clearly visible) */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Simple White Text (No extra clutter or badges) */}
          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
              {company.name}
            </h1>
            <p className="text-white/95 text-base sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              {company.shortDescription}
            </p>
          </div>
        </section>

        {/* 2. CONTENT AREA: Clean Blog Editorial Layout (Breadcrumb strip completely removed as requested) */}
        <main className="max-w-[800px] mx-auto px-6 py-12 sm:py-16 space-y-8">
          {blocksToRender.map((block, idx) => {
            switch (block.type) {
              // Header Block
              case 'header': {
                if (block.level === 3) {
                  return (
                    <h3
                      key={idx}
                      className="text-xl sm:text-2xl font-bold mt-8 mb-3 text-slate-900"
                    >
                      {block.text}
                    </h3>
                  );
                }
                return (
                  <h2
                    key={idx}
                    className="text-2xl sm:text-3xl font-black mt-10 mb-4 pb-2 border-b border-slate-200 text-[#005689] tracking-tight"
                  >
                    {block.text}
                  </h2>
                );
              }

              // Paragraph Block
              case 'paragraph': {
                return (
                  <p
                    key={idx}
                    className="text-slate-700 leading-relaxed text-base sm:text-lg mb-4"
                  >
                    {block.text}
                  </p>
                );
              }

              // Bullets Block
              case 'bullets': {
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
                    {block.items.map((item, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-[#EDF5FA] border border-[#D5E9F0] text-slate-800"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#005689] shrink-0 mt-0.5" />
                        <span className="font-medium text-sm sm:text-base leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }

              // Image Block
              case 'image': {
                return (
                  <figure
                    key={idx}
                    className="my-8 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm"
                  >
                    <img
                      src={block.url}
                      alt={block.alt || company.name}
                      className="w-full h-auto max-h-[460px] object-cover"
                    />
                    {block.caption && (
                      <figcaption className="p-3 text-center text-xs sm:text-sm text-slate-500 bg-slate-50 border-t border-slate-100 italic">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              // Video Block
              case 'video': {
                return (
                  <div
                    key={idx}
                    className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-black"
                  >
                    <iframe
                      src={block.embedUrl}
                      title={block.title || `${company.name} Video`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              }

              // Fact Box / Company Verification Snapshot Block
              case 'fact_box': {
                return (
                  <div
                    key={idx}
                    className="my-8 rounded-2xl bg-[#EDF5FA] border border-[#D5E9F0] p-6 sm:p-8"
                  >
                    <h4 className="text-lg font-bold text-[#005689] mb-4 flex items-center gap-2 border-b border-[#D5E9F0] pb-3">
                      <Building2 className="w-5 h-5 text-[#005689]" />
                      {block.title || 'Corporate Verification & Overview'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {block.items.map((item, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-3.5 rounded-xl bg-white border border-[#D5E9F0]"
                        >
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            {item.label}
                          </span>
                          {item.value.startsWith('http') ? (
                            <a
                              href={item.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm sm:text-base font-bold text-[#005689] hover:underline break-words flex items-center gap-1"
                            >
                              {item.value}
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-sm sm:text-base font-bold text-slate-800 break-words">
                              {item.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Kits Grid Block
              case 'kits_grid': {
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6"
                  >
                    {block.kits.map((kit, kIdx) => (
                      <div
                        key={kIdx}
                        className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#005689]/40 transition-all shadow-xs"
                      >
                        {kit.tag && (
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#EDF5FA] text-[#005689] text-[11px] font-bold border border-[#D5E9F0] mb-2.5">
                            {kit.tag}
                          </span>
                        )}
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                          <Cpu className="w-4 h-4 text-[#005689] shrink-0" />
                          {kit.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {kit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              }

              // FAQ Block
              case 'faq': {
                return (
                  <section key={idx} className="my-10 space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-black pb-2 border-b border-slate-200 text-[#005689] tracking-tight">
                      Frequently Asked Questions About {company.name}
                    </h2>
                    <div className="space-y-3 pt-2">
                      {block.faqs.map((faq, fqIdx) => (
                        <details
                          key={fqIdx}
                          className="group rounded-2xl bg-white border border-slate-200 p-5 shadow-xs open:shadow-sm open:border-[#005689]/40 transition-all cursor-pointer"
                        >
                          <summary className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-3 list-none">
                            <span className="flex items-center gap-2.5">
                              <HelpCircle className="w-4 h-4 text-[#005689] shrink-0" />
                              {faq.question}
                            </span>
                            <span className="text-slate-400 text-xs font-semibold group-open:rotate-180 transition-transform">
                              ▼
                            </span>
                          </summary>
                          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                            {faq.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </section>
                );
              }

              default:
                return null;
            }
          })}
        </main>

        {/* 3. FULL-WIDTH AUTO-SCROLLING CAROUSEL AT BOTTOM */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 border-t border-slate-100 pt-10">
          <CompanyCarousel companies={ROBOTICS_COMPANIES} currentSlug={company.slug} />
        </div>

      </div>
    </>
  );
}
