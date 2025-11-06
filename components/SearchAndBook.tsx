
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Item, Booking } from '../types';
import { MOCK_ITEMS } from '../constants';
import { CategoryFilter } from './CategoryFilter';
import { ItemListings } from './PropertyListings';
import { ItemDetailModal } from './PropertyModal';
import { ProjectIdeasModal } from './TripInspirationModal';
import { MagnifyingGlassIcon } from './Icons';


const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};


interface DatePickerPopoverProps {
  startDate: string;
  endDate: string;
  onDatesChange: (start: string, end: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({ startDate, endDate, onDatesChange, onClear, onClose }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    const localStartDate = useMemo(() => startDate ? new Date(startDate) : null, [startDate]);
    const localEndDate = useMemo(() => endDate ? new Date(endDate) : null, [endDate]);

    const handleDateClick = (day: Date) => {
        if (!localStartDate || localEndDate) {
            onDatesChange(day.toISOString().split('T')[0], '');
        } else if (day > localStartDate) {
            onDatesChange(startDate, day.toISOString().split('T')[0]);
            onClose(); 
        } else {
            onDatesChange(day.toISOString().split('T')[0], '');
        }
    };

    const handleMonthChange = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };
    
    const renderCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // Sunday - 0, Monday - 1
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const dayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const cells = [];
        for (let i = 0; i < dayOffset; i++) {
            cells.push(<div key={`empty-start-${i}`} className="w-8 h-8 sm:w-10 sm:h-10"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(year, month, i);
            const dayTime = day.getTime();
            const isPast = day < today;

            const isStartDate = localStartDate && dayTime === localStartDate.getTime();
            const isEndDate = localEndDate && dayTime === localEndDate.getTime();
            const isInRange = localStartDate && localEndDate && day > localStartDate && day < localEndDate;
            const isHoveringInRange = localStartDate && !localEndDate && hoverDate && day > localStartDate && day <= hoverDate;
            
            let cellClasses = "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-colors duration-150 text-sm";

            if (isPast) {
                cellClasses += " text-gray-300 cursor-not-allowed line-through";
            } else {
                if (isStartDate || isEndDate) {
                    cellClasses += " bg-brand-blue text-white";
                } else if (isInRange || isHoveringInRange) {
                    cellClasses += " bg-teal-100";
                } else {
                    cellClasses += " hover:bg-gray-200";
                }
            }
            
            cells.push(
                <button
                    key={i}
                    disabled={isPast}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => !isPast && setHoverDate(day)}
                    className={cellClasses}
                >
                    {i}
                </button>
            );
        }

        return cells;
    };
    
    return (
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border max-w-sm sm:max-w-none w-full">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => handleMonthChange(-1)} className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                <div className="font-semibold text-base sm:text-lg">
                    {currentDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={() => handleMonthChange(1)} className="p-2 rounded-full hover:bg-gray-100">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-gray-500 mb-2">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1" onMouseLeave={() => setHoverDate(null)}>
                {renderCalendarGrid()}
            </div>
             <div className="flex justify-end mt-4">
                <button onClick={onClear} className="font-semibold text-sm py-2 px-4 rounded-lg hover:bg-gray-100 underline">Cancella date</button>
             </div>
        </div>
    );
};

interface SearchModalProps {
    onClose: () => void;
    onSearch: (filters: { term: string; city: string; start: string; end: string }) => void;
    initialFilters: { term: string; city: string; start: string; end: string };
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, onSearch, initialFilters }) => {
    const [term, setTerm] = useState(initialFilters.term);
    const [city, setCity] = useState(initialFilters.city);
    const [startDate, setStartDate] = useState(initialFilters.start);
    const [endDate, setEndDate] = useState(initialFilters.end);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(datePickerRef, () => setIsDatePickerOpen(false));

     useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const formattedDateRange = useMemo(() => {
        if (!startDate) return null;
        const start = new Date(startDate);
        if (!endDate) {
             const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
             return `${start.toLocaleDateString('it-IT', options)} - ...`;
        }
        try {
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null;
            
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
            return `${start.toLocaleDateString('it-IT', options)} - ${end.toLocaleDateString('it-IT', options)}`;
        } catch (e) { return null; }
    }, [startDate, endDate]);


    const handleSearch = () => {
        onSearch({ term, city, start: startDate, end: endDate });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <header className="flex-shrink-0 flex items-center p-2 border-b">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
            </header>
            <main className="flex-grow overflow-y-auto p-4 sm:p-6">
                <div className="bg-white rounded-xl shadow-lg p-4 space-y-4 border">
                    <div>
                        <label htmlFor="search-term-modal" className="block text-sm font-bold text-gray-800 mb-1">COSA</label>
                        <input id="search-term-modal" type="text" placeholder="Cerca attrezzatura..." value={term} onChange={(e) => setTerm(e.target.value)} className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                    </div>
                    <div className="border-t -mx-4"></div>
                    <div>
                        <label htmlFor="search-city-modal" className="block text-sm font-bold text-gray-800 mb-1">DOVE</label>
                        <input id="search-city-modal" type="text" placeholder="Città del noleggio" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                    </div>
                    <div className="border-t -mx-4"></div>
                    <div className="relative" ref={datePickerRef}>
                        <div className="w-full cursor-pointer" onClick={() => setIsDatePickerOpen(prev => !prev)}>
                            <label className="block text-sm font-bold text-gray-800 mb-1">QUANDO</label>
                            <div className="w-full bg-gray-100 rounded-lg p-3 text-left text-gray-500">{formattedDateRange || "Aggiungi date"}</div>
                        </div>
                         {isDatePickerOpen && (
                            <div className="absolute top-full mt-2 z-10 left-1/2 -translate-x-1/2 w-full px-4">
                                <DatePickerPopover 
                                    startDate={startDate}
                                    endDate={endDate}
                                    onDatesChange={(start, end) => {
                                        setStartDate(start);
                                        setEndDate(end);
                                    }}
                                    onClear={() => {
                                        setStartDate('');
                                        setEndDate('');
                                    }}
                                    onClose={() => setIsDatePickerOpen(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="flex-shrink-0 p-4 border-t">
                <button onClick={handleSearch} className="w-full bg-brand-blue text-white rounded-lg p-3 hover:bg-teal-800 transition-colors flex items-center justify-center space-x-2 font-bold">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    <span>Cerca</span>
                </button>
            </footer>
        </div>
    );
};


interface SearchAndBookProps {
    favoritedItemIds: Set<number>;
    onToggleFavorite: (itemId: number) => void;
    onBookingSuccess: (booking: Booking) => void;
}

export const SearchAndBook: React.FC<SearchAndBookProps> = ({ favoritedItemIds, onToggleFavorite, onBookingSuccess }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tutte');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isProjectIdeasModalOpen, setIsProjectIdeasModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(datePickerRef, () => setIsDatePickerOpen(false));

    const formattedDateRange = useMemo(() => {
        if (!startDate) return null;
        const start = new Date(startDate);
        if (!endDate) {
             const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
             return `${start.toLocaleDateString('it-IT', options)} - ...`;
        }
        try {
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null;
            
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
            return `${start.toLocaleDateString('it-IT', options)} - ${end.toLocaleDateString('it-IT', options)}`;
        } catch (e) { return null; }
    }, [startDate, endDate]);


    const filteredItems = useMemo(() => {
        let items = MOCK_ITEMS;
        if (selectedCategory !== 'Tutte') {
            items = items.filter(p => p.category === selectedCategory);
        }
        
        const lowercasedTerm = searchTerm.toLowerCase().trim();
        const lowercasedCity = city.toLowerCase().trim();

        if (lowercasedTerm) {
            items = items.filter(p =>
                p.title.toLowerCase().includes(lowercasedTerm) ||
                p.description.toLowerCase().includes(lowercasedTerm)
            );
        }
        
        if (lowercasedCity) {
            items = items.filter(p =>
                p.location.toLowerCase().includes(lowercasedCity)
            );
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            items = items.filter(item => {
                if (!item.unavailableDates) return true;
                return !item.unavailableDates.some(unavailableDateString => {
                    const unavailableDate = new Date(unavailableDateString);
                    return unavailableDate >= start && unavailableDate <= end;
                });
            });
        }
        
        return items;
    }, [selectedCategory, searchTerm, city, startDate, endDate]);
    
    const handleSearch = (filters: { term: string; city: string; start: string; end: string }) => {
        setSearchTerm(filters.term);
        setCity(filters.city);
        setStartDate(filters.start);
        setEndDate(filters.end);
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Noleggia qualsiasi cosa, ovunque.</h1>
                <p className="mt-4 text-lg text-gray-600">Dalle attrezzature professionali agli articoli per il tempo libero, trova tutto ciò di cui hai bisogno.</p>
            </div>
            
            <div className="max-w-4xl mx-auto mb-8 relative" ref={datePickerRef}>
                {/* Desktop Search Bar */}
                <div className="bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-shadow p-2 hidden sm:block">
                    <div className="flex items-center divide-x">
                         <div className="flex-1 px-4">
                            <label htmlFor="search-term-desktop" className="block text-xs font-bold text-gray-800">COSA</label>
                            <input
                                id="search-term-desktop"
                                type="text"
                                placeholder="Cerca attrezzatura..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
                            />
                        </div>
                        <div className="flex-1 px-4">
                            <label htmlFor="search-city-desktop" className="block text-xs font-bold text-gray-800">DOVE</label>
                            <input
                                id="search-city-desktop"
                                type="text"
                                placeholder="Città del noleggio"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
                            />
                        </div>
                        <div className="flex-1 cursor-pointer hover:bg-gray-50 rounded-full" onClick={() => setIsDatePickerOpen(prev => !prev)}>
                            <div className="px-4 py-1.5">
                                <label className="block text-xs font-bold text-gray-800">QUANDO</label>
                                <div className="text-sm text-gray-500 truncate">{formattedDateRange || "Aggiungi date"}</div>
                            </div>
                        </div>
                         <button className="bg-brand-blue text-white rounded-full p-3 hover:bg-teal-800 transition-colors flex items-center justify-center space-x-2 font-bold ml-2">
                            <MagnifyingGlassIcon className="w-5 h-5" />
                            <span className="hidden lg:inline">Cerca</span>
                        </button>
                    </div>
                </div>
                
                {/* Mobile Compact Search Bar */}
                <div className="sm:hidden">
                    <button 
                        onClick={() => setIsSearchModalOpen(true)}
                        className="w-full flex items-center text-left bg-white rounded-full shadow-md p-2 pl-4 border hover:shadow-lg transition-shadow"
                    >
                        <MagnifyingGlassIcon className="w-6 h-6 text-brand-blue" />
                        <div className="ml-4">
                            <p className="font-bold text-gray-800">Cerca</p>
                            <p className="text-sm text-gray-500">Attrezzatura, città, date...</p>
                        </div>
                    </button>
                </div>

                 {isDatePickerOpen && (
                    <div className="absolute top-full mt-2 z-10 left-1/2 -translate-x-1/2 w-[90vw] sm:w-auto">
                        <DatePickerPopover 
                            startDate={startDate}
                            endDate={endDate}
                            onDatesChange={(start, end) => {
                                setStartDate(start);
                                setEndDate(end);
                            }}
                            onClear={() => {
                                setStartDate('');
                                setEndDate('');
                            }}
                            onClose={() => setIsDatePickerOpen(false)}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setIsProjectIdeasModalOpen(true)}
                    className="font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors border"
                >
                    💡 Trova Idee per Progetti con l'IA
                </button>
            </div>
            
            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
            <ItemListings
                items={filteredItems}
                onItemClick={setSelectedItem}
                favoritedItemIds={favoritedItemIds}
                onToggleFavorite={onToggleFavorite}
            />
             {isProjectIdeasModalOpen && (
                <ProjectIdeasModal onClose={() => setIsProjectIdeasModalOpen(false)} />
            )}
             {isSearchModalOpen && (
                <SearchModal 
                    onClose={() => setIsSearchModalOpen(false)} 
                    onSearch={handleSearch}
                    initialFilters={{ term: searchTerm, city, start: startDate, end: endDate }}
                />
            )}

            {selectedItem && (
                <ItemDetailModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                    isFavorite={favoritedItemIds.has(selectedItem.id)}
                    onToggleFavorite={onToggleFavorite}
                    onBookingSuccess={onBookingSuccess}
                />
            )}
        </div>
    );
};