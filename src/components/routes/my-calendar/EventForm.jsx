import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, X, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

function EventForm({ date, onSave, onClose, initialEvent = '' }) {
  const [eventTitle, setEventTitle] = useState(initialEvent.title || '');
  const [startTime, setStartTime] = useState(initialEvent.time ? initialEvent.time.split('-')[0] : '09:00');
  const [endTime, setEndTime] = useState(initialEvent.time ? initialEvent.time.split('-')[1] : '17:00');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setEventTitle(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        toast.error('Speech recognition failed');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      toast.error('Please enter an event description');
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

    if (isListening) {
      recognition.stop();
    } else {
      setEventTitle('');
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Add Event for {date.toLocaleDateString()}
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
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-purple-500 pr-10"
              placeholder="Enter event details..."
              rows={3}
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
              }`}
            >
              <Mic size={20} />
            </button>
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
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-purple-500"
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
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-purple-500"
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
      </div>
    </motion.div>
  );
}

export default EventForm;