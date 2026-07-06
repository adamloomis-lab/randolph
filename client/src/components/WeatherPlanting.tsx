import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  Sprout,
} from "lucide-react";
import { getSharedWeather, type Weather, type WeatherIcon } from "@/lib/weather";
import { currentSeasonGuide } from "@/lib/planting";
// @ts-expect-error - plain JS module shared with the prerender script
import { BUSINESS } from "@/config/business.js";

const ICONS: Record<WeatherIcon, typeof Sun> = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: Snowflake,
  thunder: CloudLightning,
};

function WeatherIconEl({ icon, className }: { icon: WeatherIcon; className?: string }) {
  const C = ICONS[icon] || Cloud;
  return <C className={className} aria-hidden="true" />;
}

export default function WeatherPlanting() {
  // Season/planting content is computed at render time (SSR-safe) so the static
  // HTML always carries real, indexable planting advice for the current season.
  const guide = currentSeasonGuide();
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    let alive = true;
    getSharedWeather(BUSINESS.geo.latitude, BUSINESS.geo.longitude).then((w) => {
      if (alive) setWeather(w);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-24 md:py-32 bg-surface-container-lowest concrete-texture border-y-4 border-surface-container-highest">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[2px] w-12 bg-primary" />
          <span className="font-label-bold text-label-bold uppercase text-primary tracking-[0.2em]">
            Wadsworth Right Now
          </span>
        </div>
        <h2 className="font-headline-lg text-4xl md:text-headline-lg uppercase mb-4 leading-none max-w-3xl">
          {guide.headline}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">{guide.intro}</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Live weather panel — renders only when the fetch succeeds */}
          {weather && (
            <div className="lg:col-span-4 bg-surface-container border-2 border-surface-container-highest bevel-stone p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-label-bold text-label-bold uppercase text-on-surface-variant mb-1">
                    Wadsworth, OH
                  </p>
                  <div className="flex items-center gap-3">
                    <WeatherIconEl icon={weather.current.icon} className="w-9 h-9 text-primary" />
                    <span className="font-display-lg text-5xl leading-none text-on-surface">
                      {weather.current.temp}°
                    </span>
                  </div>
                  <p className="font-body-md text-on-surface-variant mt-1">{weather.current.label}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-surface-container-highest pt-4">
                {weather.days.map((d) => (
                  <div key={d.date} className="text-center">
                    <p className="font-label-bold text-[11px] uppercase text-on-surface-variant mb-1">{d.weekday}</p>
                    <WeatherIconEl icon={d.icon} className="w-6 h-6 mx-auto text-on-surface-variant" />
                    <p className="font-body-md text-sm text-on-surface mt-1">
                      {d.hi}° <span className="text-on-surface-variant">/ {d.lo}°</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Season planting guide — always present (SSR content) */}
          <div className={weather ? "lg:col-span-8" : "lg:col-span-12"}>
            <div className="flex items-center gap-3 mb-6">
              <Sprout className="w-6 h-6 text-primary" aria-hidden="true" />
              <h3 className="font-headline-md text-2xl md:text-headline-md uppercase">
                What to Plant Now — {guide.label} in Zone {BUSINESS.hardinessZone}
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {guide.plants.map((p) => (
                <li key={p.name} className="border-l-2 border-surface-container-highest pl-4 py-1">
                  <p className="font-title-lg text-title-lg text-on-surface">{p.name}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">{p.note}</p>
                </li>
              ))}
            </ul>
            <div className="bg-surface-container border-l-4 border-primary p-6 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
              <p className="font-body-lg text-body-lg text-on-surface">{guide.tie}</p>
              <Link
                href="/contact"
                className="shrink-0 text-center bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase px-8 py-4 metallic-gradient beveled-edge industrial-glow transition-all active:scale-95"
              >
                Plan Your Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
