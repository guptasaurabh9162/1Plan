import React, { useState } from 'react';
import { Camera, Mic, Video, Upload, X } from 'lucide-react';
import { useReactMediaRecorder } from 'react-media-recorder';

export const MediaCard = ({
  type,
  onMediaChange,
  onMediaSave,
  preview,
  onRemovePreview,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'image':
        return <Camera className="w-8 h-8" />;
      case 'audio':
        return <Mic className="w-8 h-8" />;
      case 'video':
        return <Video className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'image':
        return 'Upload Photos';
      case 'audio':
        return 'Record Audio';
      case 'video':
        return 'Record Video';
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'image':
        return 'Share your visual memories';
      case 'audio':
        return 'Capture the sounds of the moment';
      case 'video':
        return 'Create video memories';
      default:
        return '';
    }
  };

  return (
    <div className="media-card-hover glass-effect rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-purple-600/80 backdrop-blur rounded-lg text-white floating-effect">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{getTitle()}</h3>
          <p className="text-purple-200/70">{getDescription()}</p>
        </div>
      </div>

      {type === 'image' ? (
        <div className="space-y-4">
          <label className="block w-full">
            <div className="relative group cursor-pointer overflow-hidden">
              <div className="w-full h-32 border-2 border-dashed border-purple-400/30 rounded-lg flex items-center justify-center bg-purple-900/20 group-hover:bg-purple-800/30 transition-all duration-500">
                <div className="text-center transform group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-purple-300 group-hover:text-purple-400" />
                  <span className="text-sm text-purple-300 group-hover:text-purple-400">Click to upload photos</span>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onMediaChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </label>

          {preview?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {preview.map((img, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button
                    type="button"
                    onClick={() => onRemovePreview?.(index)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 transform hover:scale-110"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <MediaRecorderButton type={type} onSave={(url) => onMediaSave?.(url, type)} />
        </div>
      )}
    </div>
  );
};

const MediaRecorderButton = ({ type, onSave }) => {
  const [isRecording, setIsRecording] = useState(false);

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: type === 'video',
    audio: true,
    onStop: (blobUrl) => {
      onSave(blobUrl);
      setIsRecording(false);
    },
  });

  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  return (
    <div className="space-y-4">
      {status === 'recording' ? (
        <button
          type="button"
          onClick={handleStopRecording}
          className="relative w-full py-3 px-4 bg-red-500/80 backdrop-blur text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 recording-pulse"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Stop Recording
        </button>
      ) : (
        <button
          type="button"
          onClick={handleStartRecording}
          disabled={status === 'acquiring_media'}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            status === 'acquiring_media'
              ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600/80 backdrop-blur hover:bg-purple-700/80 text-white transform hover:scale-105'
          }`}
        >
          {status === 'acquiring_media' ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              {type === 'audio' ? <Mic className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              Start Recording
            </>
          )}
        </button>
      )}

      {mediaBlobUrl && (
        <div className="glass-effect rounded-lg p-2 transform transition-all duration-300 hover:scale-[1.02]">
          {type === 'audio' ? (
            <audio src={mediaBlobUrl} controls className="w-full" />
          ) : (
            <video src={mediaBlobUrl} controls className="w-full rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
};
