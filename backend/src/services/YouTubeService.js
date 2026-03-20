const axios = require('axios');

class YouTubeService {
  constructor(apiKey, accessToken) {
    this.apiKey = apiKey;
    this.accessToken = accessToken;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  /**
   * Create YouTube Community post
   * Note: YouTube Community posts require specific channel permissions
   */
  async createCommunityPost(text, imageUrl = null) {
    try {
      // Get channel ID first
      const channelResponse = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'id',
          mine: true
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const channelId = channelResponse.data.items[0].id;

      // Create community post (note: this API may have limited availability)
      const postData = {
        snippet: {
          channelId: channelId,
          description: text
        }
      };

      if (imageUrl) {
        postData.snippet.thumbnails = {
          default: {
            url: imageUrl
          }
        };
      }

      const response = await axios.post(
        `${this.baseUrl}/posts`,
        postData,
        {
          params: {
            part: 'snippet'
          },
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        postId: response.data.id,
        postUrl: `https://youtube.com/channel/${channelId}/community`
      };
    } catch (error) {
      console.error('YouTube Community Post Error:', error.response?.data || error.message);
      
      // Fallback: If community posts aren't available, suggest video comment
      throw new Error('YouTube Community posts require specific channel permissions. Consider posting as a video comment or description.');
    }
  }

  /**
   * Add comment to a video (alternative to community post)
   */
  async commentOnVideo(videoId, text) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/commentThreads`,
        {
          snippet: {
            videoId: videoId,
            topLevelComment: {
              snippet: {
                textOriginal: text
              }
            }
          }
        },
        {
          params: {
            part: 'snippet'
          },
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        commentId: response.data.id,
        postUrl: `https://youtube.com/watch?v=${videoId}&lc=${response.data.id}`
      };
    } catch (error) {
      console.error('YouTube Comment Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to comment on YouTube video');
    }
  }

  /**
   * Update video description (to include blog link)
   */
  async updateVideoDescription(videoId, newDescription) {
    try {
      // Get current video details
      const videoResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet',
          id: videoId
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const video = videoResponse.data.items[0];

      // Update description
      const response = await axios.put(
        `${this.baseUrl}/videos`,
        {
          id: videoId,
          snippet: {
            ...video.snippet,
            description: newDescription,
            categoryId: video.snippet.categoryId
          }
        },
        {
          params: {
            part: 'snippet'
          },
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        videoId: videoId,
        postUrl: `https://youtube.com/watch?v=${videoId}`
      };
    } catch (error) {
      console.error('YouTube Update Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to update YouTube video');
    }
  }

  /**
   * Get video statistics
   */
  async getVideoStats(videoId) {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'statistics',
          id: videoId,
          key: this.apiKey
        }
      });

      const stats = response.data.items[0].statistics;

      return {
        views: parseInt(stats.viewCount) || 0,
        likes: parseInt(stats.likeCount) || 0,
        comments: parseInt(stats.commentCount) || 0
      };
    } catch (error) {
      console.error('YouTube Stats Error:', error.response?.data || error.message);
      return { views: 0, likes: 0, comments: 0 };
    }
  }

  /**
   * Get channel info
   */
  async getChannelInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          part: 'snippet,statistics',
          mine: true
        },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      const channel = response.data.items[0];

      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount
      };
    } catch (error) {
      console.error('YouTube Channel Info Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }
}

module.exports = YouTubeService;
