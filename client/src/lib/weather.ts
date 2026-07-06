// Open-Meteo forecast — free, no API key, CORS-enabled for browser fetch.
// Powers the live "Wadsworth right now" band + 3-day forecast.
// Degrades silently: returns null on any failure (a broken weather box is
// worse than none).

export type WeatherIcon = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "thunder";

export interface DailyForecast {
  date: string;
  weekday: string;
  hi: number;
  lo: number;
  precip: number;
  label: string;
  icon: WeatherIcon;
}
export interface CurrentWeather {
  temp: number;
  label: string;
  icon: WeatherIcon;
}
export interface Weather {
  current: CurrentWeather;
  days: DailyForecast[];
}

function describe(code: number): { label: string; icon: WeatherIcon } {
  if (code === 0) return { label: "Clear", icon: "clear" };
  if (code === 1) return { label: "Mostly Sunny", icon: "clear" };
  if (code === 2) return { label: "Partly Cloudy", icon: "partly" };
  if (code === 3) return { label: "Cloudy", icon: "cloudy" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "fog" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "drizzle" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "snow" };
  if (code >= 80 && code <= 82) return { label: "Rain Showers", icon: "rain" };
  if (code === 85 || code === 86) return { label: "Snow Showers", icon: "snow" };
  if (code >= 95) return { label: "Thunderstorms", icon: "thunder" };
  return { label: "Cloudy", icon: "cloudy" };
}

function weekday(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short" });
}

interface OpenMeteoResponse {
  current?: { temperature_2m?: number; weather_code?: number };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
  };
}

let shared: Promise<Weather | null> | null = null;
export function getSharedWeather(lat: number, lon: number): Promise<Weather | null> {
  shared ??= fetchWeather(lat, lon).catch(() => null);
  return shared;
}

export async function fetchWeather(lat: number, lon: number): Promise<Weather | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&temperature_unit=fahrenheit&timezone=America/New_York&forecast_days=3`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = (await res.json()) as OpenMeteoResponse;
  const cur = data.current;
  const daily = data.daily;
  if (!cur || !daily?.time) return null;

  const cd = describe(cur.weather_code ?? -1);
  const current: CurrentWeather = {
    temp: Math.round(cur.temperature_2m ?? 0),
    label: cd.label,
    icon: cd.icon,
  };
  const days: DailyForecast[] = daily.time.map((iso, i) => {
    const d = describe(daily.weather_code?.[i] ?? -1);
    return {
      date: iso,
      weekday: weekday(iso),
      hi: Math.round(daily.temperature_2m_max?.[i] ?? 0),
      lo: Math.round(daily.temperature_2m_min?.[i] ?? 0),
      precip: Math.round(daily.precipitation_probability_max?.[i] ?? 0),
      label: d.label,
      icon: d.icon,
    };
  });
  return { current, days };
}
