"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Download, RefreshCw, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DashboardToolbar() {
  return (
    <Card className="bg-[#1f1f1f] border-gray-800 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-white focus:ring-1 focus:ring-white"
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-white text-black hover:bg-gray-200 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-[#252525] hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex flex-wrap gap-3 flex-1">
            <Select>
              <SelectTrigger className="w-[160px] bg-black border-gray-700 text-white hover:bg-[#252525]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1f1f1f] border-gray-700 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="books">Books</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px] bg-black border-gray-700 text-white hover:bg-[#252525]">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent className="bg-[#1f1f1f] border-gray-700 text-white">
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="brand-a">Brand A</SelectItem>
                <SelectItem value="brand-b">Brand B</SelectItem>
                <SelectItem value="brand-c">Brand C</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px] bg-black border-gray-700 text-white hover:bg-[#252525]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1f1f1f] border-gray-700 text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px] bg-black border-gray-700 text-white hover:bg-[#252525]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-[#1f1f1f] border-gray-700 text-white">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="500+">$500+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-gray-700 text-white hover:bg-[#252525] hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-gray-700 text-white hover:bg-[#252525] hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
