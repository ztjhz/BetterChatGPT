import { DeviceSelectOption } from "./types";

export const SMART_DEVICE_PRESENTS: DeviceSelectOption[] = [
  {
    value: "tv",
    displayName: "Living Room / TV",
    functions: [
      { value: "set_on", displayName: "Turn On" },
      { value: "set_off", displayName: "Turn Off" },
      { value: "set_volume", displayName: "Set Volume" },
    ],
  },
  {
    value: "living_ac",
    displayName: "Living Room / Air Conditioning",
    functions: [
      { value: "set_on", displayName: "Turn On" },
      { value: "set_off", displayName: "Turn Off" },
      { value: "set_temperature", displayName: "Set Temperature" },
      { value: "set_mode", displayName: "Set Mode" },
    ],
  },
  {
    value: "living_curtain",
    displayName: "Living Room / Balcony Curtains",
    functions: [
      { value: "open", displayName: "Open" },
      { value: "close", displayName: "Close" },
      { value: "stop", displayName: "Stop" },
    ],
  },
  {
    value: "living_lights",
    displayName: "Living Room / Lights",
    functions: [
      { value: "set_on", displayName: "Turn On" },
      { value: "set_off", displayName: "Turn Off" },
      { value: "set_brightness", displayName: "Set Brightness" },
    ],
  },
  {
    value: "sweeping_robots",
    displayName: "Living Room / Sweeping Robots",
    functions: [
      { value: "start", displayName: "Start" },
      { value: "stop", displayName: "Stop" },
      { value: "set_schedule", displayName: "Set Schedule" },
    ],
  },
  {
    value: "living_temp",
    displayName: "Living Room / Temperature Sensor",
    functions: [{ value: "temperature", displayName: "Temperature" }],
  },
  {
    value: "living_humid",
    displayName: "Living Room / Humidity Sensor",
    functions: [{ value: "humidity", displayName: "Humidity" }],
  },
  {
    value: "bedroom_ac",
    displayName: "Bedroom / Air Conditioning",
    functions: [
      { value: "set_on", displayName: "Turn On" },
      { value: "set_off", displayName: "Turn Off" },
      { value: "set_temperature", displayName: "Set Temperature" },
      { value: "set_mode", displayName: "Set Mode" },
    ],
  },
  {
    value: "bedroom_lights",
    displayName: "Bedroom / Lights",
    functions: [
      { value: "set_on", displayName: "Turn On" },
      { value: "set_off", displayName: "Turn Off" },
      { value: "set_brightness", displayName: "Set Brightness" },
    ],
  },
  {
    value: "bedroom_curtain",
    displayName: "Bedroom / Curtains",
    functions: [
      { value: "open", displayName: "Open" },
      { value: "close", displayName: "Close" },
      { value: "stop", displayName: "Stop" },
    ],
  },
  {
    value: "bedroom_body",
    displayName: "Bedroom / Human Body Sensor",
    functions: [
      { value: "motion", displayName: "Motion" },
      { value: "bed_occupancy", displayName: "Bed Occupancy" },
    ],
  },
  {
    value: "bedroom_temp",
    displayName: "Bedroom / Temperature Sensor",
    functions: [{ value: "temperature", displayName: "Temperature" }],
  },
  {
    value: "bedroom_humid",
    displayName: "Bedroom / Humidity Sensor",
    functions: [{ value: "humidity", displayName: "Humidity" }],
  },
  {
    value: "toilet_lamp",
    displayName: "Toilet / Lamp",
    functions: [
      { value: "set_on", displayName: "Turn On" },
      { value: "set_off", displayName: "Turn Off" },
    ],
  },
  {
    value: "water_heater",
    displayName: "Toilet / Water Heater",
    functions: [
      { value: "set_on", displayName: "Turn On" },
      { value: "set_off", displayName: "Turn Off" },
      { value: "set_temperature", displayName: "Set Temperature" },
    ],
  },
  {
    value: "toilet_body",
    displayName: "Toilet / Human Body Sensor",
    functions: [
      { value: "motion", displayName: "Motion" },
      { value: "seat_occupancy", displayName: "Seat Occupancy" },
    ],
  },
  {
    value: "entry",
    displayName: "Outdoor / Entry Sensor",
    functions: [
      { value: "open", displayName: "Open" },
      { value: "close", displayName: "Close" },
    ],
  },
  {
    value: "cctv",
    displayName: "Outdoor / Front-door CCTV",
    functions: [
      { value: "view", displayName: "View" },
      { value: "record", displayName: "Record" },
    ],
  },
];
