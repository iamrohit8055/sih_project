import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
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
import { motion } from "framer-motion";

import PageHeader from "@/components/common/PageHeader";

import {
  type CompleteWeatherReport,
  type LocationOption,
  fetchFarmWeatherData,
  getSavedFarmerLocation,
} from "@/services/weatherService";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardHover = {
  y: -4,
  transition: {
    duration: 0.25,
    ease: "easeOut",
  },
};

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
    <motion.div
      className="space-y-6 min-h-screen space-y-6 bg-slate-50/70"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      
      {/* Header */}
      <PageHeader
        title="Welcome back, Farmer!"
        description="Here's an overview of your farms, live weather conditions, and current agricultural activity."
      />

      {/* Live Farm Weather Banner */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-r from-emerald-900 via-slate-900 to-slate-950 p-6 text-white shadow-md">
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
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-extrabold tracking-tight sm:text-5xl"
                  >
                    {weatherReport.current.temperature}°C
                  </motion.span>
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
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${weatherReport.advisories.spraying.status === "favorable"
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

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/app/weather"
                className="
      group flex shrink-0 items-center gap-2
      rounded-xl
      bg-emerald-400
      px-4 py-2.5
      text-xs font-bold text-slate-950
      shadow-lg shadow-emerald-950/20
      transition-all duration-300
      hover:bg-emerald-300
      hover:shadow-emerald-400/20
    "
              >
                <span>Full Forecast</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              whileHover={cardHover}
              className="
        group relative overflow-hidden rounded-2xl
        border border-slate-200/80
        bg-white p-5
        shadow-sm
        transition-shadow duration-300
        hover:shadow-xl hover:shadow-emerald-900/5
      "
            >
              {/* subtle background glow */}
              <div
                className="
          pointer-events-none absolute -right-8 -top-8
          h-24 w-24 rounded-full
          bg-emerald-100/40
          blur-2xl
          transition-all duration-500
          group-hover:bg-emerald-200/60
        "
              />

              <div className="relative flex items-center justify-between">
                <p className="text-sm text-slate-500 transition-colors group-hover:text-slate-600">
                  {stat.label}
                </p>

                <motion.div
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  className="
            rounded-xl bg-emerald-50 p-2.5
            text-emerald-600
            transition-colors duration-300
            group-hover:bg-emerald-100
          "
                >
                  <Icon size={18} />
                </motion.div>
              </div>

              <p className="relative mt-4 text-2xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </p>


            </motion.div>
          );
        })}
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
              <motion.div
                key={item.crop}
                whileHover={{
                  y: -3,
                  scale: 1.01,
                }}
                transition={{ duration: 0.2 }}
                className="
    group relative overflow-hidden
    rounded-xl border border-slate-200
    bg-white p-4
    transition-all duration-300
    hover:border-emerald-200
    hover:bg-emerald-50/30
    hover:shadow-md
  "
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{item.crop}</p>

                  <span
                    className={
                      item.positive
                        ? "flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600"
                        : "flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-500"
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
              </motion.div>
            ))}
          </div>
        </div>

        {/* Smart Recommendation */}
        <motion.div
          whileHover={{ y: -4 }}
          className="
    group relative overflow-hidden
    rounded-2xl
    border border-amber-900/30
    bg-gradient-to-br
    from-slate-950
    via-slate-900
    to-emerald-950
    p-6 text-white
    shadow-lg
    transition-shadow duration-300
    hover:shadow-xl
    hover:shadow-emerald-950/20
  "
        >
          <div
            className="
    pointer-events-none absolute
    -right-10 -top-10
    h-32 w-32 rounded-full
    bg-amber-400/10
    blur-3xl
  "
          />
          <p className="text-sm font-medium text-emerald-400">
            Smart Recommendation
          </p>

          <h2 className="relative mt-3 text-2xl font-bold tracking-tight">
            Check your tomato harvest
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Your tomato batch may have elevated spoilage risk. Run the
            decision engine to compare selling, storage, and processing
            options.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
    relative mt-6 flex w-full
    items-center justify-center gap-2
    rounded-xl
    bg-amber-500
    px-4 py-3
    font-semibold text-slate-950
    shadow-lg shadow-amber-950/10
    transition-all duration-300
    hover:bg-amber-400
  "
          >
            <Package size={18} />
            Open Decision Engine
          </motion.button>
        </motion.div>
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
                <motion.div
                  key={task.title}
                  whileHover={{ x: 4 }}
                  className="
                    group flex items-center gap-4
                    rounded-xl
                    border border-slate-200
                    bg-white p-4
                    transition-all duration-300
                    hover:border-emerald-200
                    hover:bg-emerald-50/20
                    hover:shadow-sm
                  "
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="
                    rounded-xl
                    bg-emerald-50
                    p-2.5
                    text-emerald-600
                    transition-colors
                    group-hover:bg-emerald-100
                    "
                  >
                    <Icon size={18} />
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">
                      {task.title}
                    </p>

                    <p className="text-sm text-slate-500">
                      {task.subtitle}
                    </p>
                  </div>

                  <p
                    className="
                    rounded-full
                    bg-slate-50
                    px-2.5 py-1
                    text-right text-[11px]
                    font-medium text-slate-500
                    transition-colors
                    group-hover:bg-emerald-50
                    group-hover:text-emerald-700
                  "
                  >
                    {task.time}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <button className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View all tasks →
          </button>
        </div>

        {/* Crop Performance */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
  {/* Header */}
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

  {/* Performance Metric Controls */}
  <div className="mt-5 flex flex-wrap gap-2">
    {[
      ["health", "Health"],
      ["yield", "Yield"],
      ["profitability", "Profitability"],
    ].map(([value, label]) => (
      <button
        key={value}
        onClick={() =>
          setPerformanceMetric(value as PerformanceMetric)
        }
        className={`
          rounded-lg px-3 py-1.5 text-xs font-medium
          transition-all duration-200
          ${
            performanceMetric === value
              ? "bg-emerald-100 text-emerald-700 shadow-sm"
              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          }
        `}
      >
        {label}
      </button>
    ))}
  </div>

  {/* Performance Period Controls */}
  <div className="mt-3 flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
    <button
      onClick={() => setPerformancePeriod("thisSeason")}
      className={`
        rounded-md px-3 py-1.5 text-xs font-medium transition
        ${
          performancePeriod === "thisSeason"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }
      `}
    >
      This Season
    </button>

    <button
      onClick={() => setPerformancePeriod("lastSeason")}
      className={`
        rounded-md px-3 py-1.5 text-xs font-medium transition
        ${
          performancePeriod === "lastSeason"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }
      `}
    >
      Last Season
    </button>
  </div>

  {/* Crop Performance */}
  <div className="mt-6 space-y-5">
    {currentPerformance.map((item) => {
      const isPositive = item.change >= 0;

      return (
        <motion.div
          key={item.crop}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              {item.crop}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                {item.value}%
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

                {isPositive ? "+" : ""}
                {item.change}%
              </span>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="
                h-full rounded-full
                bg-linear-to-r
                from-emerald-500
                to-green-400
              "
            />
          </div>
        </motion.div>
      );
    })}
  </div>

  {/* Footer */}
  <p className="mt-5 text-xs text-slate-400">
    Performance compared with previous season
  </p>
</div>
      </div>

      {/* Crop Health */}
      <div className="self-start rounded-2xl border bg-white p-5 shadow-sm">
  <div className="mb-4 flex items-center justify-between">
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
      <motion.div
        key={crop}
        whileHover={{
          y: -2,
          scale: 1.01,
        }}
        className="
          group flex items-center justify-between
          rounded-xl border
          px-3 py-2.5
          transition-all duration-300
          hover:border-emerald-200
          hover:bg-emerald-50/20
          hover:shadow-sm
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Animated crop icon */}
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.1,
            }}
            className="
              rounded-lg
              bg-emerald-50
              p-2
              text-emerald-600
              transition-colors
              group-hover:bg-emerald-100
            "
          >
            <Leaf size={16} />
          </motion.div>

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
      </motion.div>
    ))}
  </div>
</div>



      {/* Farm Overview */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
  {/* Header */}
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

  {/* Farm Cards */}
  <div className="mt-5 grid gap-4 md:grid-cols-3">
    {farmData.map((farm) => (
      <motion.div
        key={farm.name}
        whileHover={{
          y: -5,
          transition: { duration: 0.2 },
        }}
        className="
          group relative overflow-hidden
          rounded-2xl
          border border-slate-200
          bg-white p-5
          transition-all duration-300
          hover:border-emerald-200
          hover:shadow-lg
          hover:shadow-emerald-900/5
        "
      >
        {/* Subtle green glow */}
        <div
          className="
            pointer-events-none absolute
            -right-8 -top-8
            h-24 w-24
            rounded-full
            bg-emerald-100/40
            blur-2xl
            opacity-0
            transition-opacity duration-500
            group-hover:opacity-100
          "
        />

        {/* Card top row */}
        <div className="relative flex items-start justify-between">
          {/* Farm icon */}
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
            <Leaf size={18} />
          </div>

          {/* Animated arrow */}
          <ArrowUpRight
            size={17}
            className="
              text-slate-300
              transition-all duration-300
              group-hover:-translate-y-1
              group-hover:translate-x-1
              group-hover:text-emerald-500
            "
          />
        </div>

        {/* Farm name */}
        <h3 className="relative mt-4 font-semibold text-slate-900">
          {farm.name}
        </h3>

        {/* Location */}
        <p className="relative mt-1 text-sm text-slate-500">
          {farm.location}
        </p>

        {/* Farm details */}
        <div className="relative mt-4 flex gap-4 text-xs font-medium text-slate-500">
          <span>{farm.acres}</span>
          <span>•</span>
          <span>{farm.crops}</span>
        </div>
      </motion.div>
    ))}
  </div>
</div>
    </motion.div>
  );
}

export default Dashboard;
