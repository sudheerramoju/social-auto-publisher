const express = require('express');
const router = express.Router();
const WordPressService = require('../services/WordPressService');

/**
 * POST /api/wordpress/connect
 * Test WordPress connection
 */
router.post('/connect', async (req, res) => {
  try {
    const { siteUrl, username, appPassword } = req.body;

    if (!siteUrl || !username || !appPassword) {
      return res.status(400).json({ 
        error: 'Site URL, username, and application password are required' 
      });
    }

    const wpService = new WordPressService(siteUrl, username, appPassword);
    const result = await wpService.testConnection();

    if (result.success) {
      res.json({
        success: true,
        message: 'Connected to WordPress successfully',
        site: {
          name: result.siteName,
          description: result.description,
          url: result.url
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('WordPress connection error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/wordpress/posts
 * Get recent posts from WordPress
 */
router.get('/posts', async (req, res) => {
  try {
    const { siteUrl, username, appPassword, limit = 10 } = req.query;

    if (!siteUrl || !username || !appPassword) {
      return res.status(400).json({ 
        error: 'Site URL, username, and application password are required' 
      });
    }

    const wpService = new WordPressService(siteUrl, username, appPassword);
    const posts = await wpService.getRecentPosts(parseInt(limit));

    res.json({
      success: true,
      count: posts.length,
      posts
    });

  } catch (error) {
    console.error('WordPress posts error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/wordpress/post/:id
 * Get specific post from WordPress
 */
router.get('/post/:id', async (req, res) => {
  try {
    const { siteUrl, username, appPassword } = req.query;
    const { id } = req.params;

    if (!siteUrl || !username || !appPassword) {
      return res.status(400).json({ 
        error: 'Site URL, username, and application password are required' 
      });
    }

    const wpService = new WordPressService(siteUrl, username, appPassword);
    const post = await wpService.getPost(id);

    res.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('WordPress post error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/wordpress/generate-caption
 * Generate social media caption from WordPress post
 */
router.post('/generate-caption', async (req, res) => {
  try {
    const { post, platform, maxLength } = req.body;

    if (!post) {
      return res.status(400).json({ error: 'Post data is required' });
    }

    const wpService = new WordPressService('', '', ''); // No credentials needed for caption generation
    
    // Adjust max length based on platform
    let length = maxLength || 280;
    if (platform === 'instagram') length = 2200;
    if (platform === 'linkedin') length = 3000;
    if (platform === 'facebook') length = 63206;

    const caption = wpService.generateCaption(post, length, true);

    res.json({
      success: true,
      caption,
      platform
    });

  } catch (error) {
    console.error('Caption generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/wordpress/search
 * Search WordPress posts
 */
router.get('/search', async (req, res) => {
  try {
    const { siteUrl, username, appPassword, keyword, limit = 10 } = req.query;

    if (!siteUrl || !username || !appPassword || !keyword) {
      return res.status(400).json({ 
        error: 'Site URL, username, application password, and keyword are required' 
      });
    }

    const wpService = new WordPressService(siteUrl, username, appPassword);
    const posts = await wpService.searchPosts(keyword, parseInt(limit));

    res.json({
      success: true,
      count: posts.length,
      keyword,
      posts
    });

  } catch (error) {
    console.error('WordPress search error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
