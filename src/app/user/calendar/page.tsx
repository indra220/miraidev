"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Video,
  Users,
  MapPin
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Event {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes
  type: "meeting" | "deadline" | "review" | "delivery";
  project: string;
  description: string;
  attendees?: string[];
  location?: string;
  link?: string;
}

export default function UserCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Meeting Proyek Kedai Kopi",
      date: "2024-04-05",
      time: "14:00",
      duration: 60,
      type: "meeting",
      project: "Website Kedai Kopi",
      description: "Diskusi detail desain dan fitur website",
      attendees: ["john.doe@example.com", "admin@miraidev.id"],
      location: "Zoom Meeting",
      link: "https://zoom.us/j/1234567890"
    },
    {
      id: 2,
      title: "Deadline Revisi Portofolio",
      date: "2024-04-10",
      time: "23:59",
      duration: 0,
      type: "deadline",
      project: "Portofolio Fotografer",
      description: "Batas akhir pengumpulan revisi proyek"
    },
    {
      id: 3,
      title: "Review Website Salon",
      date: "2024-04-12",
      time: "10:00",
      duration: 90,
      type: "review",
      project: "Website Salon Kecantikan",
      description: "Presentasi hasil akhir dan review dari klien",
      attendees: ["john.doe@example.com", "admin@miraidev.id", "salon@kecantikan.com"],
      location: "Kantor Klien"
    },
    {
      id: 4,
      title: "Delivery Proyek PPDB",
      date: "2024-04-15",
      time: "09:00",
      duration: 0,
      type: "delivery",
      project: "Website PPDB Sekolah",
      description: "Peluncuran resmi website PPDB sekolah"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    duration: 60,
    type: "meeting" as "meeting" | "deadline" | "review" | "delivery",
    project: "",
    description: "",
    attendees: "",
    location: "",
    link: ""
  });

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-800";
      case "deadline": return "bg-red-100 text-red-800";
      case "review": return "bg-yellow-100 text-yellow-800";
      case "delivery": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting": return <Video className="h-4 w-4" />;
      case "deadline": return <Clock className="h-4 w-4" />;
      case "review": return <Users className="h-4 w-4" />;
      case "delivery": return <MapPin className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event: Event = {
        id: Date.now(),
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        duration: newEvent.duration,
        type: newEvent.type,
        project: newEvent.project,
        description: newEvent.description,
        attendees: newEvent.attendees ? newEvent.attendees.split(',').map(email => email.trim()) : [],
        location: newEvent.location,
        link: newEvent.link
      };
      
      setEvents([...events, event]);
      setIsDialogOpen(false);
      setNewEvent({
        title: "",
        date: "",
        time: "",
        duration: 60,
        type: "meeting",
        project: "",
        description: "",
        attendees: "",
        location: "",
        link: ""
      });
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }
    
    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateStr);
      
      days.push(
        <div key={day} className="h-24 border border-gray-200 p-1 overflow-hidden">
          <div className="font-medium text-gray-900">{day}</div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs p-1 rounded truncate ${getTypeColor(event.type)}`}
              >
                <div className="flex items-center">
                  {getTypeIcon(event.type)}
                  <span className="ml-1 truncate">{event.title}</span>
                </div>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} lainnya
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kalender</h1>
          <p className="text-gray-600 mt-2">Kelola jadwal dan acara Anda</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Acara
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Acara Baru</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Judul Acara</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipe Acara</Label>
                  <Select 
                    value={newEvent.type} 
                    onValueChange={(value) => setNewEvent({...newEvent, type: value as "meeting" | "deadline" | "review" | "delivery"})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Tanggal</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Waktu</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Durasi (menit)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="project">Proyek Terkait</Label>
                  <Input
                    id="project"
                    value={newEvent.project}
                    onChange={(e) => setNewEvent({...newEvent, project: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="attendees">Peserta (pisahkan dengan koma)</Label>
                  <Input
                    id="attendees"
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="link">Link Meeting</Label>
                  <Input
                    id="link"
                    value={newEvent.link}
                    onChange={(e) => setNewEvent({...newEvent, link: e.target.value})}
                    placeholder="https://"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-700">
                  Simpan Acara
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold text-gray-900">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {daysOfWeek.map(day => (
            <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {renderCalendar()}
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acara Mendatang</h2>
        <div className="space-y-4">
          {events
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className={`p-2 rounded ${getTypeColor(event.type)}`}>
                  {getTypeIcon(event.type)}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.project}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{event.date} • {formatTime(event.time)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  Lihat Detail
                </Button>
              </div>
            ))}
          
          {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada acara mendatang</h3>
              <p className="mt-1 text-gray-500">
                Tidak ada acara yang dijadwalkan dalam waktu dekat.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}