'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchChannelVideos } from '@/lib/YoutubeApi';

const Header = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [randomVideoId, setRandomVideoId] = useState(null);

  // YouTube kanal ID - erstat med den aktuelle kanal ID
  const channelId = 'UCiMT0r5pyrai0DkfYFZCPzA'; // Erstat med den rigtige kanal ID
  
  // Hent video data fra kanalen ved komponent mount
  useEffect(() => {
    const fetchRandomVideo = async () => {
      try {
        const response = await fetchChannelVideos(channelId, undefined, 50); // Hent op til 50 videoer
        if (response.videos && response.videos.length > 0) {
          // Vælg en tilfældig video fra listen
          const randomIndex = Math.floor(Math.random() * response.videos.length);
          setRandomVideoId(response.videos[randomIndex].id);
        }
      } catch (error) {
        console.error('Fejl ved hentning af random video:', error);
      }
    };

    fetchRandomVideo();
  }, [channelId]);

  // Toggle dark mode function med optimeret DOM manipulation
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Brug classList.toggle for bedre ydeevne
    document.documentElement.classList.toggle('dark-mode', newMode);
    
    // Direkte manipulation af Tailwind dark: klasser
    // Dette hjælper med at tvinge en øjeblikkelig opdatering
    const darkElements = document.querySelectorAll('[class*="dark:"]');
    darkElements.forEach(el => {
      el.style.transition = '0s';
      // Genstart rendering for at sikre øjeblikkelig opdatering
      void el.offsetHeight; // Trigger reflow
    });
    
    // Genaktiver transitions efter en minimal forsinkelse
    setTimeout(() => {
      darkElements.forEach(el => {
        el.style.transition = '';
      });
    }, 50);
  };

  // Bestem hvilket billede der skal vises
  const currentImage = isHovering || isDarkMode ? "/hoverImg.png" : "/grh-logo.png";

  // Funktion til at åbne en tilfældig video
  const openRandomVideo = () => {
    if (randomVideoId) {
      window.open(`https://www.youtube.com/watch?v=${randomVideoId}`, '_blank');
    }
  };

  // Funktion til at hente en ny tilfældig video
  const getNewRandomVideo = async () => {
    try {
      const response = await fetchChannelVideos(channelId, undefined, 50);
      if (response.videos && response.videos.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.videos.length);
        setRandomVideoId(response.videos[randomIndex].id);
        window.open(`https://www.youtube.com/watch?v=${response.videos[randomIndex].id}`, '_blank');
      }
    } catch (error) {
      console.error('Fejl ved hentning af ny random video:', error);
    }
  };

  return (
    <header className={`py-4 ${isDarkMode ? 'bg-gray-900 text-white' : ' text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="flex items-center mb-4">
          <Link 
            href="#" 
            className="flex items-center relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={(e) => {
              e.preventDefault(); // Forhindrer navigation
              toggleDarkMode();
            }}
          >
            <div 
              className={`
                relative w-[150px] h-[150px] rounded-full 
                transform transition-all duration-300 ease-in-out
                hover:bg-transparent 
                ${isHovering ? 'scale-105 z-10 bg-transparent' : 'scale-100'}
                ${isDarkMode ? '' : ''}
              `}
            >
              <Image 
                src={currentImage}
                alt="Logo" 
                fill
                sizes="300px"
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>
        
        {/* Navigation menu */}
        <nav className="w-full flex justify-center">
          <ul className="flex flex-wrap justify-center space-x-2 md:space-x-6">
            <li>
              <Link 
                href="/" 
                className={`inline-block py-1.5 px-3 md:py-2 md:px-4 rounded-lg text-base md:text-lg font-medium transition-colors duration-200 cursor-pointer
                  ${isDarkMode 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
                  }`}
              >
                Forside
              </Link>
            </li>
            <li>
              <button 
                onClick={getNewRandomVideo} 
                className={`py-1.5 px-3 md:py-2 md:px-4 rounded-lg text-base md:text-lg font-medium transition-colors duration-200 cursor-pointer
                  ${isDarkMode 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
                  }`}
              >
                Random Video
              </button>
            </li>
            <li>
              <Link 
                href="/about" 
                className={`inline-block py-1.5 px-3 md:py-2 md:px-4 rounded-lg text-base md:text-lg font-medium transition-colors duration-200 cursor-pointer
                  ${isDarkMode 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
                  }`}
              >
                About Me
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;