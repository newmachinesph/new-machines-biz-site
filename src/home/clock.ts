export type City = { name: string; native?: string; zone: string; abbr: string };

/** 24-hour "HH:MM:SS" in the given IANA zone. */
export function formatClock(date: Date, zone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

/** Sydney alternates AEST/AEDT; the other JAPAC hubs never shift. */
export function zoneAbbr(date: Date, city: City): string {
  if (city.zone !== "Australia/Sydney") return city.abbr;
  const part = new Intl.DateTimeFormat("en-AU", { timeZone: city.zone, timeZoneName: "short" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  return part && /^AE[SD]T$/.test(part) ? part : city.abbr;
}
