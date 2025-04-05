'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchChannelVideos, YouTubeVideo } from '../../lib/YoutubeApi';
import './youtube-animations.css'; // Vi tilføjer animationer via CSS

interface VideoProps {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount?: string;
  channelTitle: string;
}

// Modern VideoCard component with improved UI
interface ExtendedVideoProps extends VideoProps {
  isNew?: boolean;
}

const VideoCard: React.FC<ExtendedVideoProps> = ({ 
  id, 
  title, 
  thumbnail, 
  publishedAt, 
  viewCount, 
  channelTitle,
  isNew = false
}) => {
  // Function to format dates to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format view count with thousands separator
  const formatViewCount = (views?: string) => {
    if (!views) return '';
    return views;
  };

  // Calculate time since published
  const getTimeSince = (dateString: string) => {
    const publishDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today.';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} year(s)`;
  };

  return (
    <div 
      className={`group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-transparent relative card-hover-animation
        ${isNew ? 'animate-slide-in opacity-0' : ''}`}
      style={{
        animationDelay: isNew ? `${Math.random() * 0.3}s` : '0s',
        animationFillMode: 'forwards'
      }}>
      <style jsx>{`
        .card-hover-animation {
          transform: translateY(0) scale(1);
          transition: transform 300ms ease-in-out, 
                      border-color 300ms ease-in-out, 
                      box-shadow 300ms ease-in-out;
          will-change: transform, border-color, box-shadow;
        }
        
        .card-hover-animation:hover {
          transform: translateY(-12px) scale(1.03);
          border-color: rgb(249, 115, 22); /* orange-500 */
          box-shadow: 0 10px 15px rgba(249, 115, 22, 0.4);
        }
      `}</style>
      
      <div className="relative w-full pt-[56.25%] overflow-hidden">
        <Link href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <Image 
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute inset-0 object-cover"
            loading="lazy"
            onLoadingComplete={(image) => {
              image.classList.remove('animate-pulse');
            }}
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md font-medium">
            {/* Duration would go here if available */}
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch now
            </span>
          </div>
        </Link>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <Link href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className="group-hover:text-blue-600 transition-colors duration-200">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">{title}</h3>
        </Link>
        <div className="flex items-center mb-2">
          <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-600 mr-2 overflow-hidden flex-shrink-0">
            {/* Channel icon placeholder - could be actual channel icon */}
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src="grh-logo.png" 
                alt="Channel Icon" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className=" text-sm font-medium">{channelTitle}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          {viewCount && (
            <div className="flex items-center" style={{ color: 'var(--foreground)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{formatViewCount(viewCount)} views</span>
            </div>
          )}
          <div className="flex items-center ml-2" style={{ color: 'var(--foreground)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{getTimeSince(publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// VideoCardSkeleton Component
// VideoCardSkeleton komponent med bredere elementer
const VideoCardSkeleton: React.FC = () => {
  // Definerer shimmer animation style direkte i komponenten (som backup hvis CSS filen ikke virker)
  const shimmerStyle = {
    animation: 'shimmer 2s infinite linear',
    background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
    backgroundSize: '1000px 100%',
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-700 h-full min-h-[400px]" style={{ width: '100%' }}>
      {/* Thumbnail skeleton */}
      <div className="relative w-full pt-[56.25%] bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="absolute inset-0 shimmer" style={shimmerStyle}></div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col space-y-4">
        {/* Title skeleton - to fulde linjer */}
        <div className="space-y-2" style={{ width: '100%' }}>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden" style={{ width: '100%' }}>
            <div className="h-full w-full shimmer" style={shimmerStyle}></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden" style={{ width: '95%' }}>
            <div className="h-full w-full shimmer" style={shimmerStyle}></div>
          </div>
        </div>
        
        {/* Channel info skeleton */}
        <div className="flex items-center" style={{ width: '100%' }}>
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 overflow-hidden flex-shrink-0">
            <div className="h-full w-full shimmer" style={shimmerStyle}></div>
          </div>
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden" style={{ width: '75%' }}>
            <div className="h-full w-full shimmer" style={shimmerStyle}></div>
          </div>
        </div>
        
        {/* Extra space filler */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden" style={{ width: '85%' }}>
          <div className="h-full w-full shimmer" style={shimmerStyle}></div>
        </div>
        
        {/* Video meta info skeleton */}
        <div className="flex items-center justify-between mt-auto pt-4" style={{ width: '100%' }}>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden" style={{ width: '48%' }}>
            <div className="h-full w-full shimmer" style={shimmerStyle}></div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden" style={{ width: '48%' }}>
            <div className="h-full w-full shimmer" style={shimmerStyle}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface YouTubeFeedProps {
  channelId?: string; // Optional for future use with the API
}

const YouTubeFeed: React.FC<YouTubeFeedProps> = ({ channelId }) => {
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Function to fetch the initial videos
  const getInitialVideos = async () => {
    if (!channelId) {
      setError('Intet kanal-ID angivet');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch videos using the updated API function
      const result = await fetchChannelVideos(channelId);
      
      // Update state with fetched videos
      if (result.videos && result.videos.length > 0) {
        setVideos(result.videos);
        // Store the next page token for loading more videos later
        setNextPageToken(result.nextPageToken);
        // If no next page token is returned, there are no more videos to load
        setHasMoreVideos(!!result.nextPageToken);
      } else {
        setError('Ingen videoer fundet');
        setHasMoreVideos(false);
      }
    } catch (err) {
      console.error('Fejl ved hentning af videoer:', err);
      setError('Der opstod en fejl ved hentning af videoer');
    } finally {
      setLoading(false);
    }
  };

  // Function to load more videos
  const loadMoreVideos = async () => {
    if (!channelId || !nextPageToken || loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);
      // Fetch the next page of videos using the nextPageToken
      const result = await fetchChannelVideos(channelId, nextPageToken);
      
      if (result.videos && result.videos.length > 0) {
        // Add a "new" property to identify newly loaded videos for animation
        const newVideos = result.videos.map(video => ({ ...video, isNew: true }));
        
        // Append new videos to the existing list
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
        
        // Remove the "new" flag after animation completes
        setTimeout(() => {
          setVideos(currentVideos => 
            currentVideos.map(video => ({ ...video, isNew: false }))
          );
        }, 1000); // Match this with the animation duration
        
        // Update the next page token
        setNextPageToken(result.nextPageToken);
        // If no next page token is returned, there are no more videos to load
        setHasMoreVideos(!!result.nextPageToken);
      } else {
        // No more videos to load
        setHasMoreVideos(false);
      }
    } catch (err) {
      console.error('Fejl ved indlæsning af flere videoer:', err);
      // Show a temporary error message, but don't reset the videos list
      const tempError = 'Der opstod en fejl ved indlæsning af flere videoer. Prøv igen senere.';
      setError(tempError);
      // Clear the error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoadingMore(false);
    }
  };

  // Function to render skeleton loaders
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <VideoCardSkeleton key={`skeleton-${index}`} />
    ));
  };

  // Initial fetch when component mounts
  useEffect(() => {
    getInitialVideos();
  }, [channelId]);

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {error && !loading ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-800/30 text-red-500 dark:text-red-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">{error}</h3>
            <p className="text-red-600 dark:text-red-300">Kontrollér din API-nøgle og kanal-ID, eller prøv igen senere.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? renderSkeletons() : videos.map((video, index) => (
              <VideoCard 
                key={`${video.id}-${index}`} 
                {...video} 
                isNew={(video as ExtendedVideoProps).isNew}
              />
            ))}
            
            {loadingMore && (
              <>
                {Array(3).fill(0).map((_, index) => (
                  <VideoCardSkeleton key={`more-skeleton-${index}`} />
                ))}
              </>
            )}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-10 text-center">
            {hasMoreVideos ? (
              <button 
                onClick={loadMoreVideos}
                disabled={loadingMore}
                className={`px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 cursor-pointer ${loadingMore ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load more videos'
                )}
              </button>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No more videos to show
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default YouTubeFeed;