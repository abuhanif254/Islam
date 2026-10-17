import type { Metadata } from 'next';
import './globals.css';
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, getWebsiteJsonLd, getOrganizationJsonLd } from '@/lib/seo';

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
    'Islam Bangla Portal',
    'Quran Tafsir Bengali',
    'Hadith Bengali',
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
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: 'ইসলাম',
    locale: 'bn_BD',
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
  manifest: '/site.webmanifest',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = getWebsiteJsonLd();
  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <html lang="bn" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
