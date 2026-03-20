const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'none'],
    default: 'none'
  },
  blogUrl: {
    type: String
  },
  youtubeUrl: {
    type: String
  },
  platforms: [{
    name: {
      type: String,
      enum: ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'published', 'failed'],
      default: 'pending'
    },
    postId: String,
    postUrl: String,
    publishedAt: Date,
    error: String
  }],
  scheduledFor: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  analytics: {
    facebook: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      reach: { type: Number, default: 0 }
    },
    instagram: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      reach: { type: Number, default: 0 }
    },
    linkedin: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 }
    },
    twitter: {
      likes: { type: Number, default: 0 },
      retweets: { type: Number, default: 0 },
      replies: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 }
    },
    youtube: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      views: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

const PlatformConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'],
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: String,
  tokenExpiry: Date,
  pageId: String,
  pageName: String,
  accountId: String,
  accountName: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastSync: Date
}, {
  timestamps: true
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  company: String,
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    default: 'free'
  },
  wordpressUrl: String,
  wordpressUsername: String,
  wordpressAppPassword: String
}, {
  timestamps: true
});

module.exports = {
  Post: mongoose.model('Post', PostSchema),
  PlatformConnection: mongoose.model('PlatformConnection', PlatformConnectionSchema),
  User: mongoose.model('User', UserSchema)
};
