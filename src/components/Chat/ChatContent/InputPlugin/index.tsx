import { SMART_DEVICE_PRESENTS } from "./presents";
import { useSelectInputPlugin } from "./SelectionInput";
import { useTimeInputPlugin } from "./TimeInput";
import { DeviceSelectOption } from "./types";

export const useSmartDeviceInputPlugin = (
  deviceOptions: DeviceSelectOption[],
  onSubmitLog: (formattedLog: string) => void
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
      <button
        className="btn btn-neutral h-7"
        onClick={() => onSubmitLog(formatContent())}
      >
        ＋
      </button>
    </div>
  );
  const formatContent = () =>
    formatTime() +
    " " +
    (selectedDevice ? `[${selectedDevice.value}]` : ``) +
    " " +
    (selectedDeviceFunction?.value || ``) +
    " ";

  return {
    Component,
    formatContent,
  };
};

export const useSmartDevicePresentsInputPlugin = (
  onSubmitLog: (formattedLog: string) => void
) => useSmartDeviceInputPlugin(SMART_DEVICE_PRESENTS, onSubmitLog);
