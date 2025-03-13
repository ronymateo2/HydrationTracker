"use client";

import { useState } from "react";
import { Bell, Plus } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReminderDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaveReminder?: (reminderData: any) => void;
}

const ReminderDialog = ({
  open = false,
  onOpenChange = () => {},
  onSaveReminder = () => {},
}: ReminderDialogProps) => {
  const [frequency, setFrequency] = useState<string>("hourly");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("20:00");
  const [interval, setInterval] = useState<string>("60");

  const handleSave = () => {
    onSaveReminder({
      frequency,
      startTime,
      endTime,
      interval: parseInt(interval),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Set Reminders</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Hydration Reminders</DialogTitle>
          <DialogDescription>
            Set up reminders to help you stay hydrated throughout the day.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="frequency">Reminder Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="custom">Custom Interval</SelectItem>
                <SelectItem value="fixed_times">Fixed Times</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency === "custom" && (
            <div className="grid gap-2">
              <Label htmlFor="interval">Interval (minutes)</Label>
              <Input
                id="interval"
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                min="15"
                max="240"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {frequency === "fixed_times" && (
            <div className="space-y-2">
              <Label>Reminder Times</Label>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">9:00 AM</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  ×
                </Button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">12:00 PM</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  ×
                </Button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">3:00 PM</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  ×
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Time
              </Button>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm font-medium">Reminder Preview</p>
            <p className="text-xs text-gray-500 mt-1">
              {frequency === "hourly"
                ? `You will be reminded every hour from ${startTime} to ${endTime}`
                : frequency === "custom"
                  ? `You will be reminded every ${interval} minutes from ${startTime} to ${endTime}`
                  : `You will be reminded at specific times between ${startTime} and ${endTime}`}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Reminders</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
