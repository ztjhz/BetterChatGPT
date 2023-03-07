import React from "react";

export const ToggleSwitch: React.FC<{
  status: boolean;
  onStatusChange: (newStatus: boolean) => void;
  children: React.ReactNode;
}> = ({ status, onStatusChange, children }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      value=""
      className="sr-only peer"
      checked={status}
      onChange={(e) => onStatusChange(e.target.checked)}
    />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#10A37F]"></div>
    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
      {children}
    </span>
  </label>
);
