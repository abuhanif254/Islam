// ============================================================================
// হিজরি ক্যালেন্ডার ও ইসলামী দিবস ক্যালকুলেটর (Hijri Calendar Engine)
// Standardized on Umm al-Qura / South Asian Moon Sighting Logic
// ============================================================================

import { toBengaliDigits } from './prayer-times';

export interface HijriDateInfo {
  day: number;
  monthIndex: number; // 0-11
  year: number;
  monthNameBn: string;
  monthNameAr: string;
  fullDateBn: string;
  fullDateAr: string;
  isWhiteDay: boolean; // আইয়ামে বীজ (১৩, ১৪, ১৫ তারিখ)
  upcomingEvent?: IslamicEvent;
}

export interface IslamicEvent {
  nameBn: string;
  nameAr: string;
  monthIndex: number;
  day: number;
  description: string;
}

export const HIJRI_MONTHS = [
  { nameBn: 'মুহাররম', nameAr: 'المُحَرَّم', isSacred: true },
  { nameBn: 'সফর', nameAr: 'صَفَر', isSacred: false },
  { nameBn: 'রবিউল আউয়াল', nameAr: 'رَبِيع الأَوَّل', isSacred: false },
  { nameBn: 'রবিউস সানি', nameAr: 'رَبِيع الآخِر', isSacred: false },
  { nameBn: 'জমাদিউল আউয়াল', nameAr: 'جُمَادَى الأُولَى', isSacred: false },
  { nameBn: 'জমাদিউস সানি', nameAr: 'جُمَادَى الآخِرَة', isSacred: false },
  { nameBn: 'রজব', nameAr: 'رَجَب', isSacred: true },
  { nameBn: 'শাবান', nameAr: 'شَعْبَان', isSacred: false },
  { nameBn: 'রমাদান', nameAr: 'رَمَضَان', isSacred: false },
  { nameBn: 'শাওয়াল', nameAr: 'شَوَّال', isSacred: false },
  { nameBn: 'জিলকদ', nameAr: 'ذُو القَعْدَة', isSacred: true },
  { nameBn: 'জিলহজ্জ', nameAr: 'ذُو الحِجَّة', isSacred: true },
];

export const MAJOR_ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    nameBn: 'পবিত্র আশুরা',
    nameAr: 'يوم عاشوراء',
    monthIndex: 0,
    day: 10,
    description: 'হযরত মূসা (আ.)-এর ফেরাউন থেকে নাজাত ও কারবালার ঐতিহাসিক শাহাদাত।',
  },
  {
    nameBn: 'লাইলাতুল মিরাজ',
    nameAr: 'الإسراء والمعراج',
    monthIndex: 6,
    day: 27,
    description: 'নবী করীম (সা.)-এর ঊর্ধ্বাকাশ ভ্রমণ ও পাঁচ ওয়াক্ত সালাত উপহার লাভ।',
  },
  {
    nameBn: 'শবে বরাত (লাইলাতুল নিসফি মিন শাবান)',
    nameAr: 'ليلة النصف من شعبان',
    monthIndex: 7,
    day: 15,
    description: 'ভাগ্য ও ক্ষমার মহিমান্বিত রজনী।',
  },
  {
    nameBn: 'মাহে রমাদানের সূচনা',
    nameAr: 'أول شهر رمضان',
    monthIndex: 8,
    day: 1,
    description: 'সিয়াম সাধনা ও পবিত্র কুরআন নাজিলের মোবারক মাস।',
  },
  {
    nameBn: 'লাইলাতুল কদর',
    nameAr: 'ليلة القدر',
    monthIndex: 8,
    day: 27,
    description: 'হাজার মাসের চেয়েও শ্রেষ্ঠ বরকতময় রজনী।',
  },
  {
    nameBn: 'পবিত্র ঈদুল ফিতর',
    nameAr: 'عيد الفطر المبارك',
    monthIndex: 9,
    day: 1,
    description: 'রমাদান সমাপনী ও আনন্দ উৎসবের মহাসম্মেলন।',
  },
  {
    nameBn: 'ইয়াওমে আরাফাহ',
    nameAr: 'يوم عرفة',
    monthIndex: 11,
    day: 9,
    description: 'হজের মূল রুকন ও সগীরা গুনাহ মাফের দিন।',
  },
  {
    nameBn: 'পবিত্র ঈদুল আযহা ও কুরবানী',
    nameAr: 'عيد الأضحى المبارك',
    monthIndex: 11,
    day: 10,
    description: 'হযরত ইবরাহীম (আ.) ও ইসমাঈল (আ.)-এর মহান আত্মত্যাগের স্মারক।',
  },
];

/**
 * Astronomical Kuwaiti Algorithm with Moon-Sighting Adjustment
 * @param date Gregorian date
 * @param adjustmentDays +/- 1 or 2 days for local moon sighting in Bangladesh
 */
export function getHijriDate(date: Date = new Date(), adjustmentDays: number = 0): HijriDateInfo {
  // Apply moon sighting adjustment offset
  const targetDate = new Date(date.getTime() + adjustmentDays * 24 * 3600000);

  let day = targetDate.getDate();
  let month = targetDate.getMonth();
  let year = targetDate.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  let jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524;

  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4);
  }
  let bb = jd + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  let dd = Math.floor(365.25 * cc);
  let ee = Math.floor((bb - dd) / 30.6001);
  day = bb - dd - Math.floor(30.6001 * ee);
  month = ee - 1;
  if (ee > 13) {
    cc += 1;
    month = ee - 13;
  }
  year = cc - 4716;

  let wd = (jd + 1) % 7;

  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  m = Math.floor((24 * l) / 709);
  day = l - Math.floor((709 * m) / 24);
  y = 30 * n + j - 30;

  let hijriMonthIdx = m - 1;
  if (hijriMonthIdx < 0) hijriMonthIdx = 11;
  if (hijriMonthIdx > 11) hijriMonthIdx = 0;

  const monthObj = HIJRI_MONTHS[hijriMonthIdx];

  // Check if it's Ayyam al-Beed (White Days: 13, 14, 15)
  const isWhiteDay = day === 13 || day === 14 || day === 15;

  // Find nearest upcoming major event
  const upcomingEvent = MAJOR_ISLAMIC_EVENTS.find(
    e => e.monthIndex === hijriMonthIdx && Math.abs(e.day - day) <= 5
  );

  const dayBn = toBengaliDigits(day);
  const yearBn = toBengaliDigits(y);

  return {
    day,
    monthIndex: hijriMonthIdx,
    year: y,
    monthNameBn: monthObj.nameBn,
    monthNameAr: monthObj.nameAr,
    fullDateBn: `${dayBn} ${monthObj.nameBn} ${yearBn} হিজরি`,
    fullDateAr: `${day} ${monthObj.nameAr} ${y} هـ`,
    isWhiteDay,
    upcomingEvent,
  };
}
