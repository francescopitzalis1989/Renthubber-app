import React from 'react';
import type { Item, Category, Feature, Owner, Review, DetailedRatings, User, Booking, Thread, Dispute, BookingEvent, ChatTab, ThreadType, Withdrawal, Coupon, AuditLog, CMSPage, AutomatedEmail, SiteSettings, WebhookEvent } from './types';
import { BellIcon, CalendarIcon, ChartBarIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, CreditCardIcon, DocumentChartBarIcon, DocumentMagnifyingGlassIcon, DocumentTextIcon, HeartIcon, InboxIcon, MagnifyingGlassIcon, PaperAirplaneIcon, ShieldCheckIcon, ShieldExclamationIcon, SparklesIcon, StarIcon, TagIcon, UserGroupIcon, WalletIcon } from './components/Icons';
import { BookingStatus, DepositBookingStatus } from './types';

export const PAYMENTS_CONFIG = {
  useMocks: false, // Default to new behavior
};

// Nuove Icone per Categorie
const EdiliIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const BebeIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75S9.75 9.336 9.75 9.75zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" /></svg>;
const FesteTemaIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>;
const CucinaIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GiochiIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>;
const OutdoorIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const SanitarieIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const DomesticheIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h4.5V16.5" /></svg>;
const IndustrialiIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 00-4.773-4.773L6.75 15.75l2.472 2.472a3.375 3.375 0 004.773-4.773z" /></svg>;
const LavoroIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>;
const AgricoleIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.632-1.996l.305-1.22a3.75 3.75 0 017.28 1.996l-.305 1.22a5.25 5.25 0 011.022 10.875" /></svg>;
const ElettronicaIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>;
const VeicoliIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h10.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-7.5a2.25 2.25 0 00-2.25 2.25v1.5" /></svg>;
const AbbigliamentoIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const EventiIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>;

export let CATEGORIES: Category[] = [
    { name: 'Attrezzature Edili', icon: EdiliIcon, subcategories: ['Betoniere', 'Martelli Demolitori', 'Ponteggi', 'Generatori'] },
    { name: 'Premaman e Bebè', icon: BebeIcon, subcategories: ['Passeggini', 'Seggiolini Auto', 'Culle', 'Tiralatte'] },
    { name: 'Feste a Tema', icon: FesteTemaIcon, subcategories: ['Costumi', 'Decorazioni', 'Macchine per Popcorn', 'Gonfiabili'] },
    { name: 'Cucina & Ristorazione', icon: CucinaIcon, subcategories: ['Impastatrici', 'Robot da Cucina', 'Fornelloni', 'Attrezzatura Catering'] },
    { name: 'Giochi & Tempo Libero', icon: GiochiIcon, subcategories: ['Console', 'Giochi da Tavolo', 'Droni Giocattolo'] },
    { name: 'Camping & Outdoor', icon: OutdoorIcon, subcategories: ['Tende', 'Zaini', 'Fornelli da Campo', 'Attrezzatura da Scalata'] },
    { name: 'Attrezzature Sanitarie', icon: SanitarieIcon, subcategories: ['Carrozzine', 'Deambulatori', 'Letti Ortopedici'] },
    { name: 'Attrezzature Domestiche', icon: DomesticheIcon, subcategories: ['Idropulitrici', 'Aspirapolveri Speciali', 'Lucidatrici'] },
    { name: 'Attrezzature Industriali', icon: IndustrialiIcon, subcategories: ['Saldatrici', 'Compressori', 'Muletti'] },
    { name: 'Attrezzature da Lavoro', icon: LavoroIcon, subcategories: ['Scale', 'Utensili Elettrici', 'Generatori di Corrente'] },
    { name: 'Attrezzature Agricole', icon: AgricoleIcon, subcategories: ['Motozappe', 'Decespugliatori', 'Tagliasiepi'] },
    { name: 'Elettronica', icon: ElettronicaIcon, subcategories: ['Fotocamere', 'Droni Professionali', 'Proiettori', 'Sistemi Audio'] },
    { name: 'Veicoli', icon: VeicoliIcon, subcategories: ['Auto', 'Furgoni', 'Moto e Scooter', 'Biciclette'] },
    { name: 'Abbigliamento e Accessori', icon: AbbigliamentoIcon, subcategories: ['Abiti da Cerimonia', 'Accessori di Lusso', 'Attrezzatura Sportiva'] },
    { name: 'Eventi e Feste', icon: EventiIcon, subcategories: ['Impianti Audio', 'Luci da Palco', 'Gazebo', 'Tavoli e Sedie'] },
];

export const TECHNICAL_SPECS_BY_CATEGORY: { [key: string]: string[] } = {
    'Attrezzature Edili': ['Marca', 'Modello', 'Potenza (W)', 'Peso (kg)'],
    'Elettronica': ['Marca', 'Modello', 'Risoluzione', 'Connettività'],
    'Veicoli': ['Marca', 'Modello', 'Anno', 'Tipo Carburante'],
    'Attrezzature da Lavoro': ['Marca', 'Modello', 'Alimentazione', 'Peso (kg)'],
};

export let SUPERHUBBER_CRITERIA = {
  rating: 4.8,
  rentalDays: 100,
  responseRate: 90,
  cancellations: 3,
};

const mockOwner: Owner = {
  name: 'Marco',
  photoUrl: 'https://i.pravatar.cc/150?u=marco',
  isSuperhubber: true,
  yearsHosting: 3,
  reviewCount: 152,
  rating: 4.94,
  rentalDays: 120,
  responseRate: 100,
  cancellations: 2,
  detailedRatingsCount: {
    condition: 150,
    precision: 152,
    communication: 152,
    location: 148,
    checkIn: 151,
    value: 149,
  }
};

export const mockDetailedRatings: DetailedRatings = {
  overall: 4.94,
  condition: 5.0,
  precision: 4.9,
  communication: 5.0,
  location: 4.8,
  checkIn: 5.0,
  value: 4.9
};

const mockFeatures: Feature[] = [
    { name: 'Sensore 24.2 MP', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg> },
    { name: 'Registrazione Video 4K', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6.75a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 15.75V9a2.25 2.25 0 012.25-2.25h15z" /></svg> },
    { name: 'Include Obiettivo 24-70mm', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
    { name: '2 Batterie', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V10.5m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v4.5m18 0V9M3 12V9m18 3V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75V9" /></svg> },
    { name: 'Borsa per il trasporto', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 .007l2.25.007M12 15l-2.25.007M12 15l2.25 1.313M12 15l-2.25 1.313M3 10.5l2.25-1.313M3 10.5l2.25 1.313M3 10.5v2.25m9 3l2.25-1.313M12 18l-2.25-1.313M12 18V15m0 0l2.25.007M12 15l-2.25.007M12 15l2.25 1.313M12 15l-2.25 1.313M21 10.5l-2.25-1.313M21 10.5l-2.25 1.313M21 10.5v2.25m-9 3l2.25-1.313M12 18l-2.25-1.313M12 18V15m0 0l2.25.007M12 15l-2.25.007M12 15l2.25 1.313M12 15l-2.25 1.313z" /></svg> },
];

const mockRules = {
  houseRules: { title: 'Regole del proprietario', items: ['Trattare l\'attrezzatura con cura.', 'Riconsegna puntuale.', 'Comunicare tempestivamente eventuali problemi.'] },
  safety: { title: 'Sicurezza e attrezzatura', items: ['Manuale di istruzioni fornito.', 'Controllare l\'attrezzatura prima dell\'uso.'] },
  cancellation: { title: 'Termini di cancellazione', items: ['Cancellazione gratuita entro 48 ore dalla prenotazione.', 'Penale del 50% per cancellazioni entro 7 giorni dal noleggio.', 'Nessun rimborso per cancellazioni successive.'] }
};

export let MOCK_ITEMS: Item[] = [
  {
    id: 1,
    title: 'Fotocamera Mirrorless Pro',
    location: 'Milano, Italia',
    locationDetails: 'Nel centro storico di Milano, a pochi passi dal Duomo.',
    price: 50,
    imageUrls: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542038784-56eD6D454A5D?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'Elettronica',
    description: 'Cattura foto e video mozzafiato con questa fotocamera Mirrorless di livello professionale. Fornita con un obiettivo versatile 24-70mm, due batterie e una borsa per il trasporto. Ideale sia per fotografi amatoriali che per professionisti che necessitano di un corpo macchina affidabile per un progetto.',
    spaceDescription: 'L\'attrezzatura viene conservata in uno studio protetto e a temperatura controllata per garantirne le massime prestazioni. Il ritiro avviene in una zona comoda e facilmente accessibile con i mezzi pubblici.',
    tagline: 'Sensore full-frame da 24.2 MP · Video 4K',
    maxQuantity: 1,
    owner: mockOwner,
    reviewCount: 152,
    detailedRatings: mockDetailedRatings,
    features: mockFeatures,
    rules: mockRules,
    securityDeposit: 200,
    cancellationPolicy: 'Moderata',
    status: 'Attivo',
  },
  {
    id: 2,
    title: 'Betoniera Elettrica 140L',
    location: 'Roma, Italia',
    locationDetails: 'Quartiere Prati, vicino alla metro.',
    price: 35,
    imageUrls: [
      'https://images.unsplash.com/photo-1581141849291-1125c7b69c2b?q=80&w=1935&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593349389422-cf501b2f70a2?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605118953503-68ed2f3de215?q=80&w=1925&auto=format&fit=crop',
    ],
    category: 'Attrezzature Edili',
    description: 'Betoniera robusta e affidabile, ideale per piccoli e medi lavori di costruzione. Facile da trasportare e utilizzare.',
    spaceDescription: 'Facile ritiro da magazzino al piano terra.',
    tagline: 'Capacità 140L · Motore elettrico monofase',
    maxQuantity: 3,
    owner: { ...mockOwner, name: 'Giulia', isSuperhubber: false, reviewCount: 45, rating: 4.8 },
    reviewCount: 45,
    detailedRatings: { ...mockDetailedRatings, overall: 4.8 },
    features: [{name: 'Capacità 140 Litri', icon: EdiliIcon}, {name: 'Motore Elettrico', icon: EdiliIcon}, {name: 'Facile da trasportare', icon: EdiliIcon}],
    rules: mockRules,
    securityDeposit: 100,
    cancellationPolicy: 'Flessibile',
    status: 'In revisione',
  },
  {
    id: 3,
    title: 'Passeggino da Viaggio Leggero',
    location: 'Napoli, Italia',
    locationDetails: 'Vicino al lungomare.',
    price: 25,
    imageUrls: [
      'https://images.unsplash.com/photo-1560341022-c5c7b3f46f12?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618520556633-82084b3e6c9a?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508739217351-737c35581156?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518621334648-f62d3a37b3c6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604176422368-a4e4f1345d3c?q=80&w=1964&auto=format&fit=crop',
    ],
    category: 'Premaman e Bebè',
    description: 'Passeggino ultraleggero e compatto, ideale per viaggiare. Si chiude con una sola mano ed è omologato come bagaglio a mano per la maggior parte delle compagnie aeree.',
    spaceDescription: 'Disponibile per il ritiro o la consegna a domicilio (costo extra).',
    tagline: 'Ultraleggero · Chiusura compatta · Da 6 mesi',
    maxQuantity: 2,
    owner: { ...mockOwner, name: 'Antonio', isSuperhubber: true, reviewCount: 210, rating: 5.0 },
    reviewCount: 210,
    detailedRatings: { ...mockDetailedRatings, overall: 5.0 },
    features: [{name: 'Pesa solo 6kg', icon: BebeIcon}, {name: 'Chiusura a libro', icon: BebeIcon}, {name: 'Capottina parasole UPF 50+', icon: BebeIcon}],
    rules: mockRules,
    securityDeposit: 50,
    cancellationPolicy: 'Rigida',
    status: 'Bozza',
  },
];

export let MOCK_USERS: User[] = [
    {
        id: 1,
        firstName: 'Marco',
        lastName: 'Rossi',
        email: 'hubber@renthubber.com',
        phone: '3331234567',
        avatarUrl: 'https://i.pravatar.cc/150?u=marco',
        roles: ['hubber'],
        currentRole: 'hubber',
        dateOfBirth: '1985-05-15',
        isVerified: true,
        billingInfo: {
            billingType: 'Azienda',
            companyName: 'Rossi Noleggi S.r.l.',
            vatNumber: 'IT12345678901',
            sdiCode: 'A1B2C3D',
            address: 'Via Roma, 1',
            city: 'Milano',
            zipCode: '20121',
            country: 'Italia',
        }
    },
    {
        id: 2,
        firstName: 'Laura',
        lastName: 'Verdi',
        email: 'renter@renthubber.com',
        phone: '3337654321',
        avatarUrl: 'https://i.pravatar.cc/150?u=laura',
        roles: ['renter'],
        currentRole: 'renter',
        dateOfBirth: '1992-11-20',
        isVerified: false,
        billingInfo: {
            billingType: 'Privato',
            taxCode: 'VRDLRA92S60F205X',
            address: 'Piazza Duomo, 22',
            city: 'Firenze',
            zipCode: '50122',
            country: 'Italia',
        }
    },
    {
        id: 3,
        firstName: 'Test',
        lastName: 'Hubber',
        email: 'test.hubber@renthubber.com',
        phone: '3330000001',
        avatarUrl: 'https://i.pravatar.cc/150?u=testhubber',
        roles: ['hubber'],
        currentRole: 'hubber',
        dateOfBirth: '1988-01-30',
        isVerified: true,
    },
    {
        id: 4,
        firstName: 'Test',
        lastName: 'Renter',
        email: 'test.renter@renthubber.com',
        phone: '3330000002',
        avatarUrl: 'https://i.pravatar.cc/150?u=testrenter',
        roles: ['renter'],
        currentRole: 'renter',
        dateOfBirth: '1995-07-10',
        isVerified: false,
    },
    {
        id: 5,
        firstName: 'Dual',
        lastName: 'User',
        email: 'dual@renthubber.com',
        phone: '3331122334',
        avatarUrl: 'https://i.pravatar.cc/150?u=dual',
        roles: ['renter', 'hubber'],
        currentRole: 'renter',
        dateOfBirth: '1990-01-01',
        isVerified: true,
        adminRoles: ['Support'],
    },
    {
        id: 6,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@renthubber.com',
        phone: '3339998887',
        avatarUrl: 'https://i.pravatar.cc/150?u=admin',
        roles: ['hubber'],
        currentRole: 'hubber',
        dateOfBirth: '1980-01-01',
        isVerified: true,
        isAdmin: true,
    },
];

export let MOCK_BOOKINGS: Booking[] = [
    {
        id: 1,
        renterId: 2,
        hubberId: 1,
        item: MOCK_ITEMS[0],
        startAt: '2024-07-01T10:00:00Z',
        endAt: '2024-07-05T10:00:00Z',
        dueAt: '2024-07-05T10:00:00Z',
        totalPrice: 250,
        status: BookingStatus.COMPLETED,
        graceEnabled: true,
        escrowDepositCents: 20000,
        rentalPaymentIntentId: 'pi_mock_rental_1',
        depositPaymentIntentId: 'pi_mock_deposit_1',
        rentalPaid: true,
        depositStatus: DepositBookingStatus.RELEASED,
        renterReviewed: true,
        hubberReviewed: false,
        renterServiceFee: 12.5,
        hubberCommission: 25,
        hubberNetEarning: 225,
    },
    {
        id: 2,
        renterId: 4,
        hubberId: 1,
        item: MOCK_ITEMS[1],
        startAt: '2024-08-10T09:00:00Z',
        endAt: '2024-08-12T09:00:00Z',
        dueAt: '2024-08-12T09:00:00Z',
        totalPrice: 105,
        status: BookingStatus.CONFIRMED,
        graceEnabled: true,
        escrowDepositCents: 10000,
        rentalPaymentIntentId: 'pi_mock_rental_2',
        depositPaymentIntentId: 'pi_mock_deposit_2',
        rentalPaid: true,
        depositStatus: DepositBookingStatus.AUTHORIZED,
        renterReviewed: false,
        hubberReviewed: false,
        renterServiceFee: 5.25,
        hubberCommission: 10.5,
        hubberNetEarning: 94.5,
    },
    {
        id: 3,
        renterId: 2,
        hubberId: 1,
        item: MOCK_ITEMS[2],
        startAt: '2024-09-01T14:00:00Z',
        endAt: '2024-09-07T14:00:00Z',
        dueAt: new Date(Date.now() + 3 * 60 * 1000).toISOString(), // Per test timer: scade tra 3 minuti
        totalPrice: 175,
        status: BookingStatus.PICKED_UP,
        pickedUpAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        graceEnabled: true,
        escrowDepositCents: 5000,
        rentalPaymentIntentId: 'pi_mock_rental_3',
        depositPaymentIntentId: 'pi_mock_deposit_3',
        rentalPaid: true,
        depositStatus: DepositBookingStatus.AUTHORIZED,
        renterReviewed: false,
        hubberReviewed: false,
        renterServiceFee: 8.75,
        hubberCommission: 17.5,
        hubberNetEarning: 157.5,
    },
     {
        id: 4,
        renterId: 4,
        hubberId: 1,
        item: MOCK_ITEMS[1],
        startAt: '2024-09-15T12:00:00Z',
        endAt: '2024-09-20T12:00:00Z',
        dueAt: '2024-09-20T12:00:00Z',
        totalPrice: 210,
        status: BookingStatus.DISPUTE_OPEN,
        graceEnabled: true,
        escrowDepositCents: 10000,
        rentalPaymentIntentId: 'pi_mock_rental_4',
        depositPaymentIntentId: 'pi_mock_deposit_4',
        rentalPaid: true,
        depositStatus: DepositBookingStatus.AUTHORIZED,
        renterReviewed: false,
        hubberReviewed: false,
        renterServiceFee: 10.5,
        hubberCommission: 21,
        hubberNetEarning: 189,
    },
    {
        id: 5,
        renterId: 2,
        hubberId: 1,
        item: MOCK_ITEMS[0],
        startAt: '2024-10-01T11:00:00Z',
        endAt: '2024-10-03T11:00:00Z',
        dueAt: '2024-10-03T11:00:00Z',
        totalPrice: 150,
        status: BookingStatus.PENDING,
        graceEnabled: true,
        escrowDepositCents: 20000,
        rentalPaid: false,
        depositStatus: DepositBookingStatus.PENDING_AUTHORIZATION,
        renterReviewed: false,
        hubberReviewed: false,
        renterServiceFee: 7.5,
        hubberCommission: 15,
        hubberNetEarning: 135,
    },
    {
        id: 6,
        renterId: 4,
        hubberId: 1,
        item: MOCK_ITEMS[2],
        startAt: '2024-06-01T10:00:00Z',
        endAt: '2024-06-05T10:00:00Z',
        dueAt: '2024-06-05T10:00:00Z',
        totalPrice: 125,
        status: BookingStatus.COMPLETED,
        graceEnabled: true,
        escrowDepositCents: 5000,
        rentalPaymentIntentId: 'pi_mock_rental_6',
        depositPaymentIntentId: 'pi_mock_deposit_6',
        rentalPaid: true,
        depositStatus: DepositBookingStatus.RELEASED,
        renterReviewed: true,
        hubberReviewed: true,
        renterServiceFee: 6.25,
        hubberCommission: 12.5,
        hubberNetEarning: 112.5,
    },
];

export let MOCK_ALL_REVIEWS: Review[] = [
    { 
        id: 1, 
        bookingId: 1, 
        reviewerId: 2, 
        revieweeId: 1, 
        rating: 5, 
        comment: 'Attrezzatura perfetta, come nuova. Marco è stato gentilissimo e molto disponibile a spiegarmi il funzionamento. Consigliatissimo!', 
        timestamp: '2024-07-10T11:00:00Z',
        userName: 'Laura Verdi',
        userPhotoUrl: MOCK_USERS.find(u => u.id === 2)!.avatarUrl,
    },
    { 
        id: 2, 
        bookingId: 6, 
        reviewerId: 4, 
        revieweeId: 1, 
        rating: 4, 
        comment: 'Tutto ok, esperienza positiva.', 
        timestamp: '2024-06-10T12:00:00Z',
        userName: 'Test Renter',
        userPhotoUrl: MOCK_USERS.find(u => u.id === 4)!.avatarUrl,
    },
    { 
        id: 3, 
        bookingId: 6, 
        reviewerId: 1, 
        revieweeId: 4, 
        rating: 5, 
        comment: 'Renter eccellente, ha trattato l\'attrezzatura con cura. Consigliato.', 
        timestamp: '2024-06-11T15:00:00Z',
        userName: 'Marco Rossi',
        userPhotoUrl: MOCK_USERS.find(u => u.id === 1)!.avatarUrl,
    },
];

export let MOCK_THREADS: Thread[] = [
    {
        id: 1,
        type: 'LISTING',
        participant: { id: 2, name: 'Elena', avatarUrl: 'https://i.pravatar.cc/150?u=elena' },
        item: { title: 'Fotocamera Mirrorless Pro', imageUrl: MOCK_ITEMS[0].imageUrls[0] },
        isUnread: true,
        messages: [
            { id: 1, senderId: 2, text: 'Ciao! La fotocamera è ancora disponibile per la prossima settimana?', timestamp: '2024-09-20T10:30:00Z'},
            { id: 2, senderId: 1, text: 'Ciao Elena! Sì, è disponibile. Vuoi che te la tenga da parte?', timestamp: '2024-09-20T10:32:00Z'},
            { id: 3, senderId: 2, text: 'Sì, grazie! Procedo con la prenotazione.', timestamp: '2024-09-20T10:35:00Z'},
        ],
    },
    {
        id: 2,
        type: 'RENTAL',
        bookingId: 3, // In corso/Picked Up
        participant: { id: 2, name: 'Laura Verdi', avatarUrl: 'https://i.pravatar.cc/150?u=laura' },
        item: { title: 'Passeggino da Viaggio Leggero', imageUrl: MOCK_ITEMS[2].imageUrls[0] },
        isUnread: false,
        messages: [
            { id: 1, senderId: 2, text: 'Buongiorno, il passeggino è perfetto grazie!', timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString()},
            { id: 2, senderId: 1, text: 'Ottimo! Buona giornata.', timestamp: new Date(Date.now() - 3.5 * 60 * 1000).toISOString()},
        ]
    },
    {
        id: 3,
        type: 'BOOKING',
        bookingId: 2, // Confermata
        participant: { id: 4, name: 'Test Renter', avatarUrl: 'https://i.pravatar.cc/150?u=testrenter' },
        item: { title: 'Betoniera Elettrica 140L', imageUrl: MOCK_ITEMS[1].imageUrls[0] },
        isUnread: true,
        messages: [
            { id: 1, senderId: 4, text: 'Prenotazione confermata, grazie!', timestamp: '2024-08-09T10:01:00Z'},
        ]
    },
    {
        id: 4,
        type: 'SUPPORT',
        bookingId: 4, // In disputa
        participant: { id: 99, name: 'Supporto Renthubber', avatarUrl: 'https://i.pravatar.cc/150?u=support' },
        item: { title: 'Contestazione #D-123', imageUrl: MOCK_ITEMS[1].imageUrls[0] },
        isUnread: true,
        messages: [
            { id: 1, senderId: 99, text: 'Abbiamo ricevuto la tua richiesta di supporto per il noleggio della Betoniera.', timestamp: '2024-09-18T11:20:00Z'},
        ]
    },
    {
        id: 5,
        type: 'SUPPORT',
        participant: { id: 99, name: 'Supporto Renthubber', avatarUrl: 'https://i.pravatar.cc/150?u=support' },
        item: { title: 'Verifica Documenti', imageUrl: 'https://via.placeholder.com/150/005F6B/FFFFFF?text=ID' },
        isUnread: true,
        messages: [
             { id: 1, senderId: 99, text: 'I tuoi documenti sono in fase di revisione.', timestamp: '2024-09-18T15:45:00Z'},
        ]
    },
    {
        id: 6,
        type: 'LISTING',
        participant: { id: 6, name: 'Luca', avatarUrl: 'https://i.pravatar.cc/150?u=luca' },
        item: { title: 'Fotocamera Mirrorless Pro', imageUrl: MOCK_ITEMS[0].imageUrls[0] },
        isUnread: false,
        messages: [
            { id: 1, senderId: 6, text: 'È possibile avere uno sconto per un noleggio di 10 giorni?', timestamp: '2024-09-17T11:00:00Z'},
            { id: 2, senderId: 1, text: 'Ciao Luca, certo. Posso applicare uno sconto del 15% sul totale.', timestamp: '2024-09-17T11:05:00Z'},
        ]
    },
    {
        id: 7,
        type: 'RENTAL', // It's a rental chat that escalated
        bookingId: 4, // Link to the dispute
        participant: { id: 4, name: 'Test Renter', avatarUrl: 'https://i.pravatar.cc/150?u=testrenter' }, // This is one participant
        // The other participant is the hubber of booking 4, which is user 1 (Marco Rossi)
        item: { title: 'Betoniera Elettrica 140L', imageUrl: MOCK_ITEMS[1].imageUrls[0] },
        isUnread: true,
        messages: [
            { id: 1, senderId: 4, text: 'Ciao, ho restituito la betoniera ma ho notato un graffio che non credo di aver fatto io.', timestamp: '2024-09-18T10:50:00Z'},
            {
                id: 4,
                senderId: 4,
                timestamp: '2024-09-18T10:51:00Z',
                file: {
                    name: 'graffio.jpg',
                    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400',
                    type: 'image',
                },
                text: 'Ecco una foto del danno che ho trovato.'
            },
            { id: 2, senderId: 1, text: 'Ciao, il graffio non c\'era quando l\'hai ritirata. Devo trattenere parte del deposito.', timestamp: '2024-09-18T10:55:00Z'},
            { id: 3, senderId: 4, text: 'Non sono d\'accordo, apro una contestazione.', timestamp: '2024-09-18T10:58:00Z'},
        ],
    },
    {
        id: 8,
        type: 'SUPPORT',
        participant: { id: 2, name: 'Laura Verdi', avatarUrl: 'https://i.pravatar.cc/150?u=laura' },
        item: { title: 'Domanda sul mio account', imageUrl: 'https://via.placeholder.com/150/005F6B/FFFFFF?text=Q' },
        isUnread: false,
        assigneeId: 5, // Assigned to Dual User (Support)
        messages: [
             { id: 1, senderId: 2, text: 'Buongiorno, non riesco a verificare il mio account.', timestamp: '2024-09-21T09:00:00Z'},
             { id: 2, senderId: 6, text: 'Buongiorno Laura, sono Admin. Sto controllando il suo account. Può dirmi quale errore riceve?', timestamp: '2024-09-21T09:05:00Z'},
        ]
    },
    {
        id: 9,
        type: 'SUPPORT',
        participant: { id: 4, name: 'Test Renter', avatarUrl: 'https://i.pravatar.cc/150?u=testrenter' },
        item: { title: 'Problema con un pagamento', imageUrl: 'https://via.placeholder.com/150/005F6B/FFFFFF?text=€' },
        isUnread: true, // New unassigned ticket
        messages: [
             { id: 1, senderId: 4, text: 'Salve, ho un addebito che non riconosco.', timestamp: '2024-09-22T11:00:00Z'},
        ]
    },
];

export let MOCK_DISPUTES: Dispute[] = [
    { 
        id: 1, 
        bookingId: 4, 
        openedBy: 'renter', 
        disputeType: 'Danno',
        description: 'L\'oggetto è stato restituito con un graffio evidente sul lato che non era presente al momento del ritiro.', 
        status: 'OPEN',
        requestedAmount: 50.00,
        mediaUrls: [
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400'
        ]
    }
];

export const MOCK_EVENTS: BookingEvent[] = [
    // Events for Booking ID 2 (Betoniera, thread 3)
    { bookingId: 2, actorId: 2, action: 'BOOKING_REQUESTED', oldState: BookingStatus.PENDING, newState: BookingStatus.PENDING, timestamp: '2024-08-08T14:00:00Z' },
    { bookingId: 2, actorId: 1, action: 'BOOKING_APPROVED', oldState: BookingStatus.PENDING, newState: BookingStatus.CONFIRMED, timestamp: '2024-08-09T10:00:00Z' },
    
    // Events for Booking ID 3 (Passeggino, thread 2 - timer test)
    { bookingId: 3, actorId: 2, action: 'PICKED_UP', oldState: BookingStatus.CONFIRMED, newState: BookingStatus.PICKED_UP, timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },

    // Events for Booking ID 4 (Dispute, thread 4)
    { bookingId: 4, actorId: 2, action: 'DISPUTE_OPEN', oldState: BookingStatus.DELIVERED_BY_RENTER, newState: BookingStatus.DISPUTE_OPEN, timestamp: '2024-09-18T11:00:00Z' },
];

export let MOCK_WITHDRAWALS: Withdrawal[] = [
    {
        id: 1,
        hubberId: 1,
        amount: 220.50,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        method: 'bank',
        status: 'pending',
        paymentDetails: {
            iban: 'IT60X0542811101000000123456'
        }
    }
];

export const HUBBER_DASHBOARD_LINKS = [
    { name: 'Dashboard', icon: ChartBarIcon },
    { name: 'I miei annunci', icon: InboxIcon },
    { name: 'Messaggi e richieste', icon: ChatBubbleLeftRightIcon },
    { name: 'Prenotazioni', icon: CalendarIcon },
    { name: 'Depositi', icon: WalletIcon },
    { name: 'Guadagni e Wallet', icon: WalletIcon },
    { name: 'Recensioni ricevute', icon: StarIcon },
    { name: 'Impostazioni', icon: Cog6ToothIcon },
];

export const RENTER_DASHBOARD_LINKS = [
    { name: 'Cerca e prenota', icon: MagnifyingGlassIcon },
    { name: 'Prenotazioni', icon: CalendarIcon },
    { name: 'Preferiti', icon: HeartIcon },
    { name: 'Messaggi', icon: ChatBubbleLeftRightIcon },
    { name: 'Pagamenti', icon: CreditCardIcon },
    { name: 'Recensioni lasciate', icon: DocumentMagnifyingGlassIcon },
    { name: 'Impostazioni', icon: Cog6ToothIcon },
];

export const ADMIN_DASHBOARD_LINKS = [
    { name: 'Panoramica', icon: ChartBarIcon },
    { name: 'Annunci', icon: InboxIcon },
    { name: 'Utenti', icon: UserGroupIcon },
    { name: 'Prenotazioni', icon: CalendarIcon },
    { name: 'Richieste di Payout', icon: CreditCardIcon },
    { name: 'Dispute & Ticket', icon: ShieldExclamationIcon },
    { name: 'Chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Recensioni', icon: StarIcon },
    { name: 'Catalogo', icon: TagIcon },
    { name: 'Coupon', icon: SparklesIcon },
    { name: 'Contenuti (CMS)', icon: DocumentTextIcon },
    { name: 'Email Automatiche', icon: PaperAirplaneIcon },
    { name: 'Report', icon: DocumentChartBarIcon },
    { name: 'Impostazioni', icon: Cog6ToothIcon },
    { name: 'Log & Audit', icon: ShieldCheckIcon },
];


export const threadTypeToChatTabMap: { [key in ThreadType]: ChatTab } = {
    'LISTING': 'listings',
    'RENTAL': 'rentals',
    'BOOKING': 'bookings',
    'SUPPORT': 'support',
};

// Durata del timer di conferma in ore
export const CONFIRMATION_TIMER_HOURS = 72;
export const REMINDER_THRESHOLDS_HOURS = [48, 24, 2];

// Per testing
export const TEST_TIMER_DURATION_MINUTES = 3;
export const TEST_REMINDER_THRESHOLDS_SECONDS = [120, 60, 30];

export let MOCK_COUPONS: Coupon[] = [
    { id: 1, code: 'BENVENUTO10', type: 'percentage', value: 10, usageCount: 25, maxUsage: 100, isActive: true, createdAt: '2024-01-01T10:00:00Z', startDate: '2024-01-01', endDate: '2024-12-31', singleUsePerUser: true, isStackable: false },
    { id: 2, code: 'ESTATE2024', type: 'fixed', value: 20, usageCount: 50, maxUsage: 50, isActive: false, createdAt: '2024-06-01T10:00:00Z', startDate: '2024-06-01', endDate: '2024-08-31', singleUsePerUser: false, isStackable: false },
    { id: 3, code: 'PROVA5', type: 'fixed', value: 5, usageCount: 12, maxUsage: null, isActive: true, createdAt: '2024-07-15T10:00:00Z', startDate: '2024-07-15', singleUsePerUser: true, isStackable: true },
];

export let MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 1, adminId: 6, timestamp: '2024-09-21T10:00:00Z', action: 'USER_VERIFIED', details: 'Utente #2 (Laura Verdi) verificato.' },
    { id: 2, adminId: 6, timestamp: '2024-09-20T15:30:00Z', action: 'LISTING_SUSPENDED', details: 'Annuncio #3 ("Passeggino...") sospeso per revisione.' },
    { id: 3, adminId: 6, timestamp: '2024-09-19T11:00:00Z', action: 'COUPON_CREATED', details: 'Creato coupon "PROVA5".' },
];

export let MOCK_ADMIN_ROLES: string[] = [
    'Support',
];

export let MOCK_CMS_PAGES: CMSPage[] = [
    { 
        id: 1, 
        title: 'Homepage Banner', 
        content: 'Offerta speciale: 15% di sconto su tutti i noleggi estivi!', 
        format: 'text', 
        placement: 'none' 
    },
    { 
        id: 2, 
        title: 'Chi Siamo', 
        content: '<h1>Chi Siamo</h1><p>Renthubber è la piattaforma <strong>leader</strong> per il noleggio di oggetti tra privati...</p>', 
        format: 'html', 
        placement: 'footer-info' 
    },
    { 
        id: 3, 
        title: 'FAQ', 
        content: 'Come funziona il deposito cauzionale?\nIl deposito viene solo autorizzato sulla tua carta...', 
        format: 'text', 
        placement: 'footer-support' 
    },
    {
        id: 4,
        title: 'Termini e Condizioni',
        content: '<h2>1. Accettazione dei Termini</h2><p>Utilizzando Renthubber, accetti di essere vincolato da questi Termini e Condizioni...</p>',
        format: 'html',
        placement: 'footer-info',
    },
    {
        id: 5,
        title: 'Privacy Policy',
        content: '<h2>Informativa sulla Privacy</h2><p>La tua privacy è importante per noi. Questa informativa spiega quali dati personali raccogliamo e come li usiamo...</p>',
        format: 'html',
        placement: 'footer-info',
    }
];

export let MOCK_AUTOMATED_EMAILS: AutomatedEmail[] = [
    {
        id: 'welcome_email',
        name: 'Benvenuto Nuovo Utente',
        description: 'Inviata subito dopo la prima registrazione di un utente.',
        subject: 'Benvenuto su Renthubber!',
        recipientType: 'new_user',
        format: 'html',
        body: `<!DOCTYPE html>
<html>
<head>
<style> body { font-family: sans-serif; color: #333; } .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; } .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; } .content { padding: 20px 0; } .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; } </style>
</head>
<body>
<div class="container">
  <div class="header">{{logo_placeholder}}</div>
  <div class="content">
    <h1>Ciao {{user_name}},</h1>
    <p>Benvenuto su Renthubber! Siamo felici di averti con noi.</p>
    <p>Inizia subito a esplorare gli articoli disponibili per il noleggio o a creare il tuo primo annuncio.</p>
    <a href="{{login_url}}" style="display: inline-block; padding: 10px 20px; background-color: #005F6B; color: white; text-decoration: none; border-radius: 5px;">Vai alla Dashboard</a>
  </div>
  <div class="footer"><p>&copy; Renthubber Inc. Tutti i diritti riservati.</p></div>
</div>
</body>
</html>`,
        includeLogo: true,
        isActive: true,
        availableVariables: ['{{user_name}}', '{{login_url}}']
    },
    {
        id: 'new_booking_renter',
        name: 'Nuova Prenotazione (per Renter)',
        description: 'Inviata al renter quando una sua richiesta di prenotazione viene confermata.',
        subject: 'La tua prenotazione per {{item_title}} è confermata!',
        recipientType: 'renter',
        format: 'text',
        body: `Ciao {{user_name}},\n\nLa tua prenotazione per "{{item_title}}" dal {{start_date}} al {{end_date}} è stata confermata!\n\nPuoi gestire i dettagli e comunicare con l'hubber dalla tua dashboard.\n\nGrazie,\nIl team di Renthubber`,
        includeLogo: false,
        isActive: true,
        availableVariables: ['{{user_name}}', '{{item_title}}', '{{start_date}}', '{{end_date}}', '{{booking_id}}']
    },
    {
        id: 'payout_completed_hubber',
        name: 'Pagamento Inviato (per Hubber)',
        description: 'Inviata all\'hubber quando un suo payout viene processato dall\'admin.',
        subject: 'Abbiamo inviato il tuo pagamento di {{amount}}€',
        recipientType: 'hubber',
        format: 'text',
        body: `Ciao {{user_name}},\n\nTi informiamo che abbiamo appena processato il tuo pagamento di {{amount}}€.\n\nL'accredito dovrebbe essere visibile sul tuo {{payout_method}} entro pochi giorni lavorativi.\n\nGrazie per usare Renthubber!\nIl team di Renthubber`,
        includeLogo: false,
        isActive: true,
        availableVariables: ['{{user_name}}', '{{amount}}', '{{payout_method}}']
    }
];

export let MOCK_SITE_SETTINGS: SiteSettings = {
    companyName: "Renthubber, Inc.",
    vatNumber: "IT12345678901",
    address: "Via Roma, 1, 20121 Milano MI, Italia",
    legalEmail: "legal@renthubber.com",
    phone: "+39 02 1234567",
    siteTitle: "Renthubber | Noleggia qualsiasi cosa, ovunque.",
    siteDescription: "Un'applicazione per il noleggio di attrezzature che mostra articoli in affitto e utilizza Gemini per generare idee per i loro progetti. Gli utenti possono sfogliare articoli, filtrare per categoria e ottenere idee personalizzate per i loro progetti.",
    metaKeywords: "noleggio, affitto, attrezzature, fai da te, eventi",
    allowIndexing: true,
    logoUrl: "https://via.placeholder.com/150x50.png?text=Renthubber",
    faviconUrl: "/vite.svg",
    appleTouchIconUrl: "https://via.placeholder.com/180.png?text=R",
};

export const MOCK_WEBHOOK_EVENTS: WebhookEvent[] = [
  { id: 'evt_1', provider: 'Stripe', eventType: 'checkout.session.completed', timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), status: 'succeeded', relatedId: 'cs_123' },
  { id: 'evt_2', provider: 'Stripe', eventType: 'payment_intent.succeeded', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), status: 'succeeded', relatedId: 'pi_123' },
  { id: 'evt_3', provider: 'PayPal', eventType: 'PAYMENT.CAPTURE.COMPLETED', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), status: 'succeeded', relatedId: 'paypal_ord_456' },
  { id: 'evt_4', provider: 'Stripe', eventType: 'charge.failed', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), status: 'failed', relatedId: 'ch_789' },
  { id: 'evt_5', provider: 'Stripe', eventType: 'payment_intent.amount_capturable_updated', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), status: 'succeeded', relatedId: 'pi_abc' },
  { id: 'evt_6', provider: 'PayPal', eventType: 'CHECKOUT.ORDER.APPROVED', timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), status: 'succeeded', relatedId: 'paypal_ord_def' },
];