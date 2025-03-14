"use client";

import { useState } from "react";
import { PlusCircle, Coffee, Milk, GlassWater, Droplet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BeverageType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export interface AddBeverageDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddBeverage?: (type: string, amount: number) => void;
}

const beverageTypes: BeverageType[] = [
  {
    id: "water",
    name: "Water",
    icon: <Droplet className="h-5 w-5 text-blue-500" />,
    color: "bg-blue-100",
  },
  {
    id: "milk",
    name: "Milk",
    icon: <Milk className="h-5 w-5 text-gray-200" />,
    color: "bg-gray-100",
  },
  {
    id: "green-tea",
    name: "Green Tea",
    icon: <GlassWater className="h-5 w-5 text-green-500" />,
    color: "bg-green-100",
  },
  {
    id: "coffee",
    name: "Coffee",
    icon: <Coffee className="h-5 w-5 text-amber-800" />,
    color: "bg-amber-100",
  },
];

const defaultServingSizes = {
  water: 250, // ml
  milk: 200, // ml
  "green-tea": 180, // ml
  coffee: 150, // ml
};

const AddBeverageDialog = ({
  open = false,
  onOpenChange = () => {},
  onAddBeverage = () => {},
}: AddBeverageDialogProps) => {
  const [selectedType, setSelectedType] = useState<string>("water");
  const [servingSize, setServingSize] = useState<number>(250);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    // Set default serving size based on beverage type
    setServingSize(
      defaultServingSizes[value as keyof typeof defaultServingSizes],
    );
  };

  const handleServingSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setServingSize(value);
    }
  };

  const handleAddBeverage = async () => {
    try {
      // Call the API to log the beverage in Supabase
      const response = await fetch("/api/hydration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          beverage_type: selectedType,
          amount: servingSize,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to log beverage");
      }

      const result = await response.json();
      console.log("Beverage logged successfully:", result);

      // Update the UI
      onAddBeverage(selectedType, servingSize);
      onOpenChange(false);
    } catch (error) {
      console.error("Error logging beverage:", error);
      // You could add a toast notification here to show the error
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-base font-medium"
        >
          <PlusCircle className="h-5 w-5 text-blue-600" />
          <span className="text-blue-600">Add Beverage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Add Beverage
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Select a beverage type and specify the serving size to track your
            hydration.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label
              htmlFor="beverage-type"
              className="text-base font-medium text-gray-800"
            >
              Beverage Type
            </label>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger id="beverage-type">
                <SelectValue placeholder="Select a beverage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-base font-medium text-gray-500">
                    Beverages
                  </SelectLabel>
                  {beverageTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="flex items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${type.color}`}>
                          {type.icon}
                        </div>
                        <span className="text-base font-medium text-gray-500">
                          {type.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="serving-size"
              className="text-base font-medium text-gray-800"
            >
              Serving Size (ml)
            </label>
            <Input
              id="serving-size"
              type="number"
              value={servingSize}
              onChange={handleServingSizeChange}
              min={1}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[100, 200, 300, 500].map((size) => (
              <Button
                key={size}
                type="button"
                variant={servingSize === size ? "default" : "outline"}
                onClick={() => setServingSize(size)}
                className="text-xs h-8"
              >
                {size} ml
              </Button>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-center gap-3">
              {beverageTypes.find((type) => type.id === selectedType)?.icon}
              <div>
                <p className="text-base font-semibold text-gray-800">
                  {beverageTypes.find((type) => type.id === selectedType)?.name}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {servingSize} ml
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddBeverage}>Add Beverage</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBeverageDialog;
