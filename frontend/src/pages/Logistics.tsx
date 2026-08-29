import { useEffect, useRef, useState } from "react";

import {
  getNearbyStorage,
  getNearbyTransporters,
} from "@/services/logisticsService";

import { calculateDistanceKm } from "@/services/logisticsCalculator";

import type {
  StorageFacility,
  Transporter,
} from "@/types/logistics";

import LogisticsMap from "@/components/logistics/LogisticsMap";
import TransporterTable from "@/components/logistics/TransporterTable";
import TransporterDetails from "@/components/logistics/TransporterDetails";
import StorageTable from "@/components/logistics/StorageTable";
import StorageDetails from "@/components/logistics/StorageDetails";
import useFarmLocation from "@/hooks/useFarmLocation";

function Logistics() {
  /* ================================================== */
  /* LOGISTICS DATA                                     */
  /* ================================================== */

  const [transporters, setTransporters] = useState<
    Transporter[]
  >([]);

  const [storageFacilities, setStorageFacilities] =
    useState<StorageFacility[]>([]);

  /* ================================================== */
  /* SHARED SELECTION                                   */
  /* ================================================== */

  const [selectedEntity, setSelectedEntity] =
    useState<
      | {
        type: "TRANSPORTER";
        data: Transporter;
      }
      | {
        type: "STORAGE";
        data: StorageFacility;
      }
      | null
    >(null);

  /* ================================================== */
  /* PAGE STATE                                         */
  /* ================================================== */

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  /* ================================================== */
  /* FARM / PICKUP LOCATION                             */
  /* ================================================== */

  /*
   * Temporary location for development.
   *
   * Later:
   *
   * logged-in farmer
   *        ↓
   * farmer profile
   *        ↓
   * farm location
   *        ↓
   * database
   */
  const {
    farmLocation,
  } = useFarmLocation();

  const pickupLocation = farmLocation ?? {
    latitude: 26.8467,
    longitude: 80.9462,
  };

  /* ================================================== */
  /* MOVE SCREEN TO DETAIL WHEN ROW CLICKED                       */
  /* ================================================== */

  const transporterDetailsRef =
    useRef<HTMLDivElement | null>(null);

  const storageDetailsRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedEntity) {
      return;
    }

    if (window.innerWidth >= 1280) {
      return;
    }

    setTimeout(() => {
      if (selectedEntity.type === "TRANSPORTER") {
        transporterDetailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (selectedEntity.type === "STORAGE") {
        storageDetailsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }, [selectedEntity]);

  /* ================================================== */
  /* LOAD LOGISTICS DATA                                */
  /* ================================================== */

  useEffect(() => {
    async function loadLogisticsData() {
      try {
        setLoading(true);
        setError(null);

        const [
          transportersData,
          storageData,
        ] = await Promise.all([
          getNearbyTransporters(),
          getNearbyStorage(),
        ]);

        setTransporters(transportersData);
        setStorageFacilities(storageData);
      } catch (err) {
        console.error(
          "Failed to load logistics data:",
          err
        );

        setError(
          "Unable to load logistics information. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLogisticsData();
  }, []);

  /* ================================================== */
  /* SELECTED TRANSPORTER                              */
  /* ================================================== */

  const selectedTransporter =
    selectedEntity?.type === "TRANSPORTER"
      ? selectedEntity.data
      : null;

  /* ================================================== */
  /* SELECTED STORAGE                                  */
  /* ================================================== */

  const selectedStorage =
    selectedEntity?.type === "STORAGE"
      ? selectedEntity.data
      : null;

  /* ================================================== */
  /* CLOSEST TRANSPORTER                            */
  /* ================================================== */

  const closestTransporter =
    transporters.length > 0
      ? [...transporters].sort(
        (a, b) =>
          calculateDistanceKm(
            pickupLocation,
            a.location
          ) -
          calculateDistanceKm(
            pickupLocation,
            b.location
          )
      )[0]
      : null;

  /* ================================================== */
  /* CLOSEST STORAGE                          */
  /* ================================================== */

  const closestStorage =
    storageFacilities.length > 0
      ? [...storageFacilities].sort(
        (a, b) =>
          calculateDistanceKm(
            pickupLocation,
            a.location
          ) -
          calculateDistanceKm(
            pickupLocation,
            b.location
          )
      )[0]
      : null;

  /* ================================================== */
  /* RECOMMENDED TRANSPORT                       */
  /* ================================================== */

  const recommendedTransporter =
    transporters.length > 0
      ? [...transporters].sort((a, b) => {
        const distanceA =
          calculateDistanceKm(
            pickupLocation,
            a.location
          );

        const distanceB =
          calculateDistanceKm(
            pickupLocation,
            b.location
          );

        const scoreA =
          a.rating * 20 +
          a.onTimeDeliveryRate * 0.3 +
          (a.availability === "AVAILABLE"
            ? 15
            : 0) -
          distanceA * 2;

        const scoreB =
          b.rating * 20 +
          b.onTimeDeliveryRate * 0.3 +
          (b.availability === "AVAILABLE"
            ? 15
            : 0) -
          distanceB * 2;

        return scoreB - scoreA;
      })[0]
      : null;

  /* ================================================== */
  /* RECOMMENDED STORAGE                          */
  /* ================================================== */

  const recommendedStorage =
    storageFacilities.length > 0
      ? [...storageFacilities].sort((a, b) => {
        const distanceA =
          calculateDistanceKm(
            pickupLocation,
            a.location
          );

        const distanceB =
          calculateDistanceKm(
            pickupLocation,
            b.location
          );

        const availabilityA =
          a.availability === "AVAILABLE"
            ? 15
            : 0;

        const availabilityB =
          b.availability === "AVAILABLE"
            ? 15
            : 0;

        const capacityA =
          (a.availableCapacityKg /
            a.totalCapacityKg) *
          10;

        const capacityB =
          (b.availableCapacityKg /
            b.totalCapacityKg) *
          10;

        const scoreA =
          a.rating * 20 +
          availabilityA +
          capacityA -
          distanceA * 2;

        const scoreB =
          b.rating * 20 +
          availabilityB +
          capacityB -
          distanceB * 2;

        return scoreB - scoreA;
      })[0]
      : null;

  /* ================================================== */
  /* LOADING STATE                                     */
  /* ================================================== */

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <p className="text-sm text-slate-500">
          Loading logistics information...
        </p>
      </div>
    );
  }

  /* ================================================== */
  /* ERROR STATE                                       */
  /* ================================================== */

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  /* ================================================== */
  /* PAGE                                              */
  /* ================================================== */

  return (
    <div className="space-y-5">
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <div className="animate-[fadeInUp_0.5s_ease-out]">
        <h1 className="text-4xl font-bold  tracking-tight text-slate-900">
          Map & Logistics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Find nearby transporters and storage facilities
          for your produce.
        </p>
      </div>

      {/* ================================================== */}
      {/* MAP + OVERVIEW                                     */}
      {/* ================================================== */}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
        {/* MAP */}

        <LogisticsMap
          transporters={transporters}
          storageFacilities={storageFacilities}
          selectedEntity={selectedEntity}
          pickupLocation={pickupLocation}
        />

        {/* OVERVIEW */}

        <div
          className="
    rounded-2xl border border-slate-200
    bg-white p-2 shadow-sm
    animate-[fadeInUp_0.6s_ease-out]
  "
          style={{
            animationDelay: "250ms",
            animationFillMode: "both",
          }}
        >
          {/* HEADER */}

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Logistics Overview
              </h2>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                Nearby
              </span>
            </div>

            <p className=" text-sm text-slate-500">
              Nearby logistics resources available to you.
            </p>
          </div>

          {/* RESOURCE STATS */}

          <div className="mt-1 grid grid-cols-2 gap-3">
            {/* TRANSPORTERS */}

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-sky-100 hover:bg-sky-50/40">
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-lg">
                  🚚
                </div>

                <span className="text-lg font-bold text-slate-900">
                  {transporters.length}
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                Transporters
              </p>

              <p className="text-[11px] text-slate-500">
                Nearby transport providers
              </p>
            </div>

            {/* STORAGE */}

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-colors hover:border-sky-100 hover:bg-sky-50/40">
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-lg">
                  ❄️
                </div>

                <span className="text-lg font-bold text-slate-900">
                  {storageFacilities.length}
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                Storage Facilities
              </p>

              <p className="text-[11px] text-slate-500">
                Nearby storage providers
              </p>
            </div>
          </div>

          {/* AVAILABILITY */}

          <div className="mt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Availability
            </p>

            <div className="mt-1 space-y-1">
              {/* TRANSPORT */}

              <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3.5 py-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <span className="text-sm">🚚</span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Available transporters
                    </p>

                    <p className=" text-[10px] text-slate-400">
                      Ready for pickup
                    </p>
                  </div>
                </div>

                <span className="text-sm font-bold text-emerald-600">
                  {
                    transporters.filter(
                      (t) => t.availability === "AVAILABLE"
                    ).length
                  }
                </span>
              </div>

              {/* STORAGE */}

              <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3.5 py-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
                    <span className="text-sm">❄️</span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Available storage
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Ready to reserve
                    </p>
                  </div>
                </div>

                <span className="text-sm font-bold text-sky-600">
                  {
                    storageFacilities.filter(
                      (s) => s.availability === "AVAILABLE"
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* SMART RECOMMENDATIONS                              */}
          {/* ================================================== */}

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Smart recommendations
              </p>

              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                ✨ Best match
              </span>
            </div>

            {/* TRANSPORTER */}

            {recommendedTransporter && (
              <button
                type="button"
                onClick={() => {
                  setSelectedEntity({
                    type: "TRANSPORTER",
                    data: recommendedTransporter,
                  });
                }}
                className="
        group w-full rounded-xl
        border border-emerald-100
        bg-emerald-50/60
        p-1 text-left
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-emerald-200
        hover:bg-emerald-50
        hover:shadow-sm
      "
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-base shadow-sm">
                    🚚
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-emerald-600">
                          Recommended transporter
                        </p>

                        <p className="mt-0.5 truncate text-xs font-bold text-slate-800">
                          {recommendedTransporter.name}
                        </p>
                      </div>

                      <span className="shrink-0 text-[10px] font-semibold text-amber-500">
                        ★{" "}
                        {recommendedTransporter.rating.toFixed(
                          1
                        )}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[10px] text-slate-500">
                        📍{" "}
                        {calculateDistanceKm(
                          pickupLocation,
                          recommendedTransporter.location
                        ).toFixed(1)}{" "}
                        km
                      </span>

                      <span className="text-[10px] text-slate-500">
                        ₹{recommendedTransporter.vehicle.pricePerKm}/km
                      </span>

                      <span className="text-[10px] font-medium text-emerald-600">
                        {recommendedTransporter.onTimeDeliveryRate}% on-time
                      </span>
                    </div>
                  </div>

                  <span className="pt-4 text-xs text-emerald-500 transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </button>
            )}

            {/* STORAGE */}

            {recommendedStorage && (
              <button
                type="button"
                onClick={() => {
                  setSelectedEntity({
                    type: "STORAGE",
                    data: recommendedStorage,
                  });
                }}
                className="
        group w-full rounded-xl
        border border-sky-100
        bg-sky-50/60
        p-1 text-left
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-sky-200
        hover:bg-sky-50
        hover:shadow-sm
      "
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-base shadow-sm">
                    ❄️
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-sky-600">
                          Recommended storage
                        </p>

                        <p className="mt-0.5 truncate text-xs font-bold text-slate-800">
                          {recommendedStorage.name}
                        </p>
                      </div>

                      <span className="shrink-0 text-[10px] font-semibold text-amber-500">
                        ★{" "}
                        {recommendedStorage.rating.toFixed(
                          1
                        )}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[10px] text-slate-500">
                        📍{" "}
                        {calculateDistanceKm(
                          pickupLocation,
                          recommendedStorage.location
                        ).toFixed(1)}{" "}
                        km
                      </span>

                      <span className="text-[10px] text-slate-500">
                        {recommendedStorage.availableCapacityKg.toLocaleString()}{" "}
                        kg free
                      </span>

                      <span className="text-[10px] font-medium text-sky-600">
                        ₹{recommendedStorage.pricePerKgPerDay}/kg/day
                      </span>
                    </div>
                  </div>

                  <span className="pt-4 text-xs text-sky-500 transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* LEGEND */}

          <div className="mt-1 border-t border-slate-100 pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Map legend
            </p>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-[11px] text-slate-500">
                  Your Farm
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs">🚚</span>
                <span className="text-[11px] text-slate-500">
                  Transporter
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs">❄️</span>
                <span className="text-[11px] text-slate-500">
                  Storage
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* TRANSPORTERS                                      */}
      {/* ================================================== */}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <TransporterTable
          transporters={transporters}
          pickupLocation={pickupLocation}
          selectedTransporter={selectedTransporter}
          onSelect={(transporter) => {
            setSelectedEntity({
              type: "TRANSPORTER",
              data: transporter,
            });
          }}
        />
        <div
          ref={transporterDetailsRef}
          className="scroll-mt-20"
        >
          <TransporterDetails
            transporter={selectedTransporter}
            pickupLocation={pickupLocation}
            onClose={() => {
              setSelectedEntity(null);
            }}
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* STORAGE                                            */}
      {/* ================================================== */}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <StorageTable
          storageFacilities={storageFacilities}
          selectedStorage={selectedStorage}
          onSelect={(storage) => {
            setSelectedEntity({
              type: "STORAGE",
              data: storage,
            });
          }}
        />

        <div
          ref={storageDetailsRef}
          className="scroll-mt-20"
        >
          <StorageDetails
            storage={selectedStorage}
            pickupLocation={pickupLocation}
            onClose={() => {
              setSelectedEntity(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Logistics;
