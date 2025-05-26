import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, X, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

function EventForm({ date, onSave, onClose, initialEvent = '' }) {
  const [eventTitle, setEventTitle] = useState(initialEvent.title || '');
  const [startTime, setStartTime] = useState(initialEvent.time ? initialEvent.time.split('-')[0] : '09:00');
  const [endTime, setEndTime] = useState(initialEvent.time ? initialEvent.time.split('-')[1] : '17:00');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const micRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setEventTitle(transcript);
        setIsListening(false);
        toast.success('Voice input captured!');
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
    
    // Cleanup
    return () => {
      if (recognition) {
        recognition.onend = null;
        recognition.abort();
      }
    };
  }, []);

  // Start or stop listening when isListening changes
  useEffect(() => {
    if (recognition) {
      if (isListening) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Recognition start error:', error);
        }
      } else {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Recognition stop error:', error);
        }
      }
    }
  }, [isListening, recognition]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      toast.error('Please enter an event description');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be later than start time');
      return;
    }

    const timeRange = `${startTime}-${endTime}`;
    const isFullDay = startTime === '09:00' && endTime === '17:00';

    onSave({
      title: eventTitle.trim(),
      time: timeRange,
      type: isFullDay ? 'busy' : 'partial'
    });
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(!isListening);
    
    if (!isListening) {
      toast.success('Listening... Speak now');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800/90 backdrop-blur-lg rounded-xl p-6 w-full max-w-md border border-purple-500/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-purple-300">
            Add Event for {date.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700/80 border border-gray-600/80 text-white focus:outline-none focus:border-purple-500 pr-10"
              placeholder="Enter event details..."
              rows={3}
            />
            <motion.button
              ref={micRef}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleVoiceInput}
              className={`absolute right-2 top-2 p-2 rounded-full transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
              }`}
            >
              <Mic size={20} />
            </motion.button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700/80 border border-gray-600/80 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700/80 border border-gray-600/80 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors"
            >
              Save Event
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default EventForm;