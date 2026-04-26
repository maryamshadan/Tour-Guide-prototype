
export enum SafetyLevel {
  SAFE = 'SAFE',
  CAUTION = 'CAUTION',
  DANGER = 'DANGER',
}

export type Language = 'en' | 'hi' | 'te';

export interface Monument {
  id: string;
  name: string;
  type: 'Fort' | 'Temple' | 'Monument' | 'Nature' | 'Museum' | 'Palace' | 'Mosque' | 'Tombs';
  description: string;
  history: string;
  lat: number;
  lon: number;
  safetyScore: number; // 0-100
  safetyLevel: SafetyLevel;
  imageUrl: string;
  visited?: boolean;
  cached?: boolean; // Track if details are downloaded for offline
}

export interface POI {
    id: string;
    name: string;
    type: 'HOTEL' | 'RESTAURANT' | 'HOSPITAL' | 'POLICE';
    lat: number;
    lon: number;
    rating?: number;
    address?: string;
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked: boolean;
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
}

export interface User {
  name: string;
  email: string;
  language: Language;
  emergencyContacts: Contact[];
  badges: string[]; // badge IDs
  visitedMonuments: string[]; // monument IDs
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Contribution {
  id?: number;
  userId: string;
  userName: string;
  type: 'STORY' | 'TIP' | 'WARNING';
  content: string;
  monumentId: string;
  timestamp: number;
  synced: number;
}

export interface NavigationStep {
    instruction: string;
    distance: string;
    icon: 'straight' | 'left' | 'right' | 'destination';
}

export type ViewState = 'AUTH' | 'HOME' | 'LIST' | 'DETAILS' | 'CAMERA' | 'SOS' | 'PROFILE' | 'VOICE_ASSISTANT' | 'FAKE_CALL';
