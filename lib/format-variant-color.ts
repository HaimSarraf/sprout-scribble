import { closest } from "color-2-name";

export default function ConvertHexToName(color: string | number): string {
  if (typeof color === "number") {
    // Convert number to hex string
    const hex = color.toString(16).padStart(6, "0");
    return closest(hex).name;
  } else {
    return closest(color).name;
  }
}
