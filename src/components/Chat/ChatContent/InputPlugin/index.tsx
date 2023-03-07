import { SMART_DEVICE_PRESENTS } from "./presents";
import { useSelectInputPlugin } from "./SelectionInput";
import { useTimeInputPlugin } from "./TimeInput";
import { DeviceSelectOption } from "./types";

export const useSmartDeviceInputPlugin = (
  deviceOptions: DeviceSelectOption[]
) => {
  const { TimeInput, formatTime } = useTimeInputPlugin();
  const { Select: SelectDevice, selectedOption: selectedDevice } =
    useSelectInputPlugin(deviceOptions, "Device/Sensor");
  const { Select: SelectFuntion, selectedOption: selectedDeviceFunction } =
    useSelectInputPlugin(selectedDevice?.functions ?? [], "Function/Data");

  const Component = () => (
    <div className="flex gap-1 mr-2">
      <TimeInput />
      <SelectDevice />
      <SelectFuntion />
    </div>
  );

  return {
    Component,
    formatContent: () =>
      formatTime() +
      " " +
      (selectedDevice ? `[${selectedDevice.value}]` : ``) +
      " " +
      (selectedDeviceFunction?.value || ``) +
      " ",
  };
};

export const useSmartDevicePresentsInputPlugin = () =>
  useSmartDeviceInputPlugin(SMART_DEVICE_PRESENTS);
