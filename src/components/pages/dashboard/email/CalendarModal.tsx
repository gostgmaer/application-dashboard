'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock,
  MapPin,
  Users,
  Calendar as CalendarIcon
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location?: string;
  attendees?: string[];
  description?: string;
  type: 'meeting' | 'reminder' | 'deadline';
}

interface CalendarModalProps {
  onClose: () => void;
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: new Date(),
    time: '09:00',
    duration: '30 min',
    location: 'Conference Room A',
    attendees: ['john@company.com', 'sarah@company.com'],
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Project Deadline',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '17:00',
    duration: 'All day',
    description: 'Email service integration deadline',
    type: 'deadline'
  },
  {
    id: '3',
    title: 'Client Call',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '14:00',
    duration: '1 hour',
    location: 'Zoom',
    attendees: ['client@company.com'],
    type: 'meeting'
  }
];

export function CalendarModal({ onClose }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    duration: '',
    location: '',
    description: '',
    type: 'meeting' as Event['type']
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) return;

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      duration: newEvent.duration,
      location: newEvent.location || undefined,
      description: newEvent.description || undefined,
      type: newEvent.type,
      attendees: []
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      time: '',
      duration: '',
      location: '',
      description: '',
      type: 'meeting'
    });
    setIsAddingEvent(false);
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500';
      case 'reminder':
        return 'bg-yellow-500';
      case 'deadline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Calendar</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsAddingEvent(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Calendar */}
          <div className="w-2/3 border-r border-gray-200 dark:border-gray-700">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map(day => {
                  const dayEvents = getEventsForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-2 min-h-[80px] border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        isToday(day) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        !isSameMonth(day, currentDate) ? 'text-gray-400' : 
                        isToday(day) ? 'text-blue-600 dark:text-blue-400' : 
                        'text-gray-900 dark:text-white'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Event Details / Add Form */}
          <div className="w-1/3 p-6">
            {isAddingEvent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Event</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsAddingEvent(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="eventTitle">Title *</Label>
                  <Input
                    id="eventTitle"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventTime">Time</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventDuration">Duration</Label>
                  <Input
                    id="eventDuration"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 1 hour, 30 min"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventLocation">Location</Label>
                  <Input
                    id="eventLocation"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea
                    id="eventDescription"
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter event description"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleAddEvent}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!newEvent.title || !selectedDate}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : selectedDate ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <Badge variant="secondary" className={`text-white ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {event.time && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time} ({event.duration})</span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees.length} attendees</span>
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {getEventsForDate(selectedDate).length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No events scheduled for this day</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsAddingEvent(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a date to view events</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}