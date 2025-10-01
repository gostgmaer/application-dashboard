"use client";

import { Card } from "@/components/ui/card";
import { ChartBar as BarChart3, ChartPie as PieChart, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Pie, PieChart as RePieChart, Line, LineChart } from "recharts";

const categoryData = [
  { name: "Electronics", value: 450 },
  { name: "Clothing", value: 320 },
  { name: "Home", value: 180 },
  { name: "Books", value: 125 },
  { name: "Sports", value: 95 },
  { name: "Toys", value: 64 },
];

const statusData = [
  { name: "Active", value: 987, color: "#ffffff" },
  { name: "Inactive", value: 247, color: "#666666" },
];

const timelineData = [
  { month: "Jan", products: 45 },
  { month: "Feb", products: 52 },
  { month: "Mar", products: 61 },
  { month: "Apr", products: 58 },
  { month: "May", products: 70 },
  { month: "Jun", products: 82 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1f1f1f] border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="text-white font-medium">{label}</p>
        <p className="text-gray-300 text-sm">{`${payload[0].value} products`}</p>
      </div>
    );
  }
  return null;
};

export default function ChartsSection() {
  return (
    <div className="space-y-6">
      <Card className="bg-[#1f1f1f] border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Products by Category</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <XAxis
              dataKey="name"
              stroke="#666666"
              tick={{ fill: '#999999' }}
              axisLine={{ stroke: '#333333' }}
            />
            <YAxis
              stroke="#666666"
              tick={{ fill: '#999999' }}
              axisLine={{ stroke: '#333333' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#ffffff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1f1f1f] border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Active vs Inactive</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-400">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-[#1f1f1f] border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Products Over Time</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <XAxis
                dataKey="month"
                stroke="#666666"
                tick={{ fill: '#999999' }}
                axisLine={{ stroke: '#333333' }}
              />
              <YAxis
                stroke="#666666"
                tick={{ fill: '#999999' }}
                axisLine={{ stroke: '#333333' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ fill: '#ffffff', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
