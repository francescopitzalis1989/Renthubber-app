

import React, { useState } from 'react';
import { HubberDashboard } from './components/HubberDashboard';
import { RenterDashboard } from './components/RenterDashboard';
import { Footer } from './components/Footer';
import type { User, UserRole, Booking } from './types';
import { MOCK_USERS, MOCK_BOOKINGS } from './constants';
import { PublicHeader } from './components/PublicHeader';
import { AuthModal } from './components/AuthModal';
import { SearchAndBook } from './components/SearchAndBook';
import { AdminDashboard } from './components/admin/AdminDashboard';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' as 'login' | 'register' });
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [favoritedItemIds, setFavoritedItemIds] = useState<Set<number>>(new Set([1])); // Favorite one by default for demo

  const openAuthModal = () => {
      setAuthModal({isOpen: true, mode: 'login'});
  }

  const handleToggleFavorite = (itemId: number) => {
    if (!currentUser) {
        openAuthModal();
        return;
    }
    setFavoritedItemIds(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(itemId)) {
            newFavorites.delete(itemId);
        } else {
            newFavorites.add(itemId);
        }
        return newFavorites;
    });
  };

  const handleBookingSuccess = (newBooking: Booking) => {
      setBookings(prev => [...prev, newBooking]);
      // Also update the global mock for consistency across the app if needed
      MOCK_BOOKINGS.push(newBooking);
  };

  const handleLogin = (email: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
        setCurrentUser(user);
        document.title = `Dashboard - Renthubber`;
        setAuthModal({ isOpen: false, mode: 'login' });
    } else {
        alert('Credenziali non valide. Prova con una delle email di test: "renter@renthubber.com", "hubber@renthubber.com", "dual@renthubber.com", "admin@renthubber.com"');
    }
  };

  const handleRegister = (name: string, email: string, role: UserRole) => {
    const existingUserIndex = MOCK_USERS.findIndex(u => u.email === email);
    
    if (existingUserIndex > -1) {
        const existingUser = MOCK_USERS[existingUserIndex];
        // User exists, add the new role if they don't have it already
        if (existingUser.roles.includes(role)) {
            alert(`Hai già un account ${role} con questa email. Prova ad accedere.`);
            return;
        }
        
        const updatedUser = {
            ...existingUser,
            roles: [...existingUser.roles, role],
            currentRole: role, // Switch to the newly registered role
        };
        
        MOCK_USERS[existingUserIndex] = updatedUser;
        
        setCurrentUser(updatedUser);
        document.title = `Dashboard - Renthubber`;
        setAuthModal({ isOpen: false, mode: 'login' });
        alert(`Profilo ${role} aggiunto al tuo account! Ora puoi passare da un profilo all'altro.`);

    } else {
        // New user
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const newUser: User = {
          id: MOCK_USERS.length + 1,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: 'N/A',
          avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
          roles: [role],
          currentRole: role,
          dateOfBirth: '1990-01-01', // Placeholder
          isVerified: false,
        };
        MOCK_USERS.push(newUser);
        setCurrentUser(newUser);
        document.title = `Dashboard - Renthubber`;
        setAuthModal({ isOpen: false, mode: 'login' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    document.title = 'Renthubber';
  };

  const handleSwitchRole = () => {
    if (!currentUser) return;

    const newRole = currentUser.currentRole === 'hubber' ? 'renter' : 'hubber';

    // A renter can only switch to hubber if they already have the hubber role.
    // This is enforced by the button's visibility, but this is a safeguard.
    if (currentUser.currentRole === 'renter' && !currentUser.roles.includes('hubber')) {
        return; 
    }
    
    const userUpdates: Partial<User> = { currentRole: newRole };

    // If a hubber switches to renter and doesn't have the renter role yet, add it.
    if (newRole === 'renter' && !currentUser.roles.includes('renter')) {
        const newRoles = [...currentUser.roles, 'renter'];
        userUpdates.roles = newRoles;
        
        const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
        if(userIndex > -1) MOCK_USERS[userIndex].roles = newRoles;
    }

    setCurrentUser({ ...currentUser, ...userUpdates });
  };
  
  const handleUserUpdate = (updatedUser: User) => {
      const userIndex = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
      if (userIndex > -1) {
          MOCK_USERS[userIndex] = updatedUser;
      }
      // Make sure to update the currentUser state if the edited user is the one logged in
      if (currentUser && currentUser.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {currentUser ? (
        currentUser.isAdmin ? (
          <AdminDashboard user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
        ) : currentUser.currentRole === 'hubber' ? (
          <HubberDashboard user={currentUser} bookings={bookings} onLogout={handleLogout} onSwitchRole={handleSwitchRole} />
        ) : (
          <RenterDashboard 
            user={currentUser}
            bookings={bookings}
            favoritedItemIds={favoritedItemIds}
            onToggleFavorite={handleToggleFavorite}
            onBookingSuccess={handleBookingSuccess}
            onLogout={handleLogout} 
            onSwitchRole={handleSwitchRole} 
          />
        )
      ) : (
        <>
          <PublicHeader onAuthClick={openAuthModal} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SearchAndBook 
              favoritedItemIds={favoritedItemIds}
              onToggleFavorite={handleToggleFavorite}
              onBookingSuccess={handleBookingSuccess}
            />
          </main>
          <Footer />
        </>
      )}

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        initialMode={authModal.mode}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default App;