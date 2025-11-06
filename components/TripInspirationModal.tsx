import React, { useState, useEffect, useCallback } from 'react';
import { getProjectIdeas } from '../services/geminiService';
import type { ProjectIdea } from '../types';

interface ProjectIdeasModalProps {
  onClose: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-blue"></div>
  </div>
);

const ProjectIdeaCard: React.FC<{ idea: ProjectIdea }> = ({ idea }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-transform hover:scale-105 hover:shadow-lg">
    <h3 className="text-lg font-bold text-brand-blue">{idea.projectName}</h3>
    <p className="text-gray-600 my-2">{idea.description}</p>
    <div>
      <h4 className="text-sm font-semibold text-gray-800">Attrezzatura suggerita:</h4>
      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
        {idea.requiredEquipment.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </div>
  </div>
);


export const ProjectIdeasModal: React.FC<ProjectIdeasModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const results = await getProjectIdeas(prompt);
      setIdeas(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore inaspettato.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Trova Idee per Progetti</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
          <p className="text-gray-600 mb-4">Descrivi il tuo progetto o evento e lascia che Gemini ti suggerisca qualche idea!</p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="es. 'una serata cinema in giardino tra amici'"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Genero...' : 'Genera'}
            </button>
          </div>
          
          <div className="mt-6">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}
            {ideas.length > 0 && (
              <div className="space-y-4">
                {ideas.map((idea, index) => <ProjectIdeaCard key={index} idea={idea} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
