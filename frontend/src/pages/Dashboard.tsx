import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  AlertTriangle,
  CalendarCheck,
  CloudSun,
  IndianRupee,
  Leaf,
  MapPin,
  Package,
  RefreshCw,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  Wheat,
  ArrowRight,
  CloudRain,
  Droplets,
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

const crops = [
  ["Wheat", "Green Acre Farm", "Healthy"],
  ["Tomatoes", "Sunrise Plot", "Needs Attention"],
  ["Potatoes", "Riverbed Field", "Healthy"],
  ["Basmati Rice", "Green Acre Farm", "Healthy"],
];

const tasks = [
  {
    title: "Irrigate tomatoes",
    subtitle: "Sunrise Plot",
    time: "Today · 6:00 AM",
    icon: Droplets,
  },
  {
    title: "Inspect potato leaves",
    subtitle: "Riverbed Field",
    time: "Today · 10:00 AM",
    icon: Leaf,
  },
  {
    title: "Apply fertilizer",
    subtitle: "Green Acre Farm",
    time: "Tomorrow",
    icon: Sprout,
  },
];

const marketPrices = [
  {
    crop: "Wheat",
    price: "₹2,450",
    unit: "/ quintal",
    change: "+4.2%",
    positive: true,
  },
  {
    crop: "Tomatoes",
    price: "₹2,800",
    unit: "/ quintal",
    change: "-2.1%",
    positive: false,
  },
  {
    crop: "Potatoes",
    price: "₹1,900",
    unit: "/ quintal",
    change: "+6.5%",
    positive: true,
  },
];

const farmData = [
  {
    name: "Green Acre Farm",
    location: "North Field",
    acres: "18 acres",
    crops: "2 crops",
  },
  {
    name: "Sunrise Plot",
    location: "East Field",
    acres: "8 acres",
    crops: "1 crop",
  },
  {
    name: "Riverbed Field",
    location: "South Field",
    acres: "12 acres",
    crops: "1 crop",
  },
];

type PerformanceMetric = "health" | "yield" | "profitability";
type PerformancePeriod = "thisSeason" | "lastSeason";

const performanceData = {
  thisSeason: {
    health: [
      { crop: "Wheat", value: 82, change: 12 },
      { crop: "Tomatoes", value: 68, change: 7 },
      { crop: "Potatoes", value: 76, change: 18 },
      { crop: "Basmati Rice", value: 61, change: -3 },
    ],
    yield: [
      { crop: "Wheat", value: 88, change: 14 },
      { crop: "Tomatoes", value: 72, change: 5 },
      { crop: "Potatoes", value: 81, change: 11 },
      { crop: "Basmati Rice", value: 64, change: -4 },
    ],
    profitability: [
      { crop: "Wheat", value: 79, change: 9 },
      { crop: "Tomatoes", value: 63, change: -2 },
      { crop: "Potatoes", value: 86, change: 16 },
      { crop: "Basmati Rice", value: 58, change: -6 },
    ],
  },

  lastSeason: {
    health: [
      { crop: "Wheat", value: 74, change: 5 },
      { crop: "Tomatoes", value: 63, change: 2 },
      { crop: "Potatoes", value: 64, change: 9 },
      { crop: "Basmati Rice", value: 64, change: 4 },
    ],
    yield: [
      { crop: "Wheat", value: 76, change: 8 },
      { crop: "Tomatoes", value: 67, change: 3 },
      { crop: "Potatoes", value: 72, change: 7 },
      { crop: "Basmati Rice", value: 68, change: 2 },
    ],
    profitability: [
      { crop: "Wheat", value: 70, change: 6 },
      { crop: "Tomatoes", value: 65, change: 4 },
      { crop: "Potatoes", value: 74, change: 10 },
      { crop: "Basmati Rice", value: 64, change: 1 },
    ],
  },
};

function Dashboard() {
  const [performanceMetric, setPerformanceMetric] =
    useState<PerformanceMetric>("health");

  const [performancePeriod, setPerformancePeriod] =
    useState<PerformancePeriod>("thisSeason");

  const currentPerformance =
    performanceData[performancePeriod][performanceMetric];

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
      {/* Header */}
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
              className="rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>

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

      {/* Weather + Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weather */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Today's Weather
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Good day for irrigation
              </h2>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-500">
              <CloudSun size={26} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-8">
            <div>
              <p className="text-4xl font-bold text-slate-900">28°C</p>
              <p className="mt-1 text-sm text-slate-500">Mostly Sunny</p>
            </div>

            <div className="h-12 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <Droplets size={18} className="text-blue-500" />
              <div>
                <p className="font-semibold text-slate-900">68%</p>
                <p className="text-xs text-slate-500">Humidity</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CloudSun size={18} className="text-sky-500" />
              <div>
                <p className="font-semibold text-slate-900">20%</p>
                <p className="text-xs text-slate-500">Rain Chance</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wind size={18} className="text-slate-500" />
              <div>
                <p className="font-semibold text-slate-900">12 km/h</p>
                <p className="text-xs text-slate-500">Wind</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Farm Alerts
              </p>
              <h2 className="mt-1 font-bold text-slate-900">
                Needs your attention
              </h2>
            </div>

            <div className="rounded-lg bg-orange-50 p-2 text-orange-500">
              <AlertTriangle size={19} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-red-100 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-800">
                Tomato disease risk
              </p>
              <p className="mt-1 text-xs text-red-600">
                Inspect your tomato crop within 24 hours.
              </p>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
              <p className="text-sm font-semibold text-orange-800">
                Wheat irrigation due
              </p>
              <p className="mt-1 text-xs text-orange-600">
                Recommended irrigation window: 6–9 AM.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Health + Smart Recommendation */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Market Prices */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Market Intelligence
              </p>

              <h2 className="mt-1 font-semibold text-slate-900">
                Today's Market Prices
              </h2>
            </div>

            <button className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View market
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {marketPrices.map((item) => (
              <div
                key={item.crop}
                className="rounded-xl border p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{item.crop}</p>

                  <span
                    className={
                      item.positive
                        ? "flex items-center gap-1 text-xs font-semibold text-emerald-600"
                        : "flex items-center gap-1 text-xs font-semibold text-red-500"
                    }
                  >
                    {item.positive ? (
                      <TrendingUp size={13} />
                    ) : (
                      <TrendingDown size={13} />
                    )}
                    {item.change}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <p className="text-xl font-bold text-slate-900">
                    {item.price}
                  </p>

                  <span className="text-xs text-slate-500">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommendation */}
        <div className="rounded-2xl border bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-emerald-400">
            Smart Recommendation
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Check your tomato harvest
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your tomato batch may have elevated spoilage risk. Run the
            decision engine to compare selling, storage, and processing
            options.
          </p>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition-colors hover:bg-amber-400">
            <Package size={18} />
            Open Decision Engine
          </button>
        </div>
      </div>

      {/* Tasks + Crop Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Farm Schedule
              </p>

              <h2 className="mt-1 font-semibold text-slate-900">
                Today's Tasks
              </h2>
            </div>

            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CalendarCheck size={19} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {tasks.map((task) => {
              const Icon = task.icon;

              return (
                <div
                  key={task.title}
                  className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">
                      {task.title}
                    </p>

                    <p className="text-sm text-slate-500">
                      {task.subtitle}
                    </p>
                  </div>

                  <p className="text-right text-xs font-medium text-slate-500">
                    {task.time}
                  </p>
                </div>
              );
            })}
          </div>

          <button className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View all tasks →
          </button>
        </div>

        {/* Crop Performance */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Performance
              </p>

              <h2 className="mt-1 font-semibold text-slate-900">
                Crop Performance
              </h2>
            </div>

            <TrendingUp size={20} className="text-emerald-600" />
          </div>

          <div className="mt-6 space-y-5">
            {[
              ["Wheat", "82%", "+12%"],
              ["Tomatoes", "68%", "+7%"],
              ["Potatoes", "76%", "+18%"],
              ["Basmati Rice", "61%", "-3%"],
            ].map(([crop, progress, change]) => {
              const isPositive = change.startsWith("+");

              return (
                <div key={crop}>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">
                      {crop}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {progress}
                      </span>

                      <span
                        className={
                          isPositive
                            ? "flex items-center gap-0.5 text-xs font-semibold text-emerald-600"
                            : "flex items-center gap-0.5 text-xs font-semibold text-red-500"
                        }
                      >
                        {isPositive ? (
                          <TrendingUp size={13} />
                        ) : (
                          <TrendingDown size={13} />
                        )}
                        {change}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: progress }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-xs text-slate-400">
            Performance compared with previous season
          </p>
        </div>
      </div>

      {/* Crop Health */}
      <div className="self-start rounded-2xl border bg-white p-5 shadow-sm">          <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Current Crop Health
          </h2>
          <p className="text-xs text-slate-500">
            Overview of active crops
          </p>
        </div>

        <button className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700">
          View all
          <ArrowRight size={14} />
        </button>
      </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {crops.map(([crop, farm, status]) => (
            <div
              key={crop}
              className="flex items-center justify-between rounded-xl border px-3 py-2.5 transition-colors hover:bg-slate-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Leaf size={16} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {crop}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {farm}
                  </p>
                </div>
              </div>

              <span
                className={
                  status === "Healthy"
                    ? "shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                    : "shrink-0 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold text-orange-700"
                }
              >
                {status === "Healthy" ? "Healthy" : "Attention"}
              </span>
            </div>
          ))}
        </div>
      </div>



      {/* Farm Overview */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Your Properties
            </p>

            <h2 className="mt-1 font-semibold text-slate-900">
              Farm Overview
            </h2>
          </div>

          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            Manage farms →
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {farmData.map((farm) => (
            <div
              key={farm.name}
              className="group rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Leaf size={18} />
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-slate-300 transition-colors group-hover:text-emerald-500"
                />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                {farm.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {farm.location}
              </p>

              <div className="mt-4 flex gap-4 text-xs font-medium text-slate-500">
                <span>{farm.acres}</span>
                <span>•</span>
                <span>{farm.crops}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
