import { Award, Ghost, Trees as Tree, Coffee, Compass, Crown, Star, Medal, Trophy } from 'lucide-react';

export const badges = [
  {
    id: 'explorer-1',
    name: 'Novice Explorer',
    description: 'Visit 5 different places',
    icon: Award,
    requirement: {
      type: 'visits',
      value: 5
    }
  },
  {
    id: 'ghost-hunter',
    name: 'Ghost Hunter',
    description: 'Visit 3 haunted places',
    icon: Ghost,
    requirement: {
      type: 'category',
      value: 3,
      category: 'haunted'
    }
  },
  {
    id: 'bronze-explorer',
    name: 'Bronze Explorer',
    description: 'Earn 500 points',
    icon: Medal,
    requirement: {
      type: 'points',
      value: 500
    }
  },
  {
    id: 'silver-explorer',
    name: 'Silver Explorer',
    description: 'Earn 1000 points',
    icon: Trophy,
    requirement: {
      type: 'points',
      value: 1000
    }
  },
  {
    id: 'gold-explorer',
    name: 'Gold Explorer',
    description: 'Earn 2000 points',
    icon: Crown,
    requirement: {
      type: 'points',
      value: 2000
    }
  },
  {
    id: 'platinum-explorer',
    name: 'Platinum Explorer',
    description: 'Earn 5000 points',
    icon: Star,
    requirement: {
      type: 'points',
      value: 5000
    }
  },
  {
    id: 'diamond-explorer',
    name: 'Diamond Explorer',
    description: 'Earn 10000 points',
    icon: Compass,
    requirement: {
      type: 'points',
      value: 10000
    }
  }
];
