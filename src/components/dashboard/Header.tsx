"use client";

import React from "react";
import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onProfileClick?: () => void;
}

const Header = ({ onProfileClick = () => {} }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hydration Tracker
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onProfileClick}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
