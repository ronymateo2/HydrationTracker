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
    100,
  );
  const remaining = Math.max(dailyGoal - currentIntake, 0);

  return (
    <Card className="w-full max-w-[700px] h-[300px] bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Daily Hydration Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6">
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
              <span className="text-4xl font-bold text-blue-500">
                {currentIntake}
              </span>
              <span className="text-sm text-gray-500">{unit} consumed</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {progressPercentage}%</span>
            <span>
              {remaining} {unit} remaining
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="flex w-full justify-between text-sm text-gray-500">
          <div className="text-center">
            <p className="font-medium">Daily Goal</p>
            <p className="font-bold text-blue-500">
              {dailyGoal} {unit}
            </p>
          </div>
          <div className="text-center">
            <p className="font-medium">Current Intake</p>
            <p className="font-bold text-blue-500">
              {currentIntake} {unit}
            </p>
          </div>
          <div className="text-center">
            <p className="font-medium">Remaining</p>
            <p className="font-bold text-blue-500">
              {remaining} {unit}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
