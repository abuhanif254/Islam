import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ইসলাম — প্রামাণ্য ডিজিটাল বিশ্বকোষ',
    short_name: 'ইসলাম',
    description:
      'কুরআন, সুন্নাহ ও প্রামাণ্য তাহকীকভিত্তিক বাংলা ডিজিটাল প্ল্যাটফর্ম। বিজ্ঞাপনমুক্ত, নির্ভেজাল ও প্রামাণ্য দ্বীনি সমাধান।',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#0B4F3B',
    orientation: 'portrait',
    lang: 'bn-BD',
    dir: 'ltr',
    categories: ['education', 'lifestyle', 'reference', 'books'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable'
      }
    ]
  };
}
