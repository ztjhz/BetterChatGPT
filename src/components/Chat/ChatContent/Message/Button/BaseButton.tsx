import React from 'react';

const BaseButton = ({
  onClick,
  icon,
  disabled = false,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactElement;
  disabled?: boolean;
}) => {
  return (
    <div className='text-gray-400 flex self-end lg:self-center justify-center gap-3 md:gap-4 visible'>
      <button
        className={`p-1 rounded-md dark:text-gray-400 md:invisible md:group-hover:visible ${
          disabled
            ? 'disabled:dark:hover:text-gray-400 cursor-default'
            : 'hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200'
        }`}
        onClick={disabled ? () => {} : onClick}
        disabled={disabled}
      >
        {icon}
      </button>
    </div>
  );
};

export default BaseButton;
