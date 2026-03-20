const axios = require('axios');

class LinkedInService {
  constructor(accessToken, personId) {
    this.accessToken = accessToken;
    this.personId = personId; // LinkedIn URN (e.g., urn:li:person:xxxxx)
    this.baseUrl = 'https://api.linkedin.com/v2';
  }

  /**
   * Create LinkedIn text post
   */
  async createTextPost(text, link = null) {
    try {
      const postData = {
        author: this.personId,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      // Add link if provided
      if (link) {
        postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
          status: 'READY',
          originalUrl: link
        }];
      }

      const response = await axios.post(`${this.baseUrl}/ugcPosts`, postData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      const postId = response.data.id;
      const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

      return {
        success: true,
        postId: postId,
        postUrl: postUrl
      };
    } catch (error) {
      console.error('LinkedIn API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to post to LinkedIn');
    }
  }

  /**
   * Create LinkedIn post with image
   */
  async createImagePost(text, imageUrl) {
    try {
      // Step 1: Register upload
      const registerResponse = await axios.post(
        `${this.baseUrl}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: this.personId,
            serviceRelationships: [{
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerResponse.data.value.asset;

      // Step 2: Upload image
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data);

      await axios.put(uploadUrl, imageBuffer, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream'
        }
      });

      // Step 3: Create post with image
      const postData = {
        author: this.personId,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: 'IMAGE',
            media: [{
              status: 'READY',
              media: asset
            }]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      const response = await axios.post(`${this.baseUrl}/ugcPosts`, postData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      const postId = response.data.id;
      const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

      return {
        success: true,
        postId: postId,
        postUrl: postUrl
      };
    } catch (error) {
      console.error('LinkedIn Image Post Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to post image to LinkedIn');
    }
  }

  /**
   * Get post statistics (likes, comments, shares, impressions)
   */
  async getPostStats(postId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/socialActions/${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      return {
        likes: response.data.likesSummary?.totalLikes || 0,
        comments: response.data.commentsSummary?.totalComments || 0,
        shares: response.data.sharesSummary?.totalShares || 0
      };
    } catch (error) {
      console.error('LinkedIn Stats Error:', error.response?.data || error.message);
      return { likes: 0, comments: 0, shares: 0 };
    }
  }

  /**
   * Get user profile info
   */
  async getUserProfile() {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      return {
        id: response.data.id,
        firstName: response.data.localizedFirstName,
        lastName: response.data.localizedLastName,
        profilePicture: response.data.profilePicture
      };
    } catch (error) {
      console.error('LinkedIn Profile Error:', error.response?.data || error.message);
      return null;
    }
  }
}

module.exports = LinkedInService;
