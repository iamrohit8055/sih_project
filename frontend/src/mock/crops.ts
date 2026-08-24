import type { CropStatus } from "@/types/crop";

export interface MockCrop {
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
  stage: string;
  soil: string;
  irrigation: string;
}

export const mockCrops: MockCrop[] = [
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
    stage: "Grain Filling",
    soil: "Loamy",
    irrigation: "Drip Irrigation",
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
    stage: "Flowering",
    soil: "Sandy Loam",
    irrigation: "Sprinkler",
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
    stage: "Tuber Development",
    soil: "Loamy",
    irrigation: "Drip Irrigation",
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
    stage: "Vegetative",
    soil: "Clay Loam",
    irrigation: "Flood Irrigation",
  },
];