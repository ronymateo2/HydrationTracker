"use client";

import { useState } from "react";
import ProgressCard from "@/components/dashboard/ProgressCard";
import QuickAddSection from "@/components/dashboard/QuickAddSection";
import AddBeverageDialog from "@/components/dashboard/AddBeverageDialog";
import Header from "@/components/dashboard/Header";
import StatisticsTabs from "@/components/dashboard/StatisticsTabs";
import ProfileSheet from "@/components/profile/ProfileSheet";
import ReminderDialog from "@/components/reminders/ReminderDialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentIntake, setCurrentIntake] = useState<number>(1200);
  const [dailyGoal, setDailyGoal] = useState<number>(2500);
  const [isAddBeverageOpen, setIsAddBeverageOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isReminderOpen, setIsReminderOpen] = useState<boolean>(false);

  // Handle adding a beverage
  const handleAddBeverage = (type: string, amount: number) => {
    setCurrentIntake((prev) => Math.min(prev + amount, dailyGoal));
    // In a real app, this would also save the beverage to a database
  };

  // Handle updating user profile
  const handleProfileUpdate = (userData: any) => {
    // In a real app, this would update the user profile and recalculate the hydration goal
    if (userData?.newGoal) {
      setDailyGoal(userData.newGoal);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onProfileClick={() => setIsProfileOpen(true)} />

      {/* Profile Sheet */}
      <ProfileSheet
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        onProfileUpdate={handleProfileUpdate}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Welcome Message */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to your Hydration Tracker
              </h1>
              <p className="text-gray-600 mt-2">
                Track your daily water intake and stay hydrated throughout the
                day.
              </p>
            </div>

            {/* Progress Card */}
            <ProgressCard
              currentIntake={currentIntake}
              dailyGoal={dailyGoal}
              unit="ml"
            />

            {/* Quick Add Section */}
            <div className="flex items-center justify-between mb-4 mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Add Beverage
              </h2>
              <AddBeverageDialog
                open={isAddBeverageOpen}
                onOpenChange={setIsAddBeverageOpen}
                onAddBeverage={handleAddBeverage}
              />
            </div>
            <QuickAddSection
              onAddBeverage={({ type, amount }) =>
                handleAddBeverage(type, amount)
              }
            />

            {/* Statistics Tabs */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Your Hydration Statistics
              </h2>
              <StatisticsTabs
                currentIntake={currentIntake}
                dailyGoal={dailyGoal}
              />
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">JD</span>
                </div>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm text-gray-500">
                    Hydration Goal: {dailyGoal}ml
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Hydration Tips */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Hydration Tips</h3>
                <ReminderDialog
                  open={isReminderOpen}
                  onOpenChange={setIsReminderOpen}
                  onSaveReminder={(data) =>
                    console.log("Reminder saved:", data)
                  }
                />
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Drink a glass of water first thing in the morning</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Keep a water bottle with you throughout the day</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Set reminders to drink water every hour</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Eat water-rich fruits and vegetables</span>
                </li>
              </ul>
            </div>

            {/* Daily Streak */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-3">Your Streak</h3>
              <div className="flex items-center justify-center space-x-2">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">7</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-sm">
                  <p>You've met your hydration goal for 7 days in a row!</p>
                  <p className="text-blue-600 font-medium mt-1">Keep it up!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
