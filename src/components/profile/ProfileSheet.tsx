"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ProfileSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onProfileUpdate?: (userData: any) => void;
}

const ProfileSheet = ({
  open = false,
  onOpenChange = () => {},
  onProfileUpdate = () => {},
}: ProfileSheetProps) => {
  const [age, setAge] = useState<string>("30");
  const [gender, setGender] = useState<string>("male");
  const [weight, setWeight] = useState<string>("70");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [newGoal, setNewGoal] = useState<number>(2500);

  const handleSave = async () => {
    // Calculate new hydration goal based on user data
    // This is a simplified calculation - in a real app, this would be more sophisticated
    let calculatedGoal = 2500; // Default

    const weightNum = parseInt(weight);
    const ageNum = parseInt(age);

    if (!isNaN(weightNum) && !isNaN(ageNum)) {
      // Base calculation on weight (30ml per kg)
      calculatedGoal = weightNum * 30;

      // Adjust for age (decrease slightly for older adults)
      if (ageNum > 55) calculatedGoal *= 0.9;

      // Adjust for activity level
      if (activityLevel === "sedentary") calculatedGoal *= 0.8;
      if (activityLevel === "active") calculatedGoal *= 1.1;
      if (activityLevel === "very_active") calculatedGoal *= 1.2;

      // Round to nearest 50ml
      calculatedGoal = Math.round(calculatedGoal / 50) * 50;
    }

    setNewGoal(calculatedGoal);

    try {
      // Save profile to Supabase
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: ageNum,
          gender,
          weight: weightNum,
          activity_level: activityLevel,
          daily_goal: calculatedGoal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      // Update the UI
      onProfileUpdate({
        age,
        gender,
        weight,
        activityLevel,
        newGoal: calculatedGoal,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-white">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>
            Update your profile information to get a personalized hydration
            goal.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={1}
                max={120}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min={1}
                max={300}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="very_active">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Recommended Daily Intake
            </h4>
            <p className="text-2xl font-bold text-blue-600">{newGoal} ml</p>
            <p className="text-xs text-gray-500 mt-1">
              Based on your age, gender, weight, and activity level
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Profile
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;
