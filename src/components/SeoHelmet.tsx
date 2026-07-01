import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Tinnzstore';
const BASE_URL = 'https://tinnzstore.com';
const DEFAULT_DESC = 'Hosting premium Minecraft, VPS, Dedicated Server dan Baremetal. NVMe SSD super cepat, dukungan 24 jam penuh.';
const OG_IMAGE = 'https://cdn.tinnzstore.com/assets/sep.png';

interface SeoData {
  title: string;
  description: string;
}

const seoMap: Record<string, SeoData> = {
  '/': {
    title: 'Reliable Hosting for Everyone',
    description: 'Tinnzstore menyediakan hosting Minecraft, VPS, Dedicated Server, dan Baremetal dengan performa tinggi dan harga terjangkau di Indonesia.'
  },
  '/game-hosting': {
    title: 'Game Server Hosting',
    description: 'Hosting game server untuk Minecraft, Terraria, SAMP, Hytale dan game lainnya. Performa tinggi dengan NVMe SSD dan DDoS Protection.'
  },
  '/shared-hosting': {
    title: 'Shared Hosting Minecraft',
    description: 'Hosting Minecraft murah dengan CPU AMD Ryzen & EPYC. Nexa, Neon, dan Nano plans untuk kebutuhan server Minecraft Anda.'
  },
  '/private-hosting': {
    title: 'Private Hosting',
    description: 'Private hosting dengan dedicated resources, NVMe SSD, backup unlimited, dan lokasi Singapore/Malaysia. Cocok untuk bisnis dan komunitas.'
  },
  '/app-hosting': {
    title: 'App Hosting',
    description: 'Hosting untuk aplikasi Discord bot, Telegram bot, dan aplikasi backend lainnya dengan performa tinggi.'
  },
  '/web-hosting': {
    title: 'Web Hosting',
    description: 'Web hosting dengan CloudLinux OS, Free SSL, dan performa tinggi. Cocok untuk website bisnis dan personal.'
  },
  '/terraria-hosting': {
    title: 'Terraria Server Hosting',
    description: 'Hosting server Terraria dengan performa tinggi, NVMe storage, dan DDoS protection. Supports modded and vanilla servers.'
  },
  '/samp-hosting': {
    title: 'SAMP Server Hosting',
    description: 'Hosting server SA-MP (San Andreas Multiplayer) dengan performa optimal, NVMe SSD, dan port allocation fleksibel.'
  },
  '/hytale-hosting': {
    title: 'Hytale Server Hosting',
    description: 'Hosting server Hytale dengan spesifikasi tinggi, NVMe Gen4, dan DDoS protection. Siap untuk perilisan Hytale.'
  },
  '/cloud-vps': {
    title: 'Cloud VPS',
    description: 'Cloud VPS Indonesia dengan AMD EPYC, NVMe SSD, dan proteksi DDoS. Cocok untuk development dan production.'
  },
  '/bare-metal': {
    title: 'Bare Metal Server',
    description: 'Dedicated bare metal server dengan performa maksimal. Intel Xeon dan AMD EPYC untuk workload terberat Anda.'
  },
  '/about': {
    title: 'Tentang Tinnzstore',
    description: 'Pelajari lebih lanjut tentang Tinnzstore, penyedia hosting terpercaya di Indonesia dengan layanan 24 jam.'
  },
  '/contact': {
    title: 'Kontak Kami',
    description: 'Hubungi tim support Tinnzstore melalui WhatsApp, email, atau Discord. Kami siap membantu 24 jam.'
  },
  '/hardware': {
    title: 'Spesifikasi Hardware',
    description: 'Lihat spesifikasi hardware server Tinnzstore: AMD EPYC, Ryzen, NVMe SSD, dan infrastruktur jaringan premium.'
  },
  '/host-comparison': {
    title: 'Bandingkan Hosting',
    description: 'Bandingkan paket hosting Tinnzstore untuk menemukan solusi terbaik bagi kebutuhan server Anda.'
  },
  '/sponsor': {
    title: 'Sponsorship',
    description: 'Tinnzstore mendukung komunitas gaming dan kreator konten melalui program sponsorship.'
  },
  '/sponsor/apply': {
    title: 'Daftar Sponsorship',
    description: 'Daftar program sponsorship Tinnzstore untuk komunitas gaming, YouTuber, dan streamer.'
  },
  '/terms': {
    title: 'Syarat & Ketentuan',
    description: 'Syarat dan ketentuan layanan Tinnzstore. Baca kebijakan penggunaan sebelum berlangganan.'
  },
  '/sla': {
    title: 'SLA Guarantee',
    description: 'Service Level Agreement Tinnzstore: jaminan uptime 99.9% dan kompensasi jika terjadi downtime.'
  }
};

export const SeoHelmet: React.FC = () => {
  const { pathname } = useLocation();

  const fallback: SeoData = { title: 'Reliable Hosting for Everyone', description: DEFAULT_DESC };
  let seo = seoMap[pathname] || fallback;
  const title = `${seo.title} - ${SITE_NAME}`;
  const canonical = pathname === '/' ? '/' : pathname;
  const origin = typeof window !== 'undefined' ? window.location.origin : BASE_URL;
  const ogUrl = `${origin}${pathname === '/' ? '' : pathname}`;
  const image = pathname === '/' ? OG_IMAGE : OG_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="id_ID" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
};
