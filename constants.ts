
import { Project, Service, Language } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'modern-branding-co',
    year: '2024',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQFx6zilkVODotVJ3rEJ6aqvo_FHoxZGZxbW2hs6-FtxfR-Kd_evHNQsck__dBfIrUR0Wd2ombV2gTnako2W0dewVar3j_Vns2GbmP9BVlDmpCME4Ada2k_IFGSUOYcBs7RcERAZgudtes8hBCe0q9xLFV0DpBnAADiecHgx_Vz7_2TeM2zHV8SwwAQYa5-0UovFtncvJHN8lvoBMRoz1-3tJAC5iEo2-lzmQFvMw3cMdsWPj1gzgJQMhStqIaU-joO-xDAFGnVQ',
    gallery: [],
    translations: {
      nl: { title: 'Modern Koffie Branding', category: 'Branding', description: 'Holistische merkidentiteit voor een minimalistische koffieshop.', client: 'EcoCoffee', role: 'Hoofdontwerper' },
      tr: { title: 'Modern Coffee Branding', category: 'Branding', description: 'Minimalist kahve dükkanı için bütünsel marka kimliği tasarımı.', client: 'EcoCoffee', role: 'Baş Tasarımcı' },
      en: { title: 'Modern Coffee Branding', category: 'Branding', description: 'Holistic brand identity design for a minimalist coffee shop.', client: 'EcoCoffee', role: 'Lead Designer' }
    }
  },
  {
    id: '2',
    slug: 'minimal-book-cover',
    year: '2023',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz1xlrqRPJxVypyLxNp_HmaXUbf06w5WDEq3m1vovnL4op1yxMzYhH_hVlEgcES5h8hxpfgreqWAfy7Ux4dWMWcQ2LatxC3TtZJ3S0KTCLSFVWkys-cotl2cJC1YqwpKverTAacelEGfQoF0J69N0N1mvd61GnhDGdPR5Hv-ecqaThhJyPZRRfqJe9i2KM8I3I8EehQWc0MrdTnF8BuzAXcRx3zN1O8FnSNY_a_q9eEVxcifyrrXdJjWArP_mCRNS2nfSlQNtbbQ',
    gallery: [],
    translations: {
      nl: { title: 'Het Stille Pad', category: 'Boekomslag', description: 'Typografie-gericht omslagontwerp voor een literaire roman.', client: 'Yakamoz Uitgeverij' },
      tr: { title: 'The Silent Path', category: 'Kitap Kapağı', description: 'Edebi bir roman için tipografi odaklı kapak tasarımı.', client: 'Yakamoz Yayınları' },
      en: { title: 'The Silent Path', category: 'Book Cover', description: 'Typography-focused cover design for a literary novel.', client: 'Yakamoz Publishing' }
    }
  },
  {
    id: '3',
    slug: 'tech-corp-logo',
    year: '2024',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnHbsuVQrGyByfuUMqnp2ZXP8juRmdXHeHpgY1ABc0R7S7rbfi9oQjjR2eYFvxktQU8gVFj16P51l49rRfwfUVLBbu0-jJ2ifIzsGmVacSkbpbu0OoQJWO7lZ4G11Yh-2twRdcMwALH6nGtNWxZX-bGv8mNeGb7ur8el3GcjfNF0DmoHKraSolISu90VB-3Sb5UlNhWZ-rHwke--nRM_yCY1N-N_vRitM4ZtEADSC3od78ZQCgj3644yJYOgQdYM7D3jo6HoMYmA',
    gallery: [],
    translations: {
      nl: { title: 'Vortex Tech Logo', category: 'Logo Ontwerp', description: 'Modern logotype voor een AI-gerichte startup.', client: 'Vortex' },
      tr: { title: 'Vortex Tech Logo', category: 'Logo Tasarımı', description: 'Yapay zeka odaklı bir startup için modern logotype.', client: 'Vortex' },
      en: { title: 'Vortex Tech Logo', category: 'Logo Design', description: 'Modern logotype for an AI-focused startup.', client: 'Vortex' }
    }
  }
];

export const SERVICES: Service[] = [
  { id: 'logo', icon: 'pentagon', priceStart: '€150', translations: {
    nl: { title: 'Logo Ontwerp', description: 'Unieke symbolen die de ziel van uw merk weerspiegelen.' },
    tr: { title: 'Logo Tasarımı', description: 'Markanızın ruhunu yansıtan özgün amblemler.' },
    en: { title: 'Logo Design', description: 'Unique symbols reflecting the soul of your brand.' }
  }},
  { id: 'book', icon: 'auto_stories', priceStart: '€200', translations: {
    nl: { title: 'Boekomslag', description: 'Beelden die uw verhaal laten opvallen in de schappen.' },
    tr: { title: 'Kitap Kapağı', description: 'Hikayenizi raflarda öne çıkaracak görseller.' },
    en: { title: 'Book Cover', description: 'Visuals that make your story stand out on the shelves.' }
  }},
  { id: 'social', icon: 'share', priceStart: '€400', translations: {
    nl: { title: 'Sociale Media', description: 'Maandelijkse contentplanning en visuele productie.' },
    tr: { title: 'Sosyal Medya', description: 'Aylık içerik planlama ve görsel üretim.' },
    en: { title: 'Social Media', description: 'Monthly content planning and visual production.' }
  }},
  { id: 'catalog', icon: 'menu_book', priceStart: '€300', translations: {
    nl: { title: 'Catalogus/Brochure', description: 'Gedrukt materiaal dat uw producten het best presenteert.' },
    tr: { title: 'Katalog/Broşür', description: 'Ürünlerinizi en iyi anlatan basılı materyaller.' },
    en: { title: 'Catalog/Brochure', description: 'Print materials that present your products best.' }
  }}
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  nl: {
    'nav.work': 'Projecten',
    'nav.services': 'Hiensten',
    'nav.about': 'Over Mij',
    'nav.contact': 'Contact',
    'nav.brief': 'Stuur Brief',
    'hero.title': 'WIJ MAKEN IDEEËN',
    'hero.title.highlight': 'ZICHTBAAR',
    'hero.subtitle': 'Strategische creatieve oplossingen in merkidentiteit, boekomslagen en digitale content.',
    'hero.cta.brief': 'Stuur Brief',
    'hero.cta.work': 'Bekijk Werk',
    'process.title': 'Hoe we ',
    'process.title.red': 'Werken',
    'process.subtitle': 'Onze processen zijn transparant, snel en resultaatgericht.',
    'featured.title': 'Geselecteerde Projecten',
    'featured.all': 'Bekijk Alles',
    'brief.title': 'Stuur ',
    'brief.title.blue': 'Brief',
    'brief.step': 'STAP',
    'brief.next': 'Doorgaan',
    'brief.prev': 'Terug',
    'brief.summary': 'Samenvatten',
    'brief.submit': 'Laten we beginnen!',
    'brief.success.title': 'BRIEF ONTVANGEN!',
    'brief.success.text': 'Uw aanvraag is ontvangen. Ons team zal de details bekijken en binnen 24 uur reageren.',
    'footer.cta': 'Laten we samen ',
    'footer.cta.blue': 'Creëren.',
    'footer.text': 'Ik help uw merk naar de toekomst met strategisch design en sterke typografie.'
  },
  tr: {
    'nav.work': 'Projeler',
    'nav.services': 'Hizmetler',
    'nav.about': 'Hakkımda',
    'nav.contact': 'İletişim',
    'nav.brief': 'Brief Gönder',
    'hero.title': 'FİKİRLERİ',
    'hero.title.highlight': 'GÖRÜNÜR',
    'hero.subtitle': 'Marka kimliği, kitap kapağı ve dijital içerik tasarımında strateji odaklı kreatif çözümler üretiyoruz.',
    'hero.cta.brief': 'Brief Gönder',
    'hero.cta.work': 'Projeleri Gör',
    'process.title': 'Nasıl ',
    'process.title.red': 'İlerliyoruz?',
    'process.subtitle': 'Sürecimiz şeffaf, hızlı ve sonuç odaklıdır.',
    'featured.title': 'Öne Çıkanlar',
    'featured.all': 'Tümünü Gör',
    'brief.title': 'Brief ',
    'brief.title.blue': 'Gönder',
    'brief.step': 'ADIM',
    'brief.next': 'Devam Et',
    'brief.prev': 'Geri Dön',
    'brief.summary': 'Özetle',
    'brief.submit': 'Hadi Başlayalım!',
    'brief.success.title': 'BRIEF ALINDI!',
    'brief.success.text': 'Talebiniz bize ulaştı. Tasarım ekibimiz detayları inceleyip 24 saat içinde dönecek.',
    'footer.cta': 'Hadi Birlikte ',
    'footer.cta.blue': 'Üretelim.',
    'footer.text': 'Stratejik tasarım ve güçlü tipografi ile markanızı geleceğe taşıyorum.'
  },
  en: {
    'nav.work': 'Projects',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.brief': 'Send Brief',
    'hero.title': 'WE MAKE IDEAS',
    'hero.title.highlight': 'VISIBLE',
    'hero.subtitle': 'Strategy-driven creative solutions in brand identity, book covers, and digital content design.',
    'hero.cta.brief': 'Send Brief',
    'hero.cta.work': 'See Work',
    'process.title': 'Our ',
    'process.title.red': 'Process',
    'process.subtitle': 'Our process is transparent, fast, and results-oriented.',
    'featured.title': 'Featured Work',
    'featured.all': 'See All',
    'brief.title': 'Send ',
    'brief.title.blue': 'Brief',
    'brief.step': 'STEP',
    'brief.next': 'Continue',
    'brief.prev': 'Back',
    'brief.summary': 'Summarize',
    'brief.submit': 'Let\'s Start!',
    'brief.success.title': 'BRIEF RECEIVED!',
    'brief.success.text': 'Your request has reached us. Our team will review the details and get back to you within 24 hours.',
    'footer.cta': 'Let\'s Create ',
    'footer.cta.blue': 'Together.',
    'footer.text': 'I carry your brand to the future with strategic design and strong typography.'
  }
};

export const CLIENTS = ['Yakamoz Publishing', 'Vortex Tech', 'EcoCoffee', 'Moda Sahnesi', 'Global Logistics'];
