<template>
  <div class="calendar-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>日历视图</span>
          <div class="header-actions">
            <el-button-group>
              <el-button @click="prevMonth">
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <el-button @click="today">今天</el-button>
              <el-button @click="nextMonth">
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
            <el-button type="primary" @click="showCreateDialog = true">
              <el-icon><Plus /></el-icon>
              创建任务
            </el-button>
          </div>
        </div>
      </template>

      <div class="calendar-wrapper">
        <el-calendar v-model="currentDate" class="custom-calendar">
          <template #date-cell="{ data }">
            <div class="calendar-day">
              <div class="day-number">{{ data.day.split('-').slice(2).join('-') }}</div>
              <div class="day-tasks">
                <div
                  v-for="task in getTasksForDate(data.day)"
                  :key="task.id"
                  class="task-badge"
                  :class="getTaskClass(task)"
                  @click.stop="handleTaskClick(task)"
                >
                  {{ task.title }}
                </div>
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
    </el-card>

    <!-- 任务详情对话框 -->
    <el-dialog
      v-model="taskDialogVisible"
      :title="selectedTask?.title"
      width="600px"
    >
      <div v-if="selectedTask" class="task-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedTask.completed ? 'success' : 'warning'">
              {{ selectedTask.completed ? '已完成' : '进行中' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(selectedTask.priority)">
              优先级 {{ selectedTask.priority }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">
            {{ formatDateTime(selectedTask.startTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ formatDateTime(selectedTask.endTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="截止日期">
            {{ formatDateTime(selectedTask.dueDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="时长">
            {{ selectedTask.durationHours }} 小时
          </el-descriptions-item>
        </el-descriptions>
        <div class="task-actions">
          <el-button
            v-if="!selectedTask.completed"
            type="success"
            @click="handleCompleteTask"
          >
            标记完成
          </el-button>
          <el-button type="primary" @click="handleEditTask">编辑</el-button>
          <el-button type="danger" @click="handleDeleteTask">删除</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 创建/编辑任务对话框 -->
    <TaskForm
      v-model="showCreateDialog"
      v-model:task="editingTask"
      @success="handleTaskFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import type { Task } from '@/types/task'
import { ArrowLeft, ArrowRight, Plus } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import TaskForm from '@/components/TaskForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const taskStore = useTaskStore()
const currentDate = ref(new Date())
const selectedTask = ref<Task | null>(null)
const taskDialogVisible = ref(false)
const showCreateDialog = ref(false)
const editingTask = ref<Task | null>(null)

const { tasks } = storeToRefs(taskStore)

onMounted(async () => {
  await taskStore.fetchTasks()
  await taskStore.fetchSchedule(30)
})

const prevMonth = () => {
  currentDate.value = dayjs(currentDate.value).subtract(1, 'month').toDate()
}

const nextMonth = () => {
  currentDate.value = dayjs(currentDate.value).add(1, 'month').toDate()
}

const today = () => {
  currentDate.value = new Date()
}

const getTasksForDate = (dateStr: string): Task[] => {
  const list = tasks.value || []
  return list.filter(task => {
    const taskDate = dayjs(task.startTime).format('YYYY-MM-DD')
    return taskDate === dateStr
  })
}

const getTaskClass = (task: Task) => {
  if (task.completed) return 'completed'
  if (task.priority <= 2) return 'high-priority'
  return 'normal'
}

const handleTaskClick = (task: Task) => {
  selectedTask.value = task
  taskDialogVisible.value = true
}

const handleCompleteTask = async () => {
  if (!selectedTask.value) return
  try {
    await taskStore.completeTask(selectedTask.value.id)
    ElMessage.success('任务已完成')
    taskDialogVisible.value = false
    await taskStore.fetchTasks()
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

const handleEditTask = () => {
  editingTask.value = selectedTask.value
  taskDialogVisible.value = false
  showCreateDialog.value = true
}

const handleDeleteTask = async () => {
  if (!selectedTask.value) return
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
      type: 'warning'
    })
    await taskStore.removeTask(selectedTask.value.id)
    ElMessage.success('任务已删除')
    taskDialogVisible.value = false
  } catch (error) {
    // 用户取消或错误
  }
}

const handleTaskFormSuccess = async () => {
  showCreateDialog.value = false
  editingTask.value = null
  await taskStore.fetchTasks()
  await taskStore.fetchSchedule(30)
}

const getPriorityType = (priority: number) => {
  if (priority === 1) return 'danger'
  if (priority === 2) return 'warning'
  return 'info'
}

const formatDateTime = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.calendar-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.calendar-wrapper {
  margin-top: 20px;
}

.custom-calendar :deep(.el-calendar-day) {
  height: 120px;
  padding: 8px;
}

.calendar-day {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.day-number {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
}

.day-tasks {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.task-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;
}

.task-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-badge.completed {
  background: #67c23a;
  color: white;
}

.task-badge.high-priority {
  background: #f56c6c;
  color: white;
}

.task-badge.normal {
  background: #409eff;
  color: white;
}

.task-detail {
  padding: 10px 0;
}

.task-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>

