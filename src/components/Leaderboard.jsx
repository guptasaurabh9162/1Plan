import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal } from 'lucide-react';

const Leaderboard = ({ users, darkMode }) => {
  // Get the medal based on rank
  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl p-6 shadow-xl transition-colors duration-300`}
    >
      <h2 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Leaderboard</h2>
      
      <div className="space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-4 rounded-lg ${
              user.name === 'You' 
                ? darkMode
                  ? 'bg-purple-900 bg-opacity-40 border border-purple-500'
                  : 'bg-purple-100 border border-purple-300'
                : darkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full">
              {getMedalIcon(user.rank) || (
                <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user.rank}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <p className={`font-semibold ${
                user.name === 'You'
                  ? darkMode ? 'text-purple-300' : 'text-purple-700'
                  : ''
              }`}>
                {user.name}
                {user.name === 'You' && 
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-purple-500 text-white">You</span>
                }
              </p>
            </div>
            
            <div className={`text-right font-bold ${
              darkMode ? 'text-purple-200' : 'text-purple-700'
            }`}>
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {user.points} pts
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 text-center text-sm opacity-70">
        <p>Keep exploring more places to climb up the ranks!</p>
      </div>
    </motion.div>
  );
};

export default Leaderboard;