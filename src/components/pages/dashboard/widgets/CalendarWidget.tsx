'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'Team Meeting',
    time: '09:00 AM',
    date: '2024-01-15',
    type: 'meeting',
    location: 'Conference Room A'
  },
  {
    id: 2,
    title: 'Product Review',
    time: '02:00 PM',
    date: '2024-01-15',
    type: 'review',
    location: 'Online'
  },
  {
    id: 3,
    title: 'Client Call',
    time: '04:30 PM',
    date: '2024-01-16',
    type: 'call',
    location: 'Zoom'
  },
  {
    id: 4,
    title: 'Project Deadline',
    time: '11:59 PM',
    date: '2024-01-17',
    type: 'deadline',
    location: 'Development'
  },
  {
    id: 5,
    title: 'Training Session',
    time: '10:00 AM',
    date: '2024-01-18',
    type: 'training',
    location: 'Training Room'
  }
]

const getEventTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'meeting': 'bg-blue-100 text-blue-800',
    'review': 'bg-green-100 text-green-800',
    'call': 'bg-purple-100 text-purple-800',
    'deadline': 'bg-red-100 text-red-800',
    'training': 'bg-orange-100 text-orange-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const todaysEvents = events.filter(event => 
    event.date === currentDate.toISOString().split('T')[0]
  )

  const upcomingEvents = events.filter(event => 
    new Date(event.date) > currentDate
  ).slice(0, 3)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar
          </CardTitle>
          <CardDescription>{formatDate(currentDate)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6)
                const isToday = date.toDateString() === new Date().toDateString()
                const hasEvent = events.some(event => event.date === date.toISOString().split('T')[0])
                
                return (
                  <div
                    key={i}
                    className={`p-2 text-sm cursor-pointer rounded hover:bg-gray-100 ${
                      isToday ? 'bg-blue-500 text-white' : ''
                    } ${date.getMonth() !== currentDate.getMonth() ? 'text-gray-300' : ''}`}
                  >
                    <div className="relative">
                      {date.getDate()}
                      {hasEvent && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your schedule for the next few days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysEvents.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Today</h4>
                {todaysEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg mb-2">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{event.title}</h5>
                        <Badge variant="secondary" className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{event.time}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {upcomingEvents.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Upcoming</h4>
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg mb-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">{event.title}</h5>
                        <Badge variant="secondary" className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{event.time} - {event.date}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button className="w-full" variant="outline">
              View Full Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}