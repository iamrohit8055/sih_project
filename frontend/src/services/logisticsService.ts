import type {
  ProcessingUnit,
  StorageFacility,
  Transporter,
} from "@/types/logistics";

const transporters: Transporter[] = [
  {
    id: "TR-001",
    name: "Rajesh Transport",
    phone: "+91 9876543210",
    rating: 4.8,
    totalBookings: 128,
    successfulBookings: 124,
    onTimeDeliveryRate: 96,
    location: {
      latitude: 26.8467,
      longitude: 80.9462,
    },
    vehicle: {
      id: "VH-001",
      type: "MINI_TRUCK",
      capacityKg: 2500,
      pricePerKm: 18,
      refrigerated: false,
    },
    availability: "AVAILABLE",
  },

  {
    id: "TR-002",
    name: "Singh Logistics",
    phone: "+91 9876501234",
    rating: 4.7,
    totalBookings: 104,
    successfulBookings: 101,
    onTimeDeliveryRate: 94,
    location: {
      latitude: 26.8500,
      longitude: 80.9400,
    },
    vehicle: {
      id: "VH-002",
      type: "REFRIGERATED_TRUCK",
      capacityKg: 5000,
      pricePerKm: 28,
      refrigerated: true,
    },
    availability: "AVAILABLE",
  },

  {
    id: "TR-003",
    name: "Verma Cargo Services",
    phone: "+91 9867123456",
    rating: 4.6,
    totalBookings: 96,
    successfulBookings: 91,
    onTimeDeliveryRate: 92,
    location: {
      latitude: 26.8395,
      longitude: 80.9532,
    },
    vehicle: {
      id: "VH-003",
      type: "PICKUP_TRUCK",
      capacityKg: 3000,
      pricePerKm: 20,
      refrigerated: false,
    },
    availability: "AVAILABLE",
  },

  {
    id: "TR-004",
    name: "Kisan Express",
    phone: "+91 9856012347",
    rating: 4.5,
    totalBookings: 89,
    successfulBookings: 84,
    onTimeDeliveryRate: 91,
    location: {
      latitude: 26.8582,
      longitude: 80.9325,
    },
    vehicle: {
      id: "VH-004",
      type: "MEDIUM_TRUCK",
      capacityKg: 7000,
      pricePerKm: 25,
      refrigerated: false,
    },
    availability: "BUSY",
  },

  {
    id: "TR-005",
    name: "GreenField Transport",
    phone: "+91 9845123678",
    rating: 4.4,
    totalBookings: 82,
    successfulBookings: 78,
    onTimeDeliveryRate: 90,
    location: {
      latitude: 26.8328,
      longitude: 80.9614,
    },
    vehicle: {
      id: "VH-005",
      type: "REFRIGERATED_TRUCK",
      capacityKg: 6000,
      pricePerKm: 30,
      refrigerated: true,
    },
    availability: "AVAILABLE",
  },

  {
    id: "TR-006",
    name: "Sharma Freight Movers",
    phone: "+91 9834567129",
    rating: 4.3,
    totalBookings: 76,
    successfulBookings: 71,
    onTimeDeliveryRate: 89,
    location: {
      latitude: 26.8615,
      longitude: 80.9588,
    },
    vehicle: {
      id: "VH-006",
      type: "MINI_TRUCK",
      capacityKg: 2000,
      pricePerKm: 17,
      refrigerated: false,
    },
    availability: "AVAILABLE",
  },

  {
    id: "TR-007",
    name: "AgroMove Logistics",
    phone: "+91 9823456710",
    rating: 4.2,
    totalBookings: 69,
    successfulBookings: 64,
    onTimeDeliveryRate: 88,
    location: {
      latitude: 26.8254,
      longitude: 80.9387,
    },
    vehicle: {
      id: "VH-007",
      type: "PICKUP_TRUCK",
      capacityKg: 3500,
      pricePerKm: 21,
      refrigerated: false,
    },
    availability: "BUSY",
  },

  {
    id: "TR-008",
    name: "FarmLink Carriers",
    phone: "+91 9812345678",
    rating: 4.1,
    totalBookings: 63,
    successfulBookings: 59,
    onTimeDeliveryRate: 87,
    location: {
      latitude: 26.8547,
      longitude: 80.9702,
    },
    vehicle: {
      id: "VH-008",
      type: "REFRIGERATED_TRUCK",
      capacityKg: 4500,
      pricePerKm: 27,
      refrigerated: true,
    },
    availability: "AVAILABLE",
  },

  {
    id: "TR-009",
    name: "Krishi Cargo Hub",
    phone: "+91 9801234567",
    rating: 4.0,
    totalBookings: 57,
    successfulBookings: 52,
    onTimeDeliveryRate: 85,
    location: {
      latitude: 26.8189,
      longitude: 80.9506,
    },
    vehicle: {
      id: "VH-009",
      type: "MEDIUM_TRUCK",
      capacityKg: 8000,
      pricePerKm: 26,
      refrigerated: false,
    },
    availability: "BUSY",
  },

  {
    id: "TR-010",
    name: "FreshRoute Transport",
    phone: "+91 9898765432",
    rating: 4.9,
    totalBookings: 143,
    successfulBookings: 139,
    onTimeDeliveryRate: 97,
    location: {
      latitude: 26.8412,
      longitude: 80.9278,
    },
    vehicle: {
      id: "VH-010",
      type: "REFRIGERATED_TRUCK",
      capacityKg: 5500,
      pricePerKm: 29,
      refrigerated: true,
    },
    availability: "AVAILABLE",
  },

  {
    id: "TR-011",
    name: "Bharat Agro Movers",
    phone: "+91 9878123456",
    rating: 3.9,
    totalBookings: 51,
    successfulBookings: 46,
    onTimeDeliveryRate: 83,
    location: {
      latitude: 26.8661,
      longitude: 80.9443,
    },
    vehicle: {
      id: "VH-011",
      type: "MINI_TRUCK",
      capacityKg: 2200,
      pricePerKm: 16,
      refrigerated: false,
    },
    availability: "AVAILABLE",
  },

  {
    id: "TR-012",
    name: "Harvest Haulers",
    phone: "+91 9865432109",
    rating: 4.7,
    totalBookings: 117,
    successfulBookings: 112,
    onTimeDeliveryRate: 95,
    location: {
      latitude: 26.8297,
      longitude: 80.9785,
    },
    vehicle: {
      id: "VH-012",
      type: "LARGE_TRUCK",
      capacityKg: 10000,
      pricePerKm: 32,
      refrigerated: false,
    },
    availability: "AVAILABLE",
  },
];




const storageFacilities: StorageFacility[] = [
  {
    id: "ST-001",
    name: "Green Cold Storage",
    ownerName: "Green Storage Pvt. Ltd.",
    phone: "+91 9876543211",
    rating: 4.8,
    totalBookings: 96,
    successfulBookings: 93,
    location: {
      latitude: 26.8525,
      longitude: 80.9580,
    },
    storageType: "COLD_STORAGE",
    totalCapacityKg: 50000,
    availableCapacityKg: 42000,
    pricePerKgPerDay: 1.8,
    temperatureRange: {
      minCelsius: 2,
      maxCelsius: 8,
    },
    supportedProduce: [
      "Tomato",
      "Potato",
      "Apple",
      "Mango",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-002",
    name: "Kisan Warehouse",
    ownerName: "Kisan Storage",
    phone: "+91 9876543212",
    rating: 4.6,
    totalBookings: 72,
    successfulBookings: 69,
    location: {
      latitude: 26.8350,
      longitude: 26.9320,
    },
    storageType: "WAREHOUSE",
    totalCapacityKg: 40000,
    availableCapacityKg: 31000,
    pricePerKgPerDay: 1.2,
    supportedProduce: [
      "Wheat",
      "Rice",
      "Potato",
      "Onion",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-003",
    name: "FreshStore",
    ownerName: "FreshStore Logistics",
    phone: "+91 9876543213",
    rating: 4.4,
    totalBookings: 48,
    successfulBookings: 45,
    location: {
      latitude: 26.8600,
      longitude: 26.9200,
    },
    storageType: "COLD_STORAGE",
    totalCapacityKg: 20000,
    availableCapacityKg: 8000,
    pricePerKgPerDay: 2.1,
    temperatureRange: {
      minCelsius: 3,
      maxCelsius: 10,
    },
    supportedProduce: [
      "Tomato",
      "Mango",
      "Vegetables",
    ],
    availability: "LIMITED",
  },

  {
    id: "ST-004",
    name: "AgroSafe Storage",
    ownerName: "AgroSafe Solutions",
    phone: "+91 9876543214",
    rating: 4.7,
    totalBookings: 118,
    successfulBookings: 114,
    location: {
      latitude: 26.8750,
      longitude: 80.9450,
    },
    storageType: "WAREHOUSE",
    totalCapacityKg: 75000,
    availableCapacityKg: 58000,
    pricePerKgPerDay: 1.1,
    supportedProduce: [
      "Wheat",
      "Rice",
      "Maize",
      "Barley",
      "Pulses",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-005",
    name: "FarmFresh Cold Hub",
    ownerName: "FarmFresh Logistics",
    phone: "+91 9876543215",
    rating: 4.9,
    totalBookings: 143,
    successfulBookings: 140,
    location: {
      latitude: 26.8280,
      longitude: 80.9720,
    },
    storageType: "COLD_STORAGE",
    totalCapacityKg: 60000,
    availableCapacityKg: 47000,
    pricePerKgPerDay: 2.0,
    temperatureRange: {
      minCelsius: 1,
      maxCelsius: 7,
    },
    supportedProduce: [
      "Apple",
      "Mango",
      "Tomato",
      "Grapes",
      "Orange",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-006",
    name: "Bharat Grain Depot",
    ownerName: "Bharat Agro Storage",
    phone: "+91 9876543216",
    rating: 4.5,
    totalBookings: 84,
    successfulBookings: 80,
    location: {
      latitude: 26.8420,
      longitude: 80.9100,
    },
    storageType: "WAREHOUSE",
    totalCapacityKg: 90000,
    availableCapacityKg: 62000,
    pricePerKgPerDay: 0.95,
    supportedProduce: [
      "Wheat",
      "Rice",
      "Maize",
      "Millet",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-007",
    name: "Shivam Agro Cold Chain",
    ownerName: "Shivam Agro Services",
    phone: "+91 9876543217",
    rating: 4.3,
    totalBookings: 61,
    successfulBookings: 57,
    location: {
      latitude: 26.8180,
      longitude: 80.9400,
    },
    storageType: "COLD_STORAGE",
    totalCapacityKg: 30000,
    availableCapacityKg: 6500,
    pricePerKgPerDay: 2.4,
    temperatureRange: {
      minCelsius: 0,
      maxCelsius: 6,
    },
    supportedProduce: [
      "Potato",
      "Tomato",
      "Carrot",
      "Peas",
    ],
    availability: "LIMITED",
  },

  {
    id: "ST-008",
    name: "Lucknow Agro Warehouse",
    ownerName: "Lucknow Agro Pvt. Ltd.",
    phone: "+91 9876543218",
    rating: 4.6,
    totalBookings: 105,
    successfulBookings: 101,
    location: {
      latitude: 26.8650,
      longitude: 80.9750,
    },
    storageType: "WAREHOUSE",
    totalCapacityKg: 55000,
    availableCapacityKg: 39000,
    pricePerKgPerDay: 1.3,
    supportedProduce: [
      "Wheat",
      "Rice",
      "Onion",
      "Potato",
      "Pulses",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-009",
    name: "HarvestGuard Storage",
    ownerName: "HarvestGuard India",
    phone: "+91 9876543219",
    rating: 4.2,
    totalBookings: 53,
    successfulBookings: 49,
    location: {
      latitude: 26.8900,
      longitude: 80.9300,
    },
    storageType: "WAREHOUSE",
    totalCapacityKg: 35000,
    availableCapacityKg: 9000,
    pricePerKgPerDay: 1.4,
    supportedProduce: [
      "Wheat",
      "Maize",
      "Rice",
      "Mustard",
    ],
    availability: "LIMITED",
  },

  {
    id: "ST-010",
    name: "Kisan Shakti Cold Store",
    ownerName: "Kisan Shakti Enterprises",
    phone: "+91 9876543220",
    rating: 4.7,
    totalBookings: 127,
    successfulBookings: 122,
    location: {
      latitude: 26.8100,
      longitude: 80.9850,
    },
    storageType: "COLD_STORAGE",
    totalCapacityKg: 45000,
    availableCapacityKg: 33000,
    pricePerKgPerDay: 1.9,
    temperatureRange: {
      minCelsius: 2,
      maxCelsius: 9,
    },
    supportedProduce: [
      "Potato",
      "Apple",
      "Mango",
      "Tomato",
      "Cabbage",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-011",
    name: "Sahyog Rural Warehouse",
    ownerName: "Sahyog Farmer Services",
    phone: "+91 9876543221",
    rating: 4.1,
    totalBookings: 39,
    successfulBookings: 36,
    location: {
      latitude: 26.8780,
      longitude: 80.9000,
    },
    storageType: "WAREHOUSE",
    totalCapacityKg: 28000,
    availableCapacityKg: 18000,
    pricePerKgPerDay: 1.0,
    supportedProduce: [
      "Wheat",
      "Rice",
      "Pulses",
      "Mustard",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-012",
    name: "NatureVault Cold Storage",
    ownerName: "NatureVault Agro Pvt. Ltd.",
    phone: "+91 9876543222",
    rating: 4.8,
    totalBookings: 112,
    successfulBookings: 108,
    location: {
      latitude: 26.8450,
      longitude: 80.8900,
    },
    storageType: "COLD_STORAGE",
    totalCapacityKg: 70000,
    availableCapacityKg: 12000,
    pricePerKgPerDay: 2.2,
    temperatureRange: {
      minCelsius: 1,
      maxCelsius: 8,
    },
    supportedProduce: [
      "Apple",
      "Mango",
      "Grapes",
      "Orange",
      "Tomato",
    ],
    availability: "LIMITED",
  },

  {
    id: "ST-013",
    name: "Kisan Mitra Storage",
    ownerName: "Kisan Mitra Cooperative",
    phone: "+91 9876543223",
    rating: 4.5,
    totalBookings: 67,
    successfulBookings: 64,
    location: {
      latitude: 26.8250,
      longitude: 80.9150,
    },
    storageType: "WAREHOUSE",
    totalCapacityKg: 42000,
    availableCapacityKg: 27000,
    pricePerKgPerDay: 1.15,
    supportedProduce: [
      "Wheat",
      "Rice",
      "Potato",
      "Onion",
      "Maize",
    ],
    availability: "AVAILABLE",
  },

  {
    id: "ST-014",
    name: "AgriCool Preservation Hub",
    ownerName: "AgriCool Technologies",
    phone: "+91 9876543224",
    rating: 4.6,
    totalBookings: 91,
    successfulBookings: 87,
    location: {
      latitude: 26.8950,
      longitude: 80.9650,
    },
    storageType: "COLD_STORAGE",
    totalCapacityKg: 38000,
    availableCapacityKg: 5200,
    pricePerKgPerDay: 2.3,
    temperatureRange: {
      minCelsius: 0,
      maxCelsius: 7,
    },
    supportedProduce: [
      "Tomato",
      "Strawberry",
      "Mango",
      "Vegetables",
    ],
    availability: "LIMITED",
  },

  {
    id: "ST-015",
    name: "GrainSecure Central Depot",
    ownerName: "GrainSecure India",
    phone: "+91 9876543225",
    rating: 4.4,
    totalBookings: 76,
    successfulBookings: 72,
    location: {
      latitude: 26.8550,
      longitude: 80.8850,
    },
    storageType: "WAREHOUSE",
    totalCapacityKg: 100000,
    availableCapacityKg: 74000,
    pricePerKgPerDay: 0.9,
    supportedProduce: [
      "Wheat",
      "Rice",
      "Maize",
      "Barley",
      "Millets",
    ],
    availability: "AVAILABLE",
  },
];





const processingUnits: ProcessingUnit[] = [
  {
    id: "PR-001",
    name: "ABC Agro Processing",

    location: {
      latitude: 26.83,
      longitude: 80.97,
    },

    acceptedCrops: [
      "Tomato",
      "Potato",
      "Mango",
    ],

    dailyCapacityKg: 20000,
    minimumQuantityKg: 500,

    availability: "AVAILABLE",
  },
];

export async function getNearbyTransporters(): Promise<Transporter[]> {
  return transporters;
}

export async function getNearbyStorage(): Promise<StorageFacility[]> {
  return storageFacilities;
}

export async function getNearbyProcessors(): Promise<ProcessingUnit[]> {
  return processingUnits;
}