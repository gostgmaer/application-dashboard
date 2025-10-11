'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  ShoppingCart,
  Truck,
  BarChart3
} from 'lucide-react'

const inventoryStats = {
  totalProducts: 1247,
  lowStock: 23,
  outOfStock: 8,
  totalValue: 245000,
  monthlyTurnover: 18.5
}

const categories = [
  { name: 'Electronics', stock: 245, value: 89000, percentage: 85, status: 'good' },
  { name: 'Clothing', stock: 156, value: 45000, percentage: 45, status: 'warning' },
  { name: 'Books', stock: 89, value: 12000, percentage: 92, status: 'good' },
  { name: 'Home & Garden', stock: 67, value: 23000, percentage: 23, status: 'critical' },
  { name: 'Sports', stock: 134, value: 34000, percentage: 78, status: 'good' },
]

const lowStockItems = [
  { name: 'iPhone 15 Pro', sku: 'IPH15P-256', current: 5, minimum: 20, category: 'Electronics' },
  { name: 'Nike Air Max', sku: 'NAM-42-BLK', current: 3, minimum: 15, category: 'Clothing' },
  { name: 'MacBook Air M2', sku: 'MBA-M2-512', current: 2, minimum: 10, category: 'Electronics' },
  { name: 'Garden Hose 50ft', sku: 'GH-50-GRN', current: 1, minimum: 8, category: 'Home & Garden' },
  { name: 'Yoga Mat Premium', sku: 'YM-PREM-BLU', current: 4, minimum: 12, category: 'Sports' },
]

const recentMovements = [
  { type: 'in', product: 'Samsung Galaxy S24', quantity: 50, timestamp: '2 hours ago' },
  { type: 'out', product: 'Dell XPS 13', quantity: 8, timestamp: '4 hours ago' },
  { type: 'in', product: 'Adidas Sneakers', quantity: 25, timestamp: '6 hours ago' },
  { type: 'out', product: 'Coffee Maker Pro', quantity: 12, timestamp: '8 hours ago' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good': return 'text-green-600 bg-green-100'
    case 'warning': return 'text-yellow-600 bg-yellow-100'
    case 'critical': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getMovementIcon = (type: string) => {
  return type === 'in' ? (
    <TrendingUp className="h-4 w-4 text-green-600" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-600" />
  )
}

export default function InventoryOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Overview
        </CardTitle>
        <CardDescription>Monitor stock levels and inventory performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{inventoryStats?.totalProducts||0}</div>
            <div className="text-xs text-gray-600">Total Products</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{inventoryStats?.lowStock||0}</div>
            <div className="text-xs text-gray-600">Low Stock</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{inventoryStats?.outOfStock||0}</div>
            <div className="text-xs text-gray-600">Out of Stock</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{inventoryStats.monthlyTurnover||0}%</div>
            <div className="text-xs text-gray-600">Turnover Rate</div>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Inventory Value</p>
              <p className="text-3xl font-bold">${inventoryStats.totalValue.toLocaleString()}</p>
            </div>
            <Package className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <h4 className="font-medium mb-3">Stock by Category</h4>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.stock} items • ${category.value.toLocaleString()}</div>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(category.status)}>
                    {category.percentage}% stocked
                  </Badge>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Low Stock Items
            </h4>
            <Button variant="outline" size="sm">
              Reorder All
            </Button>
          </div>
          <div className="space-y-2">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">SKU: {item.sku} • {item.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">
                    {item.current} / {item.minimum}
                  </div>
                  <div className="text-xs text-gray-500">Current / Min</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Movements */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Recent Movements
          </h4>
          <div className="space-y-2">
            {recentMovements.map((movement, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  {getMovementIcon(movement.type)}
                  <div>
                    <div className="font-medium text-sm">{movement.product}</div>
                    <div className="text-xs text-gray-500">{movement.timestamp}</div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}