import { CheckCircle2, Clock, MapPin, MessageSquare, Star, TrendingUp, User, Users } from 'lucide-react';
import type {
  CleaningAppointment,
  CleaningTask,
  FeedbackEntry,
  MetricItem,
  ProjectOverview,
  SessionDetail,
  TaskItem,
} from '@/app/types/showcase';

export const cleaningTasks: CleaningTask[] = [
  { id: 1, room: 'Living Room', completed: true, time: '09:30 AM' },
  { id: 2, room: 'Kitchen', completed: true, time: '10:15 AM' },
  { id: 3, room: 'Bathroom 1', completed: true, time: '11:00 AM' },
  { id: 4, room: 'Bedroom 1', completed: false, time: 'Pending' },
  { id: 5, room: 'Bedroom 2', completed: false, time: 'Pending' },
];

export const cleaningAppointments: CleaningAppointment[] = [
  { id: 1, date: '2026-04-17', location: 'Apartment Deep Clean', cleaner: 'Michael Lee', status: 'Confirmed' },
  { id: 2, date: '2026-04-18', location: 'Office Maintenance', cleaner: 'Northwind Studio', status: 'Pending' },
];

export const cleaningSessionDetails: SessionDetail[] = [
  { icon: MapPin, label: 'Location', value: '123 Main St, Apt 4B' },
  { icon: User, label: 'Cleaner', value: 'Sarah Johnson' },
  { icon: Clock, label: 'Started', value: '9:00 AM' },
];

export const projectManagementMetrics: MetricItem[] = [
  { label: 'Active Projects', value: 3, accent: 'green', icon: CheckCircle2 },
  { label: 'Team Members', value: 16, accent: 'blue', icon: Users },
  { label: 'Avg. Progress', value: '62%', accent: 'yellow', icon: Clock },
];

export const projectManagementProjects: ProjectOverview[] = [
  { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 65, team: 5, deadline: '2026-05-01' },
  { id: 2, name: 'Mobile App Development', status: 'Planning', progress: 20, team: 8, deadline: '2026-06-15' },
  { id: 3, name: 'Marketing Campaign', status: 'Completed', progress: 100, team: 3, deadline: '2026-04-10' },
];

export const projectManagementTasks: TaskItem[] = [
  { id: 1, title: 'Design homepage mockup', status: 'completed', assignee: 'Alice' },
  { id: 2, title: 'Implement authentication', status: 'in-progress', assignee: 'Bob' },
  { id: 3, title: 'Write documentation', status: 'pending', assignee: 'Charlie' },
  { id: 4, title: 'Setup CI/CD pipeline', status: 'in-progress', assignee: 'David' },
];

export const feedbackMetrics: MetricItem[] = [
  { label: 'Total Feedback', value: '1,234', accent: 'green', icon: MessageSquare },
  { label: 'Avg Rating', value: '4.7', accent: 'yellow', icon: Star },
  { label: 'Active Users', value: 856, accent: 'blue', icon: Users },
  { label: 'Growth', value: '+23%', accent: 'gray', icon: TrendingUp },
];

export const feedbackEntries: FeedbackEntry[] = [
  { id: 1, user: 'John Doe', rating: 5, comment: 'Excellent service!', date: '2026-04-15' },
  { id: 2, user: 'Jane Smith', rating: 4, comment: 'Very good experience', date: '2026-04-14' },
  { id: 3, user: 'Bob Johnson', rating: 5, comment: 'Outstanding!', date: '2026-04-13' },
];
