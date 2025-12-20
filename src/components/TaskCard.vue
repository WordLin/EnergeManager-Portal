<template>
  <el-card class="task-card" shadow="hover" :class="{ completed: task.completed }">
    <div class="task-content">
      <div class="task-main">
        <div class="task-header">
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-badges">
            <el-tag :type="getPriorityType(task.priority)" size="small">
              优先级 {{ task.priority }}
            </el-tag>
            <el-tag :type="task.completed ? 'success' : 'warning'" size="small">
              {{ task.completed ? '已完成' : task.status }}
            </el-tag>
          </div>
        </div>
        <div class="task-info">
          <div class="info-item">
            <el-icon><Clock /></el-icon>
            <span>开始：{{ formatDateTime(task.startTime) }}</span>
          </div>
          <div class="info-item">
            <el-icon><Timer /></el-icon>
            <span>结束：{{ formatDateTime(task.endTime) }}</span>
          </div>
          <div class="info-item">
            <el-icon><Calendar /></el-icon>
            <span>截止：{{ formatDateTime(task.dueDate) }}</span>
          </div>
          <div class="info-item">
            <el-icon><Timer /></el-icon>
            <span>时长：{{ task.durationHours }} 小时</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        <el-button
          v-if="!task.completed"
          type="success"
          size="small"
          @click="$emit('complete', task)"
        >
          <el-icon><CircleCheck /></el-icon>
          完成
        </el-button>
        <el-button type="primary" size="small" @click="$emit('edit', task)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button type="danger" size="small" @click="$emit('delete', task)">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Task } from '@/types/task'
import { Clock, Timer, Calendar, CircleCheck, Edit, Delete } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

defineProps<{
  task: Task
}>()

defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
  complete: [task: Task]
}>()

const getPriorityType = (priority: number) => {
  if (priority === 1) return 'danger'
  if (priority === 2) return 'warning'
  return 'info'
}

const formatDateTime = (dateStr: string) => {
  return dayjs(dateStr).format('MM-DD HH:mm')
}
</script>

<style scoped>
.task-card {
  transition: all 0.3s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-card.completed {
  opacity: 0.7;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.task-main {
  flex: 1;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.task-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.task-badges {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.task-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
}

.task-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}
</style>

