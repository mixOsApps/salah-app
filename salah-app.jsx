import { useState, useRef, useCallback, useEffect } from "react";

// ============================================================
// IMAGE ILLUSTRATION CONFIG
// ============================================================

import standingImg from "./images/standing.png";
import takbirImg from "./images/takbir.png";
import handsFoldedImg from "./images/hands folded.png";
import rukuImg from "./images/ruku.png";
import standingFromRukuImg from "./images/standing from ruku.png";
import sujoodImg from "./images/sujood.png";
import sittingImg from "./images/sitting.png";
import tashahudImg from "./images/tashahud.png";
import salamLeftImg from "./images/salam left.png";
import salamRightImg from "./images/salam right.png";

const POSE_IMAGES = {
  STANDING: standingImg,
  TAKBIR: takbirImg,
  HANDS_FOLDED: handsFoldedImg,
  RUKU: rukuImg,
  STANDING_FROM_RUKU: standingFromRukuImg,
  SUJOOD: sujoodImg,
  SITTING: sittingImg,
  TASHAHUD: tashahudImg,
  SALAM_RIGHT: salamRightImg,
  SALAM_LEFT: salamLeftImg,
};

// Localized display label for the pose caption under/over the illustration.
// Android used to print the raw Pose enum name (`pose.name.replace("_","
// ")`) — always English, with a literal underscore, in every locale — until
// PrayerModels.kt added `Pose.labelRes()` to route it through resources
// instead (see that function's doc comment, and the call-site comment at
// PrayerDetailScreen.kt:~323-326). This object is the web equivalent: one
// place for W3 to localise instead of the raw key leaking into the UI.
// Values match Android's values/strings.xml (pose_standing, pose_ruku, …)
// verbatim.
export const POSE_LABELS = {
  STANDING: "STANDING",
  TAKBIR: "TAKBIR",
  HANDS_FOLDED: "HANDS FOLDED",
  RUKU: "RUKU'",
  STANDING_FROM_RUKU: "STANDING FROM RUKU'",
  SUJOOD: "SUJOOD",
  SITTING: "SITTING",
  TASHAHUD: "TASHAHHUD",
  SALAM_RIGHT: "SALAM (RIGHT)",
  SALAM_LEFT: "SALAM (LEFT)",
};

function PoseIllustration({ pose, title, poseLabel }) {
  const src = POSE_IMAGES[pose] || POSE_IMAGES.STANDING;
  const isSalamLeft = pose === "SALAM_LEFT";
  const isSalamRight = pose === "SALAM_RIGHT";

  return (
    <div className="salah-illust-wrap">
      <img src={src} alt={pose} className="salah-pose-img" />
      {(isSalamLeft || isSalamRight) && (
        <div
          className={
            "salah-salam-badge " +
            (isSalamRight ? "salah-salam-badge--right" : "salah-salam-badge--left")
          }
        >
          {isSalamRight ? "TINGIN SA KANAN →" : "← TINGIN SA KALIWA"}
        </div>
      )}
      {/* Title + pose label overlaid on the bottom of the illustration,
          over a gradient — the Android arrangement. See .salah-illust-overlay
          in styles.css. */}
      <div className="salah-illust-overlay">
        <h2 className="salah-illust-overlay-title">{title}</h2>
        <div className="salah-pose-label">{poseLabel}</div>
      </div>
    </div>
  );
}

// ============================================================
// PRAYER DATA HELPERS
// ============================================================

const niyyah = (prayerNameTl, rakatCount) => ({
  title: "Niyyah (Intensyon)", pose: "STANDING", arabic: "", transliteration: "",
  tagalog: `Mag-intensyon sa puso na mag-${prayerNameTl} ng ${rakatCount} raka'at para sa Allah.`,
  instruction: "Tumayo nang tuwid, nakaharap sa Qiblah. Mag-intensyon sa puso (hindi kailangang sabihin nang malakas).",
});
const takbiratulIhram = () => ({
  title: "Takbiratul Ihram", pose: "TAKBIR",
  arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allaahu Akbar", tagalog: "Ang Allah ay Dakila",
  instruction: "Itaas ang dalawang kamay hanggang sa tagiliran ng tenga at sabihin ang Takbir.",
});
const openingDua = () => ({
  title: "Dua al-Istiftah & Ta'awwudh", pose: "HANDS_FOLDED",
  arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ\n\nأَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
  transliteration: "Subhaanaka Allaahumma wa bihamdika, wa tabaarakasmuka wa ta'aalaa jadduka, wa laa ilaaha ghayruka\n\nA'oozu billaahi minash-shaytaanir-rajeem",
  tagalog: "Luwalhati sa Iyo, O Allah, at ang papuri ay sa Iyo, at mapagpala ang Iyong Ngalan, at Kataas-taasan ang Iyong Kadakilaan, at walang ibang diyos maliban sa Iyo.\n\nAko ay nagpapatulong sa Allah laban sa Shaitan, ang isinumpa.",
  instruction: "Basahin ito nang tahimik pagkatapos ng Takbiratul Ihram at bago ang Al-Fatiha.",
});
const alFatiha = () => ({
  title: "Suratul Al-Fatiha", pose: "HANDS_FOLDED",
  arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ\nغَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
  transliteration: "Bismillaahir Rahmaanir Raheem\nAlhamdu lillaahi Rabbil 'aalameen\nAr-Rahmaanir Raheem\nMaaliki yawmid-deen\nIyyaaka na'budu wa iyyaaka nasta'een\nIhdinassiraatal mustaqeem\nSiraatallazeena an'amta 'alayhim\nGhayril maghdoobi 'alayhim wa lad-daalleen",
  tagalog: "Sa Ngalan ng Allah, ang Mahamaawain, ang Mahamaawain\nAng lahat ng papuri ay sa Allah, Panginoon ng mga nilalang\nAng Mahamaawain, ang Mahamaawain\nMay-ari ng Araw ng Paghuhukom\nIkaw lamang ang aming sinasamba at Ikaw lamang ang aming hinihingan ng tulong\nPatnubayan Mo kami sa tuwid na landas\nAng landas ng mga pinagkalooban Mo ng grasya\nHindi ng mga kinapopootan at hindi ng mga naliligaw",
  instruction: "Basahin ang Suratul Al-Fatiha. Sabihin 'Aameen' pagkatapos.",
});
const additionalSurah = () => ({
  title: "Magbasa ng Surah", pose: "HANDS_FOLDED",
  arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
  transliteration: "Qul huwallaahu ahad\nAllaahus-samad\nLam yalid wa lam yoolad\nWa lam yakun lahoo kufuwan ahad",
  tagalog: "Sabihin: Siya ang Allah, ang Nag-iisa\nAng Allah ang Sandigan\nHindi Siya nagkaanak at hindi Siya ipinanganak\nAt walang katulad Niya kahit isa",
  instruction: "Magbasa ng kahit anong surah. Halimbawa: Suratul Ikhlas (Al-Ikhlas 112).",
});
const takbirToRuku = () => ({
  title: "Takbir (Pagyuko)", pose: "TAKBIR",
  arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allaahu Akbar", tagalog: "Ang Allah ay Dakila",
  instruction: "Sabihin ang 'Allaahu Akbar' bago o habang yumuyuko para sa Ruku'.",
});
const ruku = () => ({
  title: "Ruku' (Pagyuko)", pose: "RUKU",
  arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ", transliteration: "Subhaana Rabbiyal 'Azeem (3x)",
  tagalog: "Luwalhati sa aking Panginoon, ang Makapangyarihan (3 beses)",
  instruction: "Yumuko — ang mga kamay ay nakapatong sa tuhod. Ang likod ay tuwid at parallel sa sahig. Sabihin nang 3 beses.",
});
const standingFromRuku = () => ({
  title: "I'tidal (Pagtayo)", pose: "STANDING_FROM_RUKU",
  arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\nرَبَّنَا وَلَكَ الْحَمْدُ",
  transliteration: "Sami'allaahu liman hamidah\nRabbanaa wa lakal hamd",
  tagalog: "Dinidinig ng Allah ang sinumang nagpupuri sa Kanya\nPanginoon namin, sa Iyo ang lahat ng papuri",
  instruction: "Tumayo nang tuwid mula sa ruku'. Sabihin habang tumitindig.",
});
const takbirToSujood = () => ({
  title: "Takbir (Sujood)", pose: "STANDING",
  arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allaahu Akbar", tagalog: "Ang Allah ay Dakila",
  instruction: "Sabihin ang 'Allaahu Akbar' habang bumababa para sa Sujood.",
});
const firstSujood = () => ({
  title: "Unang Sujood", pose: "SUJOOD",
  arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى", transliteration: "Subhaana Rabbiyal A'laa (3x)",
  tagalog: "Luwalhati sa aking Panginoon, ang Kataas-taasan (3 beses)",
  instruction: "Magpatirapa — noo, ilong, dalawang palad, dalawang tuhod, at dalawang paa sa sahig.",
});
const takbirToSitting = () => ({
  title: "Takbir (Pag-upo)", pose: "SITTING",
  arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allaahu Akbar", tagalog: "Ang Allah ay Dakila",
  instruction: "Sabihin ang 'Allaahu Akbar' habang bumabangon mula sa Sujood para umupo.",
});
const sittingBetween = () => ({
  title: "Pag-upo (Pagitan ng Sujood)", pose: "SITTING",
  arabic: "رَبِّ اغْفِرْ لِي", transliteration: "Rabbighfir lee (3x)",
  tagalog: "Panginoon ko, patawarin Mo ako (3 beses)",
  instruction: "Umupo nang sandali sa pagitan ng dalawang sujood.",
});
const takbirToSecondSujood = () => ({
  title: "Takbir (Pangalawang Sujood)", pose: "SITTING",
  arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allaahu Akbar", tagalog: "Ang Allah ay Dakila",
  instruction: "Sabihin ang 'Allaahu Akbar' habang bumababa para sa pangalawang Sujood.",
});
const secondSujood = () => ({
  title: "Pangalawang Sujood", pose: "SUJOOD",
  arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى", transliteration: "Subhaana Rabbiyal A'laa (3x)",
  tagalog: "Luwalhati sa aking Panginoon, ang Kataas-taasan (3 beses)",
  instruction: "Magpatirapa — noo, ilong, dalawang palad, dalawang tuhod, at dalawang paa sa sahig.",
});
const takbirToTashahhud = () => ({
  title: "Takbir (Tashahhud)", pose: "TASHAHUD",
  arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allaahu Akbar", tagalog: "Ang Allah ay Dakila",
  instruction: "Sabihin ang 'Allaahu Akbar' habang bumabangon mula sa Sujood para sa Tashahhud (Pananatiling nakaupo).",
});
const tashahhud = () => ({
  title: "Tashahhud (At-Tahiyyat)", pose: "TASHAHUD",
  arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَاوَاتُ وَالطَّيِّبَاتُ\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\nالسَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ\nأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ\nوَأَشْهَدُ أَنْ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
  transliteration: "At-tahiyyaatu lillaahi was-salawaatu wat-tayyibaat\nAs-salaamu 'alayka ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh\nAs-salaamu 'alaynaa wa 'alaa 'ibaadillaahis-saaliheen\nAsh-hadu an laa ilaaha illallaah\nWa ash-hadu anna Muhammadan 'abduhu wa rasooluh",
  tagalog: "Ang lahat ng pagbati, panalangin at kabutihan ay para sa Allah\nKapayapaan sa iyo, O Propeta, at ang awa at pagpapala ng Allah\nKapayapaan sa amin at sa lahat ng mabubuting lingkod ng Allah\nAko ay sumasaksi na walang diyos kundi ang Allah\nAt ako ay sumasaksi na si Muhammad ay Kanyang alipin at Sugo",
  instruction: "Umupo at basahin ang Tashahhud. Ituro ang hintuturo (shahadah finger) sa 'Ash-hadu'.",
});
const salawat = () => ({
  title: "Salawat (Durood Ibrahim)", pose: "TASHAHUD",
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ\nكَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ\nإِنَّكَ حَمِيدٌ مَجِيدٌ\n\nاللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ\nكَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ\nإِنَّكَ حَمِيدٌ مَجِيدٌ",
  transliteration: "Allaahumma salli 'alaa Muhammad wa 'alaa aali Muhammad\nKamaa sallayta 'alaa Ibraaheem wa 'alaa aali Ibraaheem\nInnaka hameedun majeed\n\nAllaahumma baarik 'alaa Muhammad wa 'alaa aali Muhammad\nKamaa baarakta 'alaa Ibraaheem wa 'alaa aali Ibraaheem\nInnaka hameedun majeed",
  tagalog: "O Allah, pagpalain Mo si Muhammad at ang pamilya ni Muhammad\nTulad ng pagpapala Mo kay Ibrahim at sa pamilya ni Ibrahim\nKatotohanan, Ikaw ay Kapuri-puri at Maluwalhati\n\nO Allah, igawad Mo ang Iyong pagpapala kay Muhammad at sa pamilya ni Muhammad\nTulad ng paggawad Mo ng pagpapala kay Ibrahim at sa pamilya ni Ibrahim\nKatotohanan, Ikaw ay Kapuri-puri at Maluwalhati",
  instruction: "Basahin ang Salawat/Durood Ibrahim pagkatapos ng Tashahhud sa huling raka'at.",
});
const salamRight = () => ({
  title: "Salam (Kanan)", pose: "SALAM_RIGHT",
  arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ", transliteration: "As-salaamu 'alaykum wa rahmatullaah",
  tagalog: "Kapayapaan sa inyo at ang awa ng Allah",
  instruction: "Ilingon ang ulo sa kanan at sabihin ang salam.",
});
const salamLeft = () => ({
  title: "Salam (Kaliwa)", pose: "SALAM_LEFT",
  arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ", transliteration: "As-salaamu 'alaykum wa rahmatullaah",
  tagalog: "Kapayapaan sa inyo at ang awa ng Allah",
  instruction: "Ilingon ang ulo sa kaliwa at sabihin ang salam.",
});
const takbirUp = (n) => ({
  title: `Raka'at ${n} — Allaahu Akbar`, pose: "TAKBIR",
  arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allaahu Akbar", tagalog: "Ang Allah ay Dakila",
  instruction: `Tumayo para sa raka'at ${n}. Sabihin 'Allaahu Akbar'.`,
});
const tashFirst = () => ({
  ...tashahhud(), title: "Unang Tashahhud",
  instruction: "Umupo at basahin ang Tashahhud. Pagkatapos, tumayo para sa susunod na raka'at.",
});

// ============================================================
// SUNNAH DHIKR AFTER PRAYER (MA BA'D AS-SALAH)
// ============================================================

const dhikr1 = () => ({
  title: "Dhikr 1: Astaghfirullah", pose: "SITTING",
  arabic: "أَسْتَغْفِرُ اللَّهَ (3x)\n\nاللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
  transliteration: "Astaghfirullaah (3x)\n\nAllaahumma Antas-Salaamu wa minkas-salaamu tabaarakta yaa Zal-Jalaali wal-Ikraam",
  tagalog: "Ako ay humihingi ng tawad sa Allah (3 beses).\n\nO Allah, Ikaw ang Kapayapaan at mula sa Iyo ang kapayapaan. Mapagpala Ka, O Nagtataglay ng Kadakilaan at Karangalan.",
  instruction: "Pagkatapos ng Salam, manatiling nakaupo at basahin ito.",
});

const dhikr2 = () => ({
  title: "Dhikr 2: Tawheed & Praise", pose: "SITTING",
  arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ\n\nاللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ",
  transliteration: "Laa ilaaha illallaahu wahdahoo laa shareeka lahoo, lahul-mulku wa lahul-hamdu wa Huwa 'alaa kulli shay'in Qadeer\n\nAllaahumma laa maani'a limaa a'tayta, wa laa mu'tiya limaa mana'ta, wa laa yanfa'u zal-jaddi minkal-jadd",
  tagalog: "Walang diyos maliban sa Allah, Siyang Nag-iisa... O Allah, walang makakahadlang sa Iyong ibibigay at walang makakapagbigay sa Iyong ipinagkait.",
  instruction: "Basahin ito habang nakaupo.",
});

const dhikr3 = () => ({
  title: "Dhikr 3: La Hawla...", pose: "SITTING",
  arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ",
  transliteration: "Laa hawla wa laa quwwata illaa billaah, laa ilaaha illallaahu wa laa na'budu illaa iyyaah, lahun-ni'matu wa lahul-fadlu wa lahus-thanaa'ul-hasan, laa ilaaha illallaahu mukhliseena lahud-deena wa law karihal-kaafiroon",
  tagalog: "Walang kapangyarihan at lakas kundi mula sa Allah... Siya lamang ang aming sinasamba...",
  instruction: "Ipagpatuloy ang pag-upo at pag-dhikr.",
});

const tasbih33 = () => ({
  title: "Tasbih, Tahmid, & Takbir", pose: "SITTING",
  arabic: "سُبْحَانَ اللَّهِ (33x)\nالْحَمْدُ لِلَّهِ (33x)\nاللَّهُ أَكْبَرُ (33x)\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
  transliteration: "Subhaanallaah (33x)\nAlhamdu lillaah (33x)\nAllaahu Akbar (33x)\n\nLaa ilaaha illallaahu wahdahoo laa shareeka lahoo, lahul-mulku wa lahul-hamdu wa Huwa 'alaa kulli shay'in Qadeer",
  tagalog: "Luwalhati sa Allah (33 beses), Papuri sa Allah (33 beses), Ang Allah ay Dakila (33 beses). Kumpletuhin ang 100 sa pamamagitan ng pagsasabi na walang ibang diyos...",
  instruction: "Bilangin gamit ang mga daliri ng kanang kamay.",
});

const dhikr4_fajr_maghrib = () => ({
  title: "Dhikr 4: (10 beses pagkatapos ng Fajr/Maghrib)", pose: "SITTING",
  arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ (10x)",
  transliteration: "Laa ilaaha illallaahu wahdahoo laa shareeka lahoo, lahul-mulku wa lahul-hamdu, yuhyee wa yumeetu, wa Huwa 'alaa kulli shay'in Qadeer (10x)",
  tagalog: "Walang diyos maliban sa Allah... Siya ang nagbibigay ng buhay at nagdudulot ng kamatayan... (10 beses)",
  instruction: "Basahin ito ng 10 beses pagkatapos ng Fajr at Maghrib (Sunnah).",
});

const ayatUlKursi = () => ({
  title: "Dhikr 5: Ayat-ul-Kursi", pose: "SITTING",
  arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  transliteration: "Allaahu laa ilaaha illaa Huwal-Hayyul-Qayyoom; laa ta'khuzuhu sinatun wa laa nawm; lahu maa fissamaawaati wa maa fil-ard; man zallazee yashfa'u 'indahoo illaa bi-iznih; ya'lamu maa bayna aydeehim wa maa khalfahum, wa laa yuheetoona bishay'im min 'ilmihee illaa bimaa shaaa'; wasi'a Kursiyyuhus samaawaati wal arda wa laa ya'ooduhoo hifzuhumaa; wa Huwal 'Aliyyul 'Azeem",
  tagalog: "Ang Allah, walang ibang diyos kundi Siya, ang Buhay, ang Walang-hanggan... (Ayat-ul-Kursi)",
  instruction: "Basahin ang Ayat-ul-Kursi pagkatapos ng bawat fard na dasal.",
});

const threeQuls_3x = () => ({
  title: "Dhikr 6: 3 Quls (3 beses)", pose: "SITTING",
  arabic: "سورة الإخلاص (3x)\nسورة الفلق (3x)\nسورة الناس (3x)",
  transliteration: "Qul huwallaahu ahad... (3x)\nQul a'oozu birabbil falaq... (3x)\nQul a'oozu birabbin naas... (3x)",
  tagalog: "Basahin ang bawat surah ng tatlong beses.",
  instruction: "Basahin ang tatlong huling surah ng Qur'an (Isang beses sa ibang dasal, 3 beses sa Fajr at Maghrib).",
});

const genericDhikr = [dhikr1(), dhikr2(), dhikr3(), tasbih33(), ayatUlKursi(), threeQuls_3x()];
const fajrMaghribDhikr = [dhikr1(), dhikr4_fajr_maghrib(), dhikr2(), dhikr3(), tasbih33(), ayatUlKursi(), threeQuls_3x()];

// ============================================================
// PRAYER DEFINITIONS
// ============================================================

const PRAYERS = {
  fajr: {
    name: "Fajr", rakatCount: 2, tagalog: "Dasal ng Madaling-Araw",
    icon: "🌅", description: "2 Raka'at — Fard", color: "#F4845F",
    steps: [
      niyyah("Fajr",2), takbiratulIhram(), openingDua(),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirToTashahhud(), tashahhud(), salawat(), salamRight(), salamLeft(),
      ...fajrMaghribDhikr
    ],
  },
  dhuhr: {
    name: "Dhuhr", rakatCount: 4, tagalog: "Dasal ng Tanghali",
    icon: "☀️", description: "4 Raka'at — Fard", color: "#F9C74F",
    steps: [
      niyyah("Dhuhr",4), takbiratulIhram(), openingDua(),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(4),
      alFatiha(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirToTashahhud(), tashahhud(), salawat(), salamRight(), salamLeft(),
      ...genericDhikr
    ],
  },
  asr: {
    name: "Asr", rakatCount: 4, tagalog: "Dasal ng Hapon",
    icon: "🌤️", description: "4 Raka'at — Fard", color: "#F8961E",
    steps: [
      niyyah("Asr",4), takbiratulIhram(), openingDua(),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(4),
      alFatiha(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirToTashahhud(), tashahhud(), salawat(), salamRight(), salamLeft(),
      ...genericDhikr
    ],
  },
  maghrib: {
    name: "Maghrib", rakatCount: 3, tagalog: "Dasal ng Takipsilim",
    icon: "🌇", description: "3 Raka'at — Fard", color: "#C77DBA",
    steps: [
      niyyah("Maghrib",3), takbiratulIhram(), openingDua(),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirToTashahhud(), tashahhud(), salawat(), salamRight(), salamLeft(),
      ...fajrMaghribDhikr
    ],
  },
  isha: {
    name: "Isha", rakatCount: 4, tagalog: "Dasal ng Gabi",
    icon: "🌙", description: "4 Raka'at — Fard", color: "#577590",
    steps: [
      niyyah("Isha",4), takbiratulIhram(), openingDua(),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(4),
      alFatiha(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirToTashahhud(), tashahhud(), salawat(), salamRight(), salamLeft(),
      ...genericDhikr
    ],
  },
  witr: {
    name: "Witr", rakatCount: 3, tagalog: "Dasal ng Witr",
    icon: "✨", description: "3 Raka'at", color: "#4D908E",
    steps: [
      niyyah("Witr",3), takbiratulIhram(), openingDua(),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), additionalSurah(), takbirToRuku(), ruku(), standingFromRuku(), takbirToSujood(), firstSujood(), takbirToSitting(), sittingBetween(), takbirToSecondSujood(), secondSujood(),
      takbirToTashahhud(), tashahhud(), salawat(), salamRight(), salamLeft(),
      ...genericDhikr
    ],
  },
};

const PRAYER_ORDER = ["fajr","dhuhr","asr","maghrib","isha","witr"];

// ============================================================
// APP
// ============================================================

export default function SalahApp() {
  const [sel, setSel] = useState(null);
  const [step, setStep] = useState(0);
  const [showAr, setShowAr] = useState(true);
  const [showTr, setShowTr] = useState(true);
  const [showTl, setShowTl] = useState(true);
  const ref = useRef(null);

  const prayer = sel ? PRAYERS[sel] : null;
  const s = prayer ? prayer.steps[step] : null;
  const total = prayer ? prayer.steps.length : 0;
  const pct = total > 0 ? ((step+1)/total)*100 : 0;

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [step, sel]);

  const go = useCallback((i) => {
    if(i<0||i>=total) return;
    setStep(i);
  },[total]);

  if(!sel) {
    return (
      <div className="salah-screen salah-screen--home">
        <div className="salah-arc"/>
        <div className="salah-header">
          <div className="salah-bismillah">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
          <div className="salah-header-glyph">🕌</div>
          <h1 className="salah-home-title">Gabay sa Salah</h1>
          <p className="salah-home-sub">Hakbang-hackbang na gabay sa pagdarasal<br/>para sa mga bagong Muslim</p>
        </div>
        <div className="salah-prayer-grid">
          {PRAYER_ORDER.map(k=>{
            const p=PRAYERS[k];
            return(
              <button
                key={k}
                onClick={()=>{setSel(k);setStep(0);}}
                className="salah-prayer-card"
                style={{ "--prayer-accent": p.color }}
              >
                <div className="salah-prayer-card-icon">{p.icon}</div>
                <div className="salah-prayer-card-body">
                  <div className="salah-prayer-card-name">{p.name}</div>
                  <div className="salah-prayer-card-subtitle">{p.tagalog}</div>
                </div>
                <div className="salah-prayer-card-badge">{p.description}</div>
              </button>
            );
          })}
        </div>
        <p className="salah-footer">🕌 Gabay sa Salah — Para sa mga bagong Muslim</p>
      </div>
    );
  }

  const ac = prayer.color||"#2A9D8F";
  return (
    <div
      className="salah-screen salah-screen--step"
      style={{ "--prayer-accent": ac, "--progress-pct": `${pct}%` }}
    >
      <div className="salah-topbar">
        <button onClick={()=>{setSel(null);setStep(0);}} className="salah-back-btn">← Bumalik</button>
        <div className="salah-topbar-title">{prayer.icon} {prayer.name}</div>
        <div className="salah-step-badge">{step+1}/{total}</div>
      </div>
      <div className="salah-progress-wrap"><div className="salah-progress-fill"/></div>

      <div className="salah-step-body">
        <div className="salah-illust-header">
          <div className="salah-illust-decorative">
            <PoseIllustration pose={s.pose} title={s.title} poseLabel={POSE_LABELS[s.pose] || s.pose} />
          </div>
        </div>

        <div ref={ref} className="salah-content">
          <div className="salah-instruction-box">
            <span className="salah-instruction-icon">📖</span>
            <p className="salah-instruction-text">{s.instruction}</p>
          </div>

          {showAr && s.arabic && <div className="salah-text-card"><div className="salah-text-card-label">عربي — Arabic</div><div className="salah-arabic-text">{s.arabic}</div></div>}
          {showTr && s.transliteration && <div className="salah-text-card"><div className="salah-text-card-label">Transliteration</div><div className="salah-translit-text">{s.transliteration}</div></div>}
          {showTl && s.tagalog && <div className="salah-text-card"><div className="salah-text-card-label">🇵🇭 Salin sa Tagalog</div><div className="salah-tagalog-text">{s.tagalog}</div></div>}

          <div className="salah-toggle-row">
            {[{k:"ar",l:"عربي",a:showAr,f:setShowAr},{k:"tr",l:"Translit",a:showTr,f:setShowTr},{k:"tl",l:"Tagalog",a:showTl,f:setShowTl}].map(t=>(
              <button
                key={t.k}
                onClick={()=>t.f(!t.a)}
                className={"salah-toggle-btn" + (t.a ? " is-active" : "")}
              >{t.l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="salah-navbar">
        <button onClick={()=>go(step-1)} disabled={step===0} className="salah-nav-btn salah-nav-prev">◀ Nakaraan</button>
        <button onClick={()=>go(step+1)} disabled={step>=total-1} className="salah-nav-btn salah-nav-next">Susunod ▶</button>
      </div>
    </div>
  );
}
