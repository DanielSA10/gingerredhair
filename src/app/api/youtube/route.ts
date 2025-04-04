// src/app/api/youtube/route.ts
import { NextRequest, NextResponse } from 'next/server';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount?: string;
  channelTitle: string;
}

export interface YouTubeApiResponse {
  videos: YouTubeVideo[];
  nextPageToken: string | null;
}

/**
 * Format view count to a human-readable string
 * @param count View count as a number
 * @returns Formatted view count (e.g., "1.2K", "3.5M")
 */
function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return count.toString();
  }
}

// App Router bruger HTTP metode-funktioner i stedet for handler
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channelId = searchParams.get('channelId');
  const pageToken = searchParams.get('pageToken') || undefined;
  const maxResults = parseInt(searchParams.get('maxResults') || '6');

  if (!channelId) {
    return NextResponse.json(
      { error: 'Channel ID is required', videos: [], nextPageToken: null },
      { status: 400 }
    );
  }

  try {
    // Step 1: Get the uploads playlist ID for the channel
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`
    );
    
    if (!channelResponse.ok) {
      throw new Error('Failed to fetch channel information');
    }
    
    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    
    if (!uploadsPlaylistId) {
      throw new Error('Cannot find uploads playlist');
    }
    
    // Step 2: Get videos from the uploads playlist, with pagination
    let playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${uploadsPlaylistId}&key=${process.env.YOUTUBE_API_KEY}`;
    
    // Add pageToken if provided
    if (pageToken) {
      playlistUrl += `&pageToken=${pageToken}`;
    }
    
    const playlistResponse = await fetch(playlistUrl);
    
    if (!playlistResponse.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    const playlistData = await playlistResponse.json();
    
    // Step 3: Get video IDs to fetch additional details (view counts, etc.)
    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`
    );
    
    if (!videosResponse.ok) {
      throw new Error('Failed to fetch video statistics');
    }
    
    const videosData = await videosResponse.json();
    
    // Create a map for statistics to handle possible mismatches in order
    const statsMap = new Map();
    videosData.items.forEach((item: any) => {
      statsMap.set(item.id, item.statistics);
    });
    
    // Step 4: Map the data to our interface format
    const videos = playlistData.items.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      const statistics = statsMap.get(videoId);
      
      return {
        id: videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: statistics?.viewCount ? formatViewCount(parseInt(statistics.viewCount)) : undefined,
        channelTitle: item.snippet.channelTitle
      };
    });
    
    return NextResponse.json({
      videos,
      nextPageToken: playlistData.nextPageToken || null
    });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch YouTube data',
      videos: [],
      nextPageToken: null 
    }, { status: 500 });
  }
}