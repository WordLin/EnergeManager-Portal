/**
 * 任务状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  ScheduleResponse,
  CalendarConfig,
  RescheduleRequest
} from '@/types/task'
import * as todoApi from '@/api/todo'

export const useTaskStore = defineStore('task', () => {
  // 状态
  const tasks = ref<Task[]>([])
  const schedule = ref<ScheduleResponse[]>([])
  const calendarConfig = ref<CalendarConfig | null>(null)
  const loading = ref(false)

  // 计算属性
  const completedTasks = computed(() => tasks.value.filter(t => t.completed))
  const pendingTasks = computed(() => tasks.value.filter(t => !t.completed))
  const highPriorityTasks = computed(() => tasks.value.filter(t => t.priority <= 2 && !t.completed))

  // 获取所有任务
  async function fetchTasks(completed?: boolean | null) {
    loading.value = true
    try {
      const response = await todoApi.getTasks(completed)
      tasks.value = response.tasks
      return response
    } finally {
      loading.value = false
    }
  }

  // 获取任务详情
  async function fetchTask(taskId: number) {
    loading.value = true
    try {
      const task = await todoApi.getTask(taskId)
      // 更新本地任务列表中的任务
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = task
      }
      return task
    } finally {
      loading.value = false
    }
  }

  // 创建任务
  async function createTask(data: TaskCreate) {
    loading.value = true
    try {
      const task = await todoApi.createTask(data)
      tasks.value.push(task)
      return task
    } finally {
      loading.value = false
    }
  }

  // 更新任务
  async function updateTask(taskId: number, data: TaskUpdate) {
    loading.value = true
    try {
      const task = await todoApi.updateTask(taskId, data)
      const index = tasks.value.findIndex(t => t.id === taskId)
      if (index !== -1) {
        tasks.value[index] = task
      }
      return task
    } finally {
      loading.value = false
    }
  }

  // 删除任务
  async function removeTask(taskId: number) {
    loading.value = true
    try {
      await todoApi.deleteTask(taskId)
      tasks.value = tasks.value.filter(t => t.id !== taskId)
    } finally {
      loading.value = false
    }
  }

  // 完成任务
  async function completeTask(taskId: number) {
    loading.value = true
    try {
      await todoApi.completeTask(taskId)
      // 完成后重新获取列表以确保状态同步
      await fetchTasks()
    } finally {
      loading.value = false
    }
  }

  // 获取指定日期的任务
  async function fetchTasksForDate(dateStr: string) {
    loading.value = true
    try {
      return await todoApi.getTasksForDate(dateStr)
    } finally {
      loading.value = false
    }
  }

  // 获取日程安排
  async function fetchSchedule(days?: number, startDate?: string) {
    loading.value = true
    try {
      schedule.value = await todoApi.getSchedule(days, startDate)
      return schedule.value
    } finally {
      loading.value = false
    }
  }

  // 自动重新调度
  async function reschedule(data?: RescheduleRequest) {
    loading.value = true
    try {
      await todoApi.autoReschedule(data)
      // 重新获取任务列表
      await fetchTasks()
    } finally {
      loading.value = false
    }
  }

  // 获取日历配置
  async function fetchCalendarConfig() {
    loading.value = true
    try {
      calendarConfig.value = await todoApi.getCalendarConfig()
      return calendarConfig.value
    } finally {
      loading.value = false
    }
  }

  // 更新日历配置
  async function updateCalendarConfig(data: CalendarConfig) {
    loading.value = true
    try {
      calendarConfig.value = await todoApi.updateCalendarConfig(data)
      return calendarConfig.value
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    tasks,
    schedule,
    calendarConfig,
    loading,
    // 计算属性
    completedTasks,
    pendingTasks,
    highPriorityTasks,
    // 方法
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    removeTask,
    completeTask,
    fetchTasksForDate,
    fetchSchedule,
    reschedule,
    fetchCalendarConfig,
    updateCalendarConfig
  }
})

