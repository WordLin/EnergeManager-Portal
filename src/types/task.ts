/**
 * 任务相关类型定义
 */

export interface Task {
  id: number
  title: string
  startTime: string
  endTime: string
  durationHours: number
  dueDate: string
  completed: boolean
  priority: number
  status: string
  dependsOn: number[]
  finalDeadline?: string | null
}

export interface TaskCreate {
  title: string
  startTime: string
  durationHours: number
  dueDate: string
  priority?: number
  dependsOn?: number[]
  finalDeadline?: string | null
}

export interface TaskUpdate {
  title?: string
  startTime?: string
  durationHours?: number
  dueDate?: string
  priority?: number
  dependsOn?: number[]
  finalDeadline?: string | null
  completed?: boolean
}

export interface TaskListResponse {
  total: number
  tasks: Task[]
}

export interface ScheduleResponse {
  date: string
  isWorkday: boolean
  tasks: Task[]
}

export interface CalendarConfig {
  workDays: number[]
  workStartHour: number
  workEndHour: number
  holidays?: string[] | null
  specialWorkdays?: string[] | null
}

export interface RescheduleRequest {
  currentTime?: string | null
}

