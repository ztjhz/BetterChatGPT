import React, { useCallback, useReducer, useRef, useState } from "react";
import { SelectOption } from "./types";

export const useSelectInputPlugin = <T,>(options: SelectOption<T>[]) => {
  const [selectedOption, setSelectedOption] = useState<
    SelectOption<T> | undefined
  >();
  const Select = () => (
    <SelectInput
      options={options}
      selectedValue={selectedOption?.value}
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
  onSelect: (selectedValue: string) => void;
}> = ({ options, selectedValue, onSelect }) => {
  return (
    <select
      className="bg-transparent"
      value={selectedValue}
      onChange={(e) => onSelect(e.target.value)}
    >
      {options.map((o) => (
        <option value={o.value} key={o.value}>
          {o.displayName}
        </option>
      ))}
    </select>
  );
};
