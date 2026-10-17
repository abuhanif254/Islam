// ============================================================================
// সালাতের সময়সূচি (Islamic Prayer Times Engine)
// Standardized on Islamic Foundation Bangladesh / Karachi Methodology
// ============================================================================

export interface CityOffset {
  name: string;
  nameBn: string;
  divisionBn?: string;
  fajrOffset: number; // minutes from Dhaka
  sunriseOffset: number;
  dhuhrOffset: number;
  asrOffset: number;
  maghribOffset: number;
  ishaOffset: number;
}

export const BANGLADESH_CITIES: Record<string, CityOffset> = {
  // ঢাকা বিভাগ (১৩টি জেলা)
  dhaka: { name: 'Dhaka', nameBn: 'ঢাকা', divisionBn: 'ঢাকা', fajrOffset: 0, sunriseOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0 },
  gazipur: { name: 'Gazipur', nameBn: 'গাজীপুর', divisionBn: 'ঢাকা', fajrOffset: 0, sunriseOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0 },
  narayanganj: { name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', divisionBn: 'ঢাকা', fajrOffset: -1, sunriseOffset: -1, dhuhrOffset: -1, asrOffset: -1, maghribOffset: -1, ishaOffset: -1 },
  tangail: { name: 'Tangail', nameBn: 'টাঙ্গাইল', divisionBn: 'ঢাকা', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2 },
  faridpur: { name: 'Faridpur', nameBn: 'ফরিদপুর', divisionBn: 'ঢাকা', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2 },
  gopalganj: { name: 'Gopalganj', nameBn: 'গোপালগঞ্জ', divisionBn: 'ঢাকা', fajrOffset: 3, sunriseOffset: 3, dhuhrOffset: 3, asrOffset: 3, maghribOffset: 3, ishaOffset: 3 },
  kishoreganj: { name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', divisionBn: 'ঢাকা', fajrOffset: -2, sunriseOffset: -2, dhuhrOffset: -2, asrOffset: -2, maghribOffset: -2, ishaOffset: -2 },
  madaripur: { name: 'Madaripur', nameBn: 'মাদারীপুর', divisionBn: 'ঢাকা', fajrOffset: 1, sunriseOffset: 1, dhuhrOffset: 1, asrOffset: 1, maghribOffset: 1, ishaOffset: 1 },
  manikganj: { name: 'Manikganj', nameBn: 'মানিকগঞ্জ', divisionBn: 'ঢাকা', fajrOffset: 1, sunriseOffset: 1, dhuhrOffset: 1, asrOffset: 1, maghribOffset: 1, ishaOffset: 1 },
  munshiganj: { name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', divisionBn: 'ঢাকা', fajrOffset: -1, sunriseOffset: -1, dhuhrOffset: -1, asrOffset: -1, maghribOffset: -1, ishaOffset: -1 },
  narsingdi: { name: 'Narsingdi', nameBn: 'নরসিংদী', divisionBn: 'ঢাকা', fajrOffset: -1, sunriseOffset: -1, dhuhrOffset: -1, asrOffset: -1, maghribOffset: -1, ishaOffset: -1 },
  rajbari: { name: 'Rajbari', nameBn: 'রাজবাড়ী', divisionBn: 'ঢাকা', fajrOffset: 3, sunriseOffset: 3, dhuhrOffset: 3, asrOffset: 3, maghribOffset: 3, ishaOffset: 3 },
  shariatpur: { name: 'Shariatpur', nameBn: 'শরীয়তপুর', divisionBn: 'ঢাকা', fajrOffset: 0, sunriseOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0 },

  // চট্টগ্রাম বিভাগ (১১টি জেলা)
  chittagong: { name: 'Chittagong', nameBn: 'চট্টগ্রাম', divisionBn: 'চট্টগ্রাম', fajrOffset: -5, sunriseOffset: -5, dhuhrOffset: -5, asrOffset: -5, maghribOffset: -5, ishaOffset: -5 },
  'coxs-bazar': { name: "Cox's Bazar", nameBn: 'কক্সবাজার', divisionBn: 'চট্টগ্রাম', fajrOffset: -6, sunriseOffset: -6, dhuhrOffset: -6, asrOffset: -6, maghribOffset: -6, ishaOffset: -6 },
  cumilla: { name: 'Cumilla', nameBn: 'কুমিল্লা', divisionBn: 'চট্টগ্রাম', fajrOffset: -3, sunriseOffset: -3, dhuhrOffset: -3, asrOffset: -3, maghribOffset: -3, ishaOffset: -3 },
  feni: { name: 'Feni', nameBn: 'ফেনী', divisionBn: 'চট্টগ্রাম', fajrOffset: -4, sunriseOffset: -4, dhuhrOffset: -4, asrOffset: -4, maghribOffset: -4, ishaOffset: -4 },
  brahmanbaria: { name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', divisionBn: 'চট্টগ্রাম', fajrOffset: -3, sunriseOffset: -3, dhuhrOffset: -3, asrOffset: -3, maghribOffset: -3, ishaOffset: -3 },
  chandpur: { name: 'Chandpur', nameBn: 'চাঁদপুর', divisionBn: 'চট্টগ্রাম', fajrOffset: -1, sunriseOffset: -1, dhuhrOffset: -1, asrOffset: -1, maghribOffset: -1, ishaOffset: -1 },
  lakshmipur: { name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', divisionBn: 'চট্টগ্রাম', fajrOffset: -2, sunriseOffset: -2, dhuhrOffset: -2, asrOffset: -2, maghribOffset: -2, ishaOffset: -2 },
  noakhali: { name: 'Noakhali', nameBn: 'নোয়াখালী', divisionBn: 'চট্টগ্রাম', fajrOffset: -3, sunriseOffset: -3, dhuhrOffset: -3, asrOffset: -3, maghribOffset: -3, ishaOffset: -3 },
  bandarban: { name: 'Bandarban', nameBn: 'বান্দরবান', divisionBn: 'চট্টগ্রাম', fajrOffset: -7, sunriseOffset: -7, dhuhrOffset: -7, asrOffset: -7, maghribOffset: -7, ishaOffset: -7 },
  khagrachhari: { name: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', divisionBn: 'চট্টগ্রাম', fajrOffset: -6, sunriseOffset: -6, dhuhrOffset: -6, asrOffset: -6, maghribOffset: -6, ishaOffset: -6 },
  rangamati: { name: 'Rangamati', nameBn: 'রাঙ্গামাটি', divisionBn: 'চট্টগ্রাম', fajrOffset: -7, sunriseOffset: -7, dhuhrOffset: -7, asrOffset: -7, maghribOffset: -7, ishaOffset: -7 },

  // সিলেট বিভাগ (৪টি জেলা)
  sylhet: { name: 'Sylhet', nameBn: 'সিলেট', divisionBn: 'সিলেট', fajrOffset: -6, sunriseOffset: -6, dhuhrOffset: -6, asrOffset: -6, maghribOffset: -6, ishaOffset: -6 },
  moulvibazar: { name: 'Moulvibazar', nameBn: 'মৌলভীবাজার', divisionBn: 'সিলেট', fajrOffset: -5, sunriseOffset: -5, dhuhrOffset: -5, asrOffset: -5, maghribOffset: -5, ishaOffset: -5 },
  habiganj: { name: 'Habiganj', nameBn: 'হবিগঞ্জ', divisionBn: 'সিলেট', fajrOffset: -4, sunriseOffset: -4, dhuhrOffset: -4, asrOffset: -4, maghribOffset: -4, ishaOffset: -4 },
  sunamganj: { name: 'Sunamganj', nameBn: 'সুনামগঞ্জ', divisionBn: 'সিলেট', fajrOffset: -4, sunriseOffset: -4, dhuhrOffset: -4, asrOffset: -4, maghribOffset: -4, ishaOffset: -4 },

  // রাজশাহী বিভাগ (৮টি জেলা)
  rajshahi: { name: 'Rajshahi', nameBn: 'রাজশাহী', divisionBn: 'রাজশাহী', fajrOffset: 7, sunriseOffset: 7, dhuhrOffset: 7, asrOffset: 7, maghribOffset: 7, ishaOffset: 7 },
  bogura: { name: 'Bogura', nameBn: 'বগুড়া', divisionBn: 'রাজশাহী', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4 },
  pabna: { name: 'Pabna', nameBn: 'পাবনা', divisionBn: 'রাজশাহী', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4 },
  sirajganj: { name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', divisionBn: 'রাজশাহী', fajrOffset: 3, sunriseOffset: 3, dhuhrOffset: 3, asrOffset: 3, maghribOffset: 3, ishaOffset: 3 },
  naogaon: { name: 'Naogaon', nameBn: 'নওগাঁ', divisionBn: 'রাজশাহী', fajrOffset: 6, sunriseOffset: 6, dhuhrOffset: 6, asrOffset: 6, maghribOffset: 6, ishaOffset: 6 },
  natore: { name: 'Natore', nameBn: 'নাটোর', divisionBn: 'রাজশাহী', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5 },
  'chapai-nawabganj': { name: 'Chapai Nawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', divisionBn: 'রাজশাহী', fajrOffset: 8, sunriseOffset: 8, dhuhrOffset: 8, asrOffset: 8, maghribOffset: 8, ishaOffset: 8 },
  joypurhat: { name: 'Joypurhat', nameBn: 'জয়পুরহাট', divisionBn: 'রাজশাহী', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5 },

  // খুলনা বিভাগ (১০টি জেলা)
  khulna: { name: 'Khulna', nameBn: 'খুলনা', divisionBn: 'খুলনা', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4 },
  jashore: { name: 'Jashore', nameBn: 'যশোর', divisionBn: 'খুলনা', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5 },
  kushtia: { name: 'Kushtia', nameBn: 'কুষ্টিয়া', divisionBn: 'খুলনা', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5 },
  satkhira: { name: 'Satkhira', nameBn: 'সাতক্ষীরা', divisionBn: 'খুলনা', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5 },
  bagerhat: { name: 'Bagerhat', nameBn: 'বাগেরহাট', divisionBn: 'খুলনা', fajrOffset: 3, sunriseOffset: 3, dhuhrOffset: 3, asrOffset: 3, maghribOffset: 3, ishaOffset: 3 },
  chuadanga: { name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', divisionBn: 'খুলনা', fajrOffset: 6, sunriseOffset: 6, dhuhrOffset: 6, asrOffset: 6, maghribOffset: 6, ishaOffset: 6 },
  jhenaidah: { name: 'Jhenaidah', nameBn: 'ঝিনাইদহ', divisionBn: 'খুলনা', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5 },
  magura: { name: 'Magura', nameBn: 'মাগুরা', divisionBn: 'খুলনা', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4 },
  meherpur: { name: 'Meherpur', nameBn: 'মেহেরপুর', divisionBn: 'খুলনা', fajrOffset: 7, sunriseOffset: 7, dhuhrOffset: 7, asrOffset: 7, maghribOffset: 7, ishaOffset: 7 },
  narail: { name: 'Narail', nameBn: 'নড়াইল', divisionBn: 'খুলনা', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4 },

  // বরিশাল বিভাগ (৬টি জেলা)
  barisal: { name: 'Barisal', nameBn: 'বরিশাল', divisionBn: 'বরিশাল', fajrOffset: 1, sunriseOffset: 1, dhuhrOffset: 1, asrOffset: 1, maghribOffset: 1, ishaOffset: 1 },
  bhola: { name: 'Bhola', nameBn: 'ভোলা', divisionBn: 'বরিশাল', fajrOffset: -1, sunriseOffset: -1, dhuhrOffset: -1, asrOffset: -1, maghribOffset: -1, ishaOffset: -1 },
  patuakhali: { name: 'Patuakhali', nameBn: 'পটুয়াখালী', divisionBn: 'বরিশাল', fajrOffset: 1, sunriseOffset: 1, dhuhrOffset: 1, asrOffset: 1, maghribOffset: 1, ishaOffset: 1 },
  pirojpur: { name: 'Pirojpur', nameBn: 'পিরোজপুর', divisionBn: 'বরিশাল', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2 },
  barguna: { name: 'Barguna', nameBn: 'বরগুনা', divisionBn: 'বরিশাল', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2 },
  jhalokati: { name: 'Jhalokati', nameBn: 'ঝালকাঠি', divisionBn: 'বরিশাল', fajrOffset: 1, sunriseOffset: 1, dhuhrOffset: 1, asrOffset: 1, maghribOffset: 1, ishaOffset: 1 },

  // রংপুর বিভাগ (৮টি জেলা)
  rangpur: { name: 'Rangpur', nameBn: 'রংপুর', divisionBn: 'রংপুর', fajrOffset: 5, sunriseOffset: 5, dhuhrOffset: 5, asrOffset: 5, maghribOffset: 5, ishaOffset: 5 },
  dinajpur: { name: 'Dinajpur', nameBn: 'দিনাজপুর', divisionBn: 'রংপুর', fajrOffset: 7, sunriseOffset: 7, dhuhrOffset: 7, asrOffset: 7, maghribOffset: 7, ishaOffset: 7 },
  gaibandha: { name: 'Gaibandha', nameBn: 'গাইবান্ধা', divisionBn: 'রংপুর', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4 },
  kurigram: { name: 'Kurigram', nameBn: 'কুড়িগ্রাম', divisionBn: 'রংপুর', fajrOffset: 3, sunriseOffset: 3, dhuhrOffset: 3, asrOffset: 3, maghribOffset: 3, ishaOffset: 3 },
  lalmonirhat: { name: 'Lalmonirhat', nameBn: 'লালমনিরহাট', divisionBn: 'রংপুর', fajrOffset: 4, sunriseOffset: 4, dhuhrOffset: 4, asrOffset: 4, maghribOffset: 4, ishaOffset: 4 },
  nilphamari: { name: 'Nilphamari', nameBn: 'নীলফামারী', divisionBn: 'রংপুর', fajrOffset: 6, sunriseOffset: 6, dhuhrOffset: 6, asrOffset: 6, maghribOffset: 6, ishaOffset: 6 },
  panchagarh: { name: 'Panchagarh', nameBn: 'পঞ্চগড়', divisionBn: 'রংপুর', fajrOffset: 8, sunriseOffset: 8, dhuhrOffset: 8, asrOffset: 8, maghribOffset: 8, ishaOffset: 8 },
  thakurgaon: { name: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', divisionBn: 'রংপুর', fajrOffset: 8, sunriseOffset: 8, dhuhrOffset: 8, asrOffset: 8, maghribOffset: 8, ishaOffset: 8 },

  // ময়মনসিংহ বিভাগ (৪টি জেলা)
  mymensingh: { name: 'Mymensingh', nameBn: 'ময়মনসিংহ', divisionBn: 'ময়মনসিংহ', fajrOffset: 0, sunriseOffset: 0, dhuhrOffset: 0, asrOffset: 0, maghribOffset: 0, ishaOffset: 0 },
  jamalpur: { name: 'Jamalpur', nameBn: 'জামালপুর', divisionBn: 'ময়মনসিংহ', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2 },
  netrokona: { name: 'Netrokona', nameBn: 'নেত্রকোণা', divisionBn: 'ময়মনসিংহ', fajrOffset: -1, sunriseOffset: -1, dhuhrOffset: -1, asrOffset: -1, maghribOffset: -1, ishaOffset: -1 },
  sherpur: { name: 'Sherpur', nameBn: 'শেরপুর', divisionBn: 'ময়মনসিংহ', fajrOffset: 2, sunriseOffset: 2, dhuhrOffset: 2, asrOffset: 2, maghribOffset: 2, ishaOffset: 2 },
};

export interface PrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  nameArabic: string;
  time: string; // e.g. "04:48 AM"
  timeBn: string; // e.g. "০৪:৪৮ ভোর"
  dateObj: Date;
  isNext?: boolean;
  isCurrent?: boolean;
}

export interface DayPrayerSchedule {
  city: CityOffset;
  dateStr: string;
  fajr: string;
  sahriEnds: string;
  sunrise: string;
  ishraq: string;
  dhuhr: string;
  asrHanafi: string;
  asrShafii: string;
  maghrib: string; // Iftar time
  iftar: string;
  isha: string;
  tahajjudEnd: string;
  currentWaqt: PrayerTimeItem | null;
  nextWaqt: PrayerTimeItem | null;
  remainingTime: string; // e.g. "১ ঘণ্টা ৩৫ মিনিট"
  timesList: PrayerTimeItem[];
}

// Convert numbers to Bengali digits
export function toBengaliDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, d => bnDigits[Number(d)]);
}

// Format 24h into 12h Bengali time string
export function formatTimeBn(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period =
    hours >= 4 && hours < 6
      ? 'ভোর'
      : hours >= 6 && hours < 12
      ? 'সকাল'
      : hours >= 12 && hours < 15
      ? 'দুপুর'
      : hours >= 15 && hours < 18
      ? 'বিকাল'
      : hours >= 18 && hours < 20
      ? 'সন্ধ্যা'
      : 'রাত';

  hours = hours % 12 || 12;
  const hStr = toBengaliDigits(hours < 10 ? '0' + hours : hours);
  const mStr = toBengaliDigits(minutes < 10 ? '0' + minutes : minutes);
  return `${hStr}:${mStr} ${period}`;
}

export function formatTimeEn(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hStr = hours < 10 ? '0' + hours : hours;
  const mStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hStr}:${mStr} ${ampm}`;
}

// Astronomical calculation of Solar Declination and Equation of Time
function getSolarCoordinates(julianDay: number) {
  const d = julianDay - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * Math.sin((g * Math.PI) / 180) + 0.02 * Math.sin((2 * g * Math.PI) / 180)) % 360;
  const e = 23.439 - 0.00000036 * d;

  const sinL = Math.sin((L * Math.PI) / 180);
  const cosL = Math.cos((L * Math.PI) / 180);
  const sinE = Math.sin((e * Math.PI) / 180);
  const cosE = Math.cos((e * Math.PI) / 180);

  const declination = (Math.asin(sinL * sinE) * 180) / Math.PI;
  const ra = (Math.atan2(cosE * sinL, cosL) * 180) / Math.PI / 15;
  const equationOfTime = q / 15 - (ra < 0 ? ra + 24 : ra);

  return { declination, equationOfTime };
}

// Calculate Prayer Times for a given Date and City
export function calculatePrayerTimes(
  date: Date = new Date(),
  cityKey: string = 'dhaka',
  asrMadhab: 'hanafi' | 'shafii' = 'hanafi'
): DayPrayerSchedule {
  const city = BANGLADESH_CITIES[cityKey] || BANGLADESH_CITIES.dhaka;

  // Dhaka coordinates: 23.8103° N, 90.4125° E
  const lat = 23.8103;
  const lng = 90.4125;
  const timezone = 6; // UTC+6

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const julianDay =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const { declination, equationOfTime } = getSolarCoordinates(julianDay);

  // Solar Noon (Zawal / Midday)
  const solarNoon = 12 + timezone - lng / 15 - equationOfTime;

  // Angles (Karachi / Islamic Foundation Bangladesh)
  const fajrAngle = 18.0; // 18 degrees below horizon
  const ishaAngle = 18.0;

  const radLat = (lat * Math.PI) / 180;
  const radDec = (declination * Math.PI) / 180;

  // Sun Hour Angle helper
  const hourAngle = (angle: number) => {
    const radAngle = (angle * Math.PI) / 180;
    const cosHA =
      (-Math.sin(radAngle) - Math.sin(radLat) * Math.sin(radDec)) /
      (Math.cos(radLat) * Math.cos(radDec));
    if (cosHA > 1 || cosHA < -1) return 0;
    return (Math.acos(cosHA) * 180) / Math.PI / 15;
  };

  // Asr shadow length factor (Shafii: 1, Hanafi: 2)
  const asrHourAngle = (factor: number) => {
    const angle =
      (Math.atan(1 / (factor + Math.tan(Math.abs(radLat - radDec)))) * 180) /
      Math.PI;
    const radA = (angle * Math.PI) / 180;
    const cosHA =
      (Math.sin(radA) - Math.sin(radLat) * Math.sin(radDec)) /
      (Math.cos(radLat) * Math.cos(radDec));
    if (cosHA > 1 || cosHA < -1) return 0;
    return (Math.acos(cosHA) * 180) / Math.PI / 15;
  };

  const sunriseHA = hourAngle(0.833);
  const fajrHA = hourAngle(fajrAngle);
  const ishaHA = hourAngle(ishaAngle);
  const asrShafiiHA = asrHourAngle(1);
  const asrHanafiHA = asrHourAngle(2);

  // Raw times in decimal hours
  let fajrDec = solarNoon - fajrHA;
  let sunriseDec = solarNoon - sunriseHA;
  let dhuhrDec = solarNoon + 0.06; // 4 minutes safety buffer
  let asrShafiiDec = solarNoon + asrShafiiHA;
  let asrHanafiDec = solarNoon + asrHanafiHA;
  let maghribDec = solarNoon + sunriseHA + 0.05; // 3 min safety buffer
  let ishaDec = solarNoon + ishaHA;

  // Helper to convert decimal hours to Date
  const toDate = (decHours: number, offsetMinutes: number = 0) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const totalMinutes = Math.round(decHours * 60) + offsetMinutes;
    d.setMinutes(totalMinutes);
    return d;
  };

  const fajrDate = toDate(fajrDec, city.fajrOffset);
  const sunriseDate = toDate(sunriseDec, city.sunriseOffset);
  const dhuhrDate = toDate(dhuhrDec, city.dhuhrOffset);
  const asrShafiiDate = toDate(asrShafiiDec, city.asrOffset);
  const asrHanafiDate = toDate(asrHanafiDec, city.asrOffset);
  const maghribDate = toDate(maghribDec, city.maghribOffset);
  const ishaDate = toDate(ishaDec, city.ishaOffset);

  // Derived supplementary times
  const sahriEndsDate = new Date(fajrDate.getTime() - 5 * 60000); // 5 min before Fajr
  const ishraqDate = new Date(sunriseDate.getTime() + 18 * 60000); // 18 min after sunrise
  const iftarDate = maghribDate;
  const tahajjudEndDate = sahriEndsDate;

  // Active Asr date according to preference
  const chosenAsrDate = asrMadhab === 'hanafi' ? asrHanafiDate : asrShafiiDate;

  const timesList: PrayerTimeItem[] = [
    {
      id: 'fajr',
      name: 'ফজর',
      nameArabic: 'الفجر',
      time: formatTimeEn(fajrDate),
      timeBn: formatTimeBn(fajrDate),
      dateObj: fajrDate,
    },
    {
      id: 'sunrise',
      name: 'সূর্যোদয়',
      nameArabic: 'الشروق',
      time: formatTimeEn(sunriseDate),
      timeBn: formatTimeBn(sunriseDate),
      dateObj: sunriseDate,
    },
    {
      id: 'dhuhr',
      name: 'যোহর',
      nameArabic: 'الظهر',
      time: formatTimeEn(dhuhrDate),
      timeBn: formatTimeBn(dhuhrDate),
      dateObj: dhuhrDate,
    },
    {
      id: 'asr',
      name: 'আসর',
      nameArabic: 'العصر',
      time: formatTimeEn(chosenAsrDate),
      timeBn: formatTimeBn(chosenAsrDate),
      dateObj: chosenAsrDate,
    },
    {
      id: 'maghrib',
      name: 'মাগরিব (ইফতার)',
      nameArabic: 'المغرب',
      time: formatTimeEn(maghribDate),
      timeBn: formatTimeBn(maghribDate),
      dateObj: maghribDate,
    },
    {
      id: 'isha',
      name: 'ইশা',
      nameArabic: 'العشاء',
      time: formatTimeEn(ishaDate),
      timeBn: formatTimeBn(ishaDate),
      dateObj: ishaDate,
    },
  ];

  // Determine current and next waqt
  const now = date.getTime();
  let currentWaqt: PrayerTimeItem | null = null;
  let nextWaqt: PrayerTimeItem | null = null;

  for (let i = 0; i < timesList.length; i++) {
    const curr = timesList[i];
    const next = timesList[(i + 1) % timesList.length];

    if (now >= curr.dateObj.getTime() && now < next.dateObj.getTime()) {
      currentWaqt = curr;
      nextWaqt = next;
      curr.isCurrent = true;
      next.isNext = true;
      break;
    }
  }

  // If after Isha or before Fajr
  if (!currentWaqt) {
    if (now >= ishaDate.getTime()) {
      currentWaqt = timesList[5]; // Isha
      timesList[5].isCurrent = true;
      // Next is tomorrow's Fajr
      const tomorrowFajr = new Date(fajrDate.getTime() + 24 * 3600000);
      nextWaqt = {
        id: 'fajr',
        name: 'ফজর',
        nameArabic: 'الفجر',
        time: formatTimeEn(tomorrowFajr),
        timeBn: formatTimeBn(tomorrowFajr),
        dateObj: tomorrowFajr,
        isNext: true,
      };
    } else {
      currentWaqt = timesList[5]; // Isha of yesterday
      nextWaqt = timesList[0]; // Fajr
      timesList[0].isNext = true;
    }
  }

  // Calculate remaining time
  let remainingTime = '';
  if (nextWaqt) {
    const diffMs = nextWaqt.dateObj.getTime() - now;
    if (diffMs > 0) {
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      if (hours > 0) {
        remainingTime = `${toBengaliDigits(hours)} ঘণ্টা ${toBengaliDigits(mins)} মিনিট`;
      } else {
        remainingTime = `${toBengaliDigits(mins)} মিনিট`;
      }
    }
  }

  return {
    city,
    dateStr: date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }),
    fajr: formatTimeBn(fajrDate),
    sahriEnds: formatTimeBn(sahriEndsDate),
    sunrise: formatTimeBn(sunriseDate),
    ishraq: formatTimeBn(ishraqDate),
    dhuhr: formatTimeBn(dhuhrDate),
    asrHanafi: formatTimeBn(asrHanafiDate),
    asrShafii: formatTimeBn(asrShafiiDate),
    maghrib: formatTimeBn(maghribDate),
    iftar: formatTimeBn(iftarDate),
    isha: formatTimeBn(ishaDate),
    tahajjudEnd: formatTimeBn(tahajjudEndDate),
    currentWaqt,
    nextWaqt,
    remainingTime,
    timesList,
  };
}
