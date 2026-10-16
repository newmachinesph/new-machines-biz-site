/** The launch market and the hubs that follow, in order. The one list the home globe, /about, the FAQs and
 *  llms*.txt use; a test keeps the static llms files in step. Coordinates and label offsets are for the home globe. */
export const HUBS = [
  { city: "Tokyo", country: "Japan", latitude: 35.68, longitude: 139.69, labelX: 12, labelY: 4 },
  { city: "Seoul", country: "South Korea", latitude: 37.57, longitude: 126.98, labelX: -56, labelY: 12 },
  { city: "Singapore", country: "Singapore", latitude: 1.35, longitude: 103.82, labelX: -66, labelY: 8 },
  { city: "Manila", country: "Philippines", latitude: 14.6, longitude: 120.98, labelX: 12, labelY: 6 },
  { city: "Sydney", country: "Australia", latitude: -33.87, longitude: 151.21, labelX: 12, labelY: 8 },
  { city: "Bengaluru", country: "India", latitude: 12.97, longitude: 77.59, labelX: -34, labelY: -24 },
] as const;

export const HUB_NAMES: readonly string[] = HUBS.map((hub) => hub.city);

/** "Seoul, Singapore, Manila, Sydney and Bengaluru": the hubs after the launch market, as prose. */
export const FOLLOWING_HUBS_TEXT = (() => {
  const rest = HUB_NAMES.slice(1);
  return `${rest.slice(0, -1).join(", ")} and ${rest[rest.length - 1]}`;
})();
