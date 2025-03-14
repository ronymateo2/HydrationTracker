"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProgressCard from "@/components/dashboard/ProgressCard";
import QuickAddSection from "@/components/dashboard/QuickAddSection";
import AddBeverageDialog from "@/components/dashboard/AddBeverageDialog";
import Header from "@/components/dashboard/Header";
import StatisticsTabs from "@/components/dashboard/StatisticsTabs";
import ProfileSheet from "@/components/profile/ProfileSheet";
import ReminderDialog from "@/components/reminders/ReminderDialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();

  const [currentIntake, setCurrentIntake] = useState<number>(0);
  const [dailyGoal, setDailyGoal] = useState<number>(2500);
  const [isAddBeverageOpen, setIsAddBeverageOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isReminderOpen, setIsReminderOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user profile and hydration data when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session?.user?.id]);

  // Fetch user profile and today's hydration logs
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch user profile
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.data) {
          setDailyGoal(profileData.data.daily_goal);
        }
      }

      // Fetch today's hydration logs
      const today = new Date().toISOString().split("T")[0];
      const hydrationRes = await fetch(`/api/hydration?startDate=${today}`);
      if (hydrationRes.ok) {
        const hydrationData = await hydrationRes.json();
        if (hydrationData.data) {
          // Calculate total intake for today
          const totalIntake = hydrationData.data.reduce(
            (sum: number, log: any) => sum + log.amount,
            0,
          );
          setCurrentIntake(totalIntake);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data after adding a beverage
  const refreshData = () => {
    if (session?.user?.id) {
      fetchUserData();
    }
  };

  // Handle adding a beverage
  const handleAddBeverage = (type: string, amount: number) => {
    setCurrentIntake((prev) => Math.min(prev + amount, dailyGoal));
    // The actual API call is now handled in the AddBeverageDialog and QuickAddSection components
    // Refresh data to ensure we have the latest from the database
    refreshData();
  };

  // Handle updating user profile
  const handleProfileUpdate = (userData: any) => {
    if (userData?.newGoal) {
      setDailyGoal(userData.newGoal);
    }
    // The actual API call is now handled in the ProfileSheet component
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
                  <span className="text-blue-600 font-semibold">
                    {session?.user?.name
                      ? session.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)
                      : "U"}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-black">
                    {session?.user?.name || "User"}
                  </h3>
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
                <h3 className="font-semibold text-black">Hydration Tips</h3>
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
                  <span className="text-gray-500">
                    Drink a glass of water first thing in the morning
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-gray-500">
                    Keep a water bottle with you throughout the day
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-gray-500">
                    Set reminders to drink water every hour
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-gray-500">
                    Eat water-rich fruits and vegetables
                  </span>
                </li>
              </ul>
            </div>

            {/* Daily Streak */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-3 text-black">Your Streak</h3>
              <div className="flex items-center justify-center space-x-2">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">7</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-sm text-gray-500">
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
