"use client";

import { Card } from "@/components/ui/card";
import { Activity, Layers, Percent, Clock } from "lucide-react";

const widgets = [
  {
    title: "Products by Status",
    icon: Activity,
    data: [
      { label: "Published", value: 987, percentage: 80 },
      { label: "Draft", value: 156, percentage: 13 },
      { label: "Archived", value: 91, percentage: 7 },
    ],
  },
  {
    title: "Top Brands",
    icon: Layers,
    data: [
      { label: "Brand A", value: 234 },
      { label: "Brand B", value: 189 },
      { label: "Brand C", value: 145 },
      { label: "Brand D", value: 112 },
    ],
  },
  {
    title: "Top Discounted",
    icon: Percent,
    data: [
      { label: "Electronics", value: "25% off" },
      { label: "Clothing", value: "20% off" },
      { label: "Home Decor", value: "15% off" },
      { label: "Books", value: "10% off" },
    ],
  },
  {
    title: "Recently Added",
    icon: Clock,
    data: [
      { label: "Wireless Headphones", value: "2h ago" },
      { label: "Smart Watch", value: "5h ago" },
      { label: "Laptop Stand", value: "8h ago" },
      { label: "USB-C Cable", value: "12h ago" },
    ],
  },
];

export default function AnalyticsWidgets() {
  return (
    <div className="space-y-6">
      {widgets.map((widget, index) => (
        <Card key={index} className="bg-[#1f1f1f] border-gray-800 p-6 hover:bg-[#252525] transition-colors duration-200">
          <div className="flex items-center gap-2 mb-4">
            <widget.icon className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">{widget.title}</h3>
          </div>
          <div className="space-y-3">
            {widget.data.map((item, itemIndex) => (
              <div key={itemIndex} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
                {"percentage" in item && (
                  <div className="w-full bg-black rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
