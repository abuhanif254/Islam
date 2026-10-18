export interface IslamicImagePreset {
  id: string;
  title: string;
  category: 'kaaba' | 'masjid' | 'quran' | 'calligraphy' | 'nature' | 'architecture';
  url: string;
  alt: string;
  caption: string;
  sourceTitle: string;
  sourceUrl: string;
}

export const ISLAMIC_IMAGE_PRESETS: IslamicImagePreset[] = [
  {
    id: 'kaaba-night',
    title: 'পবিত্র কাবা শরীফ (রাত্রিকালীন দৃশ্য)',
    category: 'kaaba',
    url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80',
    alt: 'পবিত্র মসজিদুল হারাম ও কাবা শরীফের রাতের সোনালী দৃশ্য',
    caption: 'পবিত্র মসজিদুল হারাম ও কাবা শরীফ, মক্কা মুকাররমা',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/kaaba-mecca'
  },
  {
    id: 'masjid-nabawi-green-dome',
    title: 'মসজিদে নববী ও সবুজ গম্বুজ',
    category: 'masjid',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
    alt: 'মসজিদে নববীর সবুজ গম্বুজ ও মিনার, মদিনা মুনাওয়ারা',
    caption: 'মসজিদে নববী ও রওজা মোবারক, মদিনা মুনাওয়ারা',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/prophets-mosque-medina'
  },
  {
    id: 'quran-open-rehal',
    title: 'রেহালে উন্মুক্ত পবিত্র কুরআনুল কারীম',
    category: 'quran',
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1600&q=80',
    alt: 'কাঠের রেহালে উন্মুক্ত পবিত্র কুরআন শরীফ ও তিলাওয়াত',
    caption: 'পবিত্র কুরআনুল কারীমের স্বর্ণাক্ষরে লিখিত আয়াত',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/holy-quran'
  },
  {
    id: 'quran-manuscript-gold',
    title: 'প্রাচীন স্বর্ণখচিত কুরআন পাণ্ডুলিপি',
    category: 'quran',
    url: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1600&q=80',
    alt: 'প্রাচীন সোনালী কারুকার্যখচিত কুরআনের পৃষ্ঠা',
    caption: 'ঐতিহাসিক ওসমানী ক্যালিগ্রাফিতে সংরক্ষিত কুরআন পাণ্ডুলিপি',
    sourceTitle: 'Wikimedia Commons / Unsplash',
    sourceUrl: 'https://unsplash.com/photos/quran-manuscript'
  },
  {
    id: 'dome-of-rock-quds',
    title: 'কুব্বাতুস সাখরা (ডোম অব দ্য রক), আল-কুদস',
    category: 'architecture',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1600&q=80',
    alt: 'পবিত্র মসজিদুল আকসা চত্বরে কুব্বাতুস সাখরার সোনালী গম্বুজ',
    caption: 'কুব্বাতুস সাখরা ও মসজিদুল আকসা প্রাঙ্গণ, জেরুজালেম',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/dome-of-the-rock'
  },
  {
    id: 'islamic-geometric-mosaic',
    title: 'ইসলামিক জ্যামিতিক নকশা ও মোজাইক আর্ট',
    category: 'calligraphy',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
    alt: 'মসজিদের দেয়ালের মার্জিত ইসলামিক নীল ও সোনালী জ্যামিতিক নকশা',
    caption: 'ঐতিহ্যবাহী ইসলামিক স্থাপত্য ও জ্যামিতিক মোজাইক শিল্প',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/islamic-patterns'
  },
  {
    id: 'calligraphy-allah-muhammad',
    title: 'আরবী ক্যালিগ্রাফি শিল্পকর্ম',
    category: 'calligraphy',
    url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=80',
    alt: 'মার্জিত আরবী থুলুথ লিপিতে লিখিত পবিত্র ক্যালিগ্রাফি',
    caption: 'ধ্রুপদী আরবী লিপিকলা ও ক্যালিগ্রাফি নিদর্শন',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/arabic-calligraphy'
  },
  {
    id: 'desert-camels-sunset',
    title: 'মরুভূমির সূর্যাস্ত ও আরব উপদ্বীপ',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
    alt: 'আরব মরুভূমির সোনালী বালিয়াড়ি ও গোধূলির আলো',
    caption: 'হেজাজ ও আরব উপদ্বীপের ঐতিহাসিক মরু প্রান্তর',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/desert-sunset'
  },
  {
    id: 'grand-mosque-interior-arches',
    title: 'মসজিদের সুরম্য খিলান ও স্তম্ভমালা',
    category: 'architecture',
    url: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1600&q=80',
    alt: 'ঐতিহাসিক মসজিদের অভ্যন্তরীণ নান্দনিক খিলান ও আলোকসজ্জা',
    caption: 'ইসলামী স্থাপত্যকলার অনুপম খিলান ও মর্মর স্তম্ভ',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/mosque-arches'
  },
  {
    id: 'tasbih-prayer-beads',
    title: 'তাসবীহ ও দোয়ার মোনাজাত',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    alt: 'কাঠের তাসবীহ ও আত্মশুদ্ধির যিকির',
    caption: 'মহান আল্লাহর যিকির ও অন্তরের প্রশান্তি',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/tasbih-beads'
  },
  {
    id: 'minarets-blue-sky',
    title: 'নীল আকাশে মসজিদের সুউচ্চ মিনার',
    category: 'masjid',
    url: 'https://images.unsplash.com/photo-1512632570417-a60008d1c7f5?auto=format&fit=crop&w=1600&q=80',
    alt: 'নীল দিগন্তে মসজিদের সুউচ্চ মিনার থেকে আযানের আহ্বান',
    caption: 'মসজিদের মিনার ও তাওহীদের সুউচ্চ ঘোষণা',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/mosque-minarets'
  },
  {
    id: 'lantern-ramadan-light',
    title: 'নূরানী ফানুস ও ইবাদতের আবহ',
    category: 'architecture',
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80',
    alt: 'ঐতিহ্যবাহী ইসলামিক ফানুস ও প্রদীপের স্নিগ্ধ আলো',
    caption: 'ইবাদত ও আধ্যাত্মিকতার স্নিগ্ধ রৌশনী',
    sourceTitle: 'Unsplash Photography',
    sourceUrl: 'https://unsplash.com/photos/islamic-lantern'
  }
];
