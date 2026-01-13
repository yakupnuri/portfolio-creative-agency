
export type Language = 'nl' | 'tr' | 'en';

export type CategoryType = 'Logo Tasarımı' | 'Kitap Kapağı' | 'Katalog/Broşür' | 'Sosyal Medya' | 'Branding' | 'Grafik Tasarım';

export interface Project {
  id: string;
  slug: string;
  year: string;
  coverImage: string;
  gallery: string[];
  translations: {
    [key in Language]: {
      title: string;
      category: string;
      description: string;
      client?: string;
      role?: string;
    }
  }
}

export interface Service {
  id: string;
  icon: string;
  priceStart: string;
  translations: {
    [key in Language]: {
      title: string;
      description: string;
    }
  }
}

export interface BriefData {
  serviceId: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  budget: string;
  deadline: string;
  message: string;
  brandName?: string;
}
