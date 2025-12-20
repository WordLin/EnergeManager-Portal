<template>
  <div class="home-container">
    <el-card class="welcome-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>欢迎使用日程任务系统</span>
        </div>
      </template>
      <div class="welcome-content">
        <el-icon class="welcome-icon" :size="80"><Calendar /></el-icon>
        <h2>管理您的日程和任务</h2>
        <p>创建任务、查看日历、跟踪进度，一切尽在掌握</p>
      </div>
    </el-card>

    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon pending" :size="40"><Clock /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ pendingTasks.length }}</div>
              <div class="stat-label">待办任务</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon completed" :size="40"><CircleCheck /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ completedTasks.length }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon priority" :size="40"><Warning /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ highPriorityTasks.length }}</div>
              <div class="stat-label">高优先级</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="actions-row">
      <el-col :xs="24" :sm="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快速操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" size="large" @click="goToCreateTask">
              <el-icon><Plus /></el-icon>
              创建新任务
            </el-button>
            <el-button type="success" size="large" @click="goToCalendar">
              <el-icon><Calendar /></el-icon>
              查看日历
            </el-button>
            <el-button type="info" size="large" @click="goToTasks">
              <el-icon><List /></el-icon>
              任务列表
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>高优先级任务</span>
            </div>
          </template>
          <div v-if="highPriorityTasks.length > 0" class="task-list">
            <div
              v-for="task in highPriorityTasks.slice(0, 5)"
              :key="task.id"
              class="task-item"
            >
              <el-tag :type="getPriorityType(task.priority)" size="small">
                优先级 {{ task.priority }}
              </el-tag>
              <span class="task-title">{{ task.title }}</span>
              <span class="task-time">{{ formatDate(task.dueDate) }}</span>
            </div>
          </div>
          <el-empty v-else description="暂无高优先级任务" :image-size="80" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import { Calendar, Clock, CircleCheck, Warning, Plus, List } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()
const taskStore = useTaskStore()

const { pendingTasks, completedTasks, highPriorityTasks } = storeToRefs(taskStore)

onMounted(async () => {
  await taskStore.fetchTasks()
})

const goToCreateTask = () => {
  router.push('/tasks?action=create')
}

const goToCalendar = () => {
  router.push('/calendar')
}

const goToTasks = () => {
  router.push('/tasks')
}

const getPriorityType = (priority: number) => {
  if (priority === 1) return 'danger'
  if (priority === 2) return 'warning'
  return 'info'
}

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('MM-DD HH:mm')
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.welcome-content {
  text-align: center;
  padding: 20px;
}

.welcome-icon {
  margin-bottom: 20px;
  opacity: 0.9;
}

.welcome-content h2 {
  margin: 10px 0;
  font-size: 28px;
}

.welcome-content p {
  font-size: 16px;
  opacity: 0.9;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-icon.pending {
  color: #409eff;
}

.stat-icon.completed {
  color: #67c23a;
}

.stat-icon.priority {
  color: #e6a23c;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.actions-row {
  margin-top: 20px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.task-title {
  flex: 1;
  font-weight: 500;
}

.task-time {
  font-size: 12px;
  color: #909399;
}
</style>

