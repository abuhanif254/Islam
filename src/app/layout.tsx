import type { Metadata } from 'next';
import { Amiri, Hind_Siliguri, Noto_Serif_Bengali } from 'next/font/google';
import './globals.css';
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  GEO_CONSTANTS,
  PHONETIC_SEARCH_KEYWORDS,
  getWebsiteJsonLd,
  getOrganizationJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | ইসলাম',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'ইসলাম',
    'কুরআন',
    'হাদিস',
    'আল্লাহ',
    'তাওহীদ',
    'নবী ও রাসুল',
    'সাহাবী',
    'ফেরেস্তা',
    'ফিকহ',
    'জান্নাত',
    'জাহান্নাম',
    'জান্নাতুল ফিরদাউস',
    'বাংলা তাফসীর',
    'সহীহ বুখারী',
    'ইসলামিক জ্ঞানকোষ',
    'সালাতের সময়সূচি',
    'হিজরি ক্যালেন্ডার',
    'Islam Bangla Portal',
    'Quran Tafsir Bengali',
    'Hadith Bengali',
    ...PHONETIC_SEARCH_KEYWORDS,
  ],
  authors: [{ name: 'ইসলাম সম্পাদকীয় পর্ষদ' }],
  creator: 'ইসলাম ডিজিটাল ম্যাগাজিন ও বিশ্বকোষ',
  publisher: 'ইসলাম পোর্টাল বাংলাদেশ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      'bn-BD': `${SITE_URL}/`,
      'bn-IN': `${SITE_URL}/`,
    },
  },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: 'ইসলাম',
    locale: 'bn_BD',
    alternateLocale: ['bn_IN', 'ar', 'en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': GEO_CONSTANTS.region,
    'geo.placename': GEO_CONSTANTS.placename,
    'geo.position': GEO_CONSTANTS.position,
    'ICBM': GEO_CONSTANTS.icbm,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-noto-serif-bengali',
  display: 'swap',
});

const speculationRules = {
  prerender: [
    {
      source: 'list',
      urls: [
        '/allah/',
        '/angels/',
        '/quran/',
        '/hadith/',
        '/prophets/',
        '/sahabi/',
        '/fiqh/',
        '/jannat/',
        '/jahannam/',
        '/prayer-times/'
      ],
      eagerness: 'moderate'
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = getWebsiteJsonLd();
  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <html
      lang="bn"
      dir="ltr"
      className={`scroll-smooth ${amiri.variable} ${hindSiliguri.variable} ${notoSerifBengali.variable}`}
    >
      <head>
        <link rel="help" href="/llms.txt" type="text/markdown" title="LLMs Context Guide" />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] text-[#141615] antialiased">
        {children}
      </body>
    </html>
  );
}
