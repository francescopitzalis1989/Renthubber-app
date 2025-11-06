import type { ReactElement } from 'react';

export interface Owner {
  name: string;
  photoUrl: string;
  isSuperhubber: boolean;
  yearsHosting: number;
  reviewCount: number;
  rating: number;
  // Criteri per Superhubber
  rentalDays: number;
  responseRate: number;
  cancellations: number;
  detailedRatingsCount: { [key: string]: number };
}

export interface Review {
  id: number;
  bookingId: number;
  reviewerId: number;
  revieweeId: number;
  rating: number;
  comment: string;
  timestamp: string; // ISO string
  // For compatibility with ItemDetailPage rendering
  userName: string;
  userPhotoUrl: string;
}

export interface DetailedRatings {
  overall: number;
  condition: number; // Condizione / Pulizia in Airbnb
  precision: number;
  communication: number;
  location: number;
  checkIn: number;
  value: number;
}

export interface Feature {
  name: string;
  icon: ReactElement;
  description?: string;
}

export interface RuleSection {
  title: string;
  items: string[];
}

export interface Item {
  id: number;
  title: string;
  location: string;
  locationDetails: string;
  price: number;
  imageUrls: string[];
  category: string;
  description: string;
  spaceDescription: string;
  tagline: string;
  maxQuantity: number;
  owner: Owner;
  reviewCount: number;
  detailedRatings: DetailedRatings;
  features: Feature[];
  rules: {
    houseRules: RuleSection;
    safety: RuleSection;
    cancellation: RuleSection;
  };
  // New fields for Add Listing Flow
  subcategory?: string;
  weeklyPrice?: number;
  monthlyPrice?: number;
  securityDeposit?: number;
  unavailableDates?: string[]; // Array of ISO date strings
  usageRules?: { [key: string]: boolean | string };
  cancellationPolicy?: 'Flessibile' | 'Moderata' | 'Rigida';
  requireId?: boolean;
  deliveryOption?: {
    enabled: boolean;
    details?: string;
  };
  videoUrl?: string; // For now, we can store a placeholder or file info
  technicalDescription?: { [key: string]: string };
  condition?: 'Come nuovo' | 'Usato';
  status?: 'Attivo' | 'Bozza' | 'In revisione' | 'Sospeso';
}

export interface Category {
  name: string;
  icon: ReactElement;
  subcategories?: string[];
}

export interface ProjectIdea {
  projectName: string;
  description: string;
  requiredEquipment: string[];
}

// NUOVI TIPI PER IL SISTEMA UTENTI

export type UserRole = 'hubber' | 'renter';
export type AdminRole = string;

export interface BillingInfo {
  billingType: 'Privato' | 'Azienda';
  // Common fields
  address: string;
  city: string;
  zipCode: string;
  country: string;
  // Private fields
  taxCode?: string; // Codice Fiscale
  // Company fields
  companyName?: string;
  vatNumber?: string; // Partita IVA
  sdiCode?: string;   // Codice SDI
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  roles: UserRole[];
  currentRole: UserRole;
  dateOfBirth: string; // YYYY-MM-DD
  isVerified: boolean;
  billingInfo?: BillingInfo;
  isAdmin?: boolean;
  adminRoles?: AdminRole[];
}

// --- TIPI PER NOLEGGI, CHAT, DISPUTE ---

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PICKED_UP = 'PICKED_UP', // Ritiro confermato, timer parte
  DELIVERED_BY_RENTER = 'DELIVERED_BY_RENTER', 
  RETURN_CONFIRMED_BY_HUBBER = 'RETURN_CONFIRMED_BY_HUBBER',
  EXTENDED = 'EXTENDED', // Proroga acquistata
  GRACE = 'GRACE', // Entro 1h di tolleranza gratuita
  COMPLETED = 'COMPLETED',
  DISPUTE_OPEN = 'DISPUTE_OPEN',
  CANCELLED = 'CANCELLED',
}

export enum DepositBookingStatus {
    PENDING_AUTHORIZATION = 'PENDING_AUTHORIZATION',
    AUTHORIZED = 'AUTHORIZED',
    CAPTURED = 'CAPTURED',
    RELEASED = 'RELEASED'
}

export interface Booking {
  id: number;
  renterId: number;
  hubberId: number;
  item: Item;
  startAt: string; // ISO pianificato
  endAt: string; // ISO pianificato
  totalPrice: number;
  status: BookingStatus;
  
  // Campi per timer e gestione avanzata
  pickedUpAt?: string; // ISO effettivo del ritiro
  dueAt: string; // ISO scadenza effettiva (inizialmente = endAt, ma può essere estesa)
  returnedAt?: string; // ISO effettivo della restituzione
  graceEnabled: boolean; // default true (1h)
  extendedMinutes?: number; // minuti totali acquistati
  extensionCost?: number; // € totali addebitati per le estensioni
  escrowDepositCents: number; // Deposito in centesimi

  // Vecchio campo, da mantenere per retrocompatibilità se necessario
  deliveryTimestamp?: string;

  // Campi per Stripe Payment Intents
  rentalPaymentIntentId?: string;
  depositPaymentIntentId?: string;
  
  // Nuovi campi per il flusso di pagamento
  rentalPaid?: boolean;
  depositStatus?: DepositBookingStatus;

  // Campi per sistema recensioni
  renterReviewed?: boolean;
  hubberReviewed?: boolean;

  // Campi per commissioni
  renterServiceFee?: number;
  hubberCommission?: number;
  hubberNetEarning?: number;
}

export interface ChatMessage {
  id: number;
  senderId: number; // Corrisponde a User ID
  text?: string;
  timestamp: string; // Esempio: "10:30"
  file?: {
    name: string;
    url: string;
    type: 'image' | 'document';
  };
  isPrivate?: boolean;
  recipientId?: number;
}


export type ThreadType = 'LISTING' | 'RENTAL' | 'BOOKING' | 'SUPPORT';

export interface Thread {
  id: number;
  type: ThreadType;
  bookingId?: number;
  participant: {
    id: number;
    name: string;
    avatarUrl: string;
  };
  item: {
    title: string;
    imageUrl: string;
  };
  messages: ChatMessage[];
  isUnread: boolean;
  assigneeId?: number;
}

export type DisputeType = 'Danno' | 'Mancata restituzione' | 'Ritardo' | 'Altro';

export interface Dispute {
    id: number;
    bookingId: number;
    openedBy: UserRole;
    disputeType: DisputeType;
    description: string;
    mediaUrls?: string[];
    status: 'OPEN' | 'RESOLVED' | 'CLOSED';
    requestedAmount?: number;
}

export interface BookingEvent {
    bookingId: number;
    actorId: number;
    action: string;
    oldState: BookingStatus;
    newState: BookingStatus;
    timestamp: string;
    metadata?: Record<string, any>;
}

export type ChatTab = 'all' | 'listings' | 'rentals' | 'bookings' | 'support';

export type DepositStatus = 'ATTIVO' | 'IN DISPUTA' | 'RILASCIATO';

export interface Deposit {
  id: string;
  bookingId: number;
  itemTitle: string;
  itemImageUrl: string;
  renterName: string;
  renterAvatarUrl: string;
  amount: number;
  status: DepositStatus;
  blockedAt: string;
  estimatedReleaseAt: string;
}

export interface Withdrawal {
  id: number;
  hubberId: number;
  amount: number;
  timestamp: string; // ISO string
  method: 'bank' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  paymentDetails: {
    iban?: string;
    paypalEmail?: string;
  };
}

export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageCount: number;
  maxUsage: number | null;
  isActive: boolean;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  singleUsePerUser?: boolean;
  isStackable?: boolean;
}

export interface AuditLog {
    id: number;
    adminId: number;
    timestamp: string;
    action: string;
    details: string;
}

export type CMSPagePlacement = 'footer-support' | 'footer-community' | 'footer-hosting' | 'footer-info' | 'none';

export interface CMSPage {
    id: number;
    title: string;
    content: string;
    format: 'text' | 'html';
    placement: CMSPagePlacement;
}

export interface SiteSettings {
    companyName: string;
    vatNumber: string;
    address: string;
    legalEmail: string;
    phone: string;
    siteTitle: string;
    siteDescription: string;
    metaKeywords: string;
    allowIndexing: boolean;
    logoUrl: string;
    faviconUrl: string;
    appleTouchIconUrl: string;
}

export interface AutomatedEmail {
    id: string; // a unique key like 'welcome_email'
    name: string;
    description: string;
    subject: string;
    recipientType: 'renter' | 'hubber' | 'new_user';
    format: 'text' | 'html';
    body: string;
    includeLogo: boolean;
    isActive: boolean;
    availableVariables: string[];
}