import { useRef, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

const scrollRegistry: Record<string, number> = {};

export function useScrollRestoration(screenKey: string) {
  const listRef = useRef<any>(null);
  const isFocused = useIsFocused();

  const handleScroll = (event: any) => {
    const y = event?.nativeEvent?.contentOffset?.y;
    if (typeof y === 'number' && !isNaN(y)) {
      scrollRegistry[screenKey] = y;
    }
  };

  useEffect(() => {
    if (isFocused && listRef.current) {
      const savedOffset = scrollRegistry[screenKey];
      if (savedOffset && savedOffset > 0) {
        const timer = setTimeout(() => {
          if (listRef.current?.scrollToOffset) {
            listRef.current.scrollToOffset({ offset: savedOffset, animated: false });
          } else if (listRef.current?.scrollTo) {
            listRef.current.scrollTo({ y: savedOffset, animated: false });
          }
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [isFocused]);

  return { listRef, handleScroll };
}
