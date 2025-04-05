// src/lib/YoutubeApi.ts

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
  error?: string;
}

/**
 * Fetches videos from a YouTube channel using our secure API proxy
 * @param channelId The ID of the YouTube channel
 * @param pageToken Optional token for pagination
 * @param maxResults Maximum number of results to return (default: 6)
 * @returns Object containing videos array and nextPageToken
 */
export async function fetchChannelVideos(
  channelId: string, 
  pageToken?: string,
  maxResults: number = 9
): Promise<YouTubeApiResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      channelId,
      maxResults: maxResults.toString()
    });
    
    if (pageToken) {
      params.append('pageToken', pageToken);
    }
    
    // Call our secure API endpoint
    const response = await fetch(`/api/youtube?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch videos from API');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return {
      videos: [],
      nextPageToken: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}