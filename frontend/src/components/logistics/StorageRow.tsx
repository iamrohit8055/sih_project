import {
  CheckCircle2,
  Clock3,
  MapPin,
  Snowflake,
  Star,
} from "lucide-react";

import type { StorageFacility } from "@/types/logistics";

interface StorageRowProps {
  storage: StorageFacility;
  rank: number;
  selected: boolean;
  onSelect: (storage: StorageFacility) => void;
}

function StorageRow({
  storage,
  rank,
  selected,
  onSelect,
}: StorageRowProps) {
  const isAvailable =
    storage.availability === "AVAILABLE";

  const capacityPercentage =
    (storage.availableCapacityKg /
      storage.totalCapacityKg) *
    100;

  return (
    <button
      type="button"
      onClick={() => onSelect(storage)}
      className={[
        "cursor-pointer",
        "transition-all duration-200",
        "hover:bg-slate-50",
        "hover:shadow-[inset_3px_0_0_#0ea5e9]",
        "w-full border-b border-slate-100 text-left",
        "transition-colors duration-150",
        "last:border-b-0",
        selected
          ? "bg-sky-100 shadow-[inset_3px_0_0_#0284c7]"
          : "hover:bg-slate-50 hover:shadow-[inset_3px_0_0_#0ea5e9]",
      ].join(" ")}
    >
      <div className="grid grid-cols-[40px_minmax(180px,1.5fr)_110px_130px_90px] items-center gap-4 px-5 py-4">
        {/* RANK */}

        <div className="text-center">
          {rank <= 3 ? (
            <span className="text-lg">
              {rank === 1
                ? "🥇"
                : rank === 2
                  ? "🥈"
                  : "🥉"}
            </span>
          ) : (
            <span className="text-sm font-semibold text-slate-500">
              {rank}
            </span>
          )}
        </div>

        {/* STORAGE */}

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Snowflake size={19} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {storage.name}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Star
                  size={12}
                  className="fill-current text-amber-500"
                />

                {storage.rating.toFixed(1)}
              </span>

              <span className="text-slate-300">
                •
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={11} />
                Nearby
              </span>
            </div>
          </div>
        </div>

        {/* STATUS */}

        <div>
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
              "text-xs font-medium",
              isAvailable
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500",
            ].join(" ")}
          >
            {isAvailable ? (
              <CheckCircle2 size={12} />
            ) : (
              <Clock3 size={12} />
            )}

            {isAvailable
              ? "Available"
              : "Busy"}
          </span>
        </div>

        {/* CAPACITY */}

        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700">
              {storage.availableCapacityKg.toLocaleString()} kg
            </span>

            <span className="text-[10px] text-slate-400">
              available
            </span>
          </div>

          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-500"
              style={{
                width: `${Math.min(
                  capacityPercentage,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* RATING */}

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">
            ⭐ {storage.rating.toFixed(1)}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            {storage.totalBookings} bookings
          </p>
        </div>
      </div>
    </button>
  );
}

export default StorageRow;
