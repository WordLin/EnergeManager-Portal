/**
 * 待办事项 API
 */
import request from './request'
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskListResponse,
  ScheduleResponse,
  CalendarConfig,
  RescheduleRequest
} from '@/types/task'

export interface TasksForDateResponse {
  date: string
  isWorkday: boolean
  tasks: Task[]
}

/**
 * 获取所有任务
 */
export function getTasks(completed?: boolean | null): Promise<TaskListResponse> {
  return request.get('/todos', {
    params: { completed }
  })
}

/**
 * 获取任务详情
 */
export function getTask(taskId: number): Promise<Task> {
  return request.get(`/todos/${taskId}`)
}

/**
 * 创建任务
 */
export function createTask(data: TaskCreate): Promise<Task> {
  return request.post('/todos', data)
}

/**
 * 更新任务
 */
export function updateTask(taskId: number, data: TaskUpdate): Promise<Task> {
  return request.put(`/todos/${taskId}`, data)
}

/**
 * 删除任务
 */
export function deleteTask(taskId: number): Promise<void> {
  return request.delete(`/todos/${taskId}`)
}

/**
 * 完成任务
 */
export function completeTask(taskId: number): Promise<void> {
  return request.post(`/todos/${taskId}/complete`)
}

/**
 * 获取指定日期的任务
 */
export function getTasksForDate(dateStr: string): Promise<TasksForDateResponse> {
  return request.get(`/todos/date/${dateStr}`)
}

/**
 * 获取未来几天的日程安排
 */
export function getSchedule(days?: number, startDate?: string): Promise<ScheduleResponse[]> {
  return request.get('/todos/schedule/days', {
    params: { days, start_date: startDate }
  })
}

/**
 * 自动重新调度过期未完成的任务
 */
export function autoReschedule(data?: RescheduleRequest): Promise<any> {
  return request.post('/todos/reschedule', data || {})
}

/**
 * 获取日历配置
 */
export function getCalendarConfig(): Promise<CalendarConfig> {
  return request.get('/todos/calendar/config')
}

/**
 * 更新日历配置
 */
export function updateCalendarConfig(data: CalendarConfig): Promise<CalendarConfig> {
  return request.put('/todos/calendar/config', data)
}

