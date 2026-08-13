import Animated, { FadeInUp } from 'react-native-reanimated';

export default function AnimatedScreen({ children }) {
  return (
    <Animated.View entering={FadeInUp.duration(400)}>
      {children}
    </Animated.View>
  );
}