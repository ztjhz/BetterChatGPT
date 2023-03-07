import React, { useCallback, useState } from "react";
import { SelectOption } from "./types";

export const useSelectInputPlugin = <T,>(options: SelectOption<T>[]) => {
  const [selectedOption, setSelectedOption] = useState<
    SelectOption<T> | undefined
  >();
  const Select = useCallback(
    () => (
      <SelectInput
        options={options}
        onSelect={(selectedValue) =>
          setSelectedOption(options.find((o) => o.value === selectedValue))
        }
      />
    ),
    []
  );
  return {
    Select,
    selectedOption,
  };
};

export const SelectInput: React.FC<{
  options: SelectOption[];
  onSelect: (selectedValue: string) => void;
}> = ({ options, onSelect }) => {
  return (
    <select
      className="bg-transparent"
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
