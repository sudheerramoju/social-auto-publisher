const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class FacebookService {
  constructor(accessToken, pageId) {
    this.accessToken = accessToken;
    this.pageId = pageId;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  /**
   * Post text and image to Facebook Page
   */
  async createPost(message, imageUrl = null, link = null) {
    try {
      const url = `${this.baseUrl}/${this.pageId}/photos`;
      
      const params = {
        access_token: this.accessToken,
        message: message
      };

      if (link) {
        params.link = link;
      }

      if (imageUrl) {
        // If image URL is provided, Facebook will fetch it
        params.url = imageUrl;
      }

      const response = await axios.post(url, null, { params });

      return {
        success: true,
        postId: response.data.id,
        postUrl: `https://facebook.com/${response.data.post_id || response.data.id}`
      };
    } catch (error) {
      console.error('Facebook API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to post to Facebook');
    }
  }

  /**
   * Post video to Facebook Page
   */
  async createVideoPost(message, videoPath) {
    try {
      const url = `${this.baseUrl}/${this.pageId}/videos`;
      
      const formData = new FormData();
      formData.append('access_token', this.accessToken);
      formData.append('description', message);
      formData.append('source', fs.createReadStream(videoPath));

      const response = await axios.post(url, formData, {
        headers: formData.getHeaders()
      });

      return {
        success: true,
        postId: response.data.id,
        postUrl: `https://facebook.com/${this.pageId}/videos/${response.data.id}`
      };
    } catch (error) {
      console.error('Facebook Video API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to post video to Facebook');
    }
  }

  /**
   * Get post insights (analytics)
   */
  async getPostInsights(postId) {
    try {
      const url = `${this.baseUrl}/${postId}/insights`;
      
      const response = await axios.get(url, {
        params: {
          access_token: this.accessToken,
          metric: 'post_impressions,post_engaged_users'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Facebook Insights Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get post engagement (likes, comments, shares)
   */
  async getPostEngagement(postId) {
    try {
      const url = `${this.baseUrl}/${postId}`;
      
      const response = await axios.get(url, {
        params: {
          access_token: this.accessToken,
          fields: 'likes.summary(true),comments.summary(true),shares'
        }
      });

      return {
        likes: response.data.likes?.summary?.total_count || 0,
        comments: response.data.comments?.summary?.total_count || 0,
        shares: response.data.shares?.count || 0
      };
    } catch (error) {
      console.error('Facebook Engagement Error:', error.response?.data || error.message);
      return { likes: 0, comments: 0, shares: 0 };
    }
  }
}

module.exports = FacebookService;
