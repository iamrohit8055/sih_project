import {
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Snowflake,
  Star,
  X,
} from "lucide-react";

import type {
  Coordinates,
  StorageFacility,
} from "@/types/logistics";

import { calculateDistanceKm } from "@/services/logisticsCalculator";

interface StorageDetailsProps {
  storage: StorageFacility | null;
  pickupLocation: Coordinates;
  onClose: () => void;
}

function StorageDetails({
  storage,
  pickupLocation,
  onClose,
}: StorageDetailsProps) {
  if (!storage) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <Snowflake size={21} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Select a storage facility
          </p>

          <p className="mt-2 max-w-60 text-xs leading-5 text-slate-500">
            Click a facility from the list to view its
            capacity, pricing and storage details.
          </p>
        </div>
      </div>
    );
  }

  const distanceKm = calculateDistanceKm(
    pickupLocation,
    storage.location
  );

  const isAvailable =
    storage.availability === "AVAILABLE";

  const occupancyPercentage =
    ((storage.totalCapacityKg -
      storage.availableCapacityKg) /
      storage.totalCapacityKg) *
    100;

  return (
    <div
      className="
    overflow-hidden rounded-2xl
    border border-slate-200
    bg-white shadow-sm
    animate-[fadeInUp_0.35s_ease-out]
  "
    >
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Snowflake size={20} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900">
              {storage.name}
            </h2>

            <div className="mt-1.5 flex items-center gap-1">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Star
                  size={12}
                  className="fill-current text-amber-500"
                />

                {storage.rating.toFixed(1)}
              </span>

              <span className="text-sm text-slate-300">
                •
              </span>

              <span className="text-xs text-slate-500">
                {storage.totalBookings} bookings
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close storage details"
        >
          <X size={17} />
        </button>
      </div>

      {/* BODY */}

      <div className="p-3">
        {/* STATUS */}

        <div
          className={[
            "flex items-center justify-between rounded-xl px-4 py-2.5",
            isAvailable
              ? "bg-emerald-50"
              : "bg-slate-50",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            {isAvailable ? (
              <CheckCircle2
                size={17}
                className="text-emerald-600"
              />
            ) : (
              <Clock3
                size={17}
                className="text-slate-500"
              />
            )}

            <span
              className={[
                "text-sm font-semibold",
                isAvailable
                  ? "text-emerald-700"
                  : "text-slate-600",
              ].join(" ")}
            >
              {isAvailable
                ? "Available for storage"
                : "Currently unavailable"}
            </span>
          </div>

          <span className="rounded-md bg-white/70 px-2 py-1 text-[11px] font-medium capitalize text-slate-500">
            {storage.storageType
              .toLowerCase()
              .replaceAll("_", " ")}
          </span>
        </div>

        {/* CAPACITY */}

        <div className="mt-3 rounded-xl bg-slate-50 px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Available capacity
              </p>

              <p className="mt-1 text-base font-bold text-slate-800">
                {storage.availableCapacityKg.toLocaleString()} kg
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Total capacity
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {storage.totalCapacityKg.toLocaleString()} kg
              </p>
            </div>
          </div>

          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-700 ease-out"
              style={{
                width: `${100 - Math.min(
                  occupancyPercentage,
                  100
                )}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold text-slate-500">
              {storage.availableCapacityKg.toLocaleString()} kg free
            </p>

            <p className="text-[10px] text-slate-400">
              {Math.round(occupancyPercentage)}% capacity occupied
            </p>
          </div>
        </div>

        {/* STORAGE INFO */}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-2 shadow-sm">
            <div className="flex items-center gap-1">
              <MapPin
                size={15}
                className="text-sky-500"
              />

              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Distance
              </span>
            </div>

            <p className="mt-1.5 text-sm font-semibold text-slate-700">
              {distanceKm.toFixed(1)} km away
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-2 shadow-sm">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-emerald-500">
                ₹
              </span>

              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Storage rate
              </span>
            </div>

            <p className="mt-1.5 text-sm font-semibold text-slate-700">
              ₹{storage.pricePerKgPerDay}/kg/day
            </p>
          </div>
        </div>


        {/* TEMPERATURE */}

        <div
          className={[
            "mt-5 flex items-center gap-3 rounded-xl px-4 py-3.5",
            storage.temperatureRange
              ? "bg-sky-50"
              : "bg-slate-50",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              storage.temperatureRange
                ? "bg-white text-sky-500"
                : "bg-white text-slate-400",
            ].join(" ")}
          >
            <Snowflake size={16} />
          </div>

          <div>
            <p
              className={[
                "text-[10px] font-semibold uppercase tracking-wide",
                storage.temperatureRange
                  ? "text-sky-400"
                  : "text-slate-400",
              ].join(" ")}
            >
              Temperature range
            </p>

            {storage.temperatureRange ? (
              <p className="mt-0.5 text-sm font-semibold text-sky-700">
                {storage.temperatureRange.minCelsius}°C –{" "}
                {storage.temperatureRange.maxCelsius}°C
              </p>
            ) : (
              <p className="mt-0.5 text-sm font-medium text-slate-500">
                Temperature information not available
              </p>
            )}
          </div>
        </div>



        {/* SUPPORTED PRODUCE */}

        {storage.supportedProduce.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Suitable for
              </p>

              <span className="text-[10px] text-slate-400">
                {storage.supportedProduce.length} types
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1">
              {storage.supportedProduce
                .slice(0, 4)
                .map((produce) => (
                  <span
                    key={produce}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                  >
                    {produce}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2.5">
          <button
            type="button"
            disabled={!isAvailable}
            className={[
              "min-h-11 rounded-xl px-4",
              "text-sm font-semibold",
              "transition-colors duration-200",
              isAvailable
                ? `
      bg-sky-600 text-white
      hover:bg-sky-700
      hover:-translate-y-0.5
      hover:shadow-2xl
      active:translate-y-0
    `
                : "cursor-not-allowed bg-slate-100 text-slate-400",
            ].join(" ")}
          >
            {isAvailable
              ? "Reserve Storage"
              : "Currently Unavailable"}
          </button>

          <button
            type="button"
            className="flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
            >
            <Phone size={14} />
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default StorageDetails;

