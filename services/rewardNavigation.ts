export interface RewardDestination {
  activityType: string;
  title: string;
  route: string;
  buttonLabel: string;
  icon: string;
}

const REWARD_DESTINATIONS: Record<string, RewardDestination> = {
  resource_read: {
    activityType: 'resource_read',
    title: 'Resource Read Completed',
    route: '/(tabs)/academics',
    buttonLabel: 'Go to Resources',
    icon: 'book-open',
  },
  quiz_completed: {
    activityType: 'quiz_completed',
    title: 'Daily Quiz Master',
    route: '/daily-quiz-result',
    buttonLabel: 'View Quiz Results',
    icon: 'award',
  },
  innovation_submitted: {
    activityType: 'innovation_submitted',
    title: 'Innovation Idea Submitted',
    route: '/innovation',
    buttonLabel: 'Go to Innovation Hub',
    icon: 'lightbulb',
  },
  community_answer: {
    activityType: 'community_answer',
    title: 'Community Contribution',
    route: '/(tabs)/community',
    buttonLabel: 'Go to Community',
    icon: 'message-circle',
  },
  event_participation: {
    activityType: 'event_participation',
    title: 'Event Participation',
    route: '/(tabs)/events',
    buttonLabel: 'Go to Events',
    icon: 'calendar',
  },
  profile_completion: {
    activityType: 'profile_completion',
    title: 'Profile Setup Completed',
    route: '/(tabs)/user_profile',
    buttonLabel: 'Go to Profile',
    icon: 'user',
  },
  daily_login: {
    activityType: 'daily_login',
    title: 'Daily Login Reward',
    route: '/rewards',
    buttonLabel: 'View Coin Wallet',
    icon: 'coins',
  },
};

export function getRewardDestination(activityType: string): RewardDestination {
  return (
    REWARD_DESTINATIONS[activityType] || {
      activityType,
      title: 'Activity Completed',
      route: '/rewards',
      buttonLabel: 'View Coin Wallet',
      icon: 'gift',
    }
  );
}
