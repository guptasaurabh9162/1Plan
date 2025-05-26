import React, { useState } from 'react';
import { Trash2, Edit, Heart, Calendar, Clock } from 'lucide-react';

const MemoryCard = ({ memory, onDelete, onEdit, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if there's media content
  const hasImages = memory.images && memory.images.length > 0;
  const hasAudio = memory.audioUrl;
  const hasVideo = memory.videoUrl;

  return (
    <div 
      className="glass-effect rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:neon-glow-subtle"
    >
      {/* Featured Image - Always show the first image if available */}
      {hasImages && (
        <div className="relative">
          <img 
            src={memory.images[0]} 
            alt="Memory" 
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          />
          {memory.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs">
              +{memory.images.length - 1} more
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="p-5">
        {/* Date and Time display - More prominent */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1 rounded-lg">
            <Calendar className="w-4 h-4 text-purple-300" /> 
            <span className="text-purple-200 font-medium">{memory.formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1 rounded-lg">
            <Clock className="w-4 h-4 text-purple-300" /> 
            <span className="text-purple-200 font-medium">{memory.formattedTime}</span>
          </div>
        </div>
        
        {/* Time Ago - Highlighted */}
        <div className="mb-4">
          <span className="text-sm px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 font-medium">
            {memory.timeAgo}
          </span>
        </div>
        
        {/* Description - More prominent */}
        <div className="mb-5">
          <h3 className="text-lg font-medium text-white mb-2">Memory</h3>
          <p className={`text-purple-100 ${isExpanded ? '' : 'line-clamp-4'}`}>
            {memory.description || "No description added"}
          </p>
          {!isExpanded && memory.description && memory.description.length > 150 && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-purple-400 hover:text-purple-300 text-sm mt-2"
            >
              Read more...
            </button>
          )}
          {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-purple-400 hover:text-purple-300 text-sm mt-2"
            >
              Show less
            </button>
          )}
        </div>
        
        {/* Location */}
        {memory.location && (
          <div className="flex items-center gap-2 text-purple-200 mb-4">
            <span className="text-lg">📍</span> {memory.location}
          </div>
        )}
        
        {/* Tags */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {memory.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-3 py-1 rounded-full bg-purple-500/30 text-purple-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Media indicators */}
        <div className="flex gap-2 mb-4">
          {hasAudio && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/30 text-blue-200">
              🎵 Audio
            </span>
          )}
          {hasVideo && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/30 text-green-200">
              🎬 Video
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex justify-between mt-4 pt-3 border-t border-purple-500/20">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(memory.id)}
              className="p-2 rounded-full hover:bg-purple-500/20 text-purple-300 hover:text-purple-100 transition-colors"
              aria-label="Edit memory"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDelete(memory.id)}
              className="p-2 rounded-full hover:bg-red-500/20 text-purple-300 hover:text-red-400 transition-colors"
              aria-label="Delete memory"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => onToggleFavorite(memory.id)}
            className={`p-2 rounded-full transition-colors ${
              memory.isFavorite 
                ? 'text-pink-400 neon-glow-subtle' 
                : 'text-purple-300 hover:text-purple-100'
            }`}
            aria-label={memory.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-5 h-5 ${memory.isFavorite ? 'fill-pink-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;