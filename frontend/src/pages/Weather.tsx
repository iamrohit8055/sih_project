import { useEffect, useState, useRef } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  LocateFixed,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Sprout,
  Sun,
  Sunrise,
  Sunset,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Wind,
  CheckCircle2,
  Bookmark,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import {
  type CompleteWeatherReport,
  type LocationOption,
  PRESET_FARM_LOCATIONS,
  fetchFarmWeatherData,
  getSavedFarmerLocation,
  reverseGeocodeLocation,
  saveFarmerLocation,
  searchLocations,
} from "@/services/weatherService";

function WeatherIcon({
  code,
  className = "w-6 h-6",
}: {
  code: number;
  className?: string;
}) {
  if (code === 0 || code === 1) {
    return <Sun className={`${className} text-amber-500`} />;
  }
  if (code === 2) {
    return <CloudSun className={`${className} text-amber-400`} />;
  }
  if (code === 3) {
    return <Cloud className={`${className} text-slate-400`} />;
  }
  if (code === 45 || code === 48) {
    return <CloudFog className={`${className} text-teal-400`} />;
  }
  if (code >= 51 && code <= 57) {
    return <CloudDrizzle className={`${className} text-blue-400`} />;
  }
  if (code >= 61 && code <= 82) {
    return <CloudRain className={`${className} text-blue-500`} />;
  }
  if (code >= 95) {
    return <CloudLightning className={`${className} text-purple-500`} />;
  }
  return <CloudSun className={`${className} text-amber-500`} />;
}

function Weather() {
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(() =>
    getSavedFarmerLocation()
  );
  const [report, setReport] = useState<CompleteWeatherReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load weather report when selectedLocation changes
  const loadWeather = async (loc: LocationOption) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFarmWeatherData(loc);
      setReport(data);
    } catch (err: unknown) {
      console.error("Weather load error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch weather forecast. Please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  // Handle GPS location detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const detectedLoc = await reverseGeocodeLocation(lat, lon);
          setSelectedLocation(detectedLoc);
          saveFarmerLocation(detectedLoc);
          setSavedSuccessMsg("Current farm coordinates detected & saved!");
          setTimeout(() => setSavedSuccessMsg(null), 3500);
        } catch (err) {
          console.error("GPS Reverse Geocode Error:", err);
          setError("Could not resolve location name from GPS coordinates.");
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        let msg = "Could not retrieve GPS location.";
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          msg = "GPS location permission was denied. Please select your farm from presets or search.";
        }
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Search location handler
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowDropdown(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationOption) => {
    setSelectedLocation(loc);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleSavePrimaryFarm = () => {
    saveFarmerLocation(selectedLocation);
    setSavedSuccessMsg(`"${selectedLocation.farmName || selectedLocation.name}" saved as your default farm!`);
    setTimeout(() => setSavedSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Farmer Weather & Agricultural Forecast"
          description="Live meteorological data, hyper-local farm weather, and actionable AI crop advisories."
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadWeather(selectedLocation)}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            title="Refresh latest forecast"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin text-emerald-600" : ""} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleSavePrimaryFarm}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            title="Save as my default farm location"
          >
            <Bookmark size={16} />
            <span className="hidden sm:inline">Save Farm</span>
          </button>
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Location Selector Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Active location indicator */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <MapPin size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">
                  {selectedLocation.farmName || selectedLocation.name}
                </p>
                {selectedLocation.admin1 && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {selectedLocation.admin1}, {selectedLocation.country || "India"}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Coordinates: {selectedLocation.latitude.toFixed(4)}° N,{" "}
                {selectedLocation.longitude.toFixed(4)}° E
                {report?.lastUpdated && ` • Updated at ${report.lastUpdated}`}
              </p>
            </div>
          </div>

          {/* Location Controls: Search, GPS, Preset Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            {/* GPS Locate button */}
            <button
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60"
            >
              <LocateFixed
                size={16}
                className={isLocating ? "animate-spin text-emerald-600" : "text-emerald-600"}
              />
              <span>{isLocating ? "Locating..." : "Use My GPS"}</span>
            </button>

            {/* Farm Presets Dropdown */}
            <select
              value={
                PRESET_FARM_LOCATIONS.find(
                  (p) =>
                    p.latitude === selectedLocation.latitude &&
                    p.longitude === selectedLocation.longitude
                )?.id || ""
              }
              onChange={(e) => {
                const found = PRESET_FARM_LOCATIONS.find((p) => p.id === e.target.value);
                if (found) setSelectedLocation(found);
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none hover:border-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="" disabled>
                Select Agri Region...
              </option>
              {PRESET_FARM_LOCATIONS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.farmName}
                </option>
              ))}
            </select>

            {/* Search Autocomplete Input */}
            <div ref={searchContainerRef} className="relative min-w-[220px] flex-1 sm:w-64">
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowDropdown(true);
                  }}
                  placeholder="Search village, city, district..."
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
                {isSearching && <RefreshCw size={13} className="animate-spin text-slate-400" />}
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                  {searchResults.map((item, idx) => (
                    <button
                      key={`${item.latitude}-${item.longitude}-${idx}`}
                      onClick={() => handleSelectLocation(item)}
                      className="flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-xs transition hover:bg-emerald-50 hover:text-emerald-900"
                    >
                      <MapPin size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.admin1 ? `${item.admin1}, ` : ""}
                          {item.country || "India"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <TriangleAlert size={20} className="mt-0.5 shrink-0 text-rose-600" />
          <div className="flex-1">
            <p className="font-semibold">Unable to load weather forecast</p>
            <p className="text-rose-700">{error}</p>
          </div>
          <button
            onClick={() => loadWeather(selectedLocation)}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid gap-6">
          <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
          <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      )}

      {/* Weather Content */}
      {!isLoading && report && (
        <>
          {/* Active Severe Weather Alerts (if any) */}
          {report.advisories.alerts.length > 0 && (
            <div className="space-y-3">
              {report.advisories.alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${
                    alert.type === "warning"
                      ? "border-amber-300 bg-amber-50 text-amber-950"
                      : "border-sky-300 bg-sky-50 text-sky-950"
                  }`}
                >
                  <ShieldAlert
                    size={22}
                    className={`mt-0.5 shrink-0 ${
                      alert.type === "warning" ? "text-amber-600" : "text-sky-600"
                    }`}
                  />
                  <div className="flex-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
                          alert.type === "warning"
                            ? "bg-amber-200 text-amber-900"
                            : "bg-sky-200 text-sky-900"
                        }`}
                      >
                        {alert.type}
                      </span>
                      <p className="font-bold">{alert.title}</p>
                    </div>
                    <p className="mt-1 text-slate-700">{alert.description}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-900">
                      Recommended Action:{" "}
                      <span className="font-normal text-slate-800">{alert.action}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hero: Current Farm Weather Card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl lg:p-8">
            {/* Background glowing sphere decoration */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-12">
              {/* Left Column: Temperature, Condition, Min/Max */}
              <div className="flex flex-col justify-between lg:col-span-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30">
                      <Sparkles size={13} />
                      Live Weather Forecast
                    </span>
                    <span className="text-xs text-slate-400">
                      Free Open-Meteo Precision Feed
                    </span>
                  </div>

                  <div className="mt-5 flex items-baseline gap-4">
                    <span className="text-6xl font-extrabold tracking-tight lg:text-7xl">
                      {report.current.temperature}°
                      <span className="text-3xl font-light text-slate-400">C</span>
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-emerald-400">
                        {report.current.condition}
                      </p>
                      <p className="text-xs text-slate-400">
                        Feels like {report.current.apparentTemperature}°C
                      </p>
                    </div>
                  </div>

                  {/* Today's High and Low */}
                  {report.daily[0] && (
                    <div className="mt-4 flex items-center gap-4 text-sm text-slate-300">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} className="text-rose-400" />
                        <span>High: {report.daily[0].maxTemp}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown size={16} className="text-sky-400" />
                        <span>Low: {report.daily[0].minTemp}°C</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets size={16} className="text-blue-400" />
                        <span>Rain Chance: {report.daily[0].precipitationProbability}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sun info */}
                {report.daily[0] && (
                  <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Sunrise size={18} className="text-amber-400" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">Sunrise</p>
                        <p className="font-semibold text-slate-200">{report.daily[0].sunrise}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset size={18} className="text-orange-400" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">Sunset</p>
                        <p className="font-semibold text-slate-200">{report.daily[0].sunset}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun size={18} className="text-amber-400" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">Max UV Index</p>
                        <p className="font-semibold text-slate-200">{report.daily[0].uvIndexMax} / 11</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Key Agricultural Weather Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-6">
                {/* Humidity */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs">Relative Humidity</span>
                    <Droplets size={16} className="text-blue-400" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {report.current.humidity}%
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {report.current.humidity > 75
                      ? "High (Fungal Risk)"
                      : report.current.humidity < 35
                      ? "Dry (High Transpiration)"
                      : "Optimal"}
                  </p>
                </div>

                {/* Wind Speed */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs">Wind Speed</span>
                    <Wind size={16} className="text-teal-400" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {report.current.windSpeed}{" "}
                    <span className="text-xs font-normal text-slate-400">km/h</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Dir: {report.current.windDirection}°
                  </p>
                </div>

                {/* Precipitation */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs">Current Rain</span>
                    <CloudRain size={16} className="text-sky-400" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {report.current.precipitation}{" "}
                    <span className="text-xs font-normal text-slate-400">mm</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {report.current.rain > 0 ? "Active Rainfall" : "No rain now"}
                  </p>
                </div>

                {/* Evapotranspiration ET0 */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs">Crop ET₀ Water Loss</span>
                    <Sprout size={16} className="text-emerald-400" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {report.daily[0]?.evapotranspiration || 3.5}{" "}
                    <span className="text-xs font-normal text-slate-400">mm/day</span>
                  </p>
                  <p className="text-[11px] text-slate-400">FAO Reference Loss</p>
                </div>

                {/* Atmospheric Pressure */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs">Barometer Pressure</span>
                    <Gauge size={16} className="text-amber-400" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {report.current.surfacePressure}{" "}
                    <span className="text-xs font-normal text-slate-400">hPa</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Surface level</p>
                </div>

                {/* Cloud & Visibility */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs">Cloud Cover</span>
                    <Cloud size={16} className="text-indigo-400" />
                  </div>
                  <p className="mt-2 text-xl font-bold text-white">
                    {report.current.cloudCover}%
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Vis: {report.current.visibility || 10} km
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agricultural AI Advisories Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Farmer Actionable Advisories
                </h3>
                <p className="text-xs text-slate-500">
                  Meteorological analysis for spraying, irrigation, harvest and disease prevention
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* 1. Spraying Window Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Spraying Window
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        report.advisories.spraying.status === "favorable"
                          ? "bg-emerald-100 text-emerald-800"
                          : report.advisories.spraying.status === "moderate"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {report.advisories.spraying.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="mt-3 font-bold text-slate-900">
                    {report.advisories.spraying.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {report.advisories.spraying.message}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-semibold text-slate-700">Agronomist Tip:</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {report.advisories.spraying.tips[0] ||
                      "Keep wind speeds below 15 km/h for best chemical absorption."}
                  </p>
                </div>
              </div>

              {/* 2. Irrigation Guide */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Irrigation Schedule
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        report.advisories.irrigation.status === "skip"
                          ? "bg-sky-100 text-sky-800"
                          : report.advisories.irrigation.status === "monitor"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {report.advisories.irrigation.status === "skip"
                        ? "HOLD IRRIGATION"
                        : report.advisories.irrigation.status === "monitor"
                        ? "MONITOR MOISTURE"
                        : "IRRIGATE TODAY"}
                    </span>
                  </div>

                  <h4 className="mt-3 font-bold text-slate-900">
                    {report.advisories.irrigation.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {report.advisories.irrigation.advice}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>3-Day Rain: {report.advisories.irrigation.expectedRainfallMm} mm</span>
                    <span>ET₀: {report.advisories.irrigation.evapotranspirationMm} mm</span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-emerald-700">
                    {report.advisories.irrigation.recommendation}
                  </p>
                </div>
              </div>

              {/* 3. Harvesting & Field Operations */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Fieldwork & Harvest
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        report.advisories.harvesting.status === "favorable"
                          ? "bg-emerald-100 text-emerald-800"
                          : report.advisories.harvesting.status === "moderate"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {report.advisories.harvesting.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="mt-3 font-bold text-slate-900">
                    {report.advisories.harvesting.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {report.advisories.harvesting.message}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-semibold text-slate-700">Storage Tip:</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {report.advisories.harvesting.tips[0] ||
                      "Keep produce bags in dry, well-ventilated storage sheds."}
                  </p>
                </div>
              </div>

              {/* 4. Disease & Pest Climate Risk */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Disease Climate Risk
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        report.advisories.diseaseRisk.level === "low"
                          ? "bg-emerald-100 text-emerald-800"
                          : report.advisories.diseaseRisk.level === "moderate"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {report.advisories.diseaseRisk.level.toUpperCase()} RISK
                    </span>
                  </div>

                  <h4 className="mt-3 font-bold text-slate-900">
                    {report.advisories.diseaseRisk.title}
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {report.advisories.diseaseRisk.riskFactor}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-semibold text-slate-700">Vulnerable Crops:</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {report.advisories.diseaseRisk.vulnerableCrops.slice(0, 3).map((crop) => (
                      <span
                        key={crop}
                        className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Forecast (24 Hours) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Hourly Weather Trend</h3>
                <p className="text-xs text-slate-500">
                  Next 24 hours temperature curve, precipitation chance and wind
                </p>
              </div>
              <span className="text-xs font-medium text-slate-400">Scroll horizontally →</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {report.hourly.map((hour, idx) => (
                <div
                  key={idx}
                  className={`flex min-w-[90px] flex-col items-center justify-between rounded-2xl border p-3 text-center transition ${
                    idx === 0
                      ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 bg-slate-50/70 hover:bg-slate-100"
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-700">{hour.displayTime}</p>

                  <div className="my-2">
                    <WeatherIcon code={hour.weatherCode} className="h-7 w-7" />
                  </div>

                  <p className="text-base font-bold text-slate-900">{hour.temperature}°C</p>

                  <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600">
                    <Droplets size={12} />
                    <span>{hour.precipitationProbability}%</span>
                  </div>

                  <p className="mt-1 text-[10px] text-slate-400">{hour.windSpeed} km/h</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Agronomy Forecast Table */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">7-Day Farm Outlook</h3>
                <p className="text-xs text-slate-500">
                  Daily temperature ranges, estimated rain volume (mm), ET₀, and field conditions
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
              {report.daily.map((day, idx) => {
                const isToday = idx === 0;
                return (
                  <div
                    key={day.date}
                    className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
                      isToday
                        ? "border-emerald-400 bg-emerald-50/40 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <p className={`font-bold ${isToday ? "text-emerald-700" : "text-slate-900"}`}>
                          {day.dayName}
                        </p>
                        <span className="text-[11px] text-slate-400">{day.displayDate}</span>
                      </div>

                      <div className="my-3 flex items-center gap-2">
                        <WeatherIcon code={day.weatherCode} className="h-8 w-8" />
                        <span className="text-xs font-medium leading-tight text-slate-700">
                          {day.condition}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                      {/* Temp High / Low */}
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{day.maxTemp}°</span>
                        <span className="text-slate-400">{day.minTemp}°</span>
                      </div>

                      {/* Rain Sum & Prob */}
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-blue-600">
                          <Droplets size={13} />
                          {day.precipitationSum} mm
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {day.precipitationProbability}%
                        </span>
                      </div>

                      {/* ET0 & Wind */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>ET₀: {day.evapotranspiration} mm</span>
                        <span>{day.windSpeedMax} km/h</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
