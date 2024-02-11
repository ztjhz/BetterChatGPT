import React, { useState } from 'react';
import RefreshIcon from '@icon/RefreshIcon';
import ColorPaletteIcon from '@icon/ColorPaletteIcon'; // Adjust the import path as needed
import { folderColorOptions } from '@constants/color'; // Assuming this is your desired color options source

interface FilterColorProps {
  setFilter: (filter: string) => void; // Removed filter prop as it's not used within FilterColor
}

const FilterColor: React.FC<FilterColorProps> = ({ setFilter }) => {
  const [showPalette, setShowPalette] = useState(false);

  const filterColor = (color: string) => {
    setFilter(color); // Function to set the filter to the selected color
  };

  return (
    <div className="relative group"> {/* Adjusted based on provided snippet */}
      <button
        className="p-1 hover:text-white"
        onClick={() => setShowPalette((prev) => !prev)}
        aria-label="folder color"
      >
        <ColorPaletteIcon style={{ color: 'white' }} />
      </button>
      {showPalette && (
        <div className="absolute left-0 bottom-0 translate-y-full p-2 z-20 bg-gray-900 rounded border border-gray-600 flex flex-col gap-2 items-center">
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
