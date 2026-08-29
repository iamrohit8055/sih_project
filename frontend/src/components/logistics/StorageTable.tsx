import {
  ArrowDownUp,
  SlidersHorizontal,
  Snowflake,
} from "lucide-react";

import { useMemo, useState } from "react";

import type { StorageFacility } from "@/types/logistics";

import StorageRow from "./StorageRow";

interface StorageTableProps {
  storageFacilities: StorageFacility[];
  selectedStorage: StorageFacility | null;
  onSelect: (storage: StorageFacility) => void;
}

type StorageFilter =
  | "ALL"
  | "AVAILABLE"
  | "COLD_STORAGE"
  | "WAREHOUSE";

type SortOption =
  | "RECOMMENDED"
  | "RATING"
  | "CAPACITY"
  | "PRICE";

function StorageTable({
  storageFacilities,
  selectedStorage,
  onSelect,
}: StorageTableProps) {
  const [filter, setFilter] =
    useState<StorageFilter>("ALL");

  const [sortBy, setSortBy] =
    useState<SortOption>("RECOMMENDED");

  const filteredStorage = useMemo(() => {
    let result = [...storageFacilities];

    /* FILTER */

    if (filter === "AVAILABLE") {
      result = result.filter(
        (storage) =>
          storage.availability === "AVAILABLE"
      );
    }

    if (
      filter === "COLD_STORAGE" ||
      filter === "WAREHOUSE"
    ) {
      result = result.filter(
        (storage) =>
          storage.storageType === filter
      );
    }

    /* SORT */

    result.sort((a, b) => {
      if (sortBy === "RATING") {
        return b.rating - a.rating;
      }

      if (sortBy === "CAPACITY") {
        return (
          b.availableCapacityKg -
          a.availableCapacityKg
        );
      }

      if (sortBy === "PRICE") {
        return (
          a.pricePerKgPerDay -
          b.pricePerKgPerDay
        );
      }

      /*
       * Temporary recommendation score.
       *
       * Later this should come from the backend.
       */

      const scoreA =
        a.rating * 20 +
        (a.availability === "AVAILABLE"
          ? 15
          : 0) +
        (a.availableCapacityKg /
          a.totalCapacityKg) *
          10;

      const scoreB =
        b.rating * 20 +
        (b.availability === "AVAILABLE"
          ? 15
          : 0) +
        (b.availableCapacityKg /
          b.totalCapacityKg) *
          10;

      return scoreB - scoreA;
    });

    return result;
  }, [storageFacilities, filter, sortBy]);

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-md
        transition-shadow duration-300
        hover:shadow-md
      "
    >
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* TITLE */}

          <div>
            <div className="flex items-center gap-2">
              <Snowflake
                size={20}
                className="text-sky-600"
              />

              <h2 className="text-lg font-bold text-slate-900">
                Storage Facilities
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Compare nearby storage options based on
              capacity, rating and price.
            </p>
          </div>

          {/* ================================================== */}
          {/* FILTERS                                             */}
          {/* ================================================== */}

          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <SlidersHorizontal size={14} />

              Filter
            </div>

            {(
              [
                ["ALL", "All"],
                ["AVAILABLE", "Available"],
                ["COLD_STORAGE", "Cold Storage"],
                ["WAREHOUSE", "Warehouse"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={[
                  "rounded-lg px-3 py-1.5 text-xs font-medium",
                  "transition-colors duration-150",
                  filter === value
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {label}
              </button>
            ))}

            <div className="mx-1 h-5 w-px bg-slate-200" />

            {/* SORT */}

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ArrowDownUp size={13} />

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value as SortOption
                  )
                }
                className="
                  rounded-lg
                  border border-slate-200
                  bg-white
                  px-2.5 py-1.5
                  text-xs font-medium
                  text-slate-600
                  outline-none
                  focus:border-sky-500
                "
              >
                <option value="RECOMMENDED">
                  Recommended
                </option>

                <option value="RATING">
                  Highest rated
                </option>

                <option value="CAPACITY">
                  Most capacity
                </option>

                <option value="PRICE">
                  Lowest price
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* CONTENT                                             */}
      {/* ================================================== */}

      {filteredStorage.length > 0 ? (
        <>
          {/* ================================================== */}
          {/* MOBILE                                             */}
          {/* ================================================== */}

          <div
            className="
              logistics-scroll
              max-h-[400px]
              overflow-y-auto
              divide-y divide-slate-100
              md:hidden
              sm:max-h-[440px]
            "
          >
            {filteredStorage.map(
              (storage, index) => {
                const isSelected =
                  selectedStorage?.id ===
                  storage.id;

                const isAvailable =
                  storage.availability ===
                  "AVAILABLE";

                return (
                  <button
                    key={storage.id}
                    type="button"
                    onClick={() =>
                      onSelect(storage)
                    }
                    className={[
                      "w-full text-left",
                      "px-4 py-4",
                      "transition-all duration-200",
                      "active:bg-slate-100",
                      isSelected
                        ? "bg-sky-50 shadow-[inset_3px_0_0_#0284c7]"
                        : "hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {/* TOP */}

                    <div className="flex items-start gap-3">
                      {/* RANK */}

                      <div className="flex h-7 w-5 shrink-0 items-center justify-center text-sm font-bold text-slate-500">
                        {index + 1}
                      </div>

                      {/* ICON */}

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-base">
                        ❄️
                      </div>

                      {/* NAME */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {storage.name}
                          </p>

                          <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-600">
                            <span className="text-amber-500">
                              ★
                            </span>

                            {storage.rating.toFixed(
                              1
                            )}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] capitalize text-slate-400">
                            {storage.storageType
                              .toLowerCase()
                              .replaceAll(
                                "_",
                                " "
                              )}
                          </span>

                          <span className="text-slate-300">
                            •
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {storage.totalBookings}{" "}
                            bookings
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="mt-3 ml-[76px] grid grid-cols-2 gap-2">
                      {/* STATUS */}

                      <div className="flex items-center gap-1.5">
                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full",
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
                            : "Limited"}
                        </span>
                      </div>

                      {/* CAPACITY */}

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {storage.availableCapacityKg.toLocaleString()}{" "}
                          kg
                        </span>

                        <span className="ml-1 text-[10px] text-slate-400">
                          free
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM */}

                    <div className="mt-2 ml-[76px] flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        ₹{storage.pricePerKgPerDay}/kg/day
                      </span>

                      <span className="text-[10px] font-medium text-sky-600">
                        View details →
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {/* ================================================== */}
          {/* DESKTOP                                             */}
          {/* ================================================== */}

          <div className="hidden overflow-x-auto md:block">
            <div className="min-w-190">
              {/* IMPORTANT:
                  Header + rows are INSIDE the same
                  scroll container.
              */}

              <div className="max-h-[430px] overflow-y-auto">
                {/* COLUMN HEADER */}

                <div
                  className="
                    sticky top-0 z-10
                    grid
                    grid-cols-[40px_minmax(180px,1.5fr)_110px_130px_90px]
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
                    Storage
                  </span>

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </span>

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Available capacity
                  </span>

                  <span className="text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Rating
                  </span>
                </div>

                {/* STORAGE ROWS */}

                {filteredStorage.map(
                  (storage, index) => (
                    <StorageRow
                      key={storage.id}
                      storage={storage}
                      rank={index + 1}
                      selected={
                        selectedStorage?.id ===
                        storage.id
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
        /* ================================================== */
        /* EMPTY STATE                                       */
        /* ================================================== */

        <div className="p-10 text-center">
          <Snowflake
            size={28}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-medium text-slate-700">
            No storage facilities found
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Try changing your filters.
          </p>
        </div>
      )}
    </section>
  );
}

export default StorageTable;