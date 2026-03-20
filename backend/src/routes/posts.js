const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import services
const FacebookService = require('../services/FacebookService');
const InstagramService = require('../services/InstagramService');
const LinkedInService = require('../services/LinkedInService');
const TwitterService = require('../services/TwitterService');
const YouTubeService = require('../services/YouTubeService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }, // 10MB default
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

/**
 * POST /api/posts/create
 * Create and publish post to multiple platforms
 */
router.post('/create', upload.single('media'), async (req, res) => {
  try {
    const {
      caption,
      blogUrl,
      youtubeUrl,
      platforms, // Array of platform names: ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube']
      scheduledFor
    } = req.body;

    if (!caption) {
      return res.status(400).json({ error: 'Caption is required' });
    }

    // Get media file if uploaded
    const mediaPath = req.file ? req.file.path : null;
    const mediaUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

    // Parse platforms array
    const selectedPlatforms = JSON.parse(platforms || '[]');

    if (selectedPlatforms.length === 0) {
      return res.status(400).json({ error: 'At least one platform must be selected' });
    }

    const results = {
      success: [],
      failed: []
    };

    // Post to each platform
    for (const platform of selectedPlatforms) {
      try {
        let result;

        switch (platform) {
          case 'facebook':
            const fbService = new FacebookService(
              process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
              process.env.FACEBOOK_PAGE_ID
            );
            
            if (mediaPath) {
              result = await fbService.createPost(caption, mediaUrl, blogUrl);
            } else {
              result = await fbService.createPost(caption, null, blogUrl);
            }
            break;

          case 'instagram':
            if (!mediaUrl) {
              throw new Error('Instagram requires an image');
            }

            const igService = new InstagramService(
              process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
              process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
            );
            
            result = await igService.createPost(caption, mediaUrl);
            break;

          case 'linkedin':
            const liService = new LinkedInService(
              process.env.LINKEDIN_ACCESS_TOKEN,
              process.env.LINKEDIN_PERSON_ID
            );

            if (mediaUrl) {
              result = await liService.createImagePost(caption, mediaUrl);
            } else {
              result = await liService.createTextPost(caption, blogUrl);
            }
            break;

          case 'twitter':
            const twService = new TwitterService(
              process.env.TWITTER_API_KEY,
              process.env.TWITTER_API_SECRET,
              process.env.TWITTER_ACCESS_TOKEN,
              process.env.TWITTER_ACCESS_SECRET
            );

            if (mediaPath) {
              result = await twService.createTweetWithMedia(caption, mediaPath);
            } else {
              // Add blog link to caption for Twitter
              const tweetText = blogUrl ? `${caption}\n\n${blogUrl}` : caption;
              result = await twService.createTweet(tweetText);
            }
            break;

          case 'youtube':
            if (!youtubeUrl) {
              throw new Error('YouTube video URL is required');
            }

            const ytService = new YouTubeService(
              process.env.YOUTUBE_API_KEY,
              process.env.YOUTUBE_ACCESS_TOKEN
            );

            const videoId = ytService.extractVideoId(youtubeUrl);
            if (!videoId) {
              throw new Error('Invalid YouTube URL');
            }

            // Comment on video with caption and blog link
            const commentText = blogUrl ? `${caption}\n\n🔗 ${blogUrl}` : caption;
            result = await ytService.commentOnVideo(videoId, commentText);
            break;

          default:
            throw new Error(`Unsupported platform: ${platform}`);
        }

        results.success.push({
          platform,
          ...result
        });

      } catch (error) {
        console.error(`Error posting to ${platform}:`, error.message);
        results.failed.push({
          platform,
          error: error.message
        });
      }
    }

    // Clean up uploaded file after processing
    if (mediaPath && fs.existsSync(mediaPath)) {
      fs.unlinkSync(mediaPath);
    }

    res.json({
      message: 'Post publishing completed',
      results
    });

  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/posts/schedule
 * Schedule a post for later
 */
router.post('/schedule', upload.single('media'), async (req, res) => {
  try {
    const {
      caption,
      blogUrl,
      youtubeUrl,
      platforms,
      scheduledFor
    } = req.body;

    if (!caption || !scheduledFor) {
      return res.status(400).json({ error: 'Caption and scheduled time are required' });
    }

    // Store in database for scheduled execution
    // This would integrate with node-cron for execution

    res.json({
      message: 'Post scheduled successfully',
      scheduledFor: new Date(scheduledFor)
    });

  } catch (error) {
    console.error('Post scheduling error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/posts/history
 * Get post history
 */
router.get('/history', async (req, res) => {
  try {
    // Retrieve posts from database
    // This is a placeholder - integrate with actual database

    res.json({
      posts: []
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
