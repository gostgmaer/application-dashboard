'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartsSectionProps {
  chartData: {
    productsByCategory: any[];
    salesTrend: any[];
    stockDistribution: any[];
    topSellingProducts: any[];
    revenueByCategory: any[];
    cumulativeRevenue: any[];
    topBrands: any[];
    salesByRegion: any[];
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function ChartsSection({ chartData }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 animate-fade-in">
      {/* Products by Category - Bar Chart */}
      <Card className="chart-container group animate-slide-up" style={{ animationDelay: '100ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gradient">Products per Category</CardTitle>
          <p className="text-sm text-muted-foreground">Distribution of products across categories</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData.productsByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#colorGradient1)" 
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    

      {/* Stock Distribution - Pie Chart */}
      <Card className="chart-container group animate-slide-up" style={{ animationDelay: '300ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gradient">Stock Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">Current inventory status breakdown</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData.stockDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {chartData.stockDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Selling Products - Horizontal Bar */}
      <Card className="chart-container group animate-slide-up" style={{ animationDelay: '400ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gradient">Top Selling Products</CardTitle>
          <p className="text-sm text-muted-foreground">Best performing products by sales volume</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData.topSellingProducts} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#colorGradient2)" 
                radius={[0, 4, 4, 0]}
              />
              <defs>
                <linearGradient id="colorGradient2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


      {/* Product Performance - Radar Chart */}
      <Card className="chart-container group animate-slide-up" style={{ animationDelay: '700ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gradient">Product Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Multi-dimensional performance analysis</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={[
              { subject: 'Sales', A: 120, fullMark: 150 },
              { subject: 'Stock', A: 98, fullMark: 150 },
              { subject: 'Revenue', A: 86, fullMark: 150 },
              { subject: 'Views', A: 99, fullMark: 150 },
              { subject: 'Rating', A: 85, fullMark: 150 },
              { subject: 'Returns', A: 65, fullMark: 150 },
            ]}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar 
                name="Performance" 
                dataKey="A" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.2} 
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Brands */}
      <Card className="chart-container group animate-slide-up" style={{ animationDelay: '800ms' }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gradient">Top Brands by Product Count</CardTitle>
          <p className="text-sm text-muted-foreground">Leading brands in our catalog</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData.topBrands}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#colorGradient5)" 
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    
    </div>
  );
}