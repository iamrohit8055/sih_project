import {
  ArrowLeft,
  CalendarDays,
  Droplets,
  Leaf,
  MapPin,
  Sprout,
  Thermometer,
  Wheat,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import CropTimeline from "@/components/crops/CropTimeline";
import HealthOverview from "@/components/crops/HealthOverview";

const mockCrops = [
  {
    id: 1,
    name: "Wheat",
    variety: "HD-2967",
    farm: "Green Acre Farm",
    area: 3.5,
    sowingDate: "12 Nov 2025",
    harvestDate: "20 Mar 2026",
    health: "Healthy",
    progress: 72,
    icon: "🌾",
    stage: "Grain Filling",
    soil: "Loamy",
    irrigation: "Drip Irrigation",
  },
  {
    id: 2,
    name: "Tomato",
    variety: "Hybrid",
    farm: "Sunrise Plot",
    area: 1.8,
    sowingDate: "05 Jan 2026",
    harvestDate: "15 Apr 2026",
    health: "Needs Attention",
    progress: 54,
    icon: "🍅",
    stage: "Flowering",
    soil: "Sandy Loam",
    irrigation: "Sprinkler",
  },
  {
    id: 3,
    name: "Potato",
    variety: "Kufri Jyoti",
    farm: "Riverbed Field",
    area: 2.2,
    sowingDate: "22 Dec 2025",
    harvestDate: "05 Apr 2026",
    health: "Healthy",
    progress: 61,
    icon: "🥔",
    stage: "Tuber Development",
    soil: "Loamy",
    irrigation: "Drip Irrigation",
  },
  {
    id: 4,
    name: "Basmati Rice",
    variety: "PB-1121",
    farm: "Green Acre Farm",
    area: 4.5,
    sowingDate: "18 Jun 2025",
    harvestDate: "28 Oct 2025",
    health: "Critical",
    progress: 36,
    icon: "🌱",
    stage: "Vegetative",
    soil: "Clay Loam",
    irrigation: "Flood Irrigation",
  },
];

function CropDetails() {
  const { cropId } = useParams();

  const crop = mockCrops.find(
    (item) => item.id === Number(cropId),
  );

  if (!crop) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Crop not found
        </h1>

        <p className="mt-2 text-slate-500">
          The crop you're looking for doesn't exist.
        </p>

        <Link to="/app/crops" className="mt-5">
          <Button variant="outline">
            Back to My Crops
          </Button>
        </Link>
      </div>
    );
  }

  const healthStyles =
    crop.health === "Healthy"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : crop.health === "Needs Attention"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        to="/app/crops"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
      >
        <ArrowLeft size={17} />
        Back to My Crops
      </Link>

      {/* Header */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
              {crop.icon}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {crop.name}
                </h1>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${healthStyles}`}
                >
                  {crop.health}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {crop.variety} · {crop.farm}
              </p>
            </div>
          </div>

          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Run Health Check
          </Button>
        </div>
      </div>

      <HealthOverview status={crop.health} />

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Growth */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Crop Growth
              </h2>

              <p className="text-sm text-slate-500">
                Current growth and harvest progress
              </p>
            </div>

            <Sprout className="text-emerald-600" size={22} />
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Overall progress
              </span>

              <span className="text-sm font-bold text-emerald-600">
                {crop.progress}%
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${crop.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <InfoCard
              icon={<Sprout size={18} />}
              label="Current Stage"
              value={crop.stage}
            />

            <InfoCard
              icon={<CalendarDays size={18} />}
              label="Expected Harvest"
              value={crop.harvestDate}
            />

            <InfoCard
              icon={<Wheat size={18} />}
              label="Farm Area"
              value={`${crop.area} acres`}
            />
          </div>
        </div>

        {/* AI recommendation */}
        <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400">
            <Leaf size={20} />

            <span className="text-sm font-semibold">
              Smart Recommendation
            </span>
          </div>

          {crop.health === "Healthy" ? (
            <>
              <h2 className="mt-5 text-xl font-bold">
                Crop looks healthy
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Continue your current irrigation and monitoring
                schedule. Keep checking soil moisture and weather
                conditions.
              </p>
            </>
          ) : crop.health === "Needs Attention" ? (
            <>
              <h2 className="mt-5 text-xl font-bold">
                Monitoring recommended
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                This crop needs closer monitoring. Run a disease
                scan and review the latest weather conditions.
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-5 text-xl font-bold">
                Immediate attention required
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your crop has a critical health status. Run a
                disease scan and review irrigation and environmental
                conditions immediately.
              </p>
            </>
          )}

          <Button className="mt-6 w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400">
            Open Disease Detection
          </Button>
        </div>
      </div>

      {/* Farm information */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-emerald-600" />

          <h2 className="font-semibold text-slate-900">
            Farm Information
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<MapPin size={18} />}
            label="Farm"
            value={crop.farm}
          />

          <InfoCard
            icon={<Wheat size={18} />}
            label="Area"
            value={`${crop.area} acres`}
          />

          <InfoCard
            icon={<Leaf size={18} />}
            label="Soil Type"
            value={crop.soil}
          />

          <InfoCard
            icon={<Droplets size={18} />}
            label="Irrigation"
            value={crop.irrigation}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid gap-6 md:grid-cols-2">
        <TimelineCard
          icon={<CalendarDays size={20} />}
          title="Sowing Date"
          value={crop.sowingDate}
        />

        <TimelineCard
          icon={<Thermometer size={20} />}
          title="Expected Harvest"
          value={crop.harvestDate}
        />
      </div>

      <CropTimeline />
    </div>
  );
}



function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function TimelineCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-1 font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default CropDetails;