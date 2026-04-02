import { useState, useRef, useCallback } from "react";

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
  SALAM_RIGHT: salamRightImg,
  SALAM_LEFT: salamLeftImg,
};

function PoseIllustration({ pose }) {
  const src = POSE_IMAGES[pose] || POSE_IMAGES.STANDING;
  const isSalamLeft = pose === "SALAM_LEFT";
  const isSalamRight = pose === "SALAM_RIGHT";

  return (
    <div style={S.illustWrap}>
      <img
        src={src}
        alt={pose}
        style={S.poseImg}
      />
      {(isSalamLeft || isSalamRight) && (
        <div style={{
          position: "absolute",
          top: 12,
          [isSalamRight ? "right" : "left"]: 12,
          background: "rgba(42, 157, 143, 0.9)",
          color: "white",
          padding: "4px 10px",
          borderRadius: 20,
          fontSize: 10,
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          letterSpacing: 0.5
        }}>
          {isSalamRight ? "TINGIN SA KANAN →" : "← TINGIN SA KALIWA"}
        </div>
      )}
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
const firstSujood = () => ({
  title: "Unang Sujood", pose: "SUJOOD",
  arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى", transliteration: "Subhaana Rabbiyal A'laa (3x)",
  tagalog: "Luwalhati sa aking Panginoon, ang Kataas-taasan (3 beses)",
  instruction: "Magpatirapa — noo, ilong, dalawang palad, dalawang tuhod, at dalawang paa sa sahig.",
});
const sittingBetween = () => ({
  title: "Pag-upo (Pagitan ng Sujood)", pose: "SITTING",
  arabic: "رَبِّ اغْفِرْ لِي", transliteration: "Rabbighfir lee (3x)",
  tagalog: "Panginoon ko, patawarin Mo ako (3 beses)",
  instruction: "Umupo nang sandali sa pagitan ng dalawang sujood.",
});
const secondSujood = () => ({
  title: "Pangalawang Sujood", pose: "SUJOOD",
  arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى", transliteration: "Subhaana Rabbiyal A'laa (3x)",
  tagalog: "Luwalhati sa aking Panginoon, ang Kataas-taasan (3 beses)",
  instruction: "Magpatirapa ulit tulad ng unang sujood.",
});
const tashahhud = () => ({
  title: "Tashahhud (At-Tahiyyat)", pose: "SITTING",
  arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\nالسَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ\nأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ\nوَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
  transliteration: "At-tahiyyaatu lillaahi was-salawaatu wat-tayyibaat\nAs-salaamu 'alayka ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh\nAs-salaamu 'alaynaa wa 'alaa 'ibaadillaahis-saaliheen\nAsh-hadu an laa ilaaha illallaah\nWa ash-hadu anna Muhammadan 'abduhu wa rasooluh",
  tagalog: "Ang lahat ng pagbati, panalangin at kabutihan ay para sa Allah\nKapayapaan sa iyo, O Propeta, at ang awa at pagpapala ng Allah\nKapayapaan sa amin at sa lahat ng mabubuting lingkod ng Allah\nAko ay sumasaksi na walang diyos kundi ang Allah\nAt ako ay sumasaksi na si Muhammad ay Kanyang alipin at Sugo",
  instruction: "Umupo at basahin ang Tashahhud. Ituro ang hintuturo (shahadah finger) sa 'Ash-hadu'.",
});
const salawat = () => ({
  title: "Salawat (Durood Ibrahim)", pose: "SITTING",
  arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ\nكَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ\nإِنَّكَ حَمِيدٌ مَجِيدٌ",
  transliteration: "Allaahumma salli 'alaa Muhammad wa 'alaa aali Muhammad\nKamaa sallayta 'alaa Ibraaheem wa 'alaa aali Ibraaheem\nInnaka hameedun majeed",
  tagalog: "O Allah, pagpalain Mo si Muhammad at ang pamilya ni Muhammad\nTulad ng pagpapala Mo kay Ibrahim at sa pamilya ni Ibrahim\nKatotohanan, Ikaw ay Kapuri-puri at Maluwalhati",
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
  ...tashahhud(), title: "Tashahhud Una",
  instruction: "Umupo at basahin ang Tashahhud. Pagkatapos, tumayo para sa susunod na raka'at.",
});

// ============================================================
// PRAYER DEFINITIONS
// ============================================================

const PRAYERS = {
  fajr: {
    name: "Fajr (Subh)", rakatCount: 2, tagalog: "Dasal ng Madaling-Araw",
    icon: "🌅", description: "2 Raka'at — Fard", color: "#F4845F",
    steps: [
      niyyah("Fajr",2), takbiratulIhram(),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashahhud(), salawat(), salamRight(), salamLeft(),
    ],
  },
  dhuhr: {
    name: "Dhuhr", rakatCount: 4, tagalog: "Dasal ng Tanghali",
    icon: "☀️", description: "4 Raka'at — Fard", color: "#F9C74F",
    steps: [
      niyyah("Dhuhr",4), takbiratulIhram(),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(4),
      alFatiha(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashahhud(), salawat(), salamRight(), salamLeft(),
    ],
  },
  asr: {
    name: "'Asr", rakatCount: 4, tagalog: "Dasal ng Hapon",
    icon: "🌤️", description: "4 Raka'at — Fard", color: "#F8961E",
    steps: [
      niyyah("'Asr",4), takbiratulIhram(),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(4),
      alFatiha(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashahhud(), salawat(), salamRight(), salamLeft(),
    ],
  },
  maghrib: {
    name: "Maghrib", rakatCount: 3, tagalog: "Dasal ng Takipsilim",
    icon: "🌇", description: "3 Raka'at — Fard", color: "#C77DBA",
    steps: [
      niyyah("Maghrib",3), takbiratulIhram(),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashahhud(), salawat(), salamRight(), salamLeft(),
    ],
  },
  isha: {
    name: "'Isha", rakatCount: 4, tagalog: "Dasal ng Gabi",
    icon: "🌙", description: "4 Raka'at — Fard", color: "#577590",
    steps: [
      niyyah("'Isha",4), takbiratulIhram(),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(4),
      alFatiha(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashahhud(), salawat(), salamRight(), salamLeft(),
    ],
  },
  witr: {
    name: "Witr", rakatCount: 3, tagalog: "Dasal ng Witr (Sunnah)",
    icon: "✨", description: "3 Raka'at — Sunnah", color: "#4D908E",
    steps: [
      niyyah("Witr",3), takbiratulIhram(),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      takbirUp(2),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashFirst(),
      takbirUp(3),
      alFatiha(), additionalSurah(), ruku(), standingFromRuku(), firstSujood(), sittingBetween(), secondSujood(),
      tashahhud(), salawat(), salamRight(), salamLeft(),
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

  const go = useCallback((i) => {
    if(i<0||i>=total) return;
    setStep(i);
    if(ref.current) ref.current.scrollTop=0;
  },[total]);

  if(!sel) {
    return (
      <div style={S.root}>
        <div style={S.arc}/>
        <div style={S.hdr}>
          <div style={S.bism}>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
          <div style={{fontSize:44,marginBottom:12}}>🕌</div>
          <h1 style={S.title}>Gabay sa Salah</h1>
          <p style={S.sub}>Hakbang-hakbang na gabay sa pagdarasal<br/>para sa mga bagong Muslim</p>
        </div>
        <div style={S.grid}>
          {PRAYER_ORDER.map(k=>{
            const p=PRAYERS[k];
            return(
              <button key={k} onClick={()=>{setSel(k);setStep(0);}} style={S.card}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=p.color;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}
              >
                <div style={{...S.cIcon,background:`${p.color}22`}}>{p.icon}</div>
                <div style={{flex:1}}>
                  <div style={S.cName}>{p.name}</div>
                  <div style={S.cTl}>{p.tagalog}</div>
                </div>
                <div style={{...S.cBadge,background:`${p.color}22`,color:p.color}}>{p.description}</div>
              </button>
            );
          })}
        </div>
        <p style={S.foot}>🕌 Gabay sa Salah — Para sa mga bagong Muslim</p>
      </div>
    );
  }

  const ac = prayer.color||"#2A9D8F";
  return (
    <div style={S.root}>
      <div style={S.top}>
        <button onClick={()=>{setSel(null);setStep(0);}} style={S.back}>← Bumalik</button>
        <div style={S.topT}>{prayer.icon} {prayer.name}</div>
        <div style={{...S.sBadge,background:`${ac}33`,color:ac}}>{step+1}/{total}</div>
      </div>
      <div style={S.pWrap}><div style={{...S.pFill,width:`${pct}%`,background:ac}}/></div>

      <div ref={ref} style={S.cnt}>
        <h2 style={S.sTitle}>{s.title}</h2>
        <div style={S.illust}>
          <PoseIllustration pose={s.pose}/>
          <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1.5,marginTop:12,color:ac,textAlign:"center"}}>
            {s.pose.replace(/_/g,' ')}
          </div>
        </div>
        <div style={{...S.iBox,borderLeftColor:ac}}>
          <span style={{fontSize:18,flexShrink:0}}>📖</span>
          <p style={S.iTxt}>{s.instruction}</p>
        </div>

        {showAr && s.arabic && <div style={S.tCard}><div style={S.lbl}>عربي — Arabic</div><div style={S.ar}>{s.arabic}</div></div>}
        {showTr && s.transliteration && <div style={S.tCard}><div style={S.lbl}>Transliteration</div><div style={S.tr}>{s.transliteration}</div></div>}
        {showTl && s.tagalog && <div style={S.tCard}><div style={S.lbl}>🇵🇭 Salin sa Tagalog</div><div style={S.tl}>{s.tagalog}</div></div>}

        <div style={S.togRow}>
          {[{k:"ar",l:"عربي",a:showAr,f:setShowAr},{k:"tr",l:"Translit",a:showTr,f:setShowTr},{k:"tl",l:"Tagalog",a:showTl,f:setShowTl}].map(t=>(
            <button key={t.k} onClick={()=>t.f(!t.a)} style={{
              ...S.tog, ...(t.a?{background:`${ac}25`,borderColor:`${ac}66`,color:ac}:{})
            }}>{t.l}</button>
          ))}
        </div>
        <div style={{height:20}}/>
      </div>

      <div style={S.nav}>
        <button onClick={()=>go(step-1)} disabled={step===0} style={{...S.nBtn,opacity:step===0?.35:1}}>◀ Nakaraan</button>
        <button onClick={()=>go(step+1)} disabled={step>=total-1} style={{...S.nPri,background:step>=total-1?"#555":ac,opacity:step>=total-1?.4:1}}>Susunod ▶</button>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const S = {
  root:{minHeight:"100vh",background:"#0B1622",color:"#E0DCD4",fontFamily:"'Segoe UI','Noto Sans',system-ui,sans-serif",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto",position:"relative"},
  arc:{position:"absolute",top:0,left:0,right:0,height:200,background:"radial-gradient(ellipse at top,rgba(42,157,143,0.08) 0%,transparent 70%)",pointerEvents:"none"},
  hdr:{textAlign:"center",padding:"44px 24px 16px",position:"relative"},
  bism:{fontFamily:"'Amiri','Traditional Arabic',serif",fontSize:20,color:"#D4A574",marginBottom:20,opacity:.9},
  title:{fontSize:30,fontWeight:800,margin:"0 0 8px",color:"#FFF",letterSpacing:-.5},
  sub:{fontSize:13,color:"#7A8EA0",margin:0,lineHeight:1.6},
  grid:{display:"flex",flexDirection:"column",gap:10,padding:"24px 18px",flex:1},
  card:{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,cursor:"pointer",transition:"all 0.25s ease",color:"#E0DCD4",textAlign:"left",width:"100%"},
  cIcon:{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0},
  cName:{fontSize:16,fontWeight:700,color:"#FFF"},
  cTl:{fontSize:12,color:"#7A8EA0",marginTop:2},
  cBadge:{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,whiteSpace:"nowrap",flexShrink:0},
  foot:{textAlign:"center",padding:20,fontSize:11,color:"#3E5060",margin:0},
  top:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 10px",borderBottom:"1px solid rgba(255,255,255,0.05)"},
  back:{background:"none",border:"none",color:"#2A9D8F",fontSize:13,fontWeight:600,cursor:"pointer",padding:"4px 0"},
  topT:{fontSize:15,fontWeight:700,color:"#FFF"},
  sBadge:{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:16},
  pWrap:{height:3,background:"rgba(255,255,255,0.06)"},
  pFill:{height:"100%",borderRadius:2,transition:"width 0.35s ease"},
  cnt:{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:14},
  sTitle:{fontSize:19,fontWeight:700,color:"#FFF",margin:0,textAlign:"center"},
  illust:{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0",background:"radial-gradient(ellipse at center,rgba(212,165,116,0.04) 0%,transparent 70%)",borderRadius:16},
  illustWrap:{width:"100%",maxWidth:300,aspectRatio:"1/1",borderRadius:24,background:"#FFFFFF",backgroundImage:"linear-gradient(180deg, #FFFFFF 72%, #E8EEF2 72.5%, #F4F7F9 100%)",position:"relative",border:"1px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:20,boxSizing:"border-box",boxShadow:"0 12px 40px rgba(0,0,0,0.3), inset 0 -2px 10px rgba(0,0,0,0.02)"},
  poseImg:{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",transition:"transform 0.3s ease",filter:"drop-shadow(0 12px 12px rgba(0,0,0,0.08))"},
  iBox:{display:"flex",gap:10,alignItems:"flex-start",background:"rgba(42,157,143,0.06)",border:"1px solid rgba(42,157,143,0.12)",borderLeft:"3px solid #2A9D8F",borderRadius:"0 10px 10px 0",padding:"12px 14px"},
  iTxt:{margin:0,fontSize:13.5,lineHeight:1.65,color:"#B0BEC5"},
  tCard:{background:"rgba(255,255,255,0.025)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,0.05)"},
  lbl:{fontSize:10,fontWeight:700,color:"#D4A574",textTransform:"uppercase",letterSpacing:1.2,marginBottom:8},
  ar:{fontFamily:"'Amiri','Traditional Arabic',serif",fontSize:19,lineHeight:2.1,direction:"rtl",textAlign:"right",color:"#FFF",whiteSpace:"pre-line"},
  tr:{fontSize:14,lineHeight:1.85,color:"#A0B0BD",fontStyle:"italic",whiteSpace:"pre-line"},
  tl:{fontSize:13.5,lineHeight:1.75,color:"#B8C8D8",whiteSpace:"pre-line"},
  togRow:{display:"flex",gap:8,justifyContent:"center"},
  tog:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"5px 16px",fontSize:12,color:"#6A7E8E",cursor:"pointer",transition:"all 0.2s",fontWeight:500},
  nav:{display:"flex",gap:10,padding:"12px 18px 24px",borderTop:"1px solid rgba(255,255,255,0.05)",background:"rgba(11,22,34,0.97)"},
  nBtn:{flex:1,padding:"13px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,background:"rgba(255,255,255,0.03)",color:"#D0CCC4",fontSize:13.5,fontWeight:600,cursor:"pointer"},
  nPri:{flex:1,padding:"13px",border:"none",borderRadius:12,color:"#FFF",fontSize:13.5,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(0,0,0,0.3)"},
};
