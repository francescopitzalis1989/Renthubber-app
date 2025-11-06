import { GoogleGenAI, Type } from "@google/genai";
import type { ProjectIdea } from '../types';

export const getProjectIdeas = async (prompt: string): Promise<ProjectIdea[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Sei un pianificatore di progetti creativo che fornisce idee stimolanti per eventi o progetti. In base alla richiesta dell'utente, suggerisci esattamente 3 idee. Per ogni idea, fornisci un nome accattivante per il progetto, una breve descrizione convincente e un elenco delle attrezzature necessarie che potrebbero essere noleggiate. Rispondi sempre in italiano.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              projectName: {
                type: Type.STRING,
                description: 'Il nome del progetto o evento, come "Serata Cinema in Giardino" o "Costruzione Libreria Fai-da-Te".'
              },
              description: {
                type: Type.STRING,
                description: 'Una breve e accattivante descrizione del progetto (2-3 frasi).'
              },
              requiredEquipment: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'Un elenco di attrezzature essenziali necessarie per il progetto, ad es., ["Proiettore", "Schermo", "Altoparlanti"].'
              }
            },
            required: ['projectName', 'description', 'requiredEquipment']
          }
        }
      }
    });
    
    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedResponse)) {
      throw new Error('Formato di risposta non valido dall\'API Gemini.');
    }
    
    return parsedResponse as ProjectIdea[];

  } catch (error) {
    console.error("Errore nel recuperare le idee per i progetti:", error);
    if (error instanceof Error) {
        throw new Error(`Impossibile ottenere idee per progetti: ${error.message}`);
    }
    throw new Error("Si è verificato un errore sconosciuto durante il recupero delle idee per i progetti.");
  }
};
