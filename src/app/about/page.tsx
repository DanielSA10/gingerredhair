"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function About() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Tjek om dark mode allerede er aktiveret ved komponent mount
  useEffect(() => {
    // Tjek om documentElement har dark-mode klassen
    const darkModeActive = document.documentElement.classList.contains('dark-mode');
    setIsDarkMode(darkModeActive);
    
    // Lyt efter ændringer i dark mode fra andre komponenter
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const hasDarkMode = document.documentElement.classList.contains('dark-mode');
          setIsDarkMode(hasDarkMode);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Hjælper til at sikre at DOM'en er opdateret med den korrekte dark mode tilstand
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b ">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
          <div className="md:w-1/2">
            <span className="text-md uppercase tracking-wider text-orange-500 dark:text-orange-400 block font-bold mb-2">About</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-orange-500 dark:text-orange-400">
              Ginger Red Hair
            </h1>
            <p className={`text-lg mb-8 leading-relaxed ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Gingerredhair is a Youtube channel which is famous. The content ranges from funny tier lists to scary ghost investigations, signalizing an amazing VARIATION. Ginger himself is a 23 year old man. <br /><br />In his free time he enjoys thinking about what GENIUS video to create next. He works as a professor of philosophy (not fake).
              Please contact if you have questions or want to say thanks (constructive criticism not allowed and will result in IP-ban)
            </p>
            <a 
              href="mailto:support@gingerredhair.com" 
              className="group relative inline-flex items-center justify-center px-8 pr-14 py-3 overflow-hidden font-medium transition-all bg-orange-500 rounded-full hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
            >
              <span className="absolute right-3 flex items-center justify-start w-8 h-8 duration-300 transform translate-x-full group-hover:translate-x-0 ease overflow-hidden">
                <Image 
                  src="/grh-logo.png"
                  width={20}
                  height={20}
                  alt="GRH Logo"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </span>
              <span className="relative flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                support@gingerredhair.com
              </span>
            </a>
          </div>
          <div className="md:w-1/2 relative aspect-square w-full max-w-md rounded-2xl overflow-hidden ">
            <div className="absolute inset-0 "></div>
            {/* Erstat med dit eget billede */}
            <Image 
              src="/grh-logo.png" 
              alt="Vores team" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Mission Section 
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
            Vores Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vi udforsker konstant nye teknologier og metoder for at holde os foran i en verden, der ændrer sig hurtigt.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Effektivitet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vi tror på at levere resultater af høj kvalitet på den mest effektive måde, uden at gå på kompromis med detaljer.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Samarbejde</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vi arbejder tæt sammen med vores kunder for at sikre, at vores løsninger matcher deres specifikke behov og mål.
              </p>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}