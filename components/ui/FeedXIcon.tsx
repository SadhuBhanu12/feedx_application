import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
} from 'react-native-svg';

export type FeedXIconName =
  | 'home'
  | 'gpa-calculator'
  | 'attendance'
  | 'innovation'
  | 'events'
  | 'colleges'
  | 'roadmap'
  | 'resources'
  | 'timetable'
  | 'opportunities'
  | 'internships'
  | 'jobs'
  | 'scholarships'
  | 'community'
  | 'profile'
  | 'notifications'
  | 'search'
  | 'settings'
  | 'grievance'
  | 'quiz'
  | 'daily-challenge'
  | 'streak'
  | 'coins'
  // Roadmap specific
  | 'career-goal'
  | 'skill-assessment'
  | 'skill-gap'
  | 'foundation'
  | 'dsa'
  | 'core-cs'
  | 'web-dev'
  | 'mobile-dev'
  | 'ai-ml'
  | 'cloud-devops'
  | 'projects'
  | 'certification'
  | 'placement'
  | 'job-ready';

import {
  FeedXCategoryColor as CategoryColor,
  FEEDX_COLOR_PALETTE as COLOR_PALETTE,
  FEEDX_ICON_TOKENS,
} from './FeedXIconTokens';

export interface FeedXIconProps {
  name: FeedXIconName;
  size?: number;
  containerSize?: number;
  color?: CategoryColor | string;
  glow?: boolean;
  active?: boolean;
  disabled?: boolean;
  completed?: boolean;
  style?: ViewStyle;
}

const DEFAULT_CATEGORY_MAP: Record<FeedXIconName, CategoryColor> = {
  home: 'green',
  'gpa-calculator': 'green',
  attendance: 'blue',
  innovation: 'orange',
  events: 'pink',
  colleges: 'purple',
  roadmap: 'green',
  resources: 'blue',
  timetable: 'orange',
  opportunities: 'green',
  internships: 'green',
  jobs: 'blue',
  scholarships: 'yellow',
  community: 'purple',
  profile: 'green',
  notifications: 'pink',
  search: 'cyan',
  settings: 'cyan',
  grievance: 'green',
  quiz: 'purple',
  'daily-challenge': 'orange',
  streak: 'orange',
  coins: 'yellow',
  'career-goal': 'green',
  'skill-assessment': 'cyan',
  'skill-gap': 'orange',
  foundation: 'blue',
  dsa: 'purple',
  'core-cs': 'cyan',
  'web-dev': 'green',
  'mobile-dev': 'purple',
  'ai-ml': 'pink',
  'cloud-devops': 'cyan',
  projects: 'yellow',
  certification: 'yellow',
  placement: 'green',
  'job-ready': 'green',
};

export const FeedXIcon: React.FC<FeedXIconProps> = ({
  name,
  size = 32,
  containerSize,
  color,
  glow = true,
  active = false,
  disabled = false,
  completed = false,
  style,
}) => {
  const category = (typeof color === 'string' && COLOR_PALETTE[color as CategoryColor])
    ? (color as CategoryColor)
    : DEFAULT_CATEGORY_MAP[name] || 'green';

  const palette = COLOR_PALETTE[category];
  const primaryColor = completed ? '#10B981' : disabled ? '#475569' : palette.primary;
  const secondaryColor = completed ? '#34D399' : disabled ? '#64748B' : palette.secondary;
  const glowColor = completed ? 'rgba(16, 185, 129, 0.5)' : palette.glow;

  const renderSvgPaths = () => {
    switch (name) {
      case 'home':
        return (
          <G strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 12L12 4L20 12V20C20 20.6 19.6 21 19 21H15C14.4 21 14 20.6 14 20V16C14 15.4 13.6 15 13 15H11C10.4 15 10 15.4 10 16V20C10 20.6 9.6 21 9 21H5C4.4 21 4 20.6 4 20V12Z" stroke="url(#iconGrad)" fill="none" />
          </G>
        );
      case 'roadmap':
      case 'career-goal':
        return (
          <G strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* AI Roadmap: Path leading to flag */}
            <Path d="M4 20C4 20 8 16 12 16C16 16 20 12 20 12" stroke="url(#iconGrad)" fill="none" strokeWidth="2.8" />
            <Path d="M16 12V5M16 5L21 7.5L16 10" stroke={secondaryColor} fill="none" strokeWidth="2" />
            <Circle cx="4" cy="20" r="1.5" fill={primaryColor} />
            <Circle cx="12" cy="16" r="1.5" fill={primaryColor} />
          </G>
        );
      case 'gpa-calculator':
        return (
          <G strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
            {/* GPA Calc: Filled user profile shape */}
            <Circle cx="12" cy="7" r="4.5" fill="url(#iconGrad)" />
            <Path d="M4 19.5C4 15.5 7.5 13.5 12 13.5C16.5 13.5 20 15.5 20 19.5V21H4V19.5Z" fill="url(#iconGrad)" />
          </G>
        );
      case 'attendance':
        return (
          <G strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Attendance: Calendar with checkmark path */}
            <Rect x="4" y="5" width="16" height="15" rx="3" stroke="url(#iconGrad)" fill="none" />
            <Path d="M4 10H20" stroke="url(#iconGrad)" />
            <Path d="M8 3V6M16 3V6" stroke="url(#iconGrad)" />
            <Path d="M9 15L11.5 17L15 13" stroke={secondaryColor} strokeWidth="2.8" fill="none" />
          </G>
        );
      case 'innovation':
      case 'daily-challenge':
        return (
          <G strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
            {/* Innovation Hub: Filled bold lightning bolt */}
            <Path d="M14.5 2L5 13.5H11V22L20.5 10.5H14L14.5 2Z" fill="url(#iconGrad)" />
          </G>
        );
      case 'events':
        return (
          <G strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Events: Calendar with checkmark inside */}
            <Rect x="4" y="5" width="16" height="15" rx="3" stroke="url(#iconGrad)" fill="none" />
            <Path d="M4 10H20" stroke="url(#iconGrad)" />
            <Path d="M8 3V6M16 3V6" stroke="url(#iconGrad)" />
            <Path d="M9 15L11.5 17L15 13" stroke={secondaryColor} strokeWidth="2.8" fill="none" />
          </G>
        );
      case 'colleges':
        return (
          <G strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Colleges: Archway gate structure */}
            <Path d="M4 21V10L12 4L20 10V21M2 21H22" stroke="url(#iconGrad)" fill="none" />
            <Path d="M9 21V14H15V21" stroke={primaryColor} fill="none" />
            <Rect x="11" y="10" width="2" height="2" rx="0.5" fill={secondaryColor} />
          </G>
        );
      case 'resources':
        return (
          <G strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Resources: Single page document */}
            <Path d="M6 2H14L19 7V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V4C5 2.9 5.9 2 7 2Z" fill={glowColor} stroke="url(#iconGrad)" />
            <Path d="M13 2V7H19" stroke={primaryColor} fill="none" />
            <Path d="M8 12H16M8 16H14" stroke={secondaryColor} strokeWidth="2.2" />
          </G>
        );
      case 'timetable':
        return (
          <G strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Timetable: Outline clock */}
            <Circle cx="12" cy="12" r="9" stroke="url(#iconGrad)" fill="none" />
            <Path d="M12 7V12L15 14" stroke={secondaryColor} strokeWidth="2.8" fill="none" />
          </G>
        );
      case 'opportunities':
      case 'internships':
      case 'jobs':
        return (
          <G strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <Rect x="3" y="7" width="18" height="13" rx="3" stroke="url(#iconGrad)" fill="none" />
            <Path d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7" stroke={primaryColor} fill="none" />
            <Path d="M12 12V15M10 13.5L12 15.5L14 13.5" stroke={secondaryColor} />
          </G>
        );
      case 'streak':
        return (
          <G strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 2C12 2 7 6 7 11C7 14.5 9.5 17 12 17C14.5 17 17 14.5 17 11C17 6 12 2 12 2Z" fill="url(#iconGrad)" stroke={primaryColor} />
            <Path d="M12 9C12 9 10 11 10 12.5C10 13.6 10.9 14.5 12 14.5C13.1 14.5 14 13.6 14 12.5C14 11 12 9 12 9Z" fill={secondaryColor} />
          </G>
        );
      case 'coins':
        return (
          <G strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="8" r="5" stroke="url(#iconGrad)" fill={glowColor} />
            <Path d="M6 12C6 14.2 8.7 16 12 16C15.3 16 18 14.2 18 12" stroke={primaryColor} fill="none" />
            <Path d="M6 16C6 18.2 8.7 20 12 20C15.3 20 18 18.2 18 16" stroke={secondaryColor} fill="none" />
          </G>
        );
      default:
        return (
          <G strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="9" stroke="url(#iconGrad)" fill="none" />
            <Path d="M12 8V12M12 16H12.01" stroke={secondaryColor} strokeWidth="2.6" />
          </G>
        );
    }
  };

  const content = (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <SvgLinearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={primaryColor} />
          <Stop offset="100%" stopColor={secondaryColor} />
        </SvgLinearGradient>
        {glow && (
          <Filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <FeGaussianBlur stdDeviation="2" result="blur" />
            <FeMerge>
              <FeMergeNode in="blur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        )}
      </Defs>
      <G filter={glow ? 'url(#neonGlow)' : undefined}>
        {renderSvgPaths()}
      </G>
    </Svg>
  );

  if (containerSize) {
    return (
      <View
        style={[
          styles.container,
          {
            width: containerSize,
            height: containerSize,
            borderRadius: Math.round(containerSize * 0.28),
            backgroundColor: active ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.75)',
            borderColor: active ? primaryColor : 'rgba(255, 255, 255, 0.08)',
            shadowColor: primaryColor,
            shadowOpacity: glow ? 0.35 : 0,
            shadowRadius: glow ? 8 : 0,
            elevation: glow ? 6 : 0,
          },
          style,
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default FeedXIcon;
