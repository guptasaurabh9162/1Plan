import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Mic, Video, Square, Loader } from 'lucide-react';

export const MediaRecorder = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaType, setMediaType] = useState('audio');

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: mediaType === 'video',
    audio: true,
    onStop: (blobUrl) => {
      onSave(blobUrl, mediaType);
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
    <div className="flex flex-col items-start gap-4 bg-gray-900 p-6 rounded-xl shadow-lg text-white w-full max-w-lg mx-auto">
      {/* Media Type Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setMediaType('audio')}
          className={`p-2 rounded-lg transition duration-300 ${
            mediaType === 'audio' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMediaType('video')}
          className={`p-2 rounded-lg transition duration-300 ${
            mediaType === 'video' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Video className="w-5 h-5" />
        </button>
      </div>

      {/* Recording Control Button */}
      {status === 'recording' ? (
        <button
          onClick={handleStopRecording}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Square className="w-4 h-4" />
          Stop Recording
        </button>
      ) : status === 'acquiring_media' ? (
        <button
          disabled
          className="flex items-center gap-2 bg-gray-600 text-gray-300 px-4 py-2 rounded-lg"
        >
          <Loader className="w-4 h-4 animate-spin" />
          Preparing...
        </button>
      ) : (
        <button
          onClick={handleStartRecording}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          {mediaType === 'audio' ? <Mic className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          Start Recording
        </button>
      )}

      {/* Media Preview */}
      {mediaBlobUrl && (
        <div className="mt-4 w-full">
          {mediaType === 'audio' ? (
            <audio controls src={mediaBlobUrl} className="w-full" />
          ) : (
            <video controls src={mediaBlobUrl} className="w-full rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
};
