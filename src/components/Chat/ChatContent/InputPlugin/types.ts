export type SelectOption<T = {}> = {
  value: string;
  displayName: string;
} & T;

export type DeviceSelectOption = SelectOption & { functions: SelectOption[] };

export const describeDevice = (device: DeviceSelectOption) =>
  `${device.displayName}(${device.value}) with ${device.functions
    .map((f) => f.value)
    .join(",")}`;
