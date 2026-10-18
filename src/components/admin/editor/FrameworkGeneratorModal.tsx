'use client';

import React, { useState } from 'react';
import { X, Sparkles, Layers, Check, BookOpen, Compass, Award } from 'lucide-react';

export interface ArticleFramework {
  id: string;
  categoryName: string;
  titleSuggestion: string;
  subtitleSuggestion: string;
  summarySuggestion: string;
  keyTakeaways: string[];
  contentSections: { heading: string; body: string }[];
  references: string[];
}

export const PRESET_FRAMEWORKS: ArticleFramework[] = [
  {
    id: 'aqeedah',
    categoryName: 'তাওহীদ ও আকীদা (Pure Monotheism)',
    titleSuggestion: 'বিশুদ্ধ আকীদার মূলনীতি ও মানব মর্যাদায় তাওহীদের বৈপ্লবিক প্রভাব',
    subtitleSuggestion: 'কুরআন ও সুন্নাহর আলোকে রুবূবিয়্যাহ, উলূহিয়্যাহ ও আসমা-সিফাতের সমন্বিত বিশ্লেষণ',
    summarySuggestion: 'তাওহীদ কেবল একটি তাত্ত্বিক বিশ্বাস নয়; বরং এটি মানুষের আত্মমর্যাদা, স্বাধীন চিন্তা ও জীবনের সকল ক্ষেত্রে মহান আল্লাহর একত্ববাদের পরিপূর্ণ আনুগত্য প্রতিষ্ঠার ভিত্তিপ্রস্তর।',
    keyTakeaways: [
      'তাওহীদুল উলূহিয়্যাহ হলো সমস্ত ইবাদত একমাত্র আল্লাহর জন্য নির্দিষ্ট করা।',
      'শিরকের ক্ষুদ্রাতিক্ষুদ্র রূপ থেকে আত্মরক্ষা করা মুমিনের ঈমান সংরক্ষণের পূর্বশর্ত।',
      'আসমাউল হুসনা বা আল্লাহর গুণবাচক নামসমূহের যথার্থ উপলব্ধির মাধ্যমে তাকওয়া অর্জন।'
    ],
    contentSections: [
      {
        heading: '১. তাওহীদের পরিচয় ও মৌলিক তাৎপর্য',
        body: 'ইসলামী শরীয়াহর মূল বুনিয়াদ হলো তাওহীদ। রুবূবিয়্যাহ, উলূহিয়্যাহ এবং আসমা ওয়াস সিফাত—এই তিন শাখার সামগ্রিক সমন্বয়েই একজন মুমিনের ঈমান পরিপূর্ণতা লাভ করে। মানবজাতির আত্মিক মুক্তি ও সম্মান একমাত্র এক আল্লাহর দাসত্বের মাধ্যমেই নিশ্চিত হয়।'
      },
      {
        heading: '২. কুরআনুল কারীমের সুস্পষ্ট ঘোষণা ও প্রামাণ্য দলীল',
        body: 'পবিত্র কুরআনের মূল সুরই হলো একত্ববাদের ঘোষণা। আল্লাহ তাআলা ঘোষণা করেন যে, সমগ্র মহাবিশ্বের সৃষ্টি, পরিচালনা এবং সার্বভৌম কর্তৃত্ব একমাত্র তাঁরই করতলগত।'
      },
      {
        heading: '৩. সহীহ সুন্নাহ ও রাসূলুল্লাহ (সা.)-এর সুনির্দিষ্ট দিকনির্দেশনা',
        body: 'রাসূলুল্লাহ (সা.) মক্কার সুদীর্ঘ তেরো বছর তাওহীদের দাওয়াতের ওপর সর্বোচ্চ জোর দিয়েছিলেন। তিনি উম্মাহকে সতর্ক করেছেন যাতে প্রকাশ্য বা অপ্রকাশ্য (রিয়া বা লোকদেখানো আমল) কোনো ধরনের শিরকে লিপ্ত না হয়।'
      },
      {
        heading: '৪. সালাফে সালেহীনের বিশুদ্ধ মানহাজ ও সমকালীন সতর্কতা',
        body: 'সাহাবায়ে কিরাম ও তাবেঈনদের যুগে তাওহীদ ছিল কর্মমুখী ও জীবন্ত। আধুনিক যুগে বস্তুবাদ, অতি-প্রগতিশীলতা ও অন্ধ অনুকরণের ফাঁদ থেকে বাঁচতে সালাফে সালেহীনের বিশুদ্ধ মানহাজে ফিরে আসা অপরিহার্য।'
      }
    ],
    references: [
      'কিতাবুত তাওহীদ — ইমাম মুহাম্মদ ইবনে আব্দুল ওয়াহহাব (রহ.)',
      'আল-আকীদা আত-তাহাবিয়্যাহ — ইমাম আবু জাফর আত-তাহাবী (রহ.)',
      'মাজমুউল ফাতাওয়া — শাইখুল ইসলাম ইবনে তাইমিয়্যাহ (রহ.)'
    ]
  },
  {
    id: 'fiqh',
    categoryName: 'ফিকহ ও শরীয়াহ বিধান (Jurisprudence)',
    titleSuggestion: 'দৈনন্দিন জীবনে ইবাদত ও মুয়ামালাতের বিশুদ্ধ ফিকহী নীতিমালা',
    subtitleSuggestion: 'শরীয়াহর আলোকে বিশুদ্ধতাহীনতা নিরসন ও আমলের যথার্থ পন্থা',
    summarySuggestion: 'শরীয়াহ নির্দেশিত ফিকহী বিধিমালার সঠিক জ্ঞান অর্জন ব্যতিরেকে একজন মুমিনের সালাত, সাওম, আর্থিক লেনদেন ও পারিবারিক জীবন নিখুঁত হওয়া সম্ভব নয়।',
    keyTakeaways: [
      'আমল কবুল হওয়ার মূল শর্ত দুটি: ইখলাস এবং সুন্নাহর হুবহু অনুসরণ।',
      'ফরয ও ওয়াজিব আমলের প্রতি সর্বাধিক গুরুত্বারোপ করা।',
      'দৈনন্দিন আর্থিক লেনদেনে হালাল-হারামের সূক্ষ্ম সীমারেখা বজায় রাখা।'
    ],
    contentSections: [
      {
        heading: '১. ফিকহের গুরুত্ব ও দলীলভিত্তিক আমলের আবশ্যকতা',
        body: 'দ্বীনের গভীর প্রজ্ঞা ও ফিকহ অর্জন করা মহান আল্লাহর বিশেষ অনুগ্রহের নিদর্শন। যে ব্যক্তি কোনো আমল করার পূর্বে তার শরীয়াহর হুকুম জেনে নেয়, সে ভুল ও ভ্রষ্টতা থেকে নিরাপদ থাকে।'
      },
      {
        heading: '২. কুরআন ও সুন্নাহর আলোকে মূল বিধান ও শর্তাবলী',
        body: 'যেকোনো ইবাদতের জন্য কিছু আবশ্যিক রুকন ও শর্ত রয়েছে। এই শর্তসমূহ পালনে গাফিলতি করলে বাহ্যিক আমল সম্পাদন হলেও তার আধ্যাত্মিক সুফল লাভ করা যায় না।'
      },
      {
        heading: '৩. ফুকাহায়ে কেরামের ঐকমত্য ও মাসআলার সূক্ষ্ম ব্যাখ্যা',
        body: 'সালাফ ও ফুকাহায়ে কেরাম অত্যন্ত নিষ্ঠার সাথে পবিত্র কুরআন ও হাদিস গবেষণা করে উম্মাহর জন্য সহজ ও সুশৃঙ্খল নীতিমালা প্রণয়ন করেছেন।'
      },
      {
        heading: '৪. সমকালীন বাস্তবতায় প্রয়োগ ও সাধারণ ভুলের সমাধান',
        body: 'আমাদের সমাজে প্রচলিত বহু ভুল ধারণা ও বেদআতী রেওয়াজ থেকে বেঁচে থেকে বিশুদ্ধ সুন্নাহসম্মত পদ্ধতিতে আমল সম্পাদন করা প্রত্যেক সচেতন মুসলিমের ঈমানী দায়িত্ব।'
      }
    ],
    references: [
      'আল-ফিকহুল ইসলামী ওয়া আদিল্লাতুহু — ড. ওহাবা আয-যুহাইলী',
      'রিয়াদুস সালেহীন — ইমাম নববী (রহ.)',
      'বুলূগুল মারাম — হাফেয ইবনে হাজার আসকালানী (রহ.)'
    ]
  },
  {
    id: 'sirat',
    categoryName: 'সীরাতুন্নবী ও আম্বিয়ায়ে কেরাম (Prophetic Biography)',
    titleSuggestion: 'রাসূলুল্লাহ (সা.)-এর পবিত্র সীরাত: উম্মাহর পুনর্জাগরণ ও নৈতিক বিপ্লবের চিরন্তন রূপরেখা',
    subtitleSuggestion: 'নবুওয়াতী দাওয়াত, মদিনার সনদ ও বিশ্ব মানবতার পথপ্রদর্শনের প্রামাণ্য ইতিহাস',
    summarySuggestion: 'নবীজি (সা.)-এর জীবনচরিত কেবল অতীতের কোনো বীরত্বগাথা নয়; বরং এটি প্রতিটি যুগের ন্যায়পরায়ণ সমাজ, ইনসাফভিত্তিক রাষ্ট্র এবং চারিত্রিক উৎকর্ষের অনুপম আলোকবর্তিকা।',
    keyTakeaways: [
      'রাসূলুল্লাহ (সা.)-এর অনুপম আখলাকই ছিল দাওয়াতের সবচেয়ে বড় অস্ত্র।',
      'হিকমত ও ধৈর্যের মাধ্যমে কঠিনতম প্রতিকূলতা জয় করার নবুওয়াতী সুন্নাত।',
      'ব্যক্তিজীবন থেকে সমাজ ও রাষ্ট্র পরিচালনা পর্যন্ত সীরাতের সামগ্রিক অনুসরণ।'
    ],
    contentSections: [
      {
        heading: '১. নবুওয়াতের প্রাক্কাল ও দাওয়াতের প্রাথমিক অধ্যায়',
        body: 'জাহেলিয়াতের ঘোর অন্ধকারে যখন পৃথিবী নিমজ্জিত ছিল, তখন হেরা গুহার ঐশ্বরিক আলো সমগ্র মানবজাতির জন্য নবদিগন্ত উন্মোচিত করে। সত্যবাদিতা, সততা ও আমানতদারির মাধ্যমে নবীজি (সা.) তাঁর দাওয়াতি জীবনের ভিত্তি স্থাপন করেছিলেন।'
      },
      {
        heading: '২. মক্কার কঠিন পরীক্ষা ও ঈমানের ঐতিহাসিক দৃঢ়তা',
        body: 'প্রতিকূল পরিবেশ, সামাজিক বয়কট ও নির্মম নির্যাতনের মুখেও নবীজি (সা.) ও তাঁর সাহাবীগণ যে ধৈর্য ও অটলতার পরিচয় দিয়েছিলেন, তা কিয়ামত পর্যন্ত ঈমানদারদের জন্য অনুপ্রেরণার উৎস।'
      },
      {
        heading: '৩. হিজরত ও মদিনায় আদর্শ ইসলামী সমাজের রূপরেখা',
        body: 'মদিনায় হিজরতের পর ভ্রাতৃত্ব প্রতিষ্ঠা, মদিনার ঐতিহাসিক সনদ এবং ইনসাফপূর্ণ শাসনব্যবস্থা কায়েম করে নবীজি (সা.) প্রমাণ করেছেন যে, ইসলাম একটি পূর্ণাঙ্গ জীবনবিধান।'
      },
      {
        heading: '৪. বিদায় হজের ঐতিহাসিক ভাষণ ও সমকালীন প্রাসঙ্গিকতা',
        body: 'বিদায় হজের ভাষণে মানবাধিকার, বর্ণবৈষম্যের বিলোপ, নারীর মর্যাদা এবং সুদমুক্ত অর্থনীতির যে অমোঘ ঘোষণা দেওয়া হয়েছিল, তা আজকের বিশ্বেও মানবমুক্তির একমাত্র দিকদর্শন।'
      }
    ],
    references: [
      'আর-রাহীকুল মাখতূম — শফিউর রহমান মুবারকপুরী (রহ.)',
      'যাদুল মাআদ — ইমাম ইবনুল কাইয়্যিম আল-জাওযিয়্যাহ (রহ.)',
      'আল-বিদায়া ওয়ান নিহায়া — হাফেয ইবনে কাসীর (রহ.)'
    ]
  },
  {
    id: 'quran',
    categoryName: 'তাফসীর ও উলূমুল কুরআন (Quranic Exegesis)',
    titleSuggestion: 'কুরআনুল কারীমের তাদাব্বুর ও জীবনঘনিষ্ঠ তাফসীরের প্রামাণ্য রূপরেখা',
    subtitleSuggestion: 'শানে নুযূল, আরবী অলঙ্কারশাস্ত্র ও সমকালীন প্রেক্ষাপটে মহিমান্বিত বাণীর অনুধাবন',
    summarySuggestion: 'পবিত্র কুরআন কেবল তিলাওয়াতের জন্য নয়; বরং এর প্রতিটি আয়াতের গভীরে চিন্তা-গবেষণা (তাদাব্বুর) এবং বাস্তব জীবনের প্রতিটি পদক্ষেপে এর হেদায়েত গ্রহণ করাই কুরআন নাযিলের মূল উদ্দেশ্য।',
    keyTakeaways: [
      'কুরআন বোঝার মূল উপায় হলো কুরআনের তাফসীর কুরআনের মাধ্যমে এবং সহীহ হাদিসের মাধ্যমে করা।',
      'শানে নুযূল বা নাযিলের প্রেক্ষাপট জানার মাধ্যমে আয়াতের সঠিক মর্ম উপলব্ধি।',
      'দৈনন্দিন চিন্তাভাবনা ও চরিত্রে কুরআনী মূল্যবোধকে স্থান দেওয়া।'
    ],
    contentSections: [
      {
        heading: '১. সূরা বা আয়াতের শানে নুযূল ও ঐতিহাসিক প্রেক্ষাপট',
        body: 'আল্লাহ রাব্বুল আলামীন কোনো আয়াত অবতীর্ণ করার পেছনে যে বিশেষ কারণ বা দিকনির্দেশনা দিয়েছেন, তা যথাযথভাবে জানা থাকলে তাফসীর অনুধাবন সহজ ও নির্ভুল হয়।'
      },
      {
        heading: '২. ভাষাতাত্ত্বিক সৌন্দর্য ও গভীর অর্থবোধকতা',
        body: 'কুরআনের আরবী শব্দচয়ন এমন এক অলৌকিক ভারসাম্যপূর্ণ যে, একটি শব্দের পরিবর্তনেও গোটা বাক্যের অর্থ ও গভীরতায় তারতম্য সৃষ্টি হতে পারে।'
      },
      {
        heading: '৩. মুফাসসিরীনে কেরামের প্রামাণ্য ব্যাখ্যা ও শিক্ষা',
        body: 'সালাফ ও শীর্ষস্থানীয় মুফাসসিরগণ এই আয়াতের মাধ্যমে মানবজাতির আত্মিক পরিশুদ্ধি ও সমাজ গঠনের যে অমূল্য দিকনির্দেশনা উদ্ধার করেছেন, তা অতীব প্রণিধানযোগ্য।'
      },
      {
        heading: '৪. দৈনন্দিন জীবন ও আত্মশুদ্ধিতে কুরআনের প্রয়োগ',
        body: 'কুরআন হলো অন্তরের ব্যাধির মহৌষধ। প্রতিদিনের কর্মব্যস্ত জীবনে কুরআনের সাথে জীবন্ত সম্পর্ক রাখা মুমিনের অন্যতম শ্রেষ্ঠ পাথেয়।'
      }
    ],
    references: [
      'তাফসীরে ইবনে কাসীর — হাফেয ইবনে কাসীর (রহ.)',
      'তাফসীরে আত-তাবারী — ইমাম ইবনে জারীর আত-তাবারী (রহ.)',
      'তাফসীরুল কুরতুবী — ইমাম আবু আব্দুল্লাহ আল-কুরতুবী (রহ.)'
    ]
  },
  {
    id: 'sahaba',
    categoryName: 'সাহাবায়ে কেরাম ও সোনালী প্রজন্ম (The Golden Generation)',
    titleSuggestion: 'সাহাবায়ে কিরামের ঈমানদীপ্ত আত্মত্যাগ ও সত্যের মাপকাঠি হিসেবে সোনালী প্রজন্ম',
    subtitleSuggestion: 'খুলাফায়ে রাশেদীন ও আশারায়ে মুবাশশারাহর জীবনী থেকে সমকালীন পাথেয়',
    summarySuggestion: 'রাসূলুল্লাহ (সা.)-এর সরাসরি সান্নিধ্যে গড়ে ওঠা সোনালী প্রজন্ম সাহাবায়ে কিরাম ছিলেন ঈমান, আমল ও ত্যাগের সর্বোচ্চ শিখরে অধিষ্ঠিত এক অনন্য কাফেলা।',
    keyTakeaways: [
      'সাহাবায়ে কিরামের প্রতি ভালোবাসা ও তাঁদের মানহাজ অনুসরণ আহলুস সুন্নাহর মৌলিক আকীদা।',
      'দ্বীনের স্বার্থে পার্থিব ধন-সম্পদ ও প্রাণ বিসর্জন দেওয়ার অনুপম দৃষ্টান্ত।',
      'ইসলামী খেলাফত ও রাষ্ট্র পরিচালনায় সততা, ইনসাফ ও জবাবদিহিতা।'
    ],
    contentSections: [
      {
        heading: '১. সোনালী প্রজন্মের অনন্য মর্যাদা ও কুরআনের প্রশংসা',
        body: 'আল্লাহ তাআলা সাহাবায়ে কিরামের ওপর সন্তুষ্টি ঘোষণা করেছেন এবং তাঁদেরকে কিয়ামত পর্যন্ত সত্যের মাপকাঠি ও আদর্শ হিসেবে সম্মানিত করেছেন।'
      },
      {
        heading: '২. দ্বীনের তরে সর্বস্ব ত্যাগের ঈমানদীপ্ত ঘটনাবলী',
        body: 'মক্কার চরম নির্যাতন থেকে শুরু করে বদর, ওহুদ ও খন্দকের রণাঙ্গনে সাহাবায়ে কিরাম যে ত্যাগ স্বীকার করেছেন, তা মানব ইতিহাসের অন্যতম শ্রেষ্ঠ অধ্যায়।'
      },
      {
        heading: '৩. খেলাফত পরিচালনা ও মানবকল্যাণে অবিস্মরণীয় অবদান',
        body: 'খুলাফায়ে রাশেদীনের শাসনকাল ছিল ইনসাফ ও নিরাপত্তার সোনালী যুগ। কোনো নাগরিক যাতে অধিকারবঞ্চিত না হয়, সে ব্যাপারে খলীফাগণ ছিলেন সদা জাগ্রত।'
      },
      {
        heading: '৪. বর্তমান প্রজন্মের জন্য সাহাবা চরিত্রের অনুকরণীয় শিক্ষা',
        body: 'আজকের বিপথগামী যুবসমাজের জন্য সাহাবায়ে কিরামের জীবনচরিতেই রয়েছে সত্যিকার বীরত্ব, চরিত্রবান নেতৃত্ব ও সফলতার চাবিকাঠি।'
      }
    ],
    references: [
      'সিয়ারু আলামিন নুবালা — ইমাম শামসুদ্দীন আয-যাহাবী (রহ.)',
      'আল-ইসাবাহ ফী তাময়ীযিস সাহাবাহ — হাফেয ইবনে হাজার আসকালানী (রহ.)',
      'উসুদুল গাবাহ — ইবনুল আসীর (রহ.)'
    ]
  }
];

interface FrameworkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFramework: (framework: ArticleFramework) => void;
}

export default function FrameworkGeneratorModal({
  isOpen,
  onClose,
  onApplyFramework
}: FrameworkGeneratorModalProps) {
  const [selectedId, setSelectedId] = useState<string>('aqeedah');

  if (!isOpen) return null;

  const currentFramework = PRESET_FRAMEWORKS.find((f) => f.id === selectedId) || PRESET_FRAMEWORKS[0];

  const handleApply = () => {
    onApplyFramework(currentFramework);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141615]/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] dark:bg-[#171F1D] border-2 border-[#141615] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#B85D19] text-white p-4 flex items-center justify-between border-b-2 border-[#141615]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            <h3 className="font-editorial text-lg font-bold">
              আর্টিকেল আউটলাইন ও ফ্রেমওয়ার্ক জেনারেটর (Article Framework Co-Pilot)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#9B4E15] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* LEFT 4 COLS: PRESET LIST */}
          <div className="md:col-span-4 bg-[#FFFFFF] dark:bg-[#1A2421] border-r border-[#DCD7CD] dark:border-[#2A3834] p-3 overflow-y-auto space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#6E7571] dark:text-[#9BA39F] block px-1">
              প্রস্তাবিত ইসলামী বিষয় নির্বাচন করুন:
            </span>
            {PRESET_FRAMEWORKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left p-3 border transition-colors ${
                  selectedId === item.id
                    ? 'bg-[#FAF8F5] dark:bg-[#1F2926] border-[#B85D19] shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-[#FAF8F5] dark:hover:bg-[#1F2926]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                    {item.categoryName}
                  </span>
                  {selectedId === item.id && <Check className="w-4 h-4 text-[#B85D19]" />}
                </div>
                <p className="text-[11px] text-[#6E7571] dark:text-[#9BA39F] mt-1 line-clamp-1">
                  {item.titleSuggestion}
                </p>
              </button>
            ))}
          </div>

          {/* RIGHT 8 COLS: PREVIEW OF THE OUTLINE */}
          <div className="md:col-span-8 p-5 overflow-y-auto space-y-4">
            <div className="border-b border-[#DCD7CD] dark:border-[#2A3834] pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#B85D19] text-white">
                ফ্রেমওয়ার্ক রূপরেখা প্রিভিউ
              </span>
              <h4 className="font-editorial text-base sm:text-lg font-bold text-[#0B4F3B] dark:text-[#4CC39A] mt-2">
                {currentFramework.titleSuggestion}
              </h4>
              <p className="text-xs font-medium text-[#6E7571] dark:text-[#9BA39F] mt-0.5">
                {currentFramework.subtitleSuggestion}
              </p>
            </div>

            {/* SECTIONS LIST */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#141615] dark:text-[#E8E6E1] block">
                অন্তর্ভুক্ত {currentFramework.contentSections.length}টি মূল অনুচ্ছেদ কাঠামো:
              </span>
              {currentFramework.contentSections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#2A3834] space-y-1"
                >
                  <span className="text-xs font-bold text-[#B85D19] block">{sec.heading}</span>
                  <p className="text-xs text-[#4A4F4C] dark:text-[#C2C8C5] line-clamp-2">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            {/* KEY TAKEAWAYS */}
            <div className="p-3 bg-[#E6F0EC] dark:bg-[#15332A] border border-[#0B4F3B]/30 space-y-1.5 text-xs">
              <span className="font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>প্রস্তাবিত ৩টি মূল শিক্ষা (Takeaways)</span>
              </span>
              <ul className="list-disc pl-5 space-y-1 text-[#141615] dark:text-[#E8E6E1]">
                {currentFramework.keyTakeaways.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            {/* REFERENCES */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#6E7571]">প্রস্তাবিত নির্ভরযোগ্য তথ্যসূত্র:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentFramework.references.map((r, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#2A3834] text-[11px]"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#FFFFFF] dark:bg-[#1A2421] border-t border-[#DCD7CD] dark:border-[#2A3834] p-4 flex items-center justify-between">
          <span className="text-xs text-[#6E7571]">
            * এটি প্রয়োগ করলে এডিটরে নতুন শিরোনাম, অনুচ্ছেদ ও সারসংক্ষেপ তৈরি হবে।
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold border border-[#DCD7CD] text-[#6E7571] hover:text-[#141615]"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-xs font-bold bg-[#B85D19] hover:bg-[#9B4E15] text-white flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>এই ফ্রেমওয়ার্কটি ফর্মে প্রয়োগ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
