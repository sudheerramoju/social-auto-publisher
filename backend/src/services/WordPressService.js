const axios = require('axios');

class WordPressService {
  constructor(siteUrl, username, appPassword) {
    this.siteUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash
    this.auth = Buffer.from(`${username}:${appPassword}`).toString('base64');
    this.baseUrl = `${this.siteUrl}/wp-json/wp/v2`;
  }

  /**
   * Get recent posts from WordPress site
   */
  async getRecentPosts(limit = 10) {
    try {
      const response = await axios.get(`${this.baseUrl}/posts`, {
        params: {
          per_page: limit,
          _embed: true, // Include featured media
          orderby: 'date',
          order: 'desc'
        },
        headers: {
          'Authorization': `Basic ${this.auth}`
        }
      });

      return response.data.map(post => ({
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''), // Strip HTML
        content: post.content.rendered,
        link: post.link,
        date: post.date,
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        categories: post._embedded?.['wp:term']?.[0]?.map(cat => cat.name) || [],
        author: post._embedded?.author?.[0]?.name || 'Unknown'
      }));
    } catch (error) {
      console.error('WordPress API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch WordPress posts. Check your credentials and site URL.');
    }
  }

  /**
   * Get a specific post by ID
   */
  async getPost(postId) {
    try {
      const response = await axios.get(`${this.baseUrl}/posts/${postId}`, {
        params: {
          _embed: true
        },
        headers: {
          'Authorization': `Basic ${this.auth}`
        }
      });

      const post = response.data;

      return {
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
        content: post.content.rendered,
        link: post.link,
        date: post.date,
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        categories: post._embedded?.['wp:term']?.[0]?.map(cat => cat.name) || [],
        author: post._embedded?.author?.[0]?.name || 'Unknown'
      };
    } catch (error) {
      console.error('WordPress Post Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch WordPress post.');
    }
  }

  /**
   * Search posts by keyword
   */
  async searchPosts(keyword, limit = 10) {
    try {
      const response = await axios.get(`${this.baseUrl}/posts`, {
        params: {
          search: keyword,
          per_page: limit,
          _embed: true
        },
        headers: {
          'Authorization': `Basic ${this.auth}`
        }
      });

      return response.data.map(post => ({
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
        link: post.link,
        date: post.date,
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
      }));
    } catch (error) {
      console.error('WordPress Search Error:', error.response?.data || error.message);
      throw new Error('Failed to search WordPress posts.');
    }
  }

  /**
   * Get media (images) from WordPress
   */
  async getMedia(limit = 10) {
    try {
      const response = await axios.get(`${this.baseUrl}/media`, {
        params: {
          per_page: limit,
          orderby: 'date',
          order: 'desc'
        },
        headers: {
          'Authorization': `Basic ${this.auth}`
        }
      });

      return response.data.map(media => ({
        id: media.id,
        title: media.title.rendered,
        url: media.source_url,
        mimeType: media.mime_type,
        date: media.date
      }));
    } catch (error) {
      console.error('WordPress Media Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch WordPress media.');
    }
  }

  /**
   * Generate social media caption from WordPress post
   */
  generateCaption(post, maxLength = 280, includeLink = true) {
    // Clean excerpt
    let caption = post.excerpt.trim();
    
    // If excerpt is too long, truncate it
    if (caption.length > maxLength - 30) {
      caption = caption.substring(0, maxLength - 30) + '...';
    }

    // Add link if requested
    if (includeLink) {
      caption += `\n\n🔗 Read more: ${post.link}`;
    }

    // Add hashtags from categories
    if (post.categories && post.categories.length > 0) {
      const hashtags = post.categories
        .slice(0, 3) // Limit to 3 hashtags
        .map(cat => `#${cat.replace(/\s+/g, '')}`)
        .join(' ');
      
      caption += `\n\n${hashtags}`;
    }

    return caption;
  }

  /**
   * Test connection to WordPress site
   */
  async testConnection() {
    try {
      const response = await axios.get(`${this.siteUrl}/wp-json`, {
        headers: {
          'Authorization': `Basic ${this.auth}`
        }
      });

      return {
        success: true,
        siteName: response.data.name,
        description: response.data.description,
        url: response.data.url
      };
    } catch (error) {
      console.error('WordPress Connection Error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Failed to connect to WordPress site. Check your credentials.'
      };
    }
  }
}

module.exports = WordPressService;
