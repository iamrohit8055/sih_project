export interface LocationOption {
  id?: string | number;
  name: string;
  admin1?: string; // State / Province
  country?: string;
  latitude: number;
  longitude: number;
  farmName?: string;
  isCurrentLocation?: boolean;
}

export interface CurrentWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  rain: number;
  weatherCode: number;
  condition: string;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  cloudCover: number;
  uvIndex: number;
  isDay: boolean;
  dewPoint?: number;
  visibility?: number;
  time: string;
}

export interface HourlyWeatherData {
  time: string;
  displayTime: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  condition: string;
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyWeatherData {
  date: string;
  displayDate: string;
  dayName: string;
  weatherCode: number;
  condition: string;
  maxTemp: number;
  minTemp: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  windDirectionDominant: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  evapotranspiration: number;
}

export interface AdvisoryItem {
  status: "favorable" | "moderate" | "unfavorable";
  score?: number;
  title: string;
  message: string;
  tips: string[];
}

export interface IrrigationAdvisory {
  status: "irrigate" | "skip" | "monitor";
  title: string;
  advice: string;
  expectedRainfallMm: number;
  evapotranspirationMm: number;
  recommendation: string;
}

export interface DiseaseRiskAdvisory {
  level: "low" | "moderate" | "high";
  title: string;
  riskFactor: string;
  vulnerableCrops: string[];
  recommendations: string[];
}

export interface WeatherAlert {
  type: "warning" | "caution" | "info";
  title: string;
  description: string;
  action: string;
}

export interface AgriculturalAdvisories {
  spraying: AdvisoryItem;
  irrigation: IrrigationAdvisory;
  harvesting: AdvisoryItem;
  diseaseRisk: DiseaseRiskAdvisory;
  alerts: WeatherAlert[];
}

export interface CompleteWeatherReport {
  location: LocationOption;
  current: CurrentWeatherData;
  hourly: HourlyWeatherData[];
  daily: DailyWeatherData[];
  advisories: AgriculturalAdvisories;
  lastUpdated: string;
}

export const PRESET_FARM_LOCATIONS: LocationOption[] = [
  {
    id: "farm-1",
    name: "Nashik",
    admin1: "Maharashtra",
    country: "India",
    latitude: 19.9975,
    longitude: 73.7898,
    farmName: "Green Acre Farm (Nashik)",
  },
  {
    id: "farm-2",
    name: "Ludhiana",
    admin1: "Punjab",
    country: "India",
    latitude: 30.9010,
    longitude: 75.8573,
    farmName: "Sunrise Plot (Ludhiana)",
  },
  {
    id: "farm-3",
    name: "Varanasi",
    admin1: "Uttar Pradesh",
    country: "India",
    latitude: 25.3176,
    longitude: 82.9739,
    farmName: "Riverbed Field (Varanasi)",
  },
  {
    id: "farm-4",
    name: "Guntur",
    admin1: "Andhra Pradesh",
    country: "India",
    latitude: 16.3067,
    longitude: 80.4365,
    farmName: "Krishna Delta Farm (Guntur)",
  },
  {
    id: "farm-5",
    name: "Indore",
    admin1: "Madhya Pradesh",
    country: "India",
    latitude: 22.7196,
    longitude: 75.8577,
    farmName: "Malwa Plateau Farm (Indore)",
  },
  {
    id: "farm-6",
    name: "Mandya",
    admin1: "Karnataka",
    country: "India",
    latitude: 12.5238,
    longitude: 76.8967,
    farmName: "Cauvery Basin Farm (Mandya)",
  },
];

export const STORAGE_KEY_SAVED_LOCATION = "sih_farmer_saved_weather_location";

export function getSavedFarmerLocation(): LocationOption {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SAVED_LOCATION);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn("Failed to load saved farmer location from localStorage", err);
  }
  return PRESET_FARM_LOCATIONS[0];
}

export function saveFarmerLocation(location: LocationOption): void {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_LOCATION, JSON.stringify(location));
  } catch (err) {
    console.warn("Failed to save farmer location to localStorage", err);
  }
}

// WMO Weather Interpretation Codes (WW)
export function getWeatherConditionInfo(code: number, isDay: boolean = true): {
  label: string;
  description: string;
  iconType: "sun" | "cloud-sun" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "thunderstorm";
  badgeClass: string;
} {
  switch (code) {
    case 0:
      return {
        label: isDay ? "Sunny / Clear Sky" : "Clear Night",
        description: "Bright sunny skies, optimal solar radiation for photosynthesis",
        iconType: "sun",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
      };
    case 1:
      return {
        label: "Mainly Clear",
        description: "Mostly clear with plenty of sunshine",
        iconType: "sun",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case 2:
      return {
        label: "Partly Cloudy",
        description: "Scattered cloud cover with sunny intervals",
        iconType: "cloud-sun",
        badgeClass: "bg-sky-100 text-sky-800 border-sky-300",
      };
    case 3:
      return {
        label: "Overcast",
        description: "Dense cloud cover, reduced solar exposure",
        iconType: "cloud",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
      };
    case 45:
    case 48:
      return {
        label: "Fog & Mist",
        description: "Reduced visibility with morning condensation",
        iconType: "fog",
        badgeClass: "bg-teal-100 text-teal-800 border-teal-300",
      };
    case 51:
    case 53:
    case 55:
      return {
        label: code === 51 ? "Light Drizzle" : code === 53 ? "Moderate Drizzle" : "Dense Drizzle",
        description: "Gentle precipitation, mild leaf surface wetting",
        iconType: "drizzle",
        badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
      };
    case 56:
    case 57:
      return {
        label: "Freezing Drizzle",
        description: "Cold icy drizzle, potential frost stress for young shoots",
        iconType: "snow",
        badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-300",
      };
    case 61:
    case 63:
    case 65:
      return {
        label: code === 61 ? "Light Rain" : code === 63 ? "Moderate Rain" : "Heavy Rain",
        description: "Substantial rainfall; soil moisture enrichment in progress",
        iconType: "rain",
        badgeClass: "bg-blue-100 text-blue-900 border-blue-400",
      };
    case 66:
    case 67:
      return {
        label: "Freezing Rain",
        description: "Cold freezing downpour, shelter livestock and shield nursery beds",
        iconType: "rain",
        badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: "Snowfall",
        description: "Freezing snow precipitation",
        iconType: "snow",
        badgeClass: "bg-cyan-100 text-cyan-900 border-cyan-300",
      };
    case 80:
    case 81:
    case 82:
      return {
        label: code === 80 ? "Light Showers" : code === 81 ? "Moderate Showers" : "Violent Showers",
        description: "Intermittent intense showers; check field drainage",
        iconType: "rain",
        badgeClass: "bg-blue-200 text-blue-900 border-blue-400",
      };
    case 85:
    case 86:
      return {
        label: "Snow Showers",
        description: "Cold snow showers",
        iconType: "snow",
        badgeClass: "bg-slate-200 text-slate-800 border-slate-400",
      };
    case 95:
      return {
        label: "Thunderstorm",
        description: "Lightning activity, sudden wind gusts, suspend spraying and harvesting",
        iconType: "thunderstorm",
        badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
      };
    case 96:
    case 99:
      return {
        label: "Thunderstorm with Hail",
        description: "Severe storm with hail risk! Protect open greenhouses and sensitive fruits",
        iconType: "thunderstorm",
        badgeClass: "bg-red-100 text-red-900 border-red-400",
      };
    default:
      return {
        label: "Fair Weather",
        description: "Mild atmospheric conditions",
        iconType: "sun",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
      };
  }
}

// Search locations with Open-Meteo Geocoding API (100% Free, No API Key)
export async function searchLocations(query: string): Promise<LocationOption[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=en&format=json`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding error: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: {
      id: number;
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
    }) => ({
      id: item.id,
      name: item.name,
      admin1: item.admin1,
      country: item.country,
      latitude: item.latitude,
      longitude: item.longitude,
      farmName: `${item.name}${item.admin1 ? `, ${item.admin1}` : ""}`,
    }));
  } catch (err) {
    console.error("Failed to search location:", err);
    return [];
  }
}

// Reverse Geocode using free BigDataCloud client API or fallback
export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number
): Promise<LocationOption> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const name = data.locality || data.city || data.principalSubdivision || "My Farm Location";
      const admin1 = data.principalSubdivision || "";
      const country = data.countryName || "India";

      return {
        name,
        admin1,
        country,
        latitude,
        longitude,
        farmName: `My Farm (${name}${admin1 ? `, ${admin1}` : ""})`,
        isCurrentLocation: true,
      };
    }
  } catch (err) {
    console.warn("Reverse geocode failed, using coordinates fallback", err);
  }

  return {
    name: "Detected Farm Location",
    latitude,
    longitude,
    farmName: `GPS Farm (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
    isCurrentLocation: true,
  };
}

// Fetch Comprehensive Weather Data from Free Open-Meteo API
export async function fetchFarmWeatherData(
  location: LocationOption
): Promise<CompleteWeatherReport> {
  const { latitude, longitude } = location;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,et0_fao_evapotranspiration&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API returned status ${res.status}`);
  }

  const raw = await res.json();

  // Parse Current Weather
  const currentCondition = getWeatherConditionInfo(
    raw.current.weather_code,
    Boolean(raw.current.is_day)
  );

  const current: CurrentWeatherData = {
    temperature: Math.round(raw.current.temperature_2m),
    apparentTemperature: Math.round(raw.current.apparent_temperature),
    humidity: raw.current.relative_humidity_2m,
    precipitation: raw.current.precipitation,
    rain: raw.current.rain,
    weatherCode: raw.current.weather_code,
    condition: currentCondition.label,
    windSpeed: Math.round(raw.current.wind_speed_10m),
    windDirection: raw.current.wind_direction_10m,
    surfacePressure: Math.round(raw.current.surface_pressure),
    cloudCover: raw.current.cloud_cover,
    uvIndex: raw.hourly?.uv_index ? Math.round(raw.hourly.uv_index[0] || 0) : 0,
    isDay: Boolean(raw.current.is_day),
    dewPoint: raw.hourly?.dew_point_2m ? Math.round(raw.hourly.dew_point_2m[0]) : undefined,
    visibility: raw.hourly?.visibility ? Math.round((raw.hourly.visibility[0] || 10000) / 1000) : 10,
    time: raw.current.time,
  };

  // Parse Hourly Forecast (next 24 hours from current index)
  const hourlyTimes: string[] = raw.hourly.time || [];
  const currentIsoHour = raw.current.time.slice(0, 13);
  let startIndex = hourlyTimes.findIndex((t) => t.startsWith(currentIsoHour));
  if (startIndex === -1) startIndex = 0;

  const hourly: HourlyWeatherData[] = hourlyTimes
    .slice(startIndex, startIndex + 24)
    .map((isoTime, idx) => {
      const actualIdx = startIndex + idx;
      const dateObj = new Date(isoTime);
      const displayTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });
      const code = raw.hourly.weather_code[actualIdx];
      const isDay = Boolean(raw.hourly.is_day[actualIdx]);
      const condition = getWeatherConditionInfo(code, isDay).label;

      return {
        time: isoTime,
        displayTime: idx === 0 ? "Now" : displayTime,
        temperature: Math.round(raw.hourly.temperature_2m[actualIdx]),
        apparentTemperature: Math.round(raw.hourly.apparent_temperature[actualIdx]),
        humidity: raw.hourly.relative_humidity_2m[actualIdx],
        precipitationProbability: raw.hourly.precipitation_probability[actualIdx] ?? 0,
        precipitation: raw.hourly.precipitation[actualIdx] ?? 0,
        weatherCode: code,
        condition,
        windSpeed: Math.round(raw.hourly.wind_speed_10m[actualIdx]),
        uvIndex: Math.round(raw.hourly.uv_index[actualIdx] ?? 0),
        isDay,
      };
    });

  // Parse 7-Day Forecast
  const dailyTimes: string[] = raw.daily.time || [];
  const daily: DailyWeatherData[] = dailyTimes.map((dateStr, idx) => {
    const d = new Date(dateStr);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const isToday = idx === 0;

    const code = raw.daily.weather_code[idx];
    const condition = getWeatherConditionInfo(code, true).label;

    return {
      date: dateStr,
      displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dayName: isToday ? "Today" : dayNames[d.getDay()],
      weatherCode: code,
      condition,
      maxTemp: Math.round(raw.daily.temperature_2m_max[idx]),
      minTemp: Math.round(raw.daily.temperature_2m_min[idx]),
      precipitationSum: Number((raw.daily.precipitation_sum[idx] ?? 0).toFixed(1)),
      precipitationProbability: raw.daily.precipitation_probability_max[idx] ?? 0,
      windSpeedMax: Math.round(raw.daily.wind_speed_10m_max[idx]),
      windDirectionDominant: raw.daily.wind_direction_10m_dominant[idx] ?? 0,
      sunrise: raw.daily.sunrise[idx]?.slice(11, 16) || "06:00",
      sunset: raw.daily.sunset[idx]?.slice(11, 16) || "18:30",
      uvIndexMax: Math.round(raw.daily.uv_index_max[idx] ?? 5),
      evapotranspiration: Number(
        (raw.daily.et0_fao_evapotranspiration?.[idx] ?? 3.5).toFixed(1)
      ),
    };
  });

  // Compute Intelligent Agricultural Advisories
  const advisories = generateAgriculturalAdvisories(current, hourly, daily);

  return {
    location,
    current,
    hourly,
    daily,
    advisories,
    lastUpdated: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

// Agricultural Decision Engine based on meteorological factors
function generateAgriculturalAdvisories(
  current: CurrentWeatherData,
  hourly: HourlyWeatherData[],
  daily: DailyWeatherData[]
): AgriculturalAdvisories {
  const next24hRainSum = hourly.slice(0, 24).reduce((acc, h) => acc + h.precipitation, 0);
  const next24hMaxRainProb = Math.max(...hourly.slice(0, 24).map((h) => h.precipitationProbability), 0);
  const maxWindSpeedNext12h = Math.max(...hourly.slice(0, 12).map((h) => h.windSpeed), 0);
  const next3DaysRainSum = daily.slice(0, 3).reduce((acc, d) => acc + d.precipitationSum, 0);
  const todayET0 = daily[0]?.evapotranspiration || 3.5;

  // 1. Spraying / Fertilizer Advisory
  let sprayingStatus: "favorable" | "moderate" | "unfavorable" = "favorable";
  let sprayingTitle = "Optimal Spraying Window";
  let sprayingMessage = "Calm winds and low chance of wash-off rain. Great time for foliar sprays.";
  const sprayingTips: string[] = [];

  if (current.windSpeed > 20 || maxWindSpeedNext12h > 22) {
    sprayingStatus = "unfavorable";
    sprayingTitle = "High Drift Risk (Strong Winds)";
    sprayingMessage = `Wind speed is ${current.windSpeed} km/h (gusts expected). High drift risk will waste chemical spray and damage adjacent plots.`;
    sprayingTips.push("Postpone spraying until wind speeds drop below 15 km/h (typically early dawn).");
  } else if (next24hRainSum > 3 || next24hMaxRainProb > 50) {
    sprayingStatus = "unfavorable";
    sprayingTitle = "Rain Wash-off Alert";
    sprayingMessage = `Rain expected within 24 hours (${next24hRainSum.toFixed(1)} mm, ${next24hMaxRainProb}% probability). Applied pesticides/fertilizers will wash away.`;
    sprayingTips.push("Delay pesticide applications until after the rain shower passes.");
  } else if (current.temperature > 34) {
    sprayingStatus = "moderate";
    sprayingTitle = "High Heat Evaporation";
    sprayingMessage = `Current temperature is ${current.temperature}°C. Spray droplets will evaporate quickly and could scorch leaf tissues.`;
    sprayingTips.push("Apply sprays in the early morning (6:00 AM - 9:00 AM) or late evening.");
  } else {
    sprayingTips.push("Ideal spray pressure: 2-3 bar with fine droplet nozzles.");
    sprayingTips.push("Ensure protective equipment (mask & gloves) is worn.");
  }

  // 2. Irrigation Advisory
  let irrigationStatus: "irrigate" | "skip" | "monitor" = "irrigate";
  let irrigationTitle = "Standard Irrigation Recommended";
  let irrigationAdvice = `Crop evapotranspiration (ET0) loss is ${todayET0} mm/day with low rainfall. Provide regular root zone watering.`;
  let irrigationRecommendation = "Run drip or furrow irrigation during morning hours to reduce water evaporation.";

  if (next3DaysRainSum > 15 || next24hRainSum > 8) {
    irrigationStatus = "skip";
    irrigationTitle = "Hold Off Irrigation (Rain Upcoming)";
    irrigationAdvice = `Upcoming precipitation of ${next3DaysRainSum.toFixed(1)} mm will satisfy soil moisture. Conserve electricity and water.`;
    irrigationRecommendation = "Clear field drainage channels to prevent waterlogging around root zones.";
  } else if (next3DaysRainSum > 4) {
    irrigationStatus = "monitor";
    irrigationTitle = "Light Irrigation / Monitor Soil";
    irrigationAdvice = `Light scattered showers (${next3DaysRainSum.toFixed(1)} mm) expected. Soil moisture may remain adequate for shallow-rooted crops.`;
    irrigationRecommendation = "Check soil moisture at 10 cm depth before switching on pumps.";
  } else if (current.temperature > 36) {
    irrigationStatus = "irrigate";
    irrigationTitle = "High Water Demand (Heat Stress)";
    irrigationAdvice = `Elevated heat (${current.temperature}°C) and high ET0 (${todayET0} mm). Crops are transpiring water rapidly.`;
    irrigationRecommendation = "Deep irrigation advised in early morning or after sunset to replenish root moisture.";
  }

  // 3. Harvesting & Fieldwork Advisory
  let harvestingStatus: "favorable" | "moderate" | "unfavorable" = "favorable";
  let harvestingTitle = "Excellent Fieldwork & Harvesting Conditions";
  let harvestingMessage = "Dry conditions and clear sunshine provide excellent grain drying and tractor mobility.";
  const harvestingTips: string[] = [];

  if (next3DaysRainSum > 10 || current.weatherCode >= 61) {
    harvestingStatus = "unfavorable";
    harvestingTitle = "Avoid Harvesting / Wet Conditions";
    harvestingMessage = "Wet soil and rain will increase post-harvest grain fungal contamination and trap heavy machinery.";
    harvestingTips.push("Ensure harvested grains in yards are covered with waterproof tarpaulins.");
  } else if (next24hMaxRainProb > 40) {
    harvestingStatus = "moderate";
    harvestingTitle = "Proceed with Caution";
    harvestingMessage = "Isolated showers possible. Complete urgent field operations early.";
    harvestingTips.push("Keep tarpaulins ready nearby during threshing and bagging.");
  } else {
    harvestingTips.push("Optimal moisture for harvesting cereals: 14-16%.");
  }

  // 4. Disease & Pest Risk Advisory
  let diseaseLevel: "low" | "moderate" | "high" = "low";
  let diseaseTitle = "Low Climate Disease Pressure";
  let diseaseRiskFactor = "Moderate humidity and fair temperatures are unfavorable for pathogen spore germination.";
  const vulnerableCrops = ["General Crops", "Field Cereals"];
  const diseaseRecs: string[] = ["Maintain regular crop scouting routines."];

  if (current.humidity > 78 && current.temperature >= 20 && current.temperature <= 32) {
    diseaseLevel = "high";
    diseaseTitle = "High Fungal / Blight Risk Alert";
    diseaseRiskFactor = `High relative humidity (${current.humidity}%) combined with warm ambient temperature (${current.temperature}°C) creates ideal microclimate for fungal spores.`;
    vulnerableCrops.push("Tomatoes", "Potatoes", "Grapes", "Chilli", "Rice");
    diseaseRecs.push("Check lower leaf surfaces for Early/Late Blight, Downy Mildew, or Blast lesions.");
    diseaseRecs.push("Ensure proper crop canopy aeration and avoid flood overhead watering.");
  } else if (current.humidity > 68 || next24hRainSum > 5) {
    diseaseLevel = "moderate";
    diseaseTitle = "Moderate Pest / Mold Risk";
    diseaseRiskFactor = "Humid intervals may encourage sucking pests (Aphids, Thrips, Whiteflies) and mild powdery mildew.";
    vulnerableCrops.push("Vegetables", "Pulses", "Cotton");
    diseaseRecs.push("Install yellow sticky traps and inspect shoot tips.");
  }

  // 5. Severe Weather Alerts
  const alerts: WeatherAlert[] = [];

  if (current.temperature >= 39 || daily[0]?.maxTemp >= 40) {
    alerts.push({
      type: "warning",
      title: "Heatwave Alert",
      description: `Maximum daytime temperature reaching ${Math.max(current.temperature, daily[0]?.maxTemp || 0)}°C. High risk of pollen sterility and moisture stress.`,
      action: "Provide light frequent irrigation and provide mulching / shade net covering for sensitive crops.",
    });
  }

  if (daily[0]?.minTemp <= 4) {
    alerts.push({
      type: "warning",
      title: "Frost Warning",
      description: `Nighttime temperature dropping to ${daily[0]?.minTemp}°C. Frost crystals can rupture tender vegetable cell walls.`,
      action: "Run light evening irrigation and create protective smoke smudges around orchard perimeters.",
    });
  }

  if (current.weatherCode === 95 || current.weatherCode === 96 || current.weatherCode === 99) {
    alerts.push({
      type: "warning",
      title: "Active Thunderstorm Alert",
      description: "Severe lightning and squall winds active in this region.",
      action: "Immediate safety: move farm workers away from tall trees and open steel sheds.",
    });
  }

  if (daily[0]?.precipitationSum >= 30 || next24hRainSum >= 30) {
    alerts.push({
      type: "caution",
      title: "Heavy Rainfall Alert",
      description: `Anticipated rainfall exceeding 30 mm (${daily[0]?.precipitationSum} mm). Risk of water logging in clay soils.`,
      action: "Open drainage furrows immediately to prevent root rot (Pythium/Phytophthora).",
    });
  }

  return {
    spraying: {
      status: sprayingStatus,
      title: sprayingTitle,
      message: sprayingMessage,
      tips: sprayingTips,
    },
    irrigation: {
      status: irrigationStatus,
      title: irrigationTitle,
      advice: irrigationAdvice,
      expectedRainfallMm: next3DaysRainSum,
      evapotranspirationMm: todayET0,
      recommendation: irrigationRecommendation,
    },
    harvesting: {
      status: harvestingStatus,
      title: harvestingTitle,
      message: harvestingMessage,
      tips: harvestingTips,
    },
    diseaseRisk: {
      level: diseaseLevel,
      title: diseaseTitle,
      riskFactor: diseaseRiskFactor,
      vulnerableCrops,
      recommendations: diseaseRecs,
    },
    alerts,
  };
}
