
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { User, Thread, ChatTab, ChatMessage, BookingEvent, Booking, Dispute, UserRole, DisputeType } from '../types';
import { MOCK_THREADS, MOCK_EVENTS, MOCK_BOOKINGS, MOCK_DISPUTES, threadTypeToChatTabMap } from '../constants';
import { ChatTabs } from './chat/ChatTabs';
import { ThreadList } from './chat/ThreadList';
import { SystemMessage } from './chat/SystemMessage';
import { getMessageForEvent, formatChatTimestamp } from '../utils/systemMessages';
import { addMinutes } from '../utils/datetime';
import { computeExtensionCost } from '../utils/pricing';
import { chargeForExtension } from '../api/payments';
import { DisputeModal } from './disputes/DisputeModal';
import { BookingStatus } from '../types';
import { ActionBanner } from './chat/ActionBanner';
import { PaperClipIcon, DocumentTextIcon } from './Icons';


interface ChatInterfaceProps {
    user: User;
    initialThreadId?: number | null;
    onThreadOpened?: () => void;
}

type TimelineItem =
    | { type: 'message'; data: ChatMessage }
    | { type: 'event'; data: BookingEvent; message: { icon: string; text: string } };


export const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, initialThreadId, onThreadOpened }) => {
    const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);
    const [bookings, setBookings] = useState(MOCK_BOOKINGS);
    const [events, setEvents] = useState(MOCK_EVENTS);
    const [disputes, setDisputes] = useState(MOCK_DISPUTES);
    const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<ChatTab>('all');
    const [disputeModalInfo, setDisputeModalInfo] = useState<{ isOpen: boolean; booking: Booking | null }>({ isOpen: false, booking: null });

    // Handle initial thread selection from props
    useEffect(() => {
        if (initialThreadId && initialThreadId !== activeThreadId) {
            const threadExists = MOCK_THREADS.some(t => t.id === initialThreadId);
            if (threadExists) {
                setActiveThreadId(initialThreadId);
                const targetThread = MOCK_THREADS.find(t => t.id === initialThreadId);
                if (targetThread) {
                    setActiveTab(threadTypeToChatTabMap[targetThread.type] || 'all');
                }
                if (onThreadOpened) onThreadOpened();
            }
        }
    }, [initialThreadId, activeThreadId, onThreadOpened]);

    // Handle tab state persistence
    useEffect(() => {
        let initialTab: ChatTab = 'all';
        try {
            const params = new URLSearchParams(window.location.search);
            const tabFromUrl = params.get('tab') as ChatTab;
            const tabFromStorage = localStorage.getItem('chatTab') as ChatTab;
            initialTab = tabFromUrl || tabFromStorage || 'all';
        } catch (error) {
            console.warn('Could not access URL search params, falling back to localStorage.', error);
            const tabFromStorage = localStorage.getItem('chatTab') as ChatTab;
            initialTab = tabFromStorage || 'all';
        }
        setActiveTab(initialTab);
    }, []);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            params.set('tab', activeTab);
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);
        } catch (error) {
            console.warn('Could not update URL with history.replaceState. This is expected in some sandboxed environments.', error);
        }
        localStorage.setItem('chatTab', activeTab);
    }, [activeTab]);
    
    const filteredThreads = useMemo(() => {
        if (activeTab === 'all') return threads;
        return threads.filter(thread => threadTypeToChatTabMap[thread.type] === activeTab);
    }, [threads, activeTab]);

    // This effect ensures the activeThreadId is always valid for the current filtered list.
    useEffect(() => {
        const isCurrentThreadInList = filteredThreads.some(t => t.id === activeThreadId);

        // If active thread is not in the current filtered list, it needs to be deselected.
        if (activeThreadId != null && !isCurrentThreadInList) {
            setActiveThreadId(null);
            return; // Let the state update and effect re-run.
        }

        // On desktop, if no thread is selected and there are threads to show, select the first one.
        if (activeThreadId === null && window.innerWidth >= 768 && filteredThreads.length > 0) {
            setActiveThreadId(filteredThreads[0].id);
        }
    }, [filteredThreads, activeThreadId]);

    const activeThread = threads.find(t => t.id === activeThreadId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeThread) {
            scrollToBottom();
        }
    }, [activeThread, activeThreadId, threads]);
    
    const createAndSetEvent = (booking: Booking, action: string, newState: BookingStatus, metadata?: Record<string, any>) => {
         const newEvent: BookingEvent = {
            bookingId: booking.id,
            actorId: user.id,
            action: action,
            oldState: booking.status,
            newState: newState,
            timestamp: new Date().toISOString(),
            metadata,
        };
        setEvents(prev => [...prev, newEvent]);
    }
    
    const addMessageToThread = (message: ChatMessage) => {
        const updatedThreads = threads.map(thread => {
            if (thread.id === activeThreadId) {
                return { ...thread, messages: [...thread.messages, message], isUnread: false };
            }
            return thread;
        });
        setThreads(updatedThreads);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeThreadId) return;

        const newChatMessage: ChatMessage = {
            id: Date.now(),
            senderId: user.id,
            text: newMessage,
            timestamp: new Date().toISOString(),
        };

        addMessageToThread(newChatMessage);
        setNewMessage('');
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !activeThreadId) return;

        const newChatMessage: ChatMessage = {
            id: Date.now(),
            senderId: user.id,
            timestamp: new Date().toISOString(),
            text: `File allegato: ${file.name}`,
        };

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newChatMessage.file = {
                    name: file.name,
                    url: e.target?.result as string,
                    type: 'image',
                };
                addMessageToThread(newChatMessage);
            };
            reader.readAsDataURL(file);
        } else {
            newChatMessage.file = {
                name: file.name,
                url: URL.createObjectURL(file), // Mock URL
                type: 'document',
            };
            addMessageToThread(newChatMessage);
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    const unreadCounts = useMemo(() => {
        const counts: Record<ChatTab, number> = {
            all: 0, listings: 0, rentals: 0, bookings: 0, support: 0,
        };
        threads.forEach(thread => {
            if (thread.isUnread) {
                counts.all++;
                const tab = threadTypeToChatTabMap[thread.type];
                if (tab) {
                    counts[tab]++;
                }
            }
        });
        return counts;
    }, [threads]);

    const handleOpenDispute = (booking: Booking) => {
        setDisputeModalInfo({ isOpen: true, booking });
    };

    const handleDisputeSubmit = (disputeData: {
        bookingId: number;
        openedBy: UserRole;
        disputeType: DisputeType;
        description: string;
        requestedAmount?: number;
        mediaUrls?: string[];
    }) => {
        const newDispute: Dispute = {
            id: disputes.length + 1,
            ...disputeData,
            status: 'OPEN',
        };
        setDisputes(prev => [...prev, newDispute]);

        setBookings(prev =>
            prev.map(b =>
                b.id === disputeData.bookingId
                    ? { ...b, status: BookingStatus.DISPUTE_OPEN }
                    : b
            )
        );
        
        const bookingForEvent = bookings.find(b => b.id === disputeData.bookingId);
        if (bookingForEvent) {
            createAndSetEvent(bookingForEvent, 'DISPUTE_OPEN', BookingStatus.DISPUTE_OPEN);
        }

        console.log(`[STAFF NOTIFICATION] Dispute #${newDispute.id} opened by ${disputeData.openedBy} for booking #${disputeData.bookingId}. Reason: ${disputeData.disputeType}.`);
        
        setDisputeModalInfo({ isOpen: false, booking: null });
    };

     // --- NUOVE AZIONI PER BOOKING ---
    const handlePickup = (booking: Booking) => {
        const newState = BookingStatus.PICKED_UP;
        setBookings(prev => prev.map(b => b.id === booking.id ? {...b, status: newState, pickedUpAt: new Date().toISOString()} : b));
        createAndSetEvent(booking, 'PICKED_UP', newState);
    };

    const handleExtend = async (booking: Booking, minutes: number) => {
        const cost = computeExtensionCost(booking.item.price, minutes);
        const costInCents = Math.round(cost * 100);

        // Simulate payment
        const paymentResult = await chargeForExtension(booking.id, user.id, costInCents);

        if (!paymentResult.success) {
            alert(`Pagamento fallito: ${paymentResult.message || 'Riprova più tardi.'}`);
            return;
        }

        const newState = BookingStatus.EXTENDED;
        const newDueAt = addMinutes(booking.dueAt, minutes);

        setBookings(prev => prev.map(b => b.id === booking.id ? {
            ...b, 
            status: newState,
            dueAt: newDueAt,
            extendedMinutes: (b.extendedMinutes || 0) + minutes,
            extensionCost: (b.extensionCost || 0) + cost
        } : b));
        
        createAndSetEvent(booking, 'EXTEND_BOOKING', newState, { minutes, cost, newDueAt });
    };

    const handleStartGrace = (booking: Booking) => {
        const newState = BookingStatus.GRACE;
        setBookings(prev => prev.map(b => b.id === booking.id ? {...b, status: newState} : b));
        createAndSetEvent(booking, 'START_GRACE', newState);
    };

    const handleReminder = (booking: Booking, hoursLeft: number) => {
        createAndSetEvent(booking, 'REMINDER_DUE', booking.status, { hoursLeft });
    };
     const handleGraceEnd = (booking: Booking) => {
        createAndSetEvent(booking, 'GRACE_ENDED', booking.status);
    };

    const handleThreadSelect = (id: number) => {
        setActiveThreadId(id);
        const threadToSelect = threads.find(t => t.id === id);
        if (threadToSelect && threadToSelect.isUnread) {
            setThreads(prevThreads =>
                prevThreads.map(t =>
                    t.id === id ? { ...t, isUnread: false } : t
                )
            );
        }
    };


    const ActiveChat = () => {
        const timeline = useMemo(() => {
            if (!activeThread) return [];

            const messageItems: TimelineItem[] = activeThread.messages.map(m => ({
                type: 'message',
                data: m,
            }));

            const eventItems: TimelineItem[] = events
                .filter(event => event.bookingId === activeThread.bookingId)
                .map(event => ({ event, message: getMessageForEvent(event, user.currentRole) }))
                .filter(item => item.message !== null)
                .map(item => ({ type: 'event', data: item.event, message: item.message! }));

            const combined = [...messageItems, ...eventItems];
            
            combined.sort((a, b) => new Date(a.data.timestamp).getTime() - new Date(b.data.timestamp).getTime());

            return combined;
        }, [activeThread, events, user.currentRole]);


        const activeBooking = useMemo(() => 
            bookings.find(b => b.id === activeThread?.bookingId),
        [bookings, activeThread]);

        const canOpenDispute = activeBooking && ![
            BookingStatus.PENDING,
            BookingStatus.COMPLETED,
            BookingStatus.DISPUTE_OPEN,
            BookingStatus.CANCELLED
        ].includes(activeBooking.status);


        if (!activeThread) {
             return (
                <div className="hidden md:flex items-center justify-center w-2/3 h-full text-gray-500">
                    <p>Seleziona una conversazione per iniziare a chattare.</p>
                </div>
            );
        }

        return (
            <main className="w-full md:w-2/3 flex flex-col h-full bg-white">
                <header className="p-4 border-b flex items-center space-x-4">
                     <button onClick={() => setActiveThreadId(null)} className="md:hidden p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <img src={activeThread.item.imageUrl} alt={activeThread.item.title} className="w-14 h-14 object-cover rounded-lg" />
                    <div className="flex-grow">
                        <p className="font-bold">{activeThread.participant.name}</p>
                        <p className="text-sm text-gray-600">{activeThread.item.title}</p>
                    </div>
                     {canOpenDispute && activeBooking && (
                        <button 
                            onClick={() => handleOpenDispute(activeBooking)}
                            className="text-xs font-semibold text-red-600 border border-red-200 rounded-full px-3 py-1 hover:bg-red-50"
                        >
                            Apri contestazione
                        </button>
                    )}
                </header>

                {activeBooking && (
                    <ActionBanner 
                        booking={activeBooking}
                        userRole={user.currentRole}
                        onPickup={() => handlePickup(activeBooking)}
                        onExtend={(minutes) => handleExtend(activeBooking, minutes)}
                        onStartGrace={() => handleStartGrace(activeBooking)}
                        onReminder={(hours) => handleReminder(activeBooking, hours)}
                        onGraceEnd={() => handleGraceEnd(activeBooking)}
                    />
                )}

                <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
                    <div>
                        {timeline.map((item, index) => {
                            if (item.type === 'event') {
                                return (
                                    <SystemMessage
                                        key={`event-${item.data.action}-${index}`}
                                        icon={item.message.icon}
                                        text={item.message.text}
                                        timestamp={item.data.timestamp}
                                    />
                                );
                            }
                            
                            const message = item.data;
                            return (
                                <div key={message.id} className={`flex items-end gap-2 my-2 ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    {message.senderId !== user.id && (
                                        <img src={activeThread.participant.avatarUrl} alt={activeThread.participant.name} className="w-6 h-6 rounded-full"/>
                                    )}
                                    <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${message.senderId === user.id ? 'bg-brand-blue text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                        <div className="text-sm space-y-2">
                                            {message.file && (
                                                message.file.type === 'image' ? (
                                                    <img src={message.file.url} alt={message.file.name} className="rounded-lg max-w-xs cursor-pointer" onClick={() => window.open(message.file.url, '_blank')} />
                                                ) : (
                                                    <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg text-gray-700 hover:bg-gray-200">
                                                        <DocumentTextIcon className="w-5 h-5 flex-shrink-0" />
                                                        <span className="truncate">{message.file.name}</span>
                                                    </a>
                                                )
                                            )}
                                            {message.text && <p>{message.text}</p>}
                                        </div>
                                        <p className={`text-xs mt-1 ${message.senderId === user.id ? 'text-blue-200 text-right' : 'text-gray-500 text-left'}`}>{formatChatTimestamp(message.timestamp)}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <footer className="p-4 border-t bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                         <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-500 hover:text-brand-blue rounded-full hover:bg-gray-100 transition-colors">
                            <PaperClipIcon className="w-6 h-6" />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Scrivi un messaggio..."
                            className="flex-grow p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-blue focus:outline-none"
                        />
                        <button type="submit" className="bg-brand-blue text-white rounded-full p-3 hover:bg-teal-800 transition-colors disabled:bg-gray-300" disabled={!newMessage.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                        </button>
                    </form>
                </footer>
            </main>
        );
    }


    return (
        <div className="bg-white rounded-xl border border-gray-200 h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] flex">
            <aside className={`h-full overflow-y-auto border-r w-full md:w-1/3 ${activeThreadId && 'hidden md:block'}`}>
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Messaggi</h2>
                </div>
                <div className="p-2 border-b">
                    <ChatTabs 
                        role={user.currentRole}
                        active={activeTab}
                        counts={unreadCounts}
                        onChange={(tab) => {
                            setActiveTab(tab);
                            // On mobile, go back to list view when changing tab
                            if(window.innerWidth < 768) {
                                setActiveThreadId(null);
                            }
                        }}
                    />
                </div>
                <ThreadList
                    threads={filteredThreads}
                    activeThreadId={activeThreadId}
                    onThreadSelect={handleThreadSelect}
                    user={user}
                    bookings={bookings}
                />
            </aside>
           <ActiveChat />
            {disputeModalInfo.isOpen && disputeModalInfo.booking && (
                <DisputeModal
                    isOpen={disputeModalInfo.isOpen}
                    onClose={() => setDisputeModalInfo({ isOpen: false, booking: null })}
                    onSubmit={handleDisputeSubmit}
                    booking={disputeModalInfo.booking}
                    userRole={user.currentRole}
                />
            )}
        </div>
    );
};
