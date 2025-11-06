

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Item, Review, Booking } from '../types';
import { PhotoModal } from './PhotoModal';
import { SUPERHUBBER_CRITERIA, MOCK_ALL_REVIEWS } from '../constants';
import { CheckoutModal } from './checkout/CheckoutModal';
import { BookingStatus, DepositBookingStatus } from '../types';
import { HeartIcon } from './Icons';

interface ItemDetailModalProps {
  item: Item;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (itemId: number) => void;
  onBookingSuccess: (booking: Booking) => void;
}

const ItemSubheader: React.FC<{ rating: number; reviewCount: number; location: string; }> = ({ rating, reviewCount, location }) => (
    <div className="flex items-center space-x-2 text-sm md:text-base text-gray-700">
        <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-brand-blue"><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.305-.772 1.626 0l1.838 4.442a.66.66 0 00.496.363l4.897.712c.813.118 1.138 1.116.547 1.702l-3.543 3.453a.659.659 0 00-.19.582l.837 4.878c.14.81-.71.144-1.442-.375l-4.38-2.302a.66.66 0 00-.616 0L5.135 18.66c-.732.519-1.582.455-1.442-.375l.837-4.878a.659.659 0 00-.19-.582L.797 9.803c-.59-.586-.266-1.584.547-1.702l4.897-.712a.66.66 0 00.496-.363l1.838-4.442z" clipRule="evenodd" /></svg>
            <span className="font-bold">{rating.toFixed(2)}</span>
        </div>
        <span className="text-gray-400">·</span>
        <a href="#reviews" className="underline">{reviewCount} recensioni</a>
        <span className="text-gray-400">·</span>
        <span className="underline">{location}</span>
    </div>
);

const ImageGallery: React.FC<{ imageUrls: string[]; onImageClick: (index: number) => void }> = ({ imageUrls, onImageClick }) => {
    // Mobile Carousel
    const MobileCarousel = () => {
      const scrollRef = useRef<HTMLDivElement>(null);
      const [currentIndex, setCurrentIndex] = useState(0);

      const handleScroll = () => {
        if (scrollRef.current) {
          const { scrollLeft, clientWidth } = scrollRef.current;
          const index = Math.round(scrollLeft / clientWidth);
          setCurrentIndex(index);
        }
      };

      return (
        <div className="relative md:hidden">
          <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth">
            {imageUrls.map((url, index) => (
              <div key={index} className="w-full h-80 flex-shrink-0 snap-center" onClick={() => onImageClick(index)}>
                <img src={url} alt={`Immagine ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {imageUrls.map((_, index) => (
              <div key={index} className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}></div>
            ))}
          </div>
        </div>
      );
    };

    // Desktop Grid
    const DesktopGrid = () => (
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[450px] rounded-2xl overflow-hidden">
        <div className="col-span-2 row-span-2 cursor-pointer" onClick={() => onImageClick(0)}>
          <img src={imageUrls[0]} alt="Immagine principale" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
        </div>
        {imageUrls.slice(1, 5).map((url, index) => (
          <div key={index} className="cursor-pointer" onClick={() => onImageClick(index + 1)}>
            <img src={url} alt={`Immagine ${index + 2}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
          </div>
        ))}
      </div>
    );
    
    return (
        <>
            <MobileCarousel />
            <DesktopGrid />
        </>
    );
};

const BookingWidget: React.FC<{ item: Item; onBook: (details: { startDate: string, endDate: string, totalPrice: number, rentalDays: number }) => void }> = ({ item, onBook }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { rentalDays, totalPrice } = useMemo(() => {
        if (!startDate || !endDate) return { rentalDays: 0, totalPrice: 0 };
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) return { rentalDays: 0, totalPrice: 0 };
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { rentalDays: diffDays, totalPrice: diffDays * item.price };
    }, [startDate, endDate, item.price]);
    
    const handleBookClick = () => {
        if (rentalDays > 0) {
            onBook({ startDate, endDate, totalPrice, rentalDays });
        } else {
            alert("Seleziona un intervallo di date valido.");
        }
    }

    return (
        <div className="p-6 rounded-2xl border shadow-lg sticky top-24">
            <div className="flex justify-between items-baseline mb-4">
                <p><span className="text-2xl font-bold">€{item.price}</span> / giorno</p>
                <div className="text-sm">
                    <span className="font-semibold">{item.detailedRatings.overall.toFixed(2)} ⭐</span>
                    <span className="text-gray-500"> ({item.reviewCount} recensioni)</span>
                </div>
            </div>
            <div className="border rounded-lg p-2 flex flex-col space-y-2">
                <div>
                  <label htmlFor="start-date" className="text-xs font-semibold">DATA INIZIO</label>
                  <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full"/>
                </div>
                <div className="border-t"></div>
                <div>
                  <label htmlFor="end-date" className="text-xs font-semibold">DATA FINE</label>
                  <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full"/>
                </div>
            </div>

            {totalPrice > 0 && (
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>€{item.price} x {rentalDays} giorni</span>
                        <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    {item.securityDeposit && (
                         <div className="flex justify-between">
                            <span>Deposito cauzionale</span>
                            <span>€{item.securityDeposit.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-base border-t pt-2">
                        <span>Totale</span>
                        <span>€{(totalPrice + (item.securityDeposit || 0)).toFixed(2)}</span>
                    </div>
                </div>
            )}

            <button onClick={handleBookClick} className="w-full mt-4 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-teal-800 transition-colors">
                Prenota
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">Non ti verrà addebitato alcun importo adesso</p>
        </div>
    );
};


const OwnerInfo: React.FC<{ owner: Item['owner'] }> = ({ owner }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b">
            <div>
                <h2 className="text-xl font-semibold">Noleggio offerto da {owner.name}</h2>
                <p className="text-gray-500">{owner.yearsHosting} anni di esperienza</p>
            </div>
            <div className="text-center flex-shrink-0 mt-4 sm:mt-0 sm:ml-4">
                <img src={owner.photoUrl} alt={owner.name} className="w-16 h-16 rounded-full mx-auto" />
                {owner.isSuperhubber && (
                    <div className="relative group">
                        <div className="flex items-center justify-center mt-2 space-x-1 cursor-pointer">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-semibold text-brand-blue">Superhubber</span>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 w-72 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <h4 className="font-bold mb-2 text-left">Cosa significa essere un Superhubber?</h4>
                            <p className="mb-2 text-left">I Superhubber sono proprietari esperti e valutati positivamente che si impegnano a fornire noleggi eccezionali.</p>
                            <p className="mb-3 text-left text-gray-300">Lo stato viene rivalutato ogni 90 giorni.</p>
                            <ul className="space-y-1.5 text-left">
                                <li className="flex justify-between items-center">
                                    <span>{'>'}= {SUPERHUBBER_CRITERIA.rentalDays} noleggi</span>
                                    {owner.rentalDays >= SUPERHUBBER_CRITERIA.rentalDays 
                                        ? <span className="text-green-400 font-bold">✓</span> 
                                        : <span className="text-red-400 font-bold">✗</span>}
                                </li>
                                <li className="flex justify-between items-center">
                                    <span>{'>'}= {SUPERHUBBER_CRITERIA.rating.toFixed(1)} di valutazione</span>
                                    {owner.rating >= SUPERHUBBER_CRITERIA.rating 
                                        ? <span className="text-green-400 font-bold">✓</span> 
                                        : <span className="text-red-400 font-bold">✗</span>}
                                </li>
                                <li className="flex justify-between items-center">
                                    <span>{'<'}= {SUPERHUBBER_CRITERIA.cancellations} cancellazioni</span>
                                    {owner.cancellations <= SUPERHUBBER_CRITERIA.cancellations 
                                        ? <span className="text-green-400 font-bold">✓</span> 
                                        : <span className="text-red-400 font-bold">✗</span>}
                                </li>
                                <li className="flex justify-between items-center">
                                    <span>{'>'}= {SUPERHUBBER_CRITERIA.responseRate}% tasso di risposta</span>
                                    {owner.responseRate >= SUPERHUBBER_CRITERIA.responseRate 
                                        ? <span className="text-green-400 font-bold">✓</span> 
                                        : <span className="text-red-400 font-bold">✗</span>}
                                </li>
                            </ul>
                            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-800"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose, isFavorite, onToggleFavorite, onBookingSuccess }) => {
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [photoModalIndex, setPhotoModalIndex] = useState(0);
    const [checkoutInfo, setCheckoutInfo] = useState({ isOpen: false, startDate: '', endDate: '', totalPrice: 0, rentalDays: 0 });

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    const itemReviews = useMemo(() => {
        return MOCK_ALL_REVIEWS.filter(r => r.bookingId % 3 === item.id % 3);
    }, [item.id]);

    const openPhotoModal = (index: number) => {
        setPhotoModalIndex(index);
        setIsPhotoModalOpen(true);
    };

    const handleBook = (details: { startDate: string, endDate: string, totalPrice: number, rentalDays: number }) => {
        setCheckoutInfo({ isOpen: true, ...details });
    };

    const handleLocalBookingSuccess = (newBooking: Booking) => {
        onBookingSuccess(newBooking);
        alert(`Prenotazione #${newBooking.id} confermata con successo!`);
        setCheckoutInfo({ isOpen: false, startDate: '', endDate: '', totalPrice: 0, rentalDays: 0 });
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-grow overflow-y-auto relative">
                    <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 p-4 flex justify-between items-center">
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="px-4 sm:px-8 pb-8">
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h1>
                                <button
                                    onClick={() => onToggleFavorite(item.id)}
                                    className="flex items-center space-x-2 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-gray-100"
                                >
                                    <HeartIcon isFilled={isFavorite} className={`w-5 h-5 ${isFavorite ? 'text-brand-blue' : 'text-gray-600'}`} />
                                    <span>{isFavorite ? 'Salvato' : 'Salva'}</span>
                                </button>
                            </div>
                            <ItemSubheader rating={item.detailedRatings.overall} reviewCount={item.reviewCount} location={item.location} />
                        </div>

                        <div className="mt-6 mb-12">
                           <ImageGallery imageUrls={item.imageUrls} onImageClick={openPhotoModal} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                            <div className="md:col-span-2">
                                 <OwnerInfo owner={item.owner} />
                                 <div className="py-6 border-b">
                                    <h3 className="text-xl font-semibold mb-2">{item.tagline}</h3>
                                    <p className="whitespace-pre-line">{item.description}</p>
                                </div>
                                <div className="py-6 border-b">
                                     <h3 className="text-xl font-semibold mb-4">Cosa troverai</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {item.features.map(feature => (
                                            <div key={feature.name} className="flex items-center space-x-3">
                                                <div className="text-gray-700">{feature.icon}</div>
                                                <span>{feature.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <BookingWidget item={item} onBook={handleBook} />
                            </div>
                        </div>
                        
                        {/* Reviews Section */}
                        <div id="reviews" className="mt-12 pt-8 border-t">
                            <h2 className="text-2xl font-bold mb-6">{item.reviewCount} recensioni</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {itemReviews.map(review => (
                                     <div key={review.id}>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <img src={review.userPhotoUrl} alt={review.userName} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-semibold">{review.userName}</p>
                                                <p className="text-sm text-gray-500">{new Date(review.timestamp).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                 <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}><path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.305-.772 1.626 0l1.838 4.442a.66.66 0 00.496.363l4.897.712c.813.118 1.138 1.116.547 1.702l-3.543 3.453a.659.659 0 00-.19.582l.837 4.878c.14.81-.71.144-1.442-.375l-4.38-2.302a.66.66 0 00-.616 0L5.135 18.66c-.732.519-1.582.455-1.442-.375l.837-4.878a.659.659 0 00-.19-.582L.797 9.803c-.59-.586-.266-1.584.547-1.702l4.897-.712a.66.66 0 00.496-.363l1.838-4.442z" clipRule="evenodd" /></svg>
                                            ))}
                                        </div>
                                        <p>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isPhotoModalOpen && (
                <PhotoModal
                    imageUrls={item.imageUrls}
                    currentIndex={photoModalIndex}
                    onClose={() => setIsPhotoModalOpen(false)}
                    onNext={() => setPhotoModalIndex((photoModalIndex + 1) % item.imageUrls.length)}
                    onPrev={() => setPhotoModalIndex((photoModalIndex - 1 + item.imageUrls.length) % item.imageUrls.length)}
                />
            )}
            
            {checkoutInfo.isOpen && (
                <CheckoutModal
                    isOpen={checkoutInfo.isOpen}
                    onClose={() => setCheckoutInfo(prev => ({ ...prev, isOpen: false }))}
                    item={item}
                    bookingDetails={checkoutInfo}
                    onBookingSuccess={handleLocalBookingSuccess}
                />
            )}
        </div>
    );
};