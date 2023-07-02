import React, { useState, useEffect, useRef } from 'react';
import useHideOnOutsideClick from './useHideOnOutsideClick';

const useDropDown = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  const [openDirection, setOpenDirection] = useState('down');
  const [checkPosition, setCheckPosition] = useState(false);

  const checkOpenDirection = () => {
    if (!buttonRef.current || !dropDownRef.current) return;
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const dropDownRect = dropDownRef.current.getBoundingClientRect();
    setOpenDirection(
      buttonRect.bottom + dropDownRect.height > window.innerHeight
        ? 'up'
        : 'down'
    );
  };

  useEffect(() => {
    if (checkPosition) {
      checkOpenDirection();
      setCheckPosition(false);
    }
  }, [checkPosition]);

  useEffect(() => {
    window.addEventListener('resize', checkOpenDirection);
    return () => {
      window.removeEventListener('resize', checkOpenDirection);
    };
  }, []);

  return {
    buttonRef,
    dropDown,
    setDropDown,
    dropDownRef,
    openDirection,
    setCheckPosition,
  };
};

export default useDropDown;