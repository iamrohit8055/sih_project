import {
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  CloudLightning,
  Snowflake,
  CloudFog,
} from "lucide-react";
import { useEffect, useState } from "react";

type WeatherData = {
  temperature: number;
  condition: string;
};

function getWeatherIcon(condition: string) {
  const value = condition.toLowerCase();

  if (value.includes("thunder") || value.includes("storm")) {
    return CloudLightning;
  }

  if (value.includes("rain") || value.includes("drizzle")) {
    return CloudRain;
  }

  if (value.includes("snow")) {
    return Snowflake;
  }

  if (value.includes("fog") || value.includes("mist") || value.includes("haze")) {
    return CloudFog;
  }

  if (value.includes("cloud")) {
    return Cloud;
  }

  if (value.includes("partly")) {
    return CloudSun;
  }

  return Sun;
}

export default function NavbarWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 33,
    condition: "Partly sunny",
  });

  useEffect(() => {
    // Backend connection will go here later.
    //
    // Example:
    //
    // fetch("http://localhost:8000/api/weather/current")
    //   .then((res) => res.json())
    //   .then((data) => setWeather(data));

  }, []);

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
  <div
    className="
      flex items-center gap-2
      rounded-lg
      px-1 py-1
      transition-colors
      bg-linear-to-r
    from-cyan-500  
    to-indigo-600
    hover:from-cyan-300
    hover:to-indigo-700
      

      sm:px-2
    "
  >
    <WeatherIcon
      size={27}
      strokeWidth={1.8}
      className="shrink-0 text-amber-500"
    />

    <div className="hidden leading-tight sm:block ">
      <p className="text-sm font-medium text-slate-100">
        {weather.temperature}°C
      </p>

      <p className="mt-0.5 max-w-22.5 truncate text-xs text-slate-200">
        {weather.condition}
      </p>
    </div>

    {/* Mobile: temperature only */}
    <span className="text-sm font-medium text-slate-100 sm:hidden">
      {weather.temperature}°C
    </span>
  </div>
);
}