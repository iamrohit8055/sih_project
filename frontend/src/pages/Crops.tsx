import {
  CircleCheck,
  Leaf,
  Search,
  Sprout,
  Wheat,
} from "lucide-react";


import { useMemo, useState, type ReactNode } from "react";


import AddCropDialog from "@/components/crops/AddCropDialog";
import CropCard from "@/components/crops/CropCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { mockCrops, type MockCrop } from "@/mock/crops";
import type { CropStatus } from "@/types/crops";
import farmHeader from "@/assets/farm-header.png";


// --------------------------------------------------
// Types
// --------------------------------------------------

type Crop = MockCrop;

type SortOption =
  | "Name"
  | "Progress-High"
  | "Progress-Low"
  | "Harvest-Nearest";



// --------------------------------------------------
// Page
// --------------------------------------------------

function Crops() {
  const [search, setSearch] = useState("");

  const [cropList, setCropList] =
    useState<Crop[]>(mockCrops);

  const [selectedStatus, setSelectedStatus] = useState<
    "All" | CropStatus
  >("All");

  const [sortBy, setSortBy] =
    useState<SortOption>("Name");


  // --------------------------------------------------
  // Filtering + Sorting
  // --------------------------------------------------

  const filteredCrops = useMemo(() => {
    const result = cropList.filter((crop) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        crop.name.toLowerCase().includes(searchValue) ||
        crop.variety.toLowerCase().includes(searchValue) ||
        crop.farm.toLowerCase().includes(searchValue);

      const matchesStatus =
        selectedStatus === "All" ||
        crop.health === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "Progress-High":
          return b.progress - a.progress;

        case "Progress-Low":
          return a.progress - b.progress;

        case "Harvest-Nearest":
          return (
            new Date(a.harvestDate).getTime() -
            new Date(b.harvestDate).getTime()
          );

        case "Name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [
    cropList,
    search,
    selectedStatus,
    sortBy,
  ]);


  // --------------------------------------------------
  // Summary Counts
  // --------------------------------------------------

  const healthyCount = cropList.filter(
    (crop) => crop.health === "Healthy",
  ).length;

  const attentionCount = cropList.filter(
    (crop) => crop.health === "Needs Attention",
  ).length;

  const criticalCount = cropList.filter(
    (crop) => crop.health === "Critical",
  ).length;


  // --------------------------------------------------
  // Add Crop
  // --------------------------------------------------

  const handleAddCrop = (
    newCrop: Omit<
      Crop,
      "id" | "progress" | "icon" | "stage" | "soil" | "irrigation" | "image"
    >,
  ) => {
    const crop: Crop = {
      ...newCrop,
      id: Date.now(),
      image: "",
      progress: 0,

      // Temporary defaults.
      // These can be edited later from the crop details page.
      stage: "Not Started",
      soil: "Not Specified",
      irrigation: "Not Specified",
    };

    setCropList((current) => [
      crop,
      ...current,
    ]);
  };


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* ================================================== */}
      {/* ILLUSTRATED HEADER + SUMMARY                       */}
      {/* ================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ">

        {/* ================= HERO ================= */}

        <div className="relative h-48 overflow-hidden sm:h-52">

          {/* Farm Image */}

          <img
            src={farmHeader}
            alt="Farm landscape"
            className="
        absolute inset-0
        h-full w-full
        object-cover
        object-right
        sm:object-center
      "
          />

          {/* Readability Overlay */}

          <div className="absolute inset-0 bg-linear-to-r from-gray-950 via-white/10 to-transparent" />

          {/* Hero Content */}

          <div className="relative z-10 flex h-full items-start justify-between p-5 sm:p-6 lg:p-7">

            {/* Title */}

            <div className="max-w-sm">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[38px]">
                My Crops
              </h1>

              <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-300 sm:text-sm">
                Track your crops, monitor their health,
                and manage your farms.
              </p>
            </div>

            {/* Add Crop */}

            <div className="shrink-0">
              <AddCropDialog
                onAddCrop={handleAddCrop}
              />
            </div>

          </div>
        </div>


        {/* ================= SUMMARY ================= */}

        <div className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-4 lg:grid-cols-4">

          <SummaryCard
            title="Total Crops"
            value={cropList.length}
            description="Across all farms"
            icon={<Sprout size={18} />}
            iconClassName="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            title="Healthy"
            value={healthyCount}
            description="Crops doing well"
            icon={<CircleCheck size={18} />}
            iconClassName="bg-green-50 text-green-600"
          />

          <SummaryCard
            title="Needs Attention"
            value={attentionCount}
            description="Requires monitoring"
            icon={<Leaf size={18} />}
            iconClassName="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            title="Critical"
            value={criticalCount}
            description="Immediate action needed"
            icon={<Wheat size={18} />}
            iconClassName="bg-red-50 text-red-600"
          />

        </div>

      </section>


      {/* -------------------------------------------- */}
      {/* Search + Filters */}
      {/* -------------------------------------------- */}

      <div className="rounded-2xl border bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search crops, varieties or farms..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

          </div>


          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">

            {(
              [
                "All",
                "Healthy",
                "Needs Attention",
                "Critical",
              ] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() =>
                  setSelectedStatus(status)
                }
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${selectedStatus === status
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {status}
              </button>
            ))}

          </div>


          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as SortOption)
            }
          >
            <SelectTrigger className="w-full rounded-xl sm:w-52.5">
              <SelectValue placeholder="Sort crops" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="Name">
                Name: A → Z
              </SelectItem>

              <SelectItem value="Progress-High">
                Progress: High → Low
              </SelectItem>

              <SelectItem value="Progress-Low">
                Progress: Low → High
              </SelectItem>

              <SelectItem value="Harvest-Nearest">
                Earliest Harvest
              </SelectItem>

            </SelectContent>
          </Select>

        </div>

      </div>


      {/* -------------------------------------------- */}
      {/* Crop Cards */}
      {/* -------------------------------------------- */}

      {filteredCrops.length > 0 ? (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
            />
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


// ==================================================
// Summary Card
// ==================================================

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
    <div className="min-w-0 rounded-xl border-2 border-slate-400 bg-white p-3 sm:p-4">

      <div className="flex items-start justify-between gap-2">

        <div className="min-w-0">

          <p className="truncate text-0.5xl font-medium text-slate-600">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </p>

        </div>

        <div
          className={`
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-lg
            sm:h-9 sm:w-9
            ${iconClassName}
          `}
        >
          {icon}
        </div>

      </div>

      <p className="mt-2 truncate text-[10px] text-slate-500 sm:text-xs">
        {description}
      </p>

    </div>
  );
}



export default Crops;