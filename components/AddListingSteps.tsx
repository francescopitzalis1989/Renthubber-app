import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Item, User } from '../types';
import { CATEGORIES, TECHNICAL_SPECS_BY_CATEGORY } from '../constants';

type StepProps = {
  data: Partial<Item>;
  updateData: (newData: Partial<Item>) => void;
};

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500 mt-1 mb-6">{subtitle}</p>
        {children}
    </div>
);

// MARK: Image Uploader
const ImageUploader: React.FC<{ images: string[]; onUpload: (images: string[]) => void; maxFiles?: number }> = ({ images, onUpload, maxFiles = 5 }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (!files) return;
        const newImages: string[] = [];
        const currentImageCount = images.length;
        const filesToProcess = Array.from(files).slice(0, maxFiles - currentImageCount);

        filesToProcess.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newImages.push(e.target.result as string);
                        if (newImages.length === filesToProcess.length) {
                            onUpload([...images, ...newImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };
    
    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(isEntering);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvents(e, false);
        handleFileChange(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        onUpload(images.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {images.map((img, index) => (
                    <div key={index} className="relative aspect-square group">
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                        <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
            {images.length < maxFiles && (
                <div 
                    onDragEnter={e => handleDragEvents(e, true)}
                    onDragLeave={e => handleDragEvents(e, false)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragging ? 'border-brand-blue bg-teal-50' : 'border-gray-300'}`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input type="file" id="file-upload" multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto w-12 h-12 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                    <p className="mt-2 font-semibold">Trascina le foto qui o clicca per caricarle</p>
                    <p className="text-xs text-gray-500">Aggiungi fino a {maxFiles} foto</p>
                </div>
            )}
        </div>
    );
};

// MARK: Step 1
export const Step1: React.FC<StepProps> = ({ data, updateData }) => {
    const selectedCategory = CATEGORIES.find(c => c.name === data.category);
    
    useEffect(() => {
        // Auto-select first subcategory when category changes
        if (selectedCategory?.subcategories && selectedCategory.subcategories[0] !== data.subcategory) {
            updateData({ subcategory: selectedCategory.subcategories[0] });
        }
    }, [data.category, selectedCategory, data.subcategory, updateData]);

    return (
        <div>
            <Section title="Iniziamo con le basi" subtitle="Fornisci i dettagli essenziali del tuo articolo per attirare i noleggiatori.">
                <div className="space-y-6">
                    <div>
                        <label className="font-semibold">Titolo dell'annuncio</label>
                        <input type="text" value={data.title} onChange={e => updateData({ title: e.target.value })} className="w-full mt-1 p-2 border rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="font-semibold">Categoria</label>
                            <select value={data.category} onChange={e => updateData({ category: e.target.value, subcategory: '' })} className="w-full mt-1 p-2 border rounded-md bg-white">
                                <option value="">Seleziona una categoria</option>
                                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-semibold">Sottocategoria</label>
                            <select value={data.subcategory} onChange={e => updateData({ subcategory: e.target.value })} className="w-full mt-1 p-2 border rounded-md bg-white" disabled={!selectedCategory?.subcategories}>
                                {selectedCategory?.subcategories?.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="font-semibold">Descrizione</label>
                        <textarea value={data.description} onChange={e => updateData({ description: e.target.value })} rows={5} className="w-full mt-1 p-2 border rounded-md"></textarea>
                    </div>
                     <div>
                        <label className="font-semibold">Dove si ritira l'oggetto?</label>
                        <input type="text" value={data.location} onChange={e => updateData({ location: e.target.value })} placeholder="Es. Milano, Italia" className="w-full mt-1 p-2 border rounded-md" />
                    </div>
                </div>
            </Section>
            <Section title="Foto" subtitle="Le buone foto sono fondamentali. Carica immagini chiare e di alta qualità.">
                <ImageUploader images={data.imageUrls || []} onUpload={images => updateData({ imageUrls: images })} maxFiles={5} />
            </Section>
        </div>
    );
};

// MARK: Step 2
export const Step2: React.FC<StepProps> = ({ data, updateData }) => {
    return (
        <div>
             <Section title="Prezzi" subtitle="Stabilisci il costo del noleggio per il tuo articolo. Puoi offrire sconti per noleggi più lunghi.">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="font-semibold">Prezzo giornaliero (€)</label>
                            <input type="number" min="0" value={data.price} onChange={e => updateData({ price: parseFloat(e.target.value) })} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="font-semibold">Deposito cauzionale (€) <span className="text-sm font-normal text-gray-500">(Opzionale)</span></label>
                            <input type="number" min="0" value={data.securityDeposit || ''} onChange={e => updateData({ securityDeposit: parseFloat(e.target.value) })} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="font-semibold">Prezzo settimanale (€) <span className="text-sm font-normal text-gray-500">(Opzionale)</span></label>
                            <input type="number" min="0" value={data.weeklyPrice || ''} onChange={e => updateData({ weeklyPrice: parseFloat(e.target.value) })} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="font-semibold">Prezzo mensile (€) <span className="text-sm font-normal text-gray-500">(Opzionale)</span></label>
                            <input type="number" min="0" value={data.monthlyPrice || ''} onChange={e => updateData({ monthlyPrice: parseFloat(e.target.value) })} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                    </div>
                </div>
             </Section>
              <Section title="Disponibilità" subtitle="Usa il calendario per bloccare le date in cui il tuo articolo non è disponibile per il noleggio.">
                  <p className="text-center text-sm text-gray-500">Il calendario per la disponibilità non è implementato in questa demo.</p>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Z" /></svg>
                  </div>
             </Section>
        </div>
    );
};

// MARK: Step 3
export const Step3: React.FC<StepProps> = ({ data, updateData }) => {
    return (
        <div>
            <Section title="Condizioni e Regole" subtitle="Definisci le regole per il noleggio per garantire un'esperienza sicura e trasparente per tutti.">
                <div className="space-y-6">
                     <div>
                        <label className="font-semibold">Regole di utilizzo</label>
                        <p className="text-sm text-gray-500 mb-2">Aggiungi regole specifiche per il tuo articolo.</p>
                        <textarea value={data.usageRules?.custom as string || ''} onChange={e => updateData({ usageRules: {...data.usageRules, custom: e.target.value} })} rows={4} className="w-full mt-1 p-2 border rounded-md" placeholder="Es. L'attrezzatura deve essere restituita pulita..."></textarea>
                    </div>
                    <div>
                        <label className="font-semibold">Politica di cancellazione</label>
                         <select value={data.cancellationPolicy} onChange={e => updateData({ cancellationPolicy: e.target.value as any })} className="w-full mt-1 p-2 border rounded-md bg-white">
                            <option value="Flessibile">Flessibile: Rimborso completo fino a 24 ore prima del noleggio.</option>
                            <option value="Moderata">Moderata: Rimborso completo fino a 5 giorni prima.</option>
                            <option value="Rigida">Rigida: Rimborso del 50% fino a 7 giorni prima.</option>
                        </select>
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                         <div>
                            <p className="font-semibold">Richiedi documento d'identità al ritiro</p>
                            <p className="text-sm text-gray-500">Consigliato per articoli di valore.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={data.requireId} onChange={e => updateData({ requireId: e.target.checked })} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                        </label>
                    </div>
                    <div className="p-4 border rounded-lg">
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Offri consegna a domicilio?</p>
                                <p className="text-sm text-gray-500">Puoi accordarti su costi e modalità con il noleggiatore.</p>
                            </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={data.deliveryOption?.enabled} onChange={e => updateData({ deliveryOption: { ...data.deliveryOption, enabled: e.target.checked } as any })} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                            </label>
                        </div>
                         {data.deliveryOption?.enabled && (
                            <div className="mt-4">
                                <label className="text-sm font-semibold">Dettagli consegna (opzionale)</label>
                                <input type="text" value={data.deliveryOption.details} onChange={e => updateData({ deliveryOption: { ...data.deliveryOption, details: e.target.value } as any })} placeholder="Es. Consegna gratuita entro 5km" className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                         )}
                    </div>
                </div>
            </Section>
        </div>
    );
};


// MARK: Step 4
export const Step4: React.FC<StepProps> = ({ data, updateData }) => {
    const techSpecs = TECHNICAL_SPECS_BY_CATEGORY[data.category || ''] || [];

    const handleTechSpecChange = (spec: string, value: string) => {
        updateData({
            technicalDescription: {
                ...data.technicalDescription,
                [spec]: value
            }
        });
    };

    return (
        <div>
            <Section title="Foto, Video e Dettagli" subtitle="Mostra il tuo articolo in azione e fornisci tutte le informazioni tecniche.">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Galleria immagini aggiuntiva</h3>
                    <p className="text-sm text-gray-500 mb-4">Aggiungi altre foto da diverse angolazioni (min 3, max 10).</p>
                    <ImageUploader images={data.imageUrls?.slice(5) || []} onUpload={images => updateData({ imageUrls: [...(data.imageUrls?.slice(0,5) || []), ...images] })} maxFiles={10} />
                </div>
            </Section>

            <Section title="Video di presentazione" subtitle="Un breve video (max 100MB) può aumentare significativamente le chance di noleggio.">
                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto w-12 h-12 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>
                    <p className="mt-2 font-semibold">Carica video (non implementato)</p>
                </div>
            </Section>
            
            <Section title="Dettagli avanzati" subtitle="Fornisci specifiche tecniche per i noleggiatori più esigenti.">
                <div className="space-y-4">
                    <div>
                        <label className="font-semibold block mb-2">Condizione dell'oggetto</label>
                        <div className="flex space-x-4">
                             <button onClick={() => updateData({ condition: 'Come nuovo' })} className={`p-4 rounded-lg border w-full text-left ${data.condition === 'Come nuovo' ? 'border-brand-blue bg-teal-50' : ''}`}>Come nuovo</button>
                             <button onClick={() => updateData({ condition: 'Usato' })} className={`p-4 rounded-lg border w-full text-left ${data.condition === 'Usato' ? 'border-brand-blue bg-teal-50' : ''}`}>Usato (in ottime condizioni)</button>
                        </div>
                    </div>
                    {techSpecs.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Specifiche tecniche</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {techSpecs.map(spec => (
                                    <div key={spec}>
                                        <label className="text-sm font-medium">{spec}</label>
                                        <input type="text" value={data.technicalDescription?.[spec] || ''} onChange={e => handleTechSpecChange(spec, e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};

// MARK: Step 5
export const Step5: React.FC<{ data: Partial<Item>; goToStep: (step: number) => void; user: User; }> = ({ data, goToStep, user }) => {
    const owner = { name: `${user.firstName} ${user.lastName}`, photoUrl: user.avatarUrl };
    
    return (
        <div>
            <Section title="Quasi fatto! Ecco l'anteprima" subtitle="Controlla che tutte le informazioni siano corrette prima di pubblicare.">
                <div className="border rounded-xl overflow-hidden">
                    {data.imageUrls && data.imageUrls.length > 0 && (
                        <div className="h-64 bg-cover bg-center" style={{backgroundImage: `url(${data.imageUrls[0]})`}}></div>
                    )}
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                             <h2 className="text-2xl font-bold">{data.title || 'Titolo non definito'}</h2>
                             <button onClick={() => goToStep(1)} className="text-sm font-semibold text-brand-blue underline">Modifica</button>
                        </div>
                        <p className="text-gray-600">{data.location}</p>
                        
                        <div className="mt-6 pt-6 border-t">
                             <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold">Noleggio offerto da {owner.name}</h3>
                                    <p className="text-gray-500">{data.category} / {data.subcategory}</p>
                                </div>
                                <img src={owner.photoUrl} alt={owner.name} className="w-14 h-14 rounded-full" />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold">Descrizione</h3>
                                <button onClick={() => goToStep(1)} className="text-sm font-semibold text-brand-blue underline">Modifica</button>
                            </div>
                            <p className="mt-2 text-gray-700 whitespace-pre-line">{data.description}</p>
                        </div>
                        
                         <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-8">
                             <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold">Prezzo</h3>
                                    <button onClick={() => goToStep(2)} className="text-sm font-semibold text-brand-blue underline">Modifica</button>
                                </div>
                                <p className="text-3xl font-bold mt-2">€{data.price} <span className="text-base font-normal">/ giorno</span></p>
                             </div>
                             <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold">Regole</h3>
                                    <button onClick={() => goToStep(3)} className="text-sm font-semibold text-brand-blue underline">Modifica</button>
                                </div>
                                <ul className="mt-2 text-sm list-disc list-inside">
                                    <li>Cauzione: {data.securityDeposit ? `€${data.securityDeposit}` : 'Non richiesta'}</li>
                                    <li>Cancellazione: {data.cancellationPolicy}</li>
                                    <li>ID richiesto: {data.requireId ? 'Sì' : 'No'}</li>
                                </ul>
                             </div>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};
