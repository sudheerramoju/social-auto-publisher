import React, { useState } from 'react';
import { 
  Share2, 
  Upload, 
  Link, 
  Calendar, 
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [formData, setFormData] = useState({
    caption: '',
    blogUrl: '',
    youtubeUrl: '',
    platforms: {
      facebook: false,
      instagram: false,
      linkedin: false,
      twitter: false,
      youtube: false
    }
  });

  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [wpPosts, setWpPosts] = useState([]);
  const [showWpModal, setShowWpModal] = useState(false);

  const platformIcons = {
    facebook: <Facebook className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />
  };

  const platformColors = {
    facebook: 'bg-blue-600',
    instagram: 'bg-gradient-to-r from-purple-600 to-pink-600',
    linkedin: 'bg-blue-700',
    twitter: 'bg-sky-500',
    youtube: 'bg-red-600'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform]
      }
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const selectedPlatforms = Object.entries(formData.platforms)
        .filter(([_, selected]) => selected)
        .map(([platform]) => platform);

      if (selectedPlatforms.length === 0) {
        alert('Please select at least one platform');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('caption', formData.caption);
      formDataToSend.append('blogUrl', formData.blogUrl);
      formDataToSend.append('youtubeUrl', formData.youtubeUrl);
      formDataToSend.append('platforms', JSON.stringify(selectedPlatforms));
      
      if (mediaFile) {
        formDataToSend.append('media', mediaFile);
      }

      const response = await fetch(`${API_URL}/posts/create`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      setResults(data.results);

    } catch (error) {
      console.error('Error posting:', error);
      alert('Error posting to platforms. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWpPosts = async () => {
    try {
      const wpUrl = prompt('Enter your WordPress site URL:');
      const wpUser = prompt('Enter your WordPress username:');
      const wpPass = prompt('Enter your WordPress application password:');

      if (!wpUrl || !wpUser || !wpPass) return;

      const response = await fetch(
        `${API_URL}/wordpress/posts?siteUrl=${encodeURIComponent(wpUrl)}&username=${encodeURIComponent(wpUser)}&appPassword=${encodeURIComponent(wpPass)}&limit=10`
      );

      const data = await response.json();
      if (data.success) {
        setWpPosts(data.posts);
        setShowWpModal(true);
      }
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      alert('Failed to fetch WordPress posts');
    }
  };

  const importWpPost = (post) => {
    setFormData(prev => ({
      ...prev,
      caption: `${post.title}\n\n${post.excerpt}`,
      blogUrl: post.link
    }));
    setShowWpModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Share2 className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Social Auto Publisher</h1>
            </div>
            <div className="text-sm text-gray-600">
              by <span className="font-semibold text-indigo-600">Visualwits</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Create Your Post
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption / Content *
                  </label>
                  <textarea
                    name="caption"
                    value={formData.caption}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Write your engaging caption here..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.caption.length} characters
                  </p>
                </div>

                {/* Blog URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Link className="w-4 h-4 mr-2" />
                    Blog Post URL
                  </label>
                  <input
                    type="url"
                    name="blogUrl"
                    value={formData.blogUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://yourblog.com/post-title"
                  />
                  <button
                    type="button"
                    onClick={fetchWpPosts}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    📝 Import from WordPress
                  </button>
                </div>

                {/* YouTube URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Youtube className="w-4 h-4 mr-2" />
                    YouTube Video URL (for YouTube posting)
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Media (Image/Video)
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {mediaPreview ? (
                        <div className="relative">
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="mx-auto h-32 w-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setMediaFile(null);
                              setMediaPreview(null);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*,video/*"
                                onChange={handleMediaChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, MP4 up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Publish to Selected Platforms</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Platform Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Select Platforms</h3>
              <div className="space-y-3">
                {Object.entries(platformIcons).map(([platform, icon]) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handlePlatformToggle(platform)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      formData.platforms[platform]
                        ? `${platformColors[platform]} text-white border-transparent`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {icon}
                      <span className="font-medium capitalize">{platform}</span>
                    </div>
                    {formData.platforms[platform] && (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Publishing Results</h3>
                
                {results.success.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Success ({results.success.length})
                    </h4>
                    <div className="space-y-2">
                      {results.success.map((result, idx) => (
                        <div key={idx} className="p-2 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium capitalize">{result.platform}</p>
                          <a
                            href={result.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View post
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.failed.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      Failed ({results.failed.length})
                    </h4>
                    <div className="space-y-2">
                      {results.failed.map((result, idx) => (
                        <div key={idx} className="p-2 bg-red-50 rounded-lg">
                          <p className="text-sm font-medium capitalize">{result.platform}</p>
                          <p className="text-xs text-red-600">{result.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* WordPress Modal */}
      {showWpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Import from WordPress</h3>
                <button
                  onClick={() => setShowWpModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {wpPosts.map((post) => (
                <div
                  key={post.id}
                  className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => importWpPost(post)}
                >
                  <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{post.excerpt.substring(0, 150)}...</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="text-indigo-600 font-medium">Click to import →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
