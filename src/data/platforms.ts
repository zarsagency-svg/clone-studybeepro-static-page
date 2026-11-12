import nextToppersImg from '../assets/platforms/next-toppers.webp';
import noxglassImg from '../assets/platforms/noxglass.svg';
import missionJeetImg from '../assets/platforms/mission-jeet.webp';
import vibrantAcademyImg from '../assets/platforms/vibrant-academy.webp';
import physicsWallahImg from '../assets/platforms/physics-wallah.webp';

// Crisp custom SVG data URLs for platforms that previously used the old classic logo
const masterSahabSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="msBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F2270"/>
      <stop offset="50%" stop-color="#1A3BB0"/>
      <stop offset="100%" stop-color="#071039"/>
    </linearGradient>
    <linearGradient id="msGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E6EDFD"/>
      <stop offset="50%" stop-color="#AFC5F8"/>
      <stop offset="100%" stop-color="#6E92F2"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" rx="44" fill="url(#msBg)"/>
  <rect x="10" y="10" width="220" height="220" rx="36" fill="none" stroke="#6E92F2" stroke-width="3" stroke-opacity="0.45"/>
  <circle cx="120" cy="92" r="42" fill="#2E5DE6" fill-opacity="0.35" stroke="#AFC5F8" stroke-width="2.5"/>
  <path d="M120 56 L154 74 L120 92 L86 74 Z" fill="url(#msGold)"/>
  <path d="M96 83 V104 C96 114 144 114 144 104 V83" fill="none" stroke="#E6EDFD" stroke-width="4" stroke-linecap="round"/>
  <text x="120" y="164" text-anchor="middle" fill="#E6EDFD" font-family="Syne, Inter, sans-serif" font-weight="800" font-size="28" letter-spacing="1">MASTER</text>
  <text x="120" y="194" text-anchor="middle" fill="#6E92F2" font-family="Inter, sans-serif" font-weight="700" font-size="22" letter-spacing="3">SAHAB</text>
</svg>
`)}`;

const uncOfflineSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="uoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071039"/>
      <stop offset="60%" stop-color="#0F2270"/>
      <stop offset="100%" stop-color="#1A3BB0"/>
    </linearGradient>
    <linearGradient id="uoAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6E92F2"/>
      <stop offset="100%" stop-color="#2E5DE6"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" rx="44" fill="url(#uoBg)"/>
  <rect x="10" y="10" width="220" height="220" rx="36" fill="none" stroke="#6E92F2" stroke-width="3" stroke-opacity="0.4"/>
  <path d="M74 68 V116 C74 142 166 142 166 116 V68" fill="none" stroke="#E6EDFD" stroke-width="16" stroke-linecap="round"/>
  <circle cx="120" cy="96" r="14" fill="url(#uoAccent)"/>
  <rect x="52" y="156" width="136" height="36" rx="18" fill="#2E5DE6"/>
  <text x="120" y="180" text-anchor="middle" fill="#E6EDFD" font-family="Inter, sans-serif" font-weight="800" font-size="17" letter-spacing="2.5">OFFLINE</text>
</svg>
`)}`;

const uncOnlineSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="unBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A3BB0"/>
      <stop offset="50%" stop-color="#0F2270"/>
      <stop offset="100%" stop-color="#071039"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" rx="44" fill="url(#unBg)"/>
  <rect x="10" y="10" width="220" height="220" rx="36" fill="none" stroke="#AFC5F8" stroke-width="3" stroke-opacity="0.45"/>
  <path d="M70 80 L120 125 L170 80" fill="none" stroke="#6E92F2" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M70 130 L120 85 L170 130" fill="none" stroke="#E6EDFD" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="120" y="188" text-anchor="middle" fill="#E6EDFD" font-family="Syne, Inter, sans-serif" font-weight="800" font-size="32" letter-spacing="4">UNC</text>
</svg>
`)}`;

export interface PlatformItem {
  id: number;
  name: string;
  subtitle: string;
  metaText: string;
  category: 'boards' | 'jee-neet' | 'tools';
  href?: string;
  isModal?: boolean;
  title: string;
  imgSrc: string;
  imgAlt: string;
  objectFit: 'contain' | 'cover';
  tiltAngle: number;
  accentShade: string;
  delayMs: number;
}

export const PLATFORMS: PlatformItem[] = [
  {
    id: 1,
    name: 'Next Toppers',
    subtitle: 'Board & Foundation Batches',
    metaText: 'Free Access · Live & Recorded',
    category: 'boards',
    href: 'https://xhashikstudy-nt.vercel.app/',
    title: 'Next Toppers - MIND SPARK',
    imgSrc: nextToppersImg,
    imgAlt: 'Next Toppers Logo',
    objectFit: 'cover',
    tiltAngle: -10,
    accentShade: '#2E5DE6',
    delayMs: 150,
  },
  {
    id: 17,
    name: 'NoxGlass',
    subtitle: 'Distraction-Free Player',
    metaText: 'Focus Mode · YouTube Study',
    category: 'tools',
    href: 'https://donotdistract.vercel.app/',
    title: 'NoxGlass - Distraction-free YouTube lecture player for focused study',
    imgSrc: noxglassImg,
    imgAlt: 'NoxGlass - distraction-free lecture player',
    objectFit: 'contain',
    tiltAngle: 9,
    accentShade: '#6E92F2',
    delayMs: 220,
  },
  {
    id: 3,
    name: 'Mission Jeet',
    subtitle: 'Video Lectures & Notes',
    metaText: 'Complete Batches · Free PDFs',
    category: 'boards',
    href: 'https://clone-video-lecture-website.vercel.app/',
    title: 'Mission Jeet - Video lectures & batches',
    imgSrc: missionJeetImg,
    imgAlt: 'Mission Jeet - MIND SPARK',
    objectFit: 'cover',
    tiltAngle: -8,
    accentShade: '#2E5DE6',
    delayMs: 290,
  },
  {
    id: 8,
    name: 'Master Sahab',
    subtitle: 'Sanskrit & Board Prep',
    metaText: 'Shemushi + Manika · HD Classes',
    category: 'boards',
    href: 'https://master-shabab.vercel.app/',
    title: 'Master Sahab on MIND SPARK Ecosystem',
    imgSrc: masterSahabSvg,
    imgAlt: 'Master Sahab - MIND SPARK Aura',
    objectFit: 'cover',
    tiltAngle: 11,
    accentShade: '#1A3BB0',
    delayMs: 360,
  },
  {
    id: 9,
    name: 'UNC Offline',
    subtitle: 'Kota Classroom Lectures',
    metaText: 'Offline Centres · Full Syllabus',
    category: 'jee-neet',
    href: 'https://clone-functional-study-page.vercel.app/',
    title: 'UNC Offline via MIND SPARK Mod',
    imgSrc: uncOfflineSvg,
    imgAlt: 'UNC Offline - MIND SPARK Mod',
    objectFit: 'cover',
    tiltAngle: -11,
    accentShade: '#2E5DE6',
    delayMs: 430,
  },
  {
    id: 10,
    name: 'UNC',
    subtitle: 'Online Lecture Portal',
    metaText: 'Plus Batches · Top Educators',
    category: 'jee-neet',
    href: 'https://studybee-lecture-platform.vercel.app/',
    title: 'UNC available on MIND SPARK',
    imgSrc: uncOnlineSvg,
    imgAlt: 'UNC - MIND SPARK',
    objectFit: 'cover',
    tiltAngle: 8,
    accentShade: '#6E92F2',
    delayMs: 500,
  },
  {
    id: 13,
    name: 'Vibrant Academy',
    subtitle: 'JEE Advanced Batches',
    metaText: 'Kota Star Faculty · Video Vault',
    category: 'jee-neet',
    href: 'https://vibrantacademy-five.vercel.app/',
    title: 'Vibrant Academy - JEE prep batches & video lectures',
    imgSrc: vibrantAcademyImg,
    imgAlt: 'Vibrant Academy - MIND SPARK',
    objectFit: 'cover',
    tiltAngle: -9,
    accentShade: '#1A3BB0',
    delayMs: 570,
  },
  {
    id: 14,
    name: 'Physics Wallah',
    subtitle: 'JEE & NEET Batches',
    metaText: 'Live Classes · Study Material',
    category: 'jee-neet',
    title: 'Physics Wallah on MIND SPARK Platform',
    imgSrc: physicsWallahImg,
    imgAlt: 'Physics Wallah - MIND SPARK Mod',
    objectFit: 'cover',
    tiltAngle: 10,
    accentShade: '#2E5DE6',
    delayMs: 640,
  },
];

export const ULTRAMARINE_PALETTE = [
  { hex: '#071039', name: 'Abyssal Ultramarine', role: 'Core Background' },
  { hex: '#0F2270', name: 'Royal Deep Navy', role: 'Elevated Surface' },
  { hex: '#1A3BB0', name: 'Classic Ultramarine', role: 'Folder Architecture' },
  { hex: '#2E5DE6', name: 'Electric Cobalt', role: 'Primary Interactive' },
  { hex: '#6E92F2', name: 'Cornflower Glow', role: 'Glass Refraction' },
  { hex: '#AFC5F8', name: 'Frosted Periwinkle', role: 'Specular & Muted Text' },
  { hex: '#E6EDFD', name: 'Alabaster Ice', role: 'Crisp Typography' },
];
