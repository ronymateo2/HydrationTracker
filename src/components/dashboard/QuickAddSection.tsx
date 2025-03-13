"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Coffee, Droplet, Milk, Leaf, Plus } from "lucide-react";

interface BeverageOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  defaultAmount: number;
  unit: string;
}

interface QuickAddSectionProps {
  onAddBeverage?: (beverage: { type: string; amount: number }) => void;
  beverageOptions?: BeverageOption[];
}

const QuickAddSection = ({
  onAddBeverage = () => {},
  beverageOptions = [
    {
      id: "water",
      name: "Water",
      icon: <Droplet size={20} />,
      color: "bg-blue-500",
      defaultAmount: 250,
      unit: "ml",
    },
    {
      id: "milk",
      name: "Milk",
      icon: <Milk size={20} />,
      color: "bg-gray-200",
      defaultAmount: 200,
      unit: "ml",
    },
    {
      id: "green-tea",
      name: "Green Tea",
      icon: <Leaf size={20} />,
      color: "bg-green-500",
      defaultAmount: 200,
      unit: "ml",
    },
    {
      id: "coffee",
      name: "Coffee",
      icon: <Coffee size={20} />,
      color: "bg-amber-800",
      defaultAmount: 150,
      unit: "ml",
    },
  ],
}: QuickAddSectionProps) => {
  const handleQuickAdd = (beverageId: string, amount: number) => {
    onAddBeverage({ type: beverageId, amount });
  };

  return (
    <div className="w-full bg-card p-6 rounded-lg shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Quick Add</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              <span>Custom</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Beverage</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Custom beverage form placeholder. This would contain beverage
                  type selection and amount input.
                </p>
                <Button className="w-full">Add Beverage</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {beverageOptions.map((beverage) => (
          <Button
            key={beverage.id}
            variant="outline"
            className="flex flex-col items-center justify-center h-24 p-2 hover:bg-accent transition-colors"
            onClick={() => handleQuickAdd(beverage.id, beverage.defaultAmount)}
          >
            <div
              className={`${beverage.color} p-2 rounded-full text-white mb-2`}
            >
              {beverage.icon}
            </div>
            <span className="text-sm font-medium">{beverage.name}</span>
            <span className="text-xs text-muted-foreground">
              {beverage.defaultAmount}
              {beverage.unit}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickAddSection;
