import React, { useState } from 'react';
import RefreshIcon from '@icon/RefreshIcon';
import ColorPaletteIcon from '@icon/ColorPaletteIcon';
import { folderColorOptions } from '@constants/color'; 
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';
import useStore from '@store/store';


const FilterColor = () => {
  const [showPalette, setShowPalette, paletteRef] = useHideOnOutsideClick();
  const setColorFilter = useStore((state) => state.setColorFilter);
  const filterColor = (color: string) => {
    setColorFilter(color); // Now correctly using the setColorFilter from the store
  };

  return (
    <div className="relative group">
      <button
        className="p-1 hover:text-white"
        onClick={() => setShowPalette((prev) => !prev)}
        aria-label="folder color"
      >
        <ColorPaletteIcon style={{ color: 'white' }} />
      </button>
      {showPalette && (
        <div
        ref={paletteRef} 
        className="absolute left-0 bottom-0 translate-y-full p-2 z-20 bg-gray-900 rounded border border-gray-600 flex flex-col gap-2 items-center">
          {folderColorOptions.map((color) => (
            <button
              key={color}
              style={{ background: color }}
              className="hover:scale-90 transition-transform h-4 w-4 rounded-full"
              onClick={() => filterColor(color)}
              aria-label={`Filter by color ${color}`}
            />
          ))}
          <button
            onClick={() => filterColor('')} // Assuming '' resets to default/no filter
            aria-label="Reset color filter"
          >
            <RefreshIcon style={{ color: 'white' }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterColor;
