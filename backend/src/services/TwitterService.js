const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');

class TwitterService {
  constructor(apiKey, apiSecret, accessToken, accessSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.accessToken = accessToken;
    this.accessSecret = accessSecret;
    this.baseUrl = 'https://api.twitter.com/2';
    this.uploadUrl = 'https://upload.twitter.com/1.1';
  }

  /**
   * Generate OAuth 1.0a signature for Twitter API
   */
  generateOAuthHeader(method, url, params = {}) {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(32).toString('base64').replace(/\W/g, '');

    const oauthParams = {
      oauth_consumer_key: this.apiKey,
      oauth_token: this.accessToken,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: '1.0',
      ...params
    };

    // Create signature base string
    const sortedParams = Object.keys(oauthParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
      .join('&');

    const signatureBase = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(this.apiSecret)}&${encodeURIComponent(this.accessSecret)}`;
    const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');

    oauthParams.oauth_signature = signature;

    // Create authorization header
    const authHeader = 'OAuth ' + Object.keys(oauthParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
      .join(', ');

    return authHeader;
  }

  /**
   * Create a text tweet
   */
  async createTweet(text) {
    try {
      const url = `${this.baseUrl}/tweets`;
      
      const response = await axios.post(
        url,
        { text: text },
        {
          headers: {
            'Authorization': this.generateOAuthHeader('POST', url),
            'Content-Type': 'application/json'
          }
        }
      );

      const tweetId = response.data.data.id;
      const tweetUrl = `https://twitter.com/i/web/status/${tweetId}`;

      return {
        success: true,
        postId: tweetId,
        postUrl: tweetUrl
      };
    } catch (error) {
      console.error('Twitter API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to post tweet');
    }
  }

  /**
   * Upload media (image/video) to Twitter
   */
  async uploadMedia(mediaPath, mediaType = 'image') {
    try {
      const url = `${this.uploadUrl}/media/upload.json`;
      const mediaData = fs.readFileSync(mediaPath);
      const mediaSize = mediaData.length;

      // Initialize upload
      const initResponse = await axios.post(
        url,
        null,
        {
          params: {
            command: 'INIT',
            total_bytes: mediaSize,
            media_type: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
            media_category: mediaType === 'video' ? 'tweet_video' : 'tweet_image'
          },
          headers: {
            'Authorization': this.generateOAuthHeader('POST', url, {
              command: 'INIT',
              total_bytes: mediaSize.toString()
            })
          }
        }
      );

      const mediaId = initResponse.data.media_id_string;

      // Upload media in chunks
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      let segmentIndex = 0;

      for (let i = 0; i < mediaSize; i += chunkSize) {
        const chunk = mediaData.slice(i, Math.min(i + chunkSize, mediaSize));
        const formData = new FormData();
        formData.append('command', 'APPEND');
        formData.append('media_id', mediaId);
        formData.append('segment_index', segmentIndex);
        formData.append('media', chunk);

        await axios.post(url, formData, {
          headers: {
            ...formData.getHeaders(),
            'Authorization': this.generateOAuthHeader('POST', url, {
              command: 'APPEND',
              media_id: mediaId,
              segment_index: segmentIndex.toString()
            })
          }
        });

        segmentIndex++;
      }

      // Finalize upload
      await axios.post(
        url,
        null,
        {
          params: {
            command: 'FINALIZE',
            media_id: mediaId
          },
          headers: {
            'Authorization': this.generateOAuthHeader('POST', url, {
              command: 'FINALIZE',
              media_id: mediaId
            })
          }
        }
      );

      return mediaId;
    } catch (error) {
      console.error('Twitter Media Upload Error:', error.response?.data || error.message);
      throw new Error('Failed to upload media to Twitter');
    }
  }

  /**
   * Create tweet with media
   */
  async createTweetWithMedia(text, mediaPath, mediaType = 'image') {
    try {
      // Upload media first
      const mediaId = await this.uploadMedia(mediaPath, mediaType);

      // Create tweet with media
      const url = `${this.baseUrl}/tweets`;
      
      const response = await axios.post(
        url,
        {
          text: text,
          media: {
            media_ids: [mediaId]
          }
        },
        {
          headers: {
            'Authorization': this.generateOAuthHeader('POST', url),
            'Content-Type': 'application/json'
          }
        }
      );

      const tweetId = response.data.data.id;
      const tweetUrl = `https://twitter.com/i/web/status/${tweetId}`;

      return {
        success: true,
        postId: tweetId,
        postUrl: tweetUrl
      };
    } catch (error) {
      console.error('Twitter Media Tweet Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to post tweet with media');
    }
  }

  /**
   * Get tweet metrics (likes, retweets, replies)
   */
  async getTweetMetrics(tweetId) {
    try {
      const url = `${this.baseUrl}/tweets/${tweetId}`;
      
      const response = await axios.get(url, {
        params: {
          'tweet.fields': 'public_metrics'
        },
        headers: {
          'Authorization': this.generateOAuthHeader('GET', url)
        }
      });

      const metrics = response.data.data.public_metrics;

      return {
        likes: metrics.like_count || 0,
        retweets: metrics.retweet_count || 0,
        replies: metrics.reply_count || 0,
        impressions: metrics.impression_count || 0
      };
    } catch (error) {
      console.error('Twitter Metrics Error:', error.response?.data || error.message);
      return { likes: 0, retweets: 0, replies: 0, impressions: 0 };
    }
  }
}

module.exports = TwitterService;
