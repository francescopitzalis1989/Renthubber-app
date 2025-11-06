import React from 'react';
import { MOCK_CMS_PAGES, MOCK_SITE_SETTINGS } from '../constants';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-sm text-gray-600 hover:underline">{children}</a>
);

const Breadcrumb: React.FC = () => (
    <div className="text-sm text-gray-700 mb-8">
        <a href="#" className="hover:underline">Italia</a>
        <span className="mx-2">&gt;</span>
        <a href="#" className="hover:underline">Lombardia</a>
        <span className="mx-2">&gt;</span>
        <a href="#" className="hover:underline">Milano</a>
    </div>
);

const ExploreSection: React.FC = () => {
    const locations = ["Roma", "Firenze", "Venezia", "Napoli", "Torino", "Bologna", "Palermo", "Genova"];
    return (
        <div>
            <h2 className="font-semibold text-lg mb-4">Esplora altre opzioni a Milano e dintorni</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {locations.map(loc => (
                    <div key={loc}>
                        <a href="#" className="font-semibold text-gray-800">{loc}</a>
                        <p className="text-gray-500">Noleggi</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const Footer: React.FC = () => {
    const supportLinks = MOCK_CMS_PAGES.filter(p => p.placement === 'footer-support');
    const communityLinks = MOCK_CMS_PAGES.filter(p => p.placement === 'footer-community');
    const hostingLinks = MOCK_CMS_PAGES.filter(p => p.placement === 'footer-hosting');
    const infoLinks = MOCK_CMS_PAGES.filter(p => p.placement === 'footer-info');

    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-12">
                <Breadcrumb />
                <ExploreSection />
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold mb-4">Supporto</h3>
                            <ul className="space-y-2">
                                <li><FooterLink href="#">Centro Assistenza</FooterLink></li>
                                <li><FooterLink href="#">Informazioni sulla sicurezza</FooterLink></li>
                                <li><FooterLink href="#">Opzioni di cancellazione</FooterLink></li>
                                {supportLinks.map(page => <li key={page.id}><FooterLink href={`#`}>{page.title}</FooterLink></li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Community</h3>
                            <ul className="space-y-2">
                                <li><FooterLink href="#">Blog della community</FooterLink></li>
                                <li><FooterLink href="#">Lotta alla discriminazione</FooterLink></li>
                                 {communityLinks.map(page => <li key={page.id}><FooterLink href={`#`}>{page.title}</FooterLink></li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Offri a noleggio</h3>
                            <ul className="space-y-2">
                                <li><FooterLink href="#">Metti in affitto i tuoi articoli</FooterLink></li>
                                <li><FooterLink href="#">Copertura per chi noleggia</FooterLink></li>
                                <li><FooterLink href="#">Visita il nostro forum</FooterLink></li>
                                 {hostingLinks.map(page => <li key={page.id}><FooterLink href={`#`}>{page.title}</FooterLink></li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Informazioni</h3>
                            <ul className="space-y-2">
                                <li><FooterLink href="#">Newsroom</FooterLink></li>
                                <li><FooterLink href="#">Lavora con noi</FooterLink></li>
                                {infoLinks.map(page => <li key={page.id}><FooterLink href={`#`}>{page.title}</FooterLink></li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-500 space-y-1">
                        <p>&copy; {new Date().getFullYear()} {MOCK_SITE_SETTINGS.companyName}. Questa è un'applicazione demo.</p>
                        {MOCK_SITE_SETTINGS.address && <p>{MOCK_SITE_SETTINGS.address}</p>}
                        {MOCK_SITE_SETTINGS.vatNumber && <p>P.IVA {MOCK_SITE_SETTINGS.vatNumber}</p>}
                    </div>
                </div>
            </div>
        </footer>
    );
};