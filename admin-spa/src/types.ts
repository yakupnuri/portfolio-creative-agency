export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor'
}

export type User = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export enum BriefStatus {
  NEW = 'new',
  REVIEWING = 'reviewing',
  PROPOSAL_SENT = 'proposal_sent',
  WON = 'won',
  LOST = 'lost'
}

export type Brief = {
  id: string;
  clientName: string;
  email: string;
  projectType: string;
  budget: string;
  status: BriefStatus;
  internalNotes: string;
  tags: string[];
  createdAt: string;
};

// Media Library Types
export type MediaType = 'image' | 'video' | 'pdf' | 'doc';
export type ActiveView = 'dashboard' | 'media' | 'posts' | 'settings';

export interface ImageEdits {
  brightness: number;
  rotation: number;
  grayscale: boolean;
  aspectRatio?: string; // e.g., '1/1', '16/9', etc.
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  type: MediaType;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedAt: string;
  uploadedBy: string;
  altText: string;
  title: string;
  caption: string;
  description: string;
  source: 'cloudinary' | 'local' | 'pixabay' | 'site';
  edits?: ImageEdits;
}

export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  largeImageURL: string;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  user: string;
  userImageURL: string;
}

export interface AppState {
  items: MediaItem[];
  selectedId: string | null;
  searchQuery: string;
  filterType: MediaType | 'all';
  viewMode: 'grid' | 'list';
  isOnline: boolean;
  activeTab: 'library' | 'cloudinary' | 'local' | 'site' | 'pixabay';
  pixabayResults: MediaItem[];
  isSearchingPixabay: boolean;
}