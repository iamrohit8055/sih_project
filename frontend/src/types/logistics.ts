export type AvailabilityStatus =
  | "AVAILABLE"
  | "BUSY"
  | "OFFLINE"
  | "LIMITED";

export type VehicleType =
  | "MINI_TRUCK"
  | "TRUCK"
  | "REFRIGERATED_TRUCK"
  | "TEMPO"
  | "PICKUP_TRUCK"
  | "MEDIUM_TRUCK"
  | "LARGE_TRUCK";

export type StorageType =
  | "COLD_STORAGE"
  | "WAREHOUSE"
  | "CONTROLLED_ATMOSPHERE";


export type MapLocationType =
  | "FARM"
  | "TRANSPORTER"
  | "STORAGE"
  | "PROCESSOR"
  | "BUYER"
  | "MANDI";

export interface MapLocation {
  id: string;
  name: string;
  type: MapLocationType;
  location: Coordinates;
}


export interface Coordinates {
  latitude: number;
  longitude: number;
}

  export interface FarmLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Transporter {
  id: string;

  name: string;
  phone: string;

  rating: number;
  totalBookings: number;
  successfulBookings: number;
  onTimeDeliveryRate: number;

  location: Coordinates;

  vehicle: {
    id: string;
    type: VehicleType;
    capacityKg: number;
    pricePerKm: number;
    refrigerated: boolean;
  };

  availability: AvailabilityStatus;
}


export interface StorageFacility {
  id: string;

  name: string;
  ownerName: string;
  phone: string;

  rating: number;
  totalBookings: number;
  successfulBookings: number;

  location: Coordinates;

  storageType: StorageType;

  totalCapacityKg: number;
  availableCapacityKg: number;

  pricePerKgPerDay: number;

  temperatureRange?: {
    minCelsius: number;
    maxCelsius: number;
  };

  supportedProduce: string[];

  availability: AvailabilityStatus;
}



export interface ProcessingUnit {
  id: string;
  name: string;

  location: Coordinates;

  acceptedCrops: string[];

  dailyCapacityKg: number;
  minimumQuantityKg: number;

  availability: AvailabilityStatus;
}

export interface ProduceBatch {
  id: string;
  farmerId: string;

  crop: string;

  quantityKg: number;

  qualityGrade: "A" | "B" | "C";

  harvestDate: string;

  expectedShelfLifeDays: number;

  location: Coordinates;
}

export interface LogisticsRequest {
  produceBatchId: string;

  quantityKg: number;

  pickupLocation: Coordinates;

  destination: {
    id: string;
    type: "BUYER" | "MANDI" | "PROCESSOR" | "STORAGE";
  };

  requiredDate: string;

  refrigeratedRequired: boolean;
}

export type SelectedLogisticsEntity =
  | {
      type: "TRANSPORTER";
      data: Transporter;
    }
  | {
      type: "STORAGE";
      data: StorageFacility;
    }
  | null;


