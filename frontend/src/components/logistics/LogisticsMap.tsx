import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import {
  LocateFixed,
} from "lucide-react";

import { useEffect } from "react";
import L from "leaflet";

import type {
  Coordinates,
  SelectedLogisticsEntity,
  StorageFacility,
  Transporter,
} from "@/types/logistics";

import "leaflet/dist/leaflet.css";

interface LogisticsMapProps {
  transporters: Transporter[];
  storageFacilities: StorageFacility[];
  selectedEntity: SelectedLogisticsEntity;
  pickupLocation: Coordinates;
}

/* ================================================== */
/* CUSTOM MARKER ICON                                 */
/* ================================================== */

const createMarkerIcon = (
  emoji: string,
  selected = false,
  type: "FARM" | "TRANSPORTER" | "STORAGE" = "TRANSPORTER"
) => {
  const size = selected ? 48 : 40;

  const colors = {
    FARM: {
      background: "#fff1f2",
      border: "#fb7185",
      selectedBackground: "#e11d48",
      selectedBorder: "#9f1239",
    },

    TRANSPORTER: {
      background: "#ecfdf5",
      border: "#86efac",
      selectedBackground: "#059669",
      selectedBorder: "#064e3b",
    },

    STORAGE: {
      background: "#eff6ff",
      border: "#93c5fd",
      selectedBackground: "#a1e3ed",
      selectedBorder: "#075985",
    },
  };

  const color = colors[type];

  return L.divIcon({
    className: "custom-logistics-marker",

    html: `
      <div
        style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${selected
        ? color.selectedBackground
        : color.background
      };
          border: ${selected
        ? `3px solid ${color.selectedBorder}`
        : `2px solid ${color.border}`
      };
          box-shadow: ${selected
        ? "0 0 0 6px rgba(14,165,233,0.15), 0 6px 16px rgba(0,0,0,0.22)"
        : "0 4px 12px rgba(0,0,0,0.16)"
      };
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${selected ? "24px" : "20px"};
          transition: all 0.25s ease;
        "
      >
        ${emoji}

        ${selected
        ? `
              <div
                style="
                  position: absolute;
                  inset: -8px;
                  border-radius: 50%;
                  border: 2px solid rgba(14,165,233,0.35);
                  animation: logisticsMarkerPulse 1.8s ease-out infinite;
                "
              ></div>
            `
        : ""
      }
      </div>
    `,

    iconSize: [size, size],

    iconAnchor: [
      size / 2,
      size / 2,
    ],

    popupAnchor: [
      0,
      -(size / 2),
    ],
  });
};

/* ================================================== */
/* MARKER ICONS                                       */
/* ================================================== */

const farmIcon = createMarkerIcon(
  "📍",
  false,
  "FARM"
);

/* ================================================== */
/* MAP CONTROLLER                                     */
/* ================================================== */

function MapController({
  selectedEntity,
}: {
  selectedEntity: SelectedLogisticsEntity;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedEntity) {
      return;
    }

    const {
      latitude,
      longitude,
    } = selectedEntity.data.location;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      console.error(
        "Invalid selected entity coordinates:",
        selectedEntity
      );

      return;
    }

    map.flyTo(
      [latitude, longitude],
      15,
      {
        duration: 1,
      }
    );
  }, [selectedEntity, map]);

  return null;
}

/* ================================================== */
/* RETURN TO FARM                                   */
/* ================================================== */

function FarmLocationControl({
  pickupLocation,
}: {
  pickupLocation: Coordinates;
}) {
  const map = useMap();

  const goToFarm = () => {
    map.flyTo(
      [
        pickupLocation.latitude,
        pickupLocation.longitude,
      ],
      13,
      {
        duration: 0.8,
      }
    );
  };

  return (
    <div className="absolute bottom-4 right-4 z-1000">
      <button
        type="button"
        onClick={goToFarm}
        className="
          flex items-center gap-2
          rounded-xl border border-slate-200
          bg-white/95 px-3 py-2.5
          text-xs font-semibold text-slate-700
          shadow-lg backdrop-blur-sm
          transition-all duration-200
          hover:-translate-y-0.5
          hover:bg-white
          hover:shadow-xl
          active:translate-y-0
        "
      >
        <LocateFixed
          size={15}
          className="text-rose-500"
        />

        My farm
      </button>
    </div>
  );
}

/* ================================================== */
/* LOGISTICS MAP                                     */
/* ================================================== */

function LogisticsMap({
  transporters,
  storageFacilities,
  selectedEntity,
  pickupLocation,
}: LogisticsMapProps) {
  /*
   * The map initially opens around the farmer's farm.
   *
   * Previously this was hardcoded:
   *
   * [26.8467, 80.9462]
   *
   * Now it comes from pickupLocation.
   */
  const center: [number, number] = [
    pickupLocation.latitude,
    pickupLocation.longitude,
  ];

  return (
    <div
      className="
    relative h-full min-h-125
    overflow-hidden rounded-2xl
    border border-slate-200
    bg-slate-100 shadow-sm
    animate-[fadeInUp_0.6s_ease-out]
  "
    >
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full min-h-105 w-full"
      >

        {/* ================================================== */}
        {/* MAP CONTROLLER                                     */}
        {/* ================================================== */}

        <MapController
          selectedEntity={selectedEntity}
        />

        {/* ================================================== */}
        {/* RETURN TO FARM                                     */}
        {/* ================================================== */}

        <FarmLocationControl
          pickupLocation={pickupLocation}
        />

        {/* ================================================== */}
        {/* MAP TILES                                          */}
        {/* ================================================== */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ================================================== */}
        {/* FARM LOCATION                                      */}
        {/* ================================================== */}

        <Marker
          position={[
            pickupLocation.latitude,
            pickupLocation.longitude,
          ]}
          icon={farmIcon}
        >
          <Popup>
            <div className="min-w-40 space-y-1">
              <p className="font-semibold text-slate-900">
                📍 Your Farm
              </p>

              <p className="text-xs text-slate-500">
                Produce pickup location
              </p>

              <p className="text-[11px] text-slate-400">
                {pickupLocation.latitude.toFixed(5)},{" "}
                {pickupLocation.longitude.toFixed(5)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* ================================================== */}
        {/* TRANSPORTERS                                      */}
        {/* ================================================== */}

        {transporters.map((transporter) => {
          const isSelected =
            selectedEntity?.type ===
            "TRANSPORTER" &&
            selectedEntity.data.id ===
            transporter.id;

          return (
            <Marker
              key={`transporter-${transporter.id}`}
              position={[
                transporter.location.latitude,
                transporter.location.longitude,
              ]}
              icon={createMarkerIcon(
                "🚚",
                isSelected,
                "TRANSPORTER"
              )}
              ref={(marker) => {
                if (isSelected && marker) {
                  setTimeout(() => {
                    marker.openPopup();
                  }, 500);
                }
              }}
            >
              <Popup>
                <div className="min-w-44">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      🚚
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {transporter.name}
                      </p>

                      <p className="text-[11px] text-slate-500">
                        ⭐ {transporter.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-[11px] text-slate-400">
                        Capacity
                      </span>

                      <span className="text-[11px] font-semibold text-slate-700">
                        {transporter.vehicle.capacityKg.toLocaleString()} kg
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[11px] text-slate-400">
                        Rate
                      </span>

                      <span className="text-[11px] font-semibold text-slate-700">
                        ₹{transporter.vehicle.pricePerKm}/km
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[11px] text-slate-400">
                        Status
                      </span>

                      <span className="text-[11px] font-semibold text-emerald-600">
                        ● Available
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ================================================== */}
        {/* STORAGE FACILITIES                                */}
        {/* ================================================== */}

        {storageFacilities.map((storage) => {
          const isSelected =
            selectedEntity?.type ===
            "STORAGE" &&
            selectedEntity.data.id ===
            storage.id;

          return (
            <Marker
              key={`storage-${storage.id}`}
              position={[
                storage.location.latitude,
                storage.location.longitude,
              ]}
              icon={createMarkerIcon(
                "❄️",
                isSelected,
                "STORAGE"
              )}
              ref={(marker) => {
                if (isSelected && marker) {
                  setTimeout(() => {
                    marker.openPopup();
                  }, 500);
                }
              }}
            >
              <Popup>
                <div className="min-w-48">
                  {/* HEADER */}

                  {/* HEADER */}

                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sm">
                      ❄️
                    </div>

                    <div className="min-w-0 leading-none">
                      <p className="truncate text-xs font-bold leading-tight text-slate-900">
                        {storage.name}
                      </p>

                      <p className="mt-0.5 text-[10px] leading-tight text-slate-500">
                        ⭐ {storage.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS */}

                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    <div className="flex justify-between gap-4">
                      <span className="text-[11px] text-slate-400">
                        Available
                      </span>

                      <span className="text-[11px] font-semibold text-slate-700">
                        {storage.availableCapacityKg.toLocaleString()} kg
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-[11px] text-slate-400">
                        Total capacity
                      </span>

                      <span className="text-[11px] font-semibold text-slate-700">
                        {storage.totalCapacityKg.toLocaleString()} kg
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-[11px] text-slate-400">
                        Rate
                      </span>

                      <span className="text-[11px] font-semibold text-slate-700">
                        ₹{storage.pricePerKgPerDay}/kg/day
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-[11px] text-slate-400">
                        Type
                      </span>

                      <span className="text-[11px] font-semibold capitalize text-slate-700">
                        {storage.storageType
                          .toLowerCase()
                          .replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-[11px] text-slate-400">
                        Status
                      </span>

                      <span
                        className={[
                          "text-[11px] font-semibold",
                          storage.availability === "AVAILABLE"
                            ? "text-emerald-600"
                            : "text-amber-600",
                        ].join(" ")}
                      >
                        ●{" "}
                        {storage.availability === "AVAILABLE"
                          ? "Available"
                          : "Limited"}
                      </span>
                    </div>
                  </div>


                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* MAP STATUS */}

      <div className="absolute right-4 top-4 z-1000">
        <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>

          <span className="text-xs font-semibold text-slate-700">
            Nearby logistics
          </span>
        </div>
      </div>
    </div>
    
  );
}

export default LogisticsMap;