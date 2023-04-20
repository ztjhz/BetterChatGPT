import React, { useEffect, useRef, useState } from 'react';

const useHideOnOutsideClick = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.RefObject<HTMLDivElement>
] => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [showElement, setShowElement] = useState<boolean>(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      elementRef.current &&
      !elementRef.current.contains(event.target as Node)
    ) {
      setShowElement(false);
    }
  };

  useEffect(() => {
    // Bind the event listener only if the element is show.
    if (showElement) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showElement, elementRef]);

  return [showElement, setShowElement, elementRef];
};

export default useHideOnOutsideClick;
