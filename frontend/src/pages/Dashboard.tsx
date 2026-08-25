import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CloudRain,
  Droplets,
  IndianRupee,
  Leaf,
  MapPin,
  Package,
  RefreshCw,
  Sparkles,
  Sprout,
  Wheat,
  Wind,
} from "lucide-react";
import { Link } from "react-router-dom";

import PageHeader from "@/components/common/PageHeader";
import {
  type CompleteWeatherReport,
  type LocationOption,
  fetchFarmWeatherData,
  getSavedFarmerLocation,
} from "@/services/weatherService";

const stats = [
  {
    label: "Total Farms",
    value: "3",
    icon: Leaf,
  },
  {
    label: "Active Crops",
    value: "4",
    icon: Sprout,
  },
  {
    label: "Expected Harvest",
    value: "8,500 kg",
    icon: Wheat,
  },
  {
    label: "Total Expenses",
    value: "₹79,000",
    icon: IndianRupee,
  },
  {
    label: "Estimated Profit",
    value: "₹1,67,000",
    icon: ArrowUpRight,
  },
];

function Dashboard() {
  const [weatherReport, setWeatherReport] = useState<CompleteWeatherReport | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [farmerLocation] = useState<LocationOption>(() => getSavedFarmerLocation());

  useEffect(() => {
    let isMounted = true;
    async function loadQuickWeather() {
      setLoadingWeather(true);
      try {
        const data = await fetchFarmWeatherData(farmerLocation);
        if (isMounted) {
          setWeatherReport(data);
        }
      } catch (err) {
        console.error("Dashboard weather fetch error:", err);
      } finally {
        if (isMounted) {
          setLoadingWeather(false);
        }
      }
    }
    loadQuickWeather();
    return () => {
      isMounted = false;
    };
  }, [farmerLocation]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Farmer!"
        description="Here's an overview of your farms, live weather conditions, and current agricultural activity."
      />

      {/* Live Farm Weather Banner */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 text-white shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Location & Current Conditions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                <Sparkles size={13} />
                Live Farm Weather Forecast
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin size={13} className="text-emerald-400" />
                <span>{farmerLocation.farmName || farmerLocation.name}</span>
              </div>
            </div>

            {loadingWeather ? (
              <div className="flex items-center gap-3 py-3">
                <RefreshCw size={20} className="animate-spin text-emerald-400" />
                <span className="text-sm text-slate-300">Fetching live weather data...</span>
              </div>
            ) : weatherReport ? (
              <div>
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {weatherReport.current.temperature}°C
                  </span>
                  <div>
                    <p className="text-base font-semibold text-emerald-400">
                      {weatherReport.current.condition}
                    </p>
                    <p className="text-xs text-slate-400">
                      Feels like {weatherReport.current.apparentTemperature}°C • Rain Chance:{" "}
                      {weatherReport.daily[0]?.precipitationProbability ?? 0}%
                    </p>
                  </div>
                </div>

                {/* Quick metrics */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Droplets size={14} className="text-blue-400" />
                    <span>Humidity: {weatherReport.current.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind size={14} className="text-teal-400" />
                    <span>Wind: {weatherReport.current.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CloudRain size={14} className="text-sky-400" />
                    <span>Today Rain: {weatherReport.daily[0]?.precipitationSum ?? 0} mm</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-300">
                Weather information currently unavailable.
              </p>
            )}
          </div>

          {/* Right: Quick Agri Advisory & CTA */}
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:flex-row sm:items-center lg:max-w-md">
            <div className="flex-1 text-xs">
              {weatherReport ? (
                <>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        weatherReport.advisories.spraying.status === "favorable"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {weatherReport.advisories.spraying.status.toUpperCase()} SPRAY WINDOW
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-slate-200">
                    {weatherReport.advisories.spraying.title}
                  </p>
                  <p className="line-clamp-2 text-slate-400">
                    {weatherReport.advisories.irrigation.advice}
                  </p>
                </>
              ) : (
                <p className="text-slate-400">
                  Check hyper-local 7-day forecast and smart spraying/irrigation advisories.
                </p>
              )}
            </div>

            <Link
              to="/app/weather"
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              <span>Full Forecast</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Icon size={18} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main dashboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Current Crop Health
              </h2>
              <p className="text-sm text-slate-500">
                Overview of active crops
              </p>
            </div>

            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {[
              ["Wheat", "Green Acre Farm", "Healthy"],
              ["Tomatoes", "Sunrise Plot", "Needs Attention"],
              ["Potatoes", "Riverbed Field", "Healthy"],
              ["Basmati Rice", "Green Acre Farm", "Healthy"],
            ].map(([crop, farm, status]) => (
              <div
                key={crop}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">{crop}</p>
                  <p className="text-sm text-slate-500">{farm}</p>
                </div>

                <span
                  className={
                    status === "Healthy"
                      ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
                  }
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-emerald-400">
            Smart Recommendation
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Check your tomato harvest
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your tomato batch may have elevated spoilage risk.
            Run the decision engine to compare selling, storage,
            and processing options.
          </p>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
            <Package size={18} />
            Open Decision Engine
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;