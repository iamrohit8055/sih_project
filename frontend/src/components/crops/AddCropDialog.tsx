import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cropSchema = z.object({
  name: z
    .string()
    .min(2, "Crop name must contain at least 2 characters."),

  variety: z
    .string()
    .min(2, "Please enter the crop variety."),

  farm: z
    .string()
    .min(2, "Please enter the farm name."),

  area: z.coerce
    .number()
    .positive("Area must be greater than 0."),

  sowingDate: z
    .string()
    .min(1, "Please select the sowing date."),

  harvestDate: z
    .string()
    .min(1, "Please select the expected harvest date."),

  health: z.enum(["Healthy", "Needs Attention", "Critical"]),
});

type CropFormValues = z.infer<typeof cropSchema>;

interface AddCropDialogProps {
  onAddCrop: (crop: CropFormValues) => void;
}

function AddCropDialog({ onAddCrop }: AddCropDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      name: "",
      variety: "",
      farm: "",
      area: 0,
      sowingDate: "",
      harvestDate: "",
      health: "Healthy",
    },
  });

  const onSubmit = (values: CropFormValues) => {
    onAddCrop(values);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700">
          <Plus size={18} />
          Add Crop
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Crop</DialogTitle>

          <DialogDescription>
            Add your crop details so you can track its progress and
            health.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Crop name */}
          <div className="space-y-2">
            <Label htmlFor="name">Crop Name</Label>

            <Input
              id="name"
              placeholder="e.g. Wheat"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Variety */}
          <div className="space-y-2">
            <Label htmlFor="variety">Variety</Label>

            <Input
              id="variety"
              placeholder="e.g. HD-2967"
              {...form.register("variety")}
            />

            {form.formState.errors.variety && (
              <p className="text-sm text-red-500">
                {form.formState.errors.variety.message}
              </p>
            )}
          </div>

          {/* Farm */}
          <div className="space-y-2">
            <Label htmlFor="farm">Farm</Label>

            <Input
              id="farm"
              placeholder="e.g. Green Acre Farm"
              {...form.register("farm")}
            />

            {form.formState.errors.farm && (
              <p className="text-sm text-red-500">
                {form.formState.errors.farm.message}
              </p>
            )}
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="area">Area (acres)</Label>

            <Input
              id="area"
              type="number"
              step="0.1"
              placeholder="e.g. 3.5"
              {...form.register("area")}
            />

            {form.formState.errors.area && (
              <p className="text-sm text-red-500">
                {form.formState.errors.area.message}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sowingDate">Sowing Date</Label>

              <Input
                id="sowingDate"
                type="date"
                {...form.register("sowingDate")}
              />

              {form.formState.errors.sowingDate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.sowingDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="harvestDate">
                Expected Harvest
              </Label>

              <Input
                id="harvestDate"
                type="date"
                {...form.register("harvestDate")}
              />

              {form.formState.errors.harvestDate && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.harvestDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Health */}
          <div className="space-y-2">
            <Label>Health Status</Label>

            <Select
              value={form.watch("health")}
              onValueChange={(value) =>
                form.setValue(
                  "health",
                  value as CropFormValues["health"],
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select health status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Healthy">Healthy</SelectItem>
                <SelectItem value="Needs Attention">
                  Needs Attention
                </SelectItem>
                <SelectItem value="Critical">
                  Critical
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
            >
              Add Crop
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCropDialog;