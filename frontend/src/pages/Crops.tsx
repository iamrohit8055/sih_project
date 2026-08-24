import {
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Leaf,
  MapPin,
  Plus,
  Search,
  Sprout,
  Wheat,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddCropDialog from "@/components/crops/AddCropDialog";
import { Link } from "react-router-dom";



type CropStatus = "Healthy" | "Needs Attention" | "Critical";

type SortOption =
  | "name"
  | "progress-high"
  | "progress-low"
  | "harvest-nearest";

interface Crop {
  id: number;
  name: string;
  variety: string;
  farm: string;
  area: number;
  sowingDate: string;
  harvestDate: string;
  health: CropStatus;
  progress: number;
  icon: string;
}

const initialCrops: Crop[] = [
  {
    id: 1,
    name: "Wheat",
    variety: "HD-2967",
    farm: "Green Acre Farm",
    area: 3.5,
    sowingDate: "2025-11-12",
    harvestDate: "2026-03-20",
    health: "Healthy",
    progress: 72,
    icon: "🌾",
  },
  {
    id: 2,
    name: "Tomato",
    variety: "Hybrid",
    farm: "Sunrise Plot",
    area: 1.8,
    sowingDate: "2026-01-05",
    harvestDate: "2026-04-15",
    health: "Needs Attention",
    progress: 54,
    icon: "🍅",
  },
  {
    id: 3,
    name: "Potato",
    variety: "Kufri Jyoti",
    farm: "Riverbed Field",
    area: 2.2,
    sowingDate: "2025-12-22",
    harvestDate: "2026-04-05",
    health: "Healthy",
    progress: 61,
    icon: "🥔",
  },
  {
    id: 4,
    name: "Basmati Rice",
    variety: "PB-1121",
    farm: "Green Acre Farm",
    area: 4.5,
    sowingDate: "2025-06-18",
    harvestDate: "2025-10-28",
    health: "Critical",
    progress: 36,
    icon: "🌱",
  },
];

const statusStyles: Record<
  CropStatus,
  {
    badge: string;
    dot: string;
  }
> = {
  Healthy: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  "Needs Attention": {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  Critical: {
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};


function Crops() {
  const [search, setSearch] = useState("");
  const [cropList, setCropList] = useState<Crop[]>(initialCrops);
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | CropStatus
  >("All");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const filteredCrops = useMemo(() => {
  const result = cropList.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      crop.variety.toLowerCase().includes(search.toLowerCase()) ||
      crop.farm.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" ||
      crop.health === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return [...result].sort((a, b) => {
    switch (sortBy) {
      case "progress-high":
        return b.progress - a.progress;

      case "progress-low":
        return a.progress - b.progress;

      case "harvest-nearest":
        return (
          new Date(a.harvestDate).getTime() -
          new Date(b.harvestDate).getTime()
        );

      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });
}, [cropList, search, selectedStatus, sortBy]);

  const healthyCount = cropList.filter(
    (crop) => crop.health === "Healthy",
  ).length;

  const attentionCount = cropList.filter(
    (crop) => crop.health === "Needs Attention",
  ).length;

  const criticalCount = cropList.filter(
    (crop) => crop.health === "Critical",
  ).length;

  const handleAddCrop = (
  newCrop: Omit<Crop, "id" | "progress" | "icon">,
) => {
  const crop: Crop = {
    ...newCrop,
    id: Date.now(),
    progress: 0,
    icon: "🌱",
  };

  setCropList((current) => [crop, ...current]);
};

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Crops"
        description="Track your crops, monitor their health, and manage your farms."
        action={<AddCropDialog onAddCrop={handleAddCrop} />}
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Crops"
          value={cropList.length}
          description="Across all farms"
          icon={<Sprout size={20} />}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Healthy"
          value={healthyCount}
          description="Crops doing well"
          icon={<CircleCheck size={20} />}
          iconClassName="bg-green-50 text-green-600"
        />

        <SummaryCard
          title="Needs Attention"
          value={attentionCount}
          description="Requires monitoring"
          icon={<Leaf size={20} />}
          iconClassName="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          title="Critical"
          value={criticalCount}
          description="Immediate action needed"
          icon={<Wheat size={20} />}
          iconClassName="bg-red-50 text-red-600"
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search crops, varieties or farms..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["All", "Healthy", "Needs Attention", "Critical"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                    selectedStatus === status
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ),
            )}
          </div>
          <Select
            value={sortBy}
            onValueChange={(value) =>
            setSortBy(value as SortOption)
          }
          >
          <SelectTrigger className="w-full rounded-xl sm:w-[210px]">
            <SelectValue placeholder="Sort crops" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="name">
              Name: A → Z
            </SelectItem>

            <SelectItem value="progress-high">
              Progress: High → Low
            </SelectItem>

            <SelectItem value="progress-low">
              Progress: Low → High
            </SelectItem>

            <SelectItem value="harvest-nearest">
              Earliest Harvest
            </SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      {/* Crop cards */}
      {filteredCrops.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCrops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Search className="text-slate-400" />
          </div>

          <h3 className="mt-4 font-semibold text-slate-900">
            No crops found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  iconClassName: string;
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  iconClassName,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconClassName}`}>
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function CropCard({ crop }: { crop: Crop }) {
  const status = statusStyles[crop.health];

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Crop header */}
      <div className="flex items-start justify-between border-b p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
            {crop.icon}
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              {crop.name}
            </h3>

            <p className="text-sm text-slate-500">
              {crop.variety}
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {crop.health}
        </span>
      </div>

      {/* Crop details */}
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} className="text-slate-400" />
          <span>{crop.farm}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Detail
            label="Area"
            value={`${crop.area} acres`}
          />

          <Detail
            label="Progress"
            value={`${crop.progress}%`}
          />

          <Detail
            label="Sowing"
            value={formatDate(crop.sowingDate)}
            icon={<CalendarDays size={14} />}
          />

          <Detail
            label="Harvest"
            value={formatDate(crop.harvestDate)}
            icon={<Wheat size={14} />}
          />
        </div>

        {/* Progress */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">
              Growing Progress
            </span>

            <span className="font-semibold text-emerald-600">
              {crop.progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${crop.progress}%` }}
            />
          </div>
        </div>

        {/* Action */}
        <Link
          to={`/app/crops/${crop.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
          View Crop Details
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-1 text-xs text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default Crops;