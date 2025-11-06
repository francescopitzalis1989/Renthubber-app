
import React, { useState } from 'react';
import { MOCK_ALL_REVIEWS, MOCK_USERS } from '../../../constants';
import type { Review } from '../../../types';

const ReviewsManagement: React.FC = () => {
    const [reviews, setReviews] = useState(MOCK_ALL_REVIEWS);

    const handleDelete = (id: number) => {
        if (window.confirm('Sei sicuro di voler eliminare questa recensione?')) {
            setReviews(prev => prev.filter(r => r.id !== id));
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gestione Recensioni</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Recensore</th>
                            <th scope="col" className="px-6 py-3">Recensione</th>
                            <th scope="col" className="px-6 py-3">Valutazione</th>
                            <th scope="col" className="px-6 py-3 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{review.userName}</td>
                                <td className="px-6 py-4 max-w-sm truncate">{review.comment}</td>
                                <td className="px-6 py-4">{'⭐'.repeat(review.rating)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(review.id)} className="font-medium text-red-600 hover:underline">Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewsManagement;
