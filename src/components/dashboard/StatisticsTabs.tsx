"use client";

import React from "react";
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
}

// Sample data for charts
const dailyData = [
  { time: "8am", amount: 250 },
  { time: "10am", amount: 200 },
  { time: "12pm", amount: 300 },
  { time: "2pm", amount: 150 },
  { time: "4pm", amount: 200 },
  { time: "6pm", amount: 100 },
];

const weeklyData = [
  { day: "Mon", amount: 1800 },
  { day: "Tue", amount: 2200 },
  { day: "Wed", amount: 1900 },
  { day: "Thu", amount: 2400 },
  { day: "Fri", amount: 2100 },
  { day: "Sat", amount: 1700 },
  { day: "Sun", amount: 2000 },
];

const monthlyData = [
  { week: "Week 1", amount: 14500 },
  { week: "Week 2", amount: 15200 },
  { week: "Week 3", amount: 13800 },
  { week: "Week 4", amount: 16000 },
];

const beverageBreakdown = [
  { name: "Water", value: 65, color: "#3b82f6" },
  { name: "Coffee", value: 15, color: "#92400e" },
  { name: "Green Tea", value: 10, color: "#22c55e" },
  { name: "Milk", value: 10, color: "#d1d5db" },
];

const StatisticsTabs = ({
  currentIntake = 1200,
  dailyGoal = 2500,
}: StatisticsTabsProps) => {
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
            <div className="h-48">
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
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {beverageBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="h-64">
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
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Weekly Average
              </h4>
              <p className="text-2xl font-bold text-blue-600">2014 ml</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">Best Day</h4>
              <p className="text-2xl font-bold text-green-600">Thu (2400 ml)</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="h-64">
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
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Monthly Total
              </h4>
              <p className="text-2xl font-bold text-blue-600">59.5 L</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Daily Average
              </h4>
              <p className="text-2xl font-bold text-green-600">1983 ml</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsTabs;
