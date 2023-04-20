import React from 'react';

export const hideOnClickOutside = (elementRef: React.RefObject<HTMLElement>, showElement: boolean, setShowElement: React.Dispatch<React.SetStateAction<boolean>>) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      elementRef.current &&
      !elementRef.current.contains(event.target as Node)
    ) {
      setShowElement(false);
    }
  };
  
  // Bind the event listener only if the element is show.
  if (showElement) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
};
