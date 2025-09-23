'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Eye,
  Thermometer,
  Sunrise,
  Sunset
} from 'lucide-react'

const currentWeather = {
  location: 'New York, NY',
  temperature: 72,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 8,
  visibility: 10,
  uvIndex: 6,
  sunrise: '6:24 AM',
  sunset: '7:45 PM'
}

const forecast = [
  { day: 'Today', high: 75, low: 62, condition: 'Partly Cloudy', icon: Cloud },
  { day: 'Tomorrow', high: 78, low: 65, condition: 'Sunny', icon: Sun },
  { day: 'Wednesday', high: 71, low: 58, condition: 'Rainy', icon: CloudRain },
  { day: 'Thursday', high: 69, low: 55, condition: 'Cloudy', icon: Cloud },
  { day: 'Friday', high: 73, low: 60, condition: 'Sunny', icon: Sun },
]

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun className="h-8 w-8 text-yellow-500" />
    case 'partly cloudy':
      return <Cloud className="h-8 w-8 text-gray-500" />
    case 'rainy':
      return <CloudRain className="h-8 w-8 text-blue-500" />
    default:
      return <Cloud className="h-8 w-8 text-gray-500" />
  }
}

const getUVIndexColor = (index: number) => {
  if (index <= 2) return 'bg-green-100 text-green-800'
  if (index <= 5) return 'bg-yellow-100 text-yellow-800'
  if (index <= 7) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

export default function WeatherWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getWeatherIcon(currentWeather.condition)}
          Weather
        </CardTitle>
        <CardDescription>{currentWeather.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {currentWeather.temperature}°F
          </div>
          <div className="text-gray-600 mb-4">{currentWeather.condition}</div>
          
          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span>Humidity</span>
              </div>
              <span className="font-medium">{currentWeather.humidity}%</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-green-600" />
                <span>Wind</span>
              </div>
              <span className="font-medium">{currentWeather.windSpeed} mph</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-purple-600" />
                <span>Visibility</span>
              </div>
              <span className="font-medium">{currentWeather.visibility} mi</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-orange-600" />
                <span>UV Index</span>
              </div>
              <Badge variant="secondary" className={getUVIndexColor(currentWeather.uvIndex)}>
                {currentWeather.uvIndex}
              </Badge>
            </div>
          </div>
        </div>

        {/* Sun Times */}
        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Sunrise className="h-4 w-4 text-yellow-600" />
            <div>
              <div className="text-xs text-gray-600">Sunrise</div>
              <div className="font-medium">{currentWeather.sunrise}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sunset className="h-4 w-4 text-orange-600" />
            <div>
              <div className="text-xs text-gray-600">Sunset</div>
              <div className="font-medium">{currentWeather.sunset}</div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h4 className="font-medium mb-3 text-sm">5-Day Forecast</h4>
          <div className="space-y-2">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <day.icon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">{day.day}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{day.condition}</span>
                  <div className="text-sm">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-gray-500 ml-1">{day.low}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}