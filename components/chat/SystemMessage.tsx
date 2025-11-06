import React from 'react';

interface SystemMessageProps {
  icon: string;
  text: string;
  timestamp: string;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({ icon, text, timestamp }) => {
    const formattedDate = new Date(timestamp).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    
    return (
        <div className="flex justify-center items-center my-4 space-x-4 text-xs text-gray-500">
            <div className="flex-grow border-t"></div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2 flex-shrink-0 text-center">
                <span className="text-base">{icon}</span>
                <span className="font-medium text-gray-700">{text}</span>
                <span className="text-gray-400 pl-2">{formattedDate}</span>
            </div>
            <div className="flex-grow border-t"></div>
        </div>
    );
};
