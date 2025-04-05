import React from 'react';
import YouTubeFeed from './components/YouTubeFeed';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-4 md:px-20 text-center">
        <h1 className="text-4xl font-bold mt-6 mb-2">Welcome to the certified Ginger Headquarters</h1>
        <p className="text-xl  mb-4">
          Watch the latest and greatest ginger content below
        </p>
        

        
        {/* YouTube feed component med din brors kanal ID */}
        <YouTubeFeed channelId="UCiMT0r5pyrai0DkfYFZCPzA" />
      </div>
    </div>
  );
}