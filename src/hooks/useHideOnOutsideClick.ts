import React, { useEffect, useRef, useState } from 'react';

const useHideOnOutsideClick = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.RefObject<HTMLElement>
] => {
  const elementRef = useRef<HTMLElement>(null);
  const [showElement, setShowElement] = useState<boolean>(false);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      elementRef.current &&
      event.target instanceof Node &&
      !elementRef.current.contains(event.target)
    ) {
      setShowElement(false);
    }
  };

  useEffect(() => {
    // Bind the event listener only if the element is show.
    if (showElement) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showElement, elementRef]);

  return [showElement, setShowElement, elementRef];
};

export default useHideOnOutsideClick;
