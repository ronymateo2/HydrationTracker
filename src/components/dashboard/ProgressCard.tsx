"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { Droplet } from "lucide-react";

interface ProgressCardProps {
  currentIntake?: number;
  dailyGoal?: number;
  unit?: string;
}

const ProgressCard = ({
  currentIntake = 1200,
  dailyGoal = 2500,
  unit = "ml",
}: ProgressCardProps) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((currentIntake / dailyGoal) * 100),
    100
  );
  const remaining = Math.max(dailyGoal - currentIntake, 0);

  return (
    <Card className="w-full max-w-[700px] bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Droplet className="h-6 w-6 text-blue-600" />
          Daily Hydration Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {/* Circular Progress Indicator */}
        <div className="relative flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center">
            <div
              className="absolute w-48 h-48 rounded-full overflow-hidden"
              style={{
                background: `conic-gradient(#3b82f6 ${progressPercentage}%, transparent ${progressPercentage}%)`,
              }}
            ></div>
            <div className="w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center z-10">
              <span className="text-4xl font-bold text-blue-600">
                {currentIntake}
              </span>
              <span className="text-base text-gray-700 font-medium">
                {unit} consumed
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-base font-medium">
            <span className="text-gray-800">
              Progress: {progressPercentage}%
            </span>
            <span className="text-gray-800">
              {remaining} {unit} remaining
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 w-full gap-4 text-gray-700">
          <div className="text-center px-2 bg-blue-50 py-2 rounded-md">
            <p className="font-medium mb-1 text-base">Daily Goal</p>
            <p className="font-bold text-blue-600 truncate text-lg">
              {dailyGoal} {unit}
            </p>
          </div>
          <div className="text-center px-2 bg-blue-50 py-2 rounded-md">
            <p className="font-medium mb-1 text-base">Current Intake</p>
            <p className="font-bold text-blue-600 truncate text-lg">
              {currentIntake} {unit}
            </p>
          </div>
          <div className="text-center px-2 bg-blue-50 py-2 rounded-md">
            <p className="font-medium mb-1 text-base">Remaining</p>
            <p className="font-bold text-blue-600 truncate text-lg">
              {remaining} {unit}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
