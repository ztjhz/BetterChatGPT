import React, { useCallback, useReducer, useRef, useState } from "react";
import { SelectOption } from "./types";

export const useSelectInputPlugin = <T,>(
  options: SelectOption<T>[],
  placeholder?: string
) => {
  const [selectedOption, setSelectedOption] = useState<
    SelectOption<T> | undefined
  >();
  const Select = () => (
    <SelectInput
      options={options}
      selectedValue={selectedOption?.value}
      placeholder={placeholder}
      onSelect={(selectedValue) => {
        const matchedOption = options.find((o) => o.value === selectedValue);
        setSelectedOption(matchedOption);
      }}
    />
  );
  return {
    Select,
    selectedOption,
  };
};

export const SelectInput: React.FC<{
  options: SelectOption[];
  selectedValue?: string;
  placeholder?: string;
  onSelect: (selectedValue: string) => void;
}> = ({ options, selectedValue, placeholder, onSelect }) => {
  return (
    <select
      className="bg-transparent"
      value={selectedValue}
      onChange={(e) => onSelect(e.target.value)}
    >
      {placeholder && (
        <option value="" key="_placeholder" disabled selected>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option value={o.value} key={o.value}>
          {o.displayName}
        </option>
      ))}
    </select>
  );
};
