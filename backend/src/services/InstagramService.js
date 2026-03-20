const axios = require('axios');

class InstagramService {
  constructor(accessToken, businessAccountId) {
    this.accessToken = accessToken;
    this.businessAccountId = businessAccountId;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  /**
   * Create Instagram post (2-step process: create container, then publish)
   */
  async createPost(caption, imageUrl, link = null) {
    try {
      // Step 1: Create media container
      const containerUrl = `${this.baseUrl}/${this.businessAccountId}/media`;
      
      const containerParams = {
        access_token: this.accessToken,
        image_url: imageUrl,
        caption: caption
      };

      const containerResponse = await axios.post(containerUrl, null, { 
        params: containerParams 
      });

      const containerId = containerResponse.data.id;

      // Step 2: Publish the container
      const publishUrl = `${this.baseUrl}/${this.businessAccountId}/media_publish`;
      
      const publishResponse = await axios.post(publishUrl, null, {
        params: {
          access_token: this.accessToken,
          creation_id: containerId
        }
      });

      return {
        success: true,
        postId: publishResponse.data.id,
        postUrl: `https://instagram.com/p/${publishResponse.data.id}`
      };
    } catch (error) {
      console.error('Instagram API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to post to Instagram');
    }
  }

  /**
   * Create Instagram carousel post (multiple images)
   */
  async createCarouselPost(caption, imageUrls) {
    try {
      // Step 1: Create containers for each image
      const containerIds = [];
      
      for (const imageUrl of imageUrls) {
        const containerUrl = `${this.baseUrl}/${this.businessAccountId}/media`;
        
        const response = await axios.post(containerUrl, null, {
          params: {
            access_token: this.accessToken,
            image_url: imageUrl,
            is_carousel_item: true
          }
        });
        
        containerIds.push(response.data.id);
      }

      // Step 2: Create carousel container
      const carouselUrl = `${this.baseUrl}/${this.businessAccountId}/media`;
      
      const carouselResponse = await axios.post(carouselUrl, null, {
        params: {
          access_token: this.accessToken,
          media_type: 'CAROUSEL',
          caption: caption,
          children: containerIds.join(',')
        }
      });

      // Step 3: Publish the carousel
      const publishUrl = `${this.baseUrl}/${this.businessAccountId}/media_publish`;
      
      const publishResponse = await axios.post(publishUrl, null, {
        params: {
          access_token: this.accessToken,
          creation_id: carouselResponse.data.id
        }
      });

      return {
        success: true,
        postId: publishResponse.data.id,
        postUrl: `https://instagram.com/p/${publishResponse.data.id}`
      };
    } catch (error) {
      console.error('Instagram Carousel Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Failed to post carousel to Instagram');
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
          metric: 'engagement,impressions,reach,saved'
        }
      });

      const insights = {};
      response.data.data.forEach(metric => {
        insights[metric.name] = metric.values[0].value;
      });

      return insights;
    } catch (error) {
      console.error('Instagram Insights Error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get post engagement (likes, comments)
   */
  async getPostEngagement(postId) {
    try {
      const url = `${this.baseUrl}/${postId}`;
      
      const response = await axios.get(url, {
        params: {
          access_token: this.accessToken,
          fields: 'like_count,comments_count,media_type,media_url'
        }
      });

      return {
        likes: response.data.like_count || 0,
        comments: response.data.comments_count || 0
      };
    } catch (error) {
      console.error('Instagram Engagement Error:', error.response?.data || error.message);
      return { likes: 0, comments: 0 };
    }
  }
}

module.exports = InstagramService;
