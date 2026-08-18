import { useCallback, useRef } from 'react';

export function useLongPress(onLongPress, onClick, { delay = 500 } = {}) {
  const timeout = useRef(null);
  const startY = useRef(0);
  const isLongPress = useRef(false);

  const start = useCallback(
    (event) => {
      if (event.touches) {
        startY.current = event.touches[0].clientY;
      }

      isLongPress.current = false;
      timeout.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    () => {
      timeout.current && clearTimeout(timeout.current);
    },
    []
  );
  
  const move = useCallback((event) => {
    if (event.touches) {
      const currentY = event.touches[0].clientY;
      // If user scrolls more than 10px, cancel the long press
      if (Math.abs(currentY - startY.current) > 10) {
        timeout.current && clearTimeout(timeout.current);
      }
    }
  }, []);

  const click = useCallback((event) => {
    if (isLongPress.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (onClick) {
      onClick(event);
    }
  }, [onClick]);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
    onTouchMove: move,
    onClick: click,
  };
}
