import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  User, 
  FolderOpen, 
  CheckCircle, 
  Circle,
  AlertCircle
} from 'lucide-react';

interface ProjectTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  assignee?: string;
}

interface ProjectMilestone {
  id: string;
  name: string;
  date: Date;
  completed: boolean;
}

interface ProjectTimelineProps {
  tasks: ProjectTask[];
  milestones: ProjectMilestone[];
  projectName: string;
  projectDescription: string;
}

export default function ProjectTimeline({ 
  tasks, 
  milestones, 
  projectName, 
  projectDescription 
}: ProjectTimelineProps) {
  const [viewMode, setViewMode] = useState<'timeline' | 'gantt'>('timeline');
  
  // Fungsi untuk menghitung durasi hari antara dua tanggal
  const getDurationInDays = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Fungsi untuk mendapatkan ikon status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Circle className="h-4 w-4 text-blue-500" />;
      case 'delayed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Urutkan milestone berdasarkan tanggal
  const sortedMilestones = [...milestones].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Tanggal awal dan akhir proyek
  const projectStart = new Date(Math.min(...tasks.map(t => t.startDate.getTime())));
  const projectEnd = new Date(Math.max(...tasks.map(t => t.endDate.getTime())));

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <FolderOpen className="h-5 w-5 mr-2 text-blue-400" />
              <CardTitle className="text-white">{projectName}</CardTitle>
            </div>
            <CardDescription className="text-gray-400 mt-1">
              {projectDescription}
            </CardDescription>
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-xs rounded-md ${
                viewMode === 'timeline'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1.5 text-xs rounded-md ${
                viewMode === 'gantt'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Gantt Chart
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'timeline' ? (
          <div className="space-y-6">
            {/* Milestone Timeline */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Milestone
              </h3>
              <div className="relative pl-8 border-l-2 border-gray-700">
                {sortedMilestones.map((milestone, index) => (
                  <div key={`${milestone.id}-${index}`} className="relative mb-6">
                    <div className={`absolute -left-2.5 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                      milestone.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-700 border-2 border-gray-500'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-white">{milestone.name}</h4>
                      <p className="text-sm text-gray-400">
                        {milestone.date.toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Timeline */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Tugas
              </h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 bg-gray-750 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          {getStatusIcon(task.status)}
                          <h4 className="font-medium text-white ml-2">{task.name}</h4>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {task.startDate.toLocaleDateString('id-ID')} - {task.endDate.toLocaleDateString('id-ID')}
                          </span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{getDurationInDays(task.startDate, task.endDate)} hari</span>
                        </div>
                        {task.assignee && (
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span>{task.assignee}</span>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(task.status)} text-white capitalize`}
                      >
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progres</span>
                        <span className="text-white">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Gantt Chart View
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="flex border-b border-gray-700 pb-2 mb-4">
                <div className="w-1/3 text-gray-300 font-medium">Tugas</div>
                <div className="w-2/3">
                  <div className="flex text-sm text-gray-400">
                    {/* Menampilkan rentang waktu */}
                    <div className="flex-1 text-center">Awal</div>
                    <div className="flex-1 text-center">50%</div>
                    <div className="flex-1 text-center">Akhir</div>
                  </div>
                </div>
              </div>
              
              {/* Gantt Bars */}
              {tasks.map((task) => {
                // Menghitung posisi bar berdasarkan tanggal
                const totalDuration = getDurationInDays(projectStart, projectEnd);
                const taskStartOffset = getDurationInDays(projectStart, task.startDate);
                const taskDuration = getDurationInDays(task.startDate, task.endDate);
                
                const startPercent = (taskStartOffset / totalDuration) * 100;
                const durationPercent = (taskDuration / totalDuration) * 100;
                
                return (
                  <div key={task.id} className="flex items-center py-2 border-b border-gray-800">
                    <div className="w-1/3 pr-4">
                      <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <span className="ml-2 text-white">{task.name}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {task.startDate.toLocaleDateString('id-ID')} - {task.endDate.toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <div className="w-2/3 relative h-10">
                      <div className="absolute inset-0 flex items-center">
                        <div 
                          className="h-4 rounded-full bg-gray-700 w-full"
                          style={{ background: 'repeating-linear-gradient(90deg, #374151, #374151 10px, #4B5563 10px, #4B5563 20px)' }}
                        ></div>
                        <div 
                          className={`h-4 rounded-full ${getStatusColor(task.status)} absolute`}
                          style={{ 
                            left: `${startPercent}%`, 
                            width: `${durationPercent}%`,
                            opacity: task.status === 'completed' ? 1 : 0.7
                          }}
                        >
                          <div className="h-full w-full flex items-center justify-center text-xs text-white font-medium">
                            {task.status === 'completed' && '100%'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}