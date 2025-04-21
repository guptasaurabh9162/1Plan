import React, { useState } from 'react';
import { Camera, Search, Heart, X, Calendar, Clock, Grid, List, Settings, ChevronDown } from 'lucide-react';
import Masonry from 'react-masonry-css';
import MemoryCard from "@/components/MemoryCard";
import { MediaCard } from "@/components/MediaCard";

const initialFormData = {
  images: [],
  description: '',
  tags: [],
  location: '',
  date: new Date(),
  time: new Date(),
};

// Format relative time (X days ago)
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return 'just now';
};

// Format date nicely
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time nicely
const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const App = () => {
  const [memories, setMemories] = useState([]);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortOption, setSortOption] = useState('newest'); // 'newest', 'oldest', 'favorites'

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleMediaSave = (url, type) => {
    setFormData((prev) => ({
      ...prev,
      [type === 'audio' ? 'audioUrl' : 'videoUrl']: url,
    }));
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    // Preserve the time from the existing date/time value
    const currentDateTime = formData.date;
    newDate.setHours(currentDateTime.getHours(), currentDateTime.getMinutes());
    
    setFormData((prev) => ({
      ...prev,
      date: newDate,
      time: newDate,
    }));
  };

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const newTime = new Date(formData.date);
    newTime.setHours(hours, minutes);
    
    setFormData((prev) => ({
      ...prev,
      time: newTime,
      date: newTime,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = formData.date; // Use the selected date and time
    
    const newMemory = {
      id: Date.now().toString(),
      ...formData,
      timestamp,
      isFavorite: false,
      timeAgo: getTimeAgo(timestamp),
      formattedDate: formatDate(timestamp),
      formattedTime: formatTime(timestamp),
    };
    setMemories((prev) => [newMemory, ...prev]);
    setIsAddingMemory(false);
    setFormData(initialFormData);
  };

  const handleEdit = (id) => {
    const memory = memories.find((m) => m.id === id);
    if (memory) {
      const { images, audioUrl, videoUrl, description, tags, location, timestamp } = memory;
      setFormData({ 
        images, 
        audioUrl, 
        videoUrl, 
        description, 
        tags, 
        location,
        date: timestamp,
        time: timestamp 
      });
      setIsAddingMemory(true);
    }
  };

  const toggleFavorite = (id) => {
    setMemories((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
      )
    );
  };

  // Update timeAgo for all memories periodically
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMemories(prev => 
        prev.map(memory => ({
          ...memory,
          timeAgo: getTimeAgo(memory.timestamp)
        }))
      );
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Filter and sort memories
  const processedMemories = React.useMemo(() => {
    // First filter
    let result = memories.filter((m) => {
      const matches = [m.description, m.location, ...(m.tags || [])].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return showFavoritesOnly ? m.isFavorite && matches : matches;
    });
    
    // Then sort
    switch (sortOption) {
      case 'oldest':
        return result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      case 'favorites':
        return result.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
      case 'newest':
      default:
        return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  }, [memories, searchTerm, showFavoritesOnly, sortOption]);

  // Helper function to get today's date in YYYY-MM-DD format for the date input
  const getTodayDateString = (date) => {
    const d = date || new Date();
    return d.toISOString().split('T')[0];
  };

  // Helper function to get current time in HH:MM format for the time input
  const getCurrentTimeString = (date) => {
    const d = date || new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Determine columns based on view mode
  const masonryColumns = viewMode === 'grid' 
    ? { default: 4, 1600: 3, 1200: 2, 768: 1 }
    : { default: 1 };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-black">
      {/* Top Bar */}
      <header className="bg-black/40 backdrop-blur-md py-4 px-6 border-b border-purple-500/20 sticky top-0 z-30">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-wider">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">MyScrap</span>
            
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddingMemory(true)}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg flex items-center gap-2 text-white transition-all duration-300 shadow-lg shadow-purple-700/30"
            >
              <Camera className="w-5 h-5" /> New Memory
            </button>
            
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1">
        {/* Sidebar - Always visible on desktop, toggleable on mobile */}
        <aside className="hidden md:block w-72 bg-black/30 backdrop-blur-md border-r border-purple-500/20 p-5 sticky top-[72px] h-[calc(100vh-72px)]">
          <div className="flex flex-col h-full">
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search memories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/20 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-50 placeholder-purple-300/50 border border-purple-500/30"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-purple-300 font-medium ml-1">Filter</h3>
                <button
                  onClick={() => setShowFavoritesOnly((prev) => !prev)}
                  className={`w-full px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
                    showFavoritesOnly
                      ? 'bg-purple-600/80 text-white shadow-md shadow-purple-700/30'
                      : 'bg-black/20 text-purple-300 hover:bg-purple-900/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} /> Favorites
                </button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-purple-300 font-medium ml-1">Sort By</h3>
                <div className="bg-black/20 rounded-lg border border-purple-500/30">
                  <button
                    onClick={() => setSortOption('newest')}
                    className={`w-full px-4 py-2 flex items-center justify-between ${
                      sortOption === 'newest' ? 'text-white' : 'text-purple-300'
                    } ${sortOption === 'newest' ? 'border-l-2 border-purple-500' : ''}`}
                  >
                    <span>Newest First</span>
                    {sortOption === 'newest' && <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>}
                  </button>
                  <button
                    onClick={() => setSortOption('oldest')}
                    className={`w-full px-4 py-2 flex items-center justify-between ${
                      sortOption === 'oldest' ? 'text-white' : 'text-purple-300'
                    } ${sortOption === 'oldest' ? 'border-l-2 border-purple-500' : ''}`}
                  >
                    <span>Oldest First</span>
                    {sortOption === 'oldest' && <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>}
                  </button>
                  <button
                    onClick={() => setSortOption('favorites')}
                    className={`w-full px-4 py-2 flex items-center justify-between ${
                      sortOption === 'favorites' ? 'text-white' : 'text-purple-300'
                    } ${sortOption === 'favorites' ? 'border-l-2 border-purple-500' : ''}`}
                  >
                    <span>Favorites First</span>
                    {sortOption === 'favorites' && <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-purple-300 font-medium ml-1">View</h3>
                <div className="flex rounded-lg overflow-hidden bg-black/20 border border-purple-500/30">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 py-2 flex justify-center ${viewMode === 'grid' ? 'bg-purple-600/80 text-white' : 'text-purple-300'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 py-2 flex justify-center ${viewMode === 'list' ? 'bg-purple-600/80 text-white' : 'text-purple-300'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <h3 className="text-white font-medium mb-2">Memory Stats</h3>
                <div className="text-sm text-purple-200">
                  <div className="flex justify-between mb-1">
                    <span>Total Memories</span>
                    <span>{memories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favorites</span>
                    <span>{memories.filter(m => m.isFavorite).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Mobile Search - Only visible on mobile */}
          <div className="block md:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-50 placeholder-purple-300/50 border border-purple-500/30"
              />
            </div>
          </div>
          
          {/* Content Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-white">
              {showFavoritesOnly ? 'Favorite Memories' : 'All Memories'}
              <span className="ml-2 text-sm bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-300">
                {processedMemories.length}
              </span>
            </h2>
            
            {/* Mobile View/Sort Controls */}
            <div className="flex md:hidden items-center gap-2">
              <div className="flex rounded-lg overflow-hidden bg-black/20 border border-purple-500/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600/80 text-white' : 'text-purple-300'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-600/80 text-white' : 'text-purple-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative">
                <button className="flex items-center gap-1 bg-black/20 px-3 py-2 rounded-lg border border-purple-500/30 text-purple-300">
                  <span className="text-sm">Sort</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={() => setShowFavoritesOnly((prev) => !prev)}
                className={`p-2 rounded-lg ${
                  showFavoritesOnly
                    ? 'bg-purple-600/80 text-white'
                    : 'bg-black/20 text-purple-300 border border-purple-500/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Memory Display */}
          {processedMemories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-purple-500/10 p-8 rounded-full mb-4">
                <Camera className="w-12 h-12 text-purple-300 opacity-50" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No memories yet</h3>
              <p className="text-purple-300 max-w-sm mb-6">Start capturing your precious moments by adding your first memory</p>
              <button
                onClick={() => setIsAddingMemory(true)}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg flex items-center gap-2 text-white transition-all duration-300"
              >
                <Camera className="w-5 h-5" /> Create Memory
              </button>
            </div>
          ) : (
            <Masonry
              breakpointCols={masonryColumns}
              className="masonry-grid"
              columnClassName="masonry-grid-column"
            >
              {processedMemories.map((memory) => (
                <div key={memory.id} className={`mb-6 ${viewMode === 'list' ? 'max-w-4xl mx-auto w-full' : ''}`}>
                  <MemoryCard
                    memory={memory}
                    onDelete={(id) => setMemories((prev) => prev.filter((m) => m.id !== id))}
                    onEdit={handleEdit}
                    onToggleFavorite={toggleFavorite}
                    layout={viewMode}
                  />
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </main>

      {/* Add Memory Modal */}
      {isAddingMemory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 max-w-4xl w-full border border-purple-500/30 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Memory</h2>
              <button
                onClick={() => setIsAddingMemory(false)}
                className="text-purple-300 hover:text-white transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MediaCard
                  type="image"
                  onMediaChange={handleImageUpload}
                  preview={formData.images}
                  onRemovePreview={handleRemoveImage}
                />
                <MediaCard
                  type="audio"
                  onMediaSave={(url) => handleMediaSave(url, 'audio')}
                />
                <MediaCard
                  type="video"
                  onMediaSave={(url) => handleMediaSave(url, 'video')}
                />
              </div>

              <div className="space-y-6">
                {/* Date and Time Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block mb-2 text-purple-200 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date
                    </label>
                    <input
                      type="date"
                      value={getTodayDateString(formData.date)}
                      onChange={handleDateChange}
                      className="w-full bg-black/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-50 border border-purple-500/30"
                    />
                  </div>
                  <div className="relative">
                    <label className="block mb-2 text-purple-200 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Time
                    </label>
                    <input
                      type="time"
                      value={getCurrentTimeString(formData.time)}
                      onChange={handleTimeChange}
                      className="w-full bg-black/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-50 border border-purple-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-purple-200">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full bg-black/20 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-50 placeholder-purple-300/50 border border-purple-500/30"
                    placeholder="Write about this memory..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-purple-200">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tags: e.target.value.split(',').map((tag) => tag.trim()),
                      }))
                    }
                    className="w-full bg-black/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-50 placeholder-purple-300/50 border border-purple-500/30"
                    placeholder="family, vacation, summer..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-purple-200">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="w-full bg-black/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-purple-50 placeholder-purple-300/50 border border-purple-500/30"
                    placeholder="Where was this memory created?"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-lg shadow-purple-700/30"
              >
                Save Memory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;