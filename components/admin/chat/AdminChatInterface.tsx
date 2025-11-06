import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_THREADS, MOCK_USERS, MOCK_BOOKINGS, MOCK_DISPUTES } from '../../../constants';
import type { Thread, User, ChatMessage } from '../../../types';
import { ShieldExclamationIcon, ChatBubbleLeftRightIcon, UserGroupIcon, PaperClipIcon, DocumentTextIcon } from '../../Icons';

// Helper per ottenere tutti i partecipanti di una conversazione
const getThreadParticipants = (thread: Thread, allUsers: User[]): User[] => {
    const usersMap = new Map(allUsers.map(u => [u.id, u]));
    const participants: User[] = [];
    const addedIds = new Set<number>();

    const addParticipant = (user: User | undefined) => {
        if (user && !addedIds.has(user.id)) {
            participants.push(user);
            addedIds.add(user.id);
        }
    };
    
    // The main participant is the one who is not the current user in a direct chat.
    // In support chats, it's the user seeking support.
    addParticipant(usersMap.get(thread.participant.id));

    // For booking/rental threads, add both renter and hubber
    if (thread.bookingId) {
        const booking = MOCK_BOOKINGS.find(b => b.id === thread.bookingId);
        if (booking) {
            addParticipant(usersMap.get(booking.renterId));
            addParticipant(usersMap.get(booking.hubberId));
        }
    } 
    
    // In a real app, you might add all admins/support agents who have participated.
    // For this mock, we just filter out the currently viewing admin.
    return participants.filter(p => !p.isAdmin);
};


// --- Componente per la finestra di chat attiva ---
interface ActiveAdminChatProps {
    activeThread: Thread | undefined;
    adminUser: User;
    usersMap: Map<number, User>;
    participants: User[];
    supportAgents: User[];
    newMessage: string;
    onNewMessageChange: (value: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAssigneeChange: (threadId: number, assigneeId: number | null) => void;
    onClose: () => void;
}

const ActiveAdminChat: React.FC<ActiveAdminChatProps> = ({
    activeThread, adminUser, usersMap, participants, supportAgents, newMessage,
    onNewMessageChange, onSendMessage, onFileUpload, onAssigneeChange, onClose
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeThread?.messages]);
    
    if (!activeThread) {
        return <div className="hidden md:flex flex-grow items-center justify-center text-gray-500 bg-gray-50">Seleziona una conversazione dalla lista.</div>;
    }

    const handleAssign = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const assigneeId = e.target.value === "unassigned" ? null : Number(e.target.value);
        onAssigneeChange(activeThread.id, assigneeId);
    };

    return (
        <div className="flex flex-col flex-grow w-full md:w-2/3 bg-white">
            <header className="flex-shrink-0 p-3 border-b flex items-center justify-between bg-white z-10">
                <div className="flex items-center space-x-3">
                    <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    </button>
                    <div className="flex -space-x-3">
                        {participants.map(p => <img key={p.id} src={p.avatarUrl} title={`${p.firstName} ${p.lastName}`} className="w-9 h-9 rounded-full border-2 border-white"/>)}
                    </div>
                    <div>
                        <p className="font-bold text-sm">{participants.map(p => p.firstName).join(', ')}</p>
                        <p className="text-xs text-gray-500">{activeThread.item.title}</p>
                    </div>
                </div>
                {adminUser.isAdmin && activeThread.type === 'SUPPORT' && (
                    <div className="flex items-center space-x-2">
                        <label htmlFor="assignee" className="text-xs font-medium text-gray-500">Assegna a:</label>
                        <select
                            id="assignee"
                            value={activeThread.assigneeId || 'unassigned'}
                            onChange={handleAssign}
                            className="text-xs border-gray-300 rounded-md shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                        >
                            <option value="unassigned">Non assegnato</option>
                            {supportAgents.map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.firstName} {agent.lastName}</option>
                            ))}
                        </select>
                    </div>
                )}
            </header>
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto bg-gray-50">
                {activeThread.messages.map(message => {
                    const sender = usersMap.get(message.senderId);
                    const isAdminSender = sender?.id === adminUser.id || sender?.adminRoles?.includes('Support');
                    
                    return (
                        <div key={message.id} className={`flex items-end gap-2 my-2 ${isAdminSender ? 'justify-end' : 'justify-start'}`}>
                            {!isAdminSender && <img src={sender?.avatarUrl} alt={sender?.firstName} className="w-6 h-6 rounded-full"/>}
                            <div className={`max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow-sm ${isAdminSender ? 'bg-brand-blue text-white rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                                {!isAdminSender && <p className="text-xs font-bold text-teal-700">{sender?.firstName}</p>}
                                
                                <div className="text-sm space-y-2">
                                    {message.file && (
                                        message.file.type === 'image' ? (
                                            <img src={message.file.url} alt={message.file.name} className="rounded-lg max-w-xs cursor-pointer" onClick={() => window.open(message.file.url, '_blank')} />
                                        ) : (
                                            <a href={message.file.url} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 p-2 rounded-lg ${isAdminSender ? 'bg-blue-900/50 hover:bg-blue-900' : 'bg-gray-100 hover:bg-gray-200'}`}>
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
            <footer className="flex-shrink-0 p-4 border-t bg-white">
                <form onSubmit={onSendMessage}>
                    <div className="flex items-center space-x-3">
                        <img src={adminUser.avatarUrl} alt="Admin" className="w-8 h-8 rounded-full" />
                        <input type="text" value={newMessage} onChange={e => onNewMessageChange(e.target.value)} placeholder="Scrivi un messaggio come Admin..." className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                        <button type="submit" className="bg-brand-blue text-white rounded-full p-3 hover:bg-teal-800 transition-colors" aria-label="Invia messaggio">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
};

// --- Componente Principale ---
interface AdminChatInterfaceProps {
    adminUser: User;
}

export const AdminChatInterface: React.FC<AdminChatInterfaceProps> = ({ adminUser }) => {
    const usersMap = useMemo(() => new Map(MOCK_USERS.map(u => [u.id, u])), []);
    const supportAgents = useMemo(() => MOCK_USERS.filter(u => u.adminRoles?.includes('Support')), []);
    
    const [threads, setThreads] = useState(MOCK_THREADS);
    const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
    const [filter, setFilter] = useState<'all' | 'disputes' | 'support' | 'mine'>('all');
    const [newMessage, setNewMessage] = useState('');
    const [toast, setToast] = useState({ show: false, message: '' });

    const isSupportAgent = adminUser.adminRoles?.includes('Support') && !adminUser.isAdmin;

    const filteredThreads = useMemo(() => {
        const disputeBookingIds = new Set(MOCK_DISPUTES.map(d => d.bookingId));
        let sortedThreads = [...threads].sort((a, b) => {
            const lastMsgA = a.messages[a.messages.length - 1];
            const lastMsgB = b.messages[b.messages.length - 1];
            if (!lastMsgA || !lastMsgB) return 0;
            return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
        });

        // Main admin view
        if (!isSupportAgent) {
            switch (filter) {
                case 'disputes': return sortedThreads.filter(t => t.bookingId && disputeBookingIds.has(t.bookingId));
                case 'support': return sortedThreads.filter(t => t.type === 'SUPPORT');
                default: return sortedThreads;
            }
        } else { // Support agent view
             switch (filter) {
                case 'mine': return sortedThreads.filter(t => t.type === 'SUPPORT' && t.assigneeId === adminUser.id);
                case 'support': return sortedThreads.filter(t => t.type === 'SUPPORT' && !t.assigneeId);
                default: return sortedThreads.filter(t => t.type === 'SUPPORT' && (!t.assigneeId || t.assigneeId === adminUser.id));
            }
        }
    }, [filter, threads, isSupportAgent, adminUser.id]);

    const activeThread = useMemo(() => threads.find(t => t.id === activeThreadId), [activeThreadId, threads]);
    const participants = useMemo(() => activeThread ? getThreadParticipants(activeThread, MOCK_USERS) : [], [activeThread]);
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeThreadId) return;
        const newChatMessage: ChatMessage = {
            id: Date.now(), senderId: adminUser.id, text: newMessage, timestamp: new Date().toISOString()
        };
        setThreads(prev => 
            prev.map(t => t.id === activeThreadId ? { ...t, messages: [...t.messages, newChatMessage] } : t)
        );
        setNewMessage('');

        setToast({ show: true, message: 'Messaggio inviato!' });
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);
    };
    
    const handleAssigneeChange = (threadId: number, assigneeId: number | null) => {
        setThreads(prev => 
            prev.map(t => t.id === threadId ? { ...t, assigneeId: assigneeId ?? undefined } : t)
        );
        // Also update the global MOCK_THREADS
        const threadIndex = MOCK_THREADS.findIndex(t => t.id === threadId);
        if (threadIndex > -1) {
            MOCK_THREADS[threadIndex].assigneeId = assigneeId ?? undefined;
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow h-[calc(100vh-130px)] flex flex-col md:flex-row overflow-hidden relative">
            {toast.show && (
                <div className="absolute bottom-5 right-5 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg z-[100]">
                    {toast.message}
                </div>
            )}
            <div className={`flex flex-col h-full overflow-y-auto border-r w-full md:w-1/3 ${activeThreadId && 'hidden md:flex'}`}>
                <div className="p-3 border-b flex items-center space-x-2 bg-gray-50 flex-wrap">
                    {isSupportAgent ? (
                        <>
                            <button onClick={() => setFilter('support')} className={`px-3 py-1.5 text-sm rounded-full flex items-center space-x-2 ${filter === 'support' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}><span>Nuovi Ticket</span></button>
                            <button onClick={() => setFilter('mine')} className={`px-3 py-1.5 text-sm rounded-full flex items-center space-x-2 ${filter === 'mine' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}><span>I Miei Ticket</span></button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm rounded-full flex items-center space-x-2 ${filter === 'all' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}><UserGroupIcon className="w-4 h-4" /><span>Tutte</span></button>
                            <button onClick={() => setFilter('disputes')} className={`px-3 py-1.5 text-sm rounded-full flex items-center space-x-2 ${filter === 'disputes' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}><ShieldExclamationIcon className="w-4 h-4" /><span>Dispute</span></button>
                            <button onClick={() => setFilter('support')} className={`px-3 py-1.5 text-sm rounded-full flex items-center space-x-2 ${filter === 'support' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}><ChatBubbleLeftRightIcon className="w-4 h-4" /><span>Supporto</span></button>
                        </>
                    )}
                </div>
                {filteredThreads.length > 0 ? (
                    <ul>
                        {filteredThreads.map(thread => {
                            const currentParticipants = getThreadParticipants(thread, MOCK_USERS);
                            const lastMessage = thread.messages[thread.messages.length - 1];
                            const assignee = thread.assigneeId ? usersMap.get(thread.assigneeId) : null;
                            return (
                                <li key={thread.id} onClick={() => setActiveThreadId(thread.id)} className={`p-4 cursor-pointer border-b ${activeThreadId === thread.id ? 'bg-teal-50' : 'hover:bg-gray-50'}`}>
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-sm truncate">{currentParticipants.map(p => p.firstName).join(' & ')}</p>
                                        {assignee && <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">{assignee.firstName}</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{thread.item.title}</p>
                                    <p className="text-sm text-gray-600 truncate mt-1">{lastMessage?.text || 'Nessun messaggio'}</p>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-gray-500">Nessuna conversazione trovata.</div>
                )}
            </div>

            <ActiveAdminChat
                activeThread={activeThread}
                adminUser={adminUser}
                usersMap={usersMap}
                participants={participants}
                supportAgents={supportAgents}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                onFileUpload={() => {}} // Placeholder
                onAssigneeChange={handleAssigneeChange}
                onClose={() => setActiveThreadId(null)}
            />
        </div>
    );
};