export type CropStatus = "Healthy" | "Growing" | "Critical" | "Harvest Ready" | "Needs Attention";

export interface Crop {
  id: string;
  name: string;
  farmName: string;
  area: number;
  progress: number;
  sowingDate: string;
  harvestDate: string;
  status: CropStatus;
  image: string;
}