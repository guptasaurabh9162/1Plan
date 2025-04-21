import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const BadgeGrid = ({ badges }) => {
  const userBadges = useStore(state => state.badges);
  const points = useStore(state => state.points);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {badges.map((badge, index) => {
        const isUnlocked = userBadges.includes(badge.id);
        const Icon = badge.icon;
        const progress = badge.requirement.type === 'points'
          ? Math.min(100, (points / badge.requirement.value) * 100)
          : 0;

        return (
          <motion.div
            key={badge.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition-all duration-300 ${
              isUnlocked
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isUnlocked ? 'bg-white bg-opacity-20' : 'bg-gray-100'
            }`}>
              <Icon className={`w-8 h-8 transition-all duration-300 ${
                isUnlocked ? 'text-white' : 'text-gray-400'
              }`} />
            </div>

            <h3 className={`font-semibold text-lg mb-2 transition-colors duration-300 ${isUnlocked ? 'text-white' : 'text-gray-800'}`}>
              {badge.name}
            </h3>
            <p className={`text-sm mb-4 ${isUnlocked ? 'text-white/80' : 'text-gray-500'}`}>
              {badge.description}
            </p>

            {!isUnlocked && badge.requirement.type === 'points' && (
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                />
              </div>
            )}

            {!isUnlocked && (
              <p className="mt-3 text-xs text-gray-400 italic">
                {badge.requirement.value - points} more points to unlock
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
