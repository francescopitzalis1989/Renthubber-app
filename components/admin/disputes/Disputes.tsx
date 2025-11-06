import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_DISPUTES, MOCK_BOOKINGS, MOCK_USERS, MOCK_THREADS, MOCK_EVENTS } from '../../../constants';
import type { Dispute, Booking, User, Thread, ChatMessage, BookingEvent } from '../../../types';
import { BookingStatus, DepositBookingStatus } from '../../../types';
import { PaperClipIcon, DocumentTextIcon } from '../../Icons';
import { captureDeposit, cancelDeposit } from '../../../api/payments';

// --- Modal Component ---
interface DisputeResolutionModalProps {
    dispute: Dispute;
    onClose: () => void;
    onResolve: (disputeId: number, resolution: 'renter' | 'hubber', reason: string) => void;
}

const DisputeResolutionModal: React.FC<DisputeResolutionModalProps> = ({ dispute, onClose, onResolve }) => {
    const adminUser = MOCK_USERS.find(u => u.isAdmin)!;
    const booking = MOCK_BOOKINGS.find(b => b.id === dispute.bookingId)!;
    const renter = MOCK_USERS.find(u => u.id === booking.renterId)!;
    const hubber = MOCK_USERS.find(u => u.id === booking.hubberId)!;
    
    // Find or create the relevant chat thread
    const [thread, setThread] = useState<Thread>(() => {
        const existingThread = MOCK_THREADS.find(t => t.bookingId === dispute.bookingId);
        if (existingThread) return JSON.parse(JSON.stringify(existingThread)); // Deep copy to avoid direct mutation
        // This is a fallback, but in a real app a thread should always exist for a dispute
        return {
            id: Date.now(), type: 'RENTAL', bookingId: dispute.bookingId,
            participant: renter, item: booking.item, messages: [], isUnread: false,
        };
    });

    const [newMessage, setNewMessage] = useState('');
    const [resolutionReason, setResolutionReason] = useState('');
    const [recipient, setRecipient] = useState<'public' | number>('public');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [thread.messages]);
    
    const addMessageToThread = (message: ChatMessage) => {
        // Update local state for immediate feedback
        const updatedThread = { ...thread, messages: [...thread.messages, message] };
        setThread(updatedThread);
        
        // Update global mock threads (simulating backend update)
        const threadIndex = MOCK_THREADS.findIndex(t => t.id === thread.id);
        if (threadIndex > -1) {
            MOCK_THREADS[threadIndex].messages.push(message);
        } else {
            MOCK_THREADS.push(updatedThread);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newChatMessage: ChatMessage = {
            id: Date.now(),
            senderId: adminUser.id,
            text: newMessage,
            timestamp: new Date().toISOString(),
            isPrivate: recipient !== 'public',
            recipientId: recipient !== 'public' ? recipient : undefined,
        };

        addMessageToThread(newChatMessage);
        setNewMessage('');
    };

     const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const newChatMessage: ChatMessage = {
            id: Date.now(), senderId: adminUser.id, timestamp: new Date().toISOString(),
            text: `File allegato dall'admin: ${file.name}`,
            isPrivate: recipient !== 'public',
            recipientId: recipient !== 'public' ? recipient : undefined,
        };

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newChatMessage.file = { name: file.name, url: e.target?.result as string, type: 'image' };
                addMessageToThread(newChatMessage);
            };
            reader.readAsDataURL(file);
        } else {
            newChatMessage.file = { name: file.name, url: URL.createObjectURL(file), type: 'document' };
            addMessageToThread(newChatMessage);
        }
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    
    const handleConfirmResolution = (winner: 'renter' | 'hubber') => {
        if (!resolutionReason.trim()) {
            alert('Per favore, inserisci una motivazione per la risoluzione.');
            return;
        }
        onResolve(dispute.id, winner, resolutionReason);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Risoluzione Disputa #{dispute.id}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">&times;</button>
                </header>
                
                <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
                    {/* Left Panel: Dispute Info */}
                    <div className="w-full md:w-1/4 p-4 border-r overflow-y-auto space-y-4">
                        <h3 className="font-bold text-lg">Dettagli Caso</h3>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Oggetto</p>
                            <p>{booking.item.title}</p>
                        </div>
                         <div>
                            <p className="text-sm font-semibold text-gray-500">Parti Coinvolte</p>
                            <p><strong>Renter:</strong> {renter.firstName} {renter.lastName}</p>
                            <p><strong>Hubber:</strong> {hubber.firstName} {hubber.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Motivo</p>
                            <p className="font-semibold">{dispute.disputeType}</p>
                        </div>
                         <div>
                            <p className="text-sm font-semibold text-gray-500">Importo Richiesto</p>
                            <p className="font-semibold text-lg">{dispute.requestedAmount ? `€${dispute.requestedAmount.toFixed(2)}` : 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Descrizione</p>
                            <p className="text-sm bg-gray-50 p-2 rounded">{dispute.description}</p>
                        </div>
                        {dispute.mediaUrls && dispute.mediaUrls.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Prove Allegate</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {dispute.mediaUrls.map((url, index) => (
                                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block">
                                            <img src={url} alt={`Prova ${index + 1}`} className="w-16 h-16 object-cover rounded-md border hover:opacity-75" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Center Panel: Chat */}
                    <div className="w-full md:w-1/2 flex flex-col border-r">
                        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                            {thread.messages.map(message => {
                                const sender = MOCK_USERS.find(u => u.id === message.senderId);
                                const isAdminSender = sender?.isAdmin;
                                const isSenderRenter = sender?.id === renter.id;
                                const isPrivate = message.isPrivate;
                                const recipientUser = isPrivate ? MOCK_USERS.find(u => u.id === message.recipientId) : null;
                                
                                return (
                                    <div key={message.id} className={`flex my-2 items-end gap-2 ${isAdminSender ? 'justify-end' : (isSenderRenter ? 'justify-start' : 'justify-end')}`}>
                                        {!isAdminSender && (
                                            <img src={sender?.avatarUrl} alt={sender?.firstName} className={`w-6 h-6 rounded-full ${isSenderRenter ? 'order-1' : 'order-2'}`} />
                                        )}
                                        <div className={`p-3 rounded-lg max-w-sm ${
                                            isAdminSender
                                                ? 'bg-yellow-100 text-yellow-800 rounded-br-none'
                                                : isSenderRenter
                                                ? 'bg-white border rounded-bl-none order-2'
                                                : 'bg-blue-100 rounded-br-none order-1'
                                        }`}>
                                            {isPrivate && isAdminSender && (
                                                <p className="text-xs font-bold text-red-600 border-b border-red-200 mb-1 pb-1">Privato a {recipientUser?.firstName}</p>
                                            )}
                                            {!isAdminSender && <p className="font-bold text-xs">{sender?.firstName}</p>}
                                             <div className="text-sm space-y-2">
                                                {message.file && (
                                                    message.file.type === 'image' ? (
                                                        <img src={message.file.url} alt={message.file.name} className="mt-2 rounded-lg max-w-xs cursor-pointer" onClick={() => window.open(message.file.url, '_blank')} />
                                                    ) : (
                                                        <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center space-x-2 bg-gray-100 p-2 rounded-lg text-gray-700 hover:bg-gray-200">
                                                            <DocumentTextIcon className="w-5 h-5 flex-shrink-0" />
                                                            <span className="truncate">{message.file.name}</span>
                                                        </a>
                                                    )
                                                )}
                                                {message.text && <p>{message.text}</p>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                             <div ref={messagesEndRef} />
                        </div>
                        <footer className="p-3 border-t bg-gray-50 space-y-2">
                             <form onSubmit={handleSendMessage}>
                                 <div className="flex items-center space-x-2">
                                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Intervieni come Admin..." className="w-full p-2 border rounded-full"/>
                                    <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-full">Invia</button>
                                </div>
                                <div className="flex items-center justify-between pl-2 pr-4">
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs flex items-center space-x-1 text-gray-500 hover:text-brand-blue"><PaperClipIcon className="w-4 h-4" /> <span>Allega File</span></button>
                                     <select value={recipient === 'public' ? 'public' : recipient} onChange={e => setRecipient(e.target.value === 'public' ? 'public' : Number(e.target.value))} className="text-xs border-gray-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue">
                                        <option value="public">Messaggio Pubblico</option>
                                        <option value={renter.id}>Privato a {renter.firstName}</option>
                                        <option value={hubber.id}>Privato a {hubber.firstName}</option>
                                    </select>
                                </div>
                            </form>
                        </footer>
                    </div>

                    {/* Right Panel: Resolution */}
                    <div className="w-full md:w-1/4 p-4 space-y-4">
                        <h3 className="font-bold text-lg">Pannello di Risoluzione</h3>
                        <p className="text-sm text-gray-600">Valuta le prove e prendi una decisione finale.</p>
                        <div>
                            <label className="font-semibold text-sm">Motivazione della decisione</label>
                            <textarea value={resolutionReason} onChange={e => setResolutionReason(e.target.value)} rows={5} className="w-full p-2 border rounded-md mt-1" placeholder="Spiega perché hai preso questa decisione..."></textarea>
                        </div>
                         <div className="space-y-2">
                            <button onClick={() => handleConfirmResolution('renter')} className="w-full bg-green-600 text-white p-3 rounded-lg">Risolvi a favore del Renter</button>
                            <button onClick={() => handleConfirmResolution('hubber')} className="w-full bg-red-600 text-white p-3 rounded-lg">Risolvi a favore del Hubber</button>
                         </div>
                    </div>
                </main>
            </div>
        </div>
    );
};


// --- Main Component ---
const Disputes: React.FC = () => {
    // We need state to re-render when the global MOCK is mutated
    const [disputes, setDisputes] = useState(MOCK_DISPUTES);
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

    const handleResolve = (disputeId: number, winner: 'renter' | 'hubber', reason: string) => {
        console.log(`Resolving dispute #${disputeId} in favor of ${winner}. Reason: ${reason}`);

        // Update MOCK_DISPUTES
        const disputeIndex = MOCK_DISPUTES.findIndex(d => d.id === disputeId);
        if (disputeIndex === -1) return;
        
        MOCK_DISPUTES[disputeIndex].status = 'RESOLVED';
        
        // Update MOCK_BOOKINGS status
        const bookingId = MOCK_DISPUTES[disputeIndex].bookingId;
        const bookingIndex = MOCK_BOOKINGS.findIndex(b => b.id === bookingId);
        if (bookingIndex === -1) return;

        const booking = MOCK_BOOKINGS[bookingIndex];
        
        if (winner === 'hubber' && booking.depositPaymentIntentId) {
            captureDeposit(booking.depositPaymentIntentId);
            MOCK_BOOKINGS[bookingIndex].depositStatus = DepositBookingStatus.CAPTURED;
            console.log(`[ACTION] Captured deposit for booking ${bookingId}`);
        } else if (winner === 'renter' && booking.depositPaymentIntentId) {
            cancelDeposit(booking.depositPaymentIntentId);
            MOCK_BOOKINGS[bookingIndex].depositStatus = DepositBookingStatus.RELEASED;
             console.log(`[ACTION] Released deposit for booking ${bookingId}`);
        }
        
        MOCK_BOOKINGS[bookingIndex].status = BookingStatus.COMPLETED;

        // Create system message event
        const resolvedEvent: BookingEvent = {
            bookingId: bookingId,
            actorId: MOCK_USERS.find(u => u.isAdmin)?.id || 99, // Admin User ID
            action: 'DISPUTE_RESOLVED',
            oldState: BookingStatus.DISPUTE_OPEN,
            newState: BookingStatus.COMPLETED,
            timestamp: new Date().toISOString(),
            metadata: {
                winner: winner,
                reason: reason,
            }
        };
        MOCK_EVENTS.push(resolvedEvent);

        // Force re-render by updating local state
        setDisputes([...MOCK_DISPUTES]);
        setSelectedDispute(null);
        alert(`Disputa #${disputeId} risolta a favore di: ${winner}.`);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestione Dispute & Ticket</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Annuncio Coinvolto</th>
                            <th scope="col" className="px-6 py-3">Parti</th>
                            <th scope="col" className="px-6 py-3">Motivo</th>
                            <th scope="col" className="px-6 py-3">Importo Rich.</th>
                            <th scope="col" className="px-6 py-3">Stato</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disputes.map(dispute => {
                             const booking = MOCK_BOOKINGS.find(b => b.id === dispute.bookingId);
                             const renter = MOCK_USERS.find(u => u.id === booking?.renterId);
                             const hubber = MOCK_USERS.find(u => u.id === booking?.hubberId);
                            return (
                                <tr key={dispute.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">#{dispute.id}</td>
                                    <td className="px-6 py-4 font-medium">{booking?.item.title}</td>
                                    <td className="px-6 py-4">{renter?.firstName} vs {hubber?.firstName}</td>
                                    <td className="px-6 py-4">{dispute.disputeType}</td>
                                    <td className="px-6 py-4 font-semibold">{dispute.requestedAmount ? `€${dispute.requestedAmount.toFixed(2)}` : 'N/A'}</td>
                                    <td className="px-6 py-4">{dispute.status}</td>
                                    <td className="px-6 py-4 text-right">
                                        {dispute.status === 'OPEN' && (
                                            <button onClick={() => setSelectedDispute(dispute)} className="font-medium text-brand-blue hover:underline">Valuta e Risolvi</button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {disputes.length === 0 && (
                    <p className="text-center p-8 text-gray-500">Nessuna disputa da visualizzare.</p>
                )}
            </div>

            {selectedDispute && (
                <DisputeResolutionModal 
                    dispute={selectedDispute}
                    onClose={() => setSelectedDispute(null)}
                    onResolve={handleResolve}
                />
            )}
        </div>
    );
};

export default Disputes;