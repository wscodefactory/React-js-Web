import type { LucideIcon } from 'lucide-react';

export interface MetricItem {
  label: string;
  value: string | number;
  accent?: 'green' | 'blue' | 'yellow' | 'gray';
  icon?: LucideIcon;
}

export interface OptionCardItem {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  selected?: boolean;
}

export interface ColorScheme {
  name: string;
  colors: string[];
}

export interface FeatureListItem {
  id: string;
  label: string;
}

export interface YamlExample {
  id: number;
  title: string;
  description: string;
  code: string;
}

export interface SvgLibraryItem {
  id: number;
  name: string;
  category: string;
  size: string;
}

export interface FormFieldTemplate {
  id: string;
  label: string;
  icon: string;
}

export interface FormCanvasField {
  id: number;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required: boolean;
}

export interface CleaningTask {
  id: number;
  room: string;
  completed: boolean;
  time: string;
}

export interface CleaningAppointment {
  id: number;
  date: string;
  location: string;
  cleaner: string;
  status: 'Confirmed' | 'Pending';
}

export interface SessionDetail {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface ActivityItem {
  title: string;
  subtitle?: string;
  detail?: string;
  badge?: string;
}

export interface ToolResourceItem {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

export interface SvgToolItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SvgLayerItem {
  id: number;
  name: string;
  visible: boolean;
  locked: boolean;
}

export type { SelectOption } from './common';

export interface CanvasStatItem {
  label: string;
  value: string;
}

export interface ProjectOverview {
  id: number;
  name: string;
  status: 'Completed' | 'In Progress' | 'Planning';
  progress: number;
  team: number;
  deadline: string;
}

export interface TaskItem {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  assignee: string;
}

export interface FeedbackEntry {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}
