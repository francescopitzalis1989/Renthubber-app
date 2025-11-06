
import React from 'react';

const ReportCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">{description}</p>
        <button onClick={() => alert(`Generazione del report "${title}" avviata...`)} className="font-medium text-brand-blue hover:underline">
            Genera Report (.csv)
        </button>
    </div>
);

const Reports: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Genera Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportCard
                    title="Report Guadagni Mensili"
                    description="Un riepilogo di tutti i guadagni, commissioni e payout per il mese selezionato."
                />
                <ReportCard
                    title="Report Crescita Utenti"
                    description="Dati sulle nuove registrazioni e sull'attività degli utenti in un periodo di tempo."
                />
                <ReportCard
                    title="Report Annunci Popolari"
                    description="Elenco degli annunci più visualizzati e noleggiati."
                />
                <ReportCard
                    title="Report Utilizzo Coupon"
                    description="Statistiche sull'utilizzo dei codici sconto attivi e passati."
                />
            </div>
        </div>
    );
};

export default Reports;
