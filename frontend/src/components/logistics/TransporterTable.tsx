import { ArrowDownUp, SlidersHorizontal, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  Coordinates,
  Transporter,
} from "@/types/logistics";

import TransporterRow from "./TransporterRow";

interface TransporterTableProps {
  transporters: Transporter[];
  pickupLocation: Coordinates;
  selectedTransporter: Transporter | null;
  onSelect: (transporter: Transporter) => void;
}

type AvailabilityFilter =
  | "ALL"
  | "AVAILABLE"
  | "BUSY";

type SortOption =
  | "RECOMMENDED"
  | "RATING"
  | "BOOKINGS";

function TransporterTable({
  transporters,
  pickupLocation,
  selectedTransporter,
  onSelect,
}: TransporterTableProps) {
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("ALL");

  const [sortBy, setSortBy] =
    useState<SortOption>("RECOMMENDED");

  const filteredTransporters = useMemo(() => {
    let result = [...transporters];

    if (availabilityFilter !== "ALL") {
      result = result.filter(
        (transporter) =>
          transporter.availability === availabilityFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "RATING") {
        return b.rating - a.rating;
      }

      if (sortBy === "BOOKINGS") {
        return b.totalBookings - a.totalBookings;
      }

      /*
       * Temporary recommendation logic.
       *
       * Later this should come from the backend
       * recommendation engine.
       */
      const scoreA =
        a.rating * 20 +
        a.onTimeDeliveryRate * 0.3 +
        (a.availability === "AVAILABLE" ? 15 : 0);

      const scoreB =
        b.rating * 20 +
        b.onTimeDeliveryRate * 0.3 +
        (b.availability === "AVAILABLE" ? 15 : 0);

      return scoreB - scoreA;
    });

    return result;
  }, [
    transporters,
    availabilityFilter,
    sortBy,
    pickupLocation,
  ]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-md">
      {/* HEADER */}
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Truck
                size={20}
                className="text-emerald-600"
              />

              <h2 className="text-lg font-bold text-slate-900">
                Available Transporters
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Compare trusted transporters and select the
              best option for your produce.
            </p>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <SlidersHorizontal size={14} />
              Filter
            </div>

            {(
              [
                ["ALL", "All"],
                ["AVAILABLE", "Available"],
                ["BUSY", "Busy"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setAvailabilityFilter(value)
                }
                className={[
                  "rounded-lg px-3 py-1.5 text-xs font-medium",
                  "transition-colors duration-150",
                  availabilityFilter === value
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {label}
              </button>
            ))}

            <div className="mx-1 h-5 w-px bg-slate-200" />

            <button
              type="button"
              onClick={() => setSortBy("RECOMMENDED")}
              className={[
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                sortBy === "RECOMMENDED"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              <ArrowDownUp size={13} />
              Recommended
            </button>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as SortOption
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="RECOMMENDED">
                Recommended
              </option>

              <option value="RATING">
                Highest rated
              </option>

              <option value="BOOKINGS">
                Most booked
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}

{filteredTransporters.length > 0 ? (
  <>
    {/* ============================================= */}
    {/* MOBILE TRANSPORTER LIST                       */}
    {/* ============================================= */}

    <div
      className="
        transporter-scroll
        max-h-[400px]
        overflow-y-auto
        divide-y
        divide-slate-100
        md:hidden
        sm:max-h-[440px]
      "
    >
      {filteredTransporters.map((transporter, index) => {
        const isSelected =
          selectedTransporter?.id === transporter.id;

        const isAvailable =
          transporter.availability === "AVAILABLE";

        return (
          <button
            key={transporter.id}
            type="button"
            onClick={() => onSelect(transporter)}
            className={[
              "w-full text-left",
              "px-4 py-4",
              "transition-all duration-200",
              "active:bg-slate-100",
              isSelected
                ? "bg-emerald-50 shadow-[inset_3px_0_0_#059669]"
                : "hover:bg-slate-50",
            ].join(" ")}
          >
            {/* TOP */}

            <div className="flex items-start gap-3">
              {/* RANK */}

              <div className="flex h-7 w-5 shrink-0 items-center justify-center rounded-lg  text-sm font-bold text-slate-500">
                {index + 1}
              </div>

              {/* ICON */}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-base">
                🚚
              </div>

              {/* NAME */}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {transporter.name}
                  </p>

                  {/* RATING */}

                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-600">
                    <span className="text-amber-500">
                      ★
                    </span>

                    {transporter.rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">
                    {transporter.vehicle.capacityKg.toLocaleString()} kg capacity
                  </span>

                  <span className="text-slate-300">
                    •
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {transporter.totalBookings} bookings
                  </span>
                </div>
              </div>
            </div>

            {/* DETAILS */}

            <div className="ml-[76px] grid grid-cols-2 gap-2">
              {/* STATUS */}

              <div className="flex items-center gap-1.5">
                <span
                  className={[
                    "h-1 w-1 rounded-full",
                    isAvailable
                      ? "bg-emerald-500"
                      : "bg-amber-500",
                  ].join(" ")}
                />

                <span
                  className={[
                    "text-[11px] font-medium",
                    isAvailable
                      ? "text-emerald-600"
                      : "text-amber-600",
                  ].join(" ")}
                >
                  {isAvailable
                    ? "Available"
                    : "Busy"}
                </span>
              </div>

              {/* ON TIME DELIVERY */}

              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-700">
                  {transporter.onTimeDeliveryRate}%
                </span>

                <span className="ml-1 text-[10px] text-slate-400">
                  on-time
                </span>
              </div>
            </div>

            {/* BOTTOM */}

            <div className="ml-[76px] flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                ₹{transporter.vehicle.pricePerKm}/km
              </span>

              <span className="text-[10px] font-medium text-emerald-600">
                View details →
              </span>
            </div>
          </button>
        );
      })}
    </div>

    {/* ============================================= */}
    {/* DESKTOP TRANSPORTER TABLE                     */}
    {/* ============================================= */}

    <div className="hidden overflow-x-auto md:block">
      <div className="min-w-190">
        {/* SCROLLABLE TABLE AREA */}

        <div className="max-h-[430px] overflow-y-auto">
          {/* COLUMN HEADER */}

          <div
            className="
              sticky top-0 z-10
              grid
              grid-cols-[40px_minmax(180px,1.5fr)_110px_90px_100px]
              items-center
              gap-4
              border-b border-slate-100
              bg-slate-50
              px-5 py-3
            "
          >
            <span className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              #
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Transporter
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Status
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Rating
            </span>

            <span className="text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Bookings
            </span>
          </div>

          {/* TRANSPORTER ROWS */}

          {filteredTransporters.map(
            (transporter, index) => (
              <TransporterRow
                key={transporter.id}
                transporter={transporter}
                rank={index + 1}
                selected={
                  selectedTransporter?.id ===
                  transporter.id
                }
                onSelect={onSelect}
              />
            )
          )}
        </div>
      </div>
    </div>
  </>
) : (
  <div className="p-10 text-center">
    <Truck
      size={28}
      className="mx-auto text-slate-300"
    />

    <p className="mt-3 text-sm font-medium text-slate-700">
      No transporters found
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Try changing your filters.
    </p>
  </div>
)}
    </section>
  );
}

export default TransporterTable;