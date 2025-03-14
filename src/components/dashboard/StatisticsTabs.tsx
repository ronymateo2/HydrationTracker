"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface StatisticsTabsProps {
  currentIntake?: number;
  dailyGoal?: number;
  refreshTrigger?: number;
}

interface BeverageLog {
  id: string;
  user_id: string;
  beverage_type: string;
  amount: number;
  created_at: string;
}

const beverageColors = {
  water: "#3b82f6", // blue
  milk: "#d1d5db", // light gray
  "green-tea": "#22c55e", // green
  coffee: "#92400e", // brown
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "numeric", hour12: true });
};

const formatDay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: "short" });
};

const formatWeek = (dateString: string) => {
  const date = new Date(dateString);
  const weekNumber = Math.ceil(
    (date.getDate() + ((date.getDay() + 6) % 7)) / 7,
  );
  return `Week ${weekNumber}`;
};

const StatisticsTabs = ({
  currentIntake = 0,
  dailyGoal = 2500,
  refreshTrigger = 0,
}: StatisticsTabsProps) => {
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [beverageBreakdown, setBeverageBreakdown] = useState<any[]>([]);
  const [weeklyAverage, setWeeklyAverage] = useState<number>(0);
  const [bestDay, setBestDay] = useState<{ day: string; amount: number }>({
    day: "",
    amount: 0,
  });
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [dailyAverage, setDailyAverage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHydrationData();
  }, [refreshTrigger]);

  const fetchHydrationData = async () => {
    setIsLoading(true);
    try {
      // Get data for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split("T")[0];

      const response = await fetch(`/api/hydration?startDate=${startDate}`);
      if (!response.ok) throw new Error("Failed to fetch hydration data");

      const { data } = await response.json();
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      processHydrationData(data);
    } catch (error) {
      console.error("Error fetching hydration data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processHydrationData = (logs: BeverageLog[]) => {
    // Sort logs by date (newest first)
    const sortedLogs = [...logs].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    // Process daily data (today's logs)
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = sortedLogs.filter((log) =>
      log.created_at.startsWith(today),
    );

    // Group by hour for daily chart
    const dailyByHour = todayLogs.reduce(
      (acc, log) => {
        const time = formatTime(log.created_at);
        if (!acc[time]) acc[time] = 0;
        acc[time] += log.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const processedDailyData = Object.entries(dailyByHour)
      .map(([time, amount]) => ({
        time,
        amount,
      }))
      .sort((a, b) => {
        // Sort by hour
        const hourA = parseInt(a.time.replace(/[^0-9]/g, ""));
        const hourB = parseInt(b.time.replace(/[^0-9]/g, ""));
        const isPMA = a.time.includes("PM");
        const isPMB = b.time.includes("PM");

        if (isPMA && !isPMB) return 1;
        if (!isPMA && isPMB) return -1;
        return hourA - hourB;
      });

    // Process weekly data (last 7 days)
    const last7Days = new Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    const weeklyByDay = last7Days.reduce(
      (acc, date) => {
        const dayLogs = sortedLogs.filter((log) =>
          log.created_at.startsWith(date),
        );
        const dayTotal = dayLogs.reduce((sum, log) => sum + log.amount, 0);
        const dayName = formatDay(date);
        acc[dayName] = (acc[dayName] || 0) + dayTotal;
        return acc;
      },
      {} as Record<string, number>,
    );

    const processedWeeklyData = Object.entries(weeklyByDay)
      .map(([day, amount]) => ({
        day,
        amount,
      }))
      .reverse(); // Reverse to show oldest to newest

    // Find best day and calculate weekly average
    let bestDayData = { day: "", amount: 0 };
    let weeklyTotal = 0;

    processedWeeklyData.forEach((day) => {
      weeklyTotal += day.amount;
      if (day.amount > bestDayData.amount) {
        bestDayData = { day: day.day, amount: day.amount };
      }
    });

    const calculatedWeeklyAverage = Math.round(
      weeklyTotal / processedWeeklyData.length,
    );

    // Process monthly data (group by week)
    const last4Weeks = new Array(4).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      return date.toISOString().split("T")[0];
    });

    const monthlyByWeek = last4Weeks.reduce(
      (acc, date) => {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - 6); // Get start of week

        const weekLogs = sortedLogs.filter((log) => {
          const logDate = new Date(log.created_at);
          return logDate >= weekStart && logDate <= new Date(date);
        });

        const weekTotal = weekLogs.reduce((sum, log) => sum + log.amount, 0);
        const weekName = formatWeek(date);
        acc[weekName] = weekTotal;
        return acc;
      },
      {} as Record<string, number>,
    );

    const processedMonthlyData = Object.entries(monthlyByWeek)
      .map(([week, amount]) => ({
        week,
        amount,
      }))
      .reverse(); // Reverse to show oldest to newest

    // Calculate monthly total and daily average
    const calculatedMonthlyTotal = sortedLogs.reduce(
      (sum, log) => sum + log.amount,
      0,
    );
    const calculatedDailyAverage = Math.round(calculatedMonthlyTotal / 30); // Assuming 30 days

    // Process beverage breakdown
    const beverageTypes = sortedLogs.reduce(
      (acc, log) => {
        if (!acc[log.beverage_type]) acc[log.beverage_type] = 0;
        acc[log.beverage_type] += log.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalAmount = Object.values(beverageTypes).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    const processedBeverageBreakdown = Object.entries(beverageTypes).map(
      ([name, amount]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " "),
        value: Math.round((amount / totalAmount) * 100),
        color: beverageColors[name as keyof typeof beverageColors] || "#888888",
      }),
    );

    // Update state with processed data
    setDailyData(processedDailyData);
    setWeeklyData(processedWeeklyData);
    setMonthlyData(processedMonthlyData);
    setBeverageBreakdown(processedBeverageBreakdown);
    setWeeklyAverage(calculatedWeeklyAverage);
    setBestDay(bestDayData);
    setMonthlyTotal(calculatedMonthlyTotal);
    setDailyAverage(calculatedDailyAverage);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border w-full">
      <Tabs defaultValue="daily">
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="h-64">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="amount"
                    name="Intake (ml)"
                    fill="hsl(var(--chart-1))"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for today
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Total Intake Today
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {currentIntake} ml
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Goal Completion
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((currentIntake / dailyGoal) * 100)}%
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Beverage Breakdown
            </h4>
            <div className="h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : beverageBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={beverageBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {beverageBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No beverage data available
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="h-64">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weeklyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Daily Intake (ml)"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for this week
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Weekly Average
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {weeklyAverage} ml
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">Best Day</h4>
              <p className="text-2xl font-bold text-green-600">
                {bestDay.day ? `${bestDay.day} (${bestDay.amount} ml)` : "N/A"}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="h-64">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="amount"
                    name="Weekly Intake (ml)"
                    fill="hsl(var(--chart-3))"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for this month
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Monthly Total
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {monthlyTotal > 0
                  ? `${(monthlyTotal / 1000).toFixed(1)} L`
                  : "0 L"}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Daily Average
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {dailyAverage} ml
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsTabs;
