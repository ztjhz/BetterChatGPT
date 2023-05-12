import React, { ReactNode } from 'react';
import useDropDown from '@hooks/useDropDown';

import DownChevronArrow from '@icon/DownChevronArrow';

const DropDown = ({
  selected,
  selections,
  onClick,
  icon = <DownChevronArrow />,
}: {
  selected: string | ReactNode | React.ReactElement;
  selections: string[];
  onClick: React.MouseEventHandler<HTMLElement>;
  icon?: React.ReactElement;
}) => {
  const {
    buttonRef,
    dropDown,
    setDropDown,
    dropDownRef,
    openDirection,
    setCheckPosition,
  } = useDropDown();

  return (
    <div className='prose dark:prose-invert relative'>
      <button
        ref={buttonRef}
        className='btn btn-neutral btn-small flex gap-1'
        type='button'
        onClick={() => {
          setDropDown((prev) => !prev);
          setCheckPosition(true);
        }}
      >
        {selected}
        {icon}
      </button>
      <div
        ref={dropDownRef as React.RefObject<HTMLDivElement>}
        id='dropdown'
        className={`${
          dropDown ? '' : 'hidden'
        } absolute z-10 bg-white text-gray-800 group opacity-90 border-b border-black/10 ${
          openDirection === 'down' ? 'top-full' : 'bottom-full'
        } rounded-lg shadow-xl dark:border-gray-900/50 dark:text-gray-100 dark:bg-gray-800`}
      >
        <ul
          className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0'
          aria-labelledby='dropdownDefaultButton'
        >
          {selections.map((r) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
              onClick={(e) => {
                onClick(e);
                setDropDown(false);
              }}
              key={r}
            >
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDown;
