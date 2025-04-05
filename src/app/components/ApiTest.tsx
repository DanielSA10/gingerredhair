// src/components/ApiTest.tsx
'use client';

import { useState, useEffect } from 'react';

const ApiTest = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeySet, setIsKeySet] = useState<boolean>(false);
  
  useEffect(() => {
    // Tjek om API nøglen er indstillet i miljøvariablerne
    const key = process.env.YOUTUBE_API_KEY;
    if (key) {
      setApiKey('**********' + key.substring(key.length - 4)); // Vis kun de sidste 4 tegn af sikkerhedsgrunde
      setIsKeySet(true);
    } else {
      setApiKey('Ikke fundet');
      setIsKeySet(false);
    }
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 text-sm">
      <h3 className="font-bold mb-2">YouTube API Status:</h3>
      <p>
        API Nøgle: {apiKey} 
        <span className={`ml-2 px-2 py-1 rounded text-white ${isKeySet ? 'bg-green-500' : 'bg-red-500'}`}>
          {isKeySet ? 'Fundet' : 'Mangler'}
        </span>
      </p>
      {!isKeySet && (
        <div className="mt-3 text-red-600 dark:text-red-400">
          <p>Din YouTube API nøgle er ikke konfigureret korrekt. Kontrollér at:</p>
          <ol className="list-decimal ml-5 mt-1">
            <li>Du har oprettet en .env.local fil i rod-mappen</li>
            <li>Filen indeholder YOUTUBE_API_KEY=din_api_nøgle</li>
            <li>Du har genstartet din Next.js server</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default ApiTest;