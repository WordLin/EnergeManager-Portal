<template>
  <div class="tasks-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>任务管理</span>
          <div class="header-actions">
            <el-button-group>
              <el-button
                :type="filterType === null ? 'primary' : ''"
                @click="filterType = null"
              >
                全部
              </el-button>
              <el-button
                :type="filterType === false ? 'primary' : ''"
                @click="filterType = false"
              >
                待办
              </el-button>
              <el-button
                :type="filterType === true ? 'primary' : ''"
                @click="filterType = true"
              >
                已完成
              </el-button>
            </el-button-group>
            <el-button type="primary" @click="showCreateDialog = true">
              <el-icon><Plus /></el-icon>
              创建任务
            </el-button>
          </div>
        </div>
      </template>

      <el-loading v-loading="loading" :loading="loading">
        <div v-if="filteredTasks.length > 0" class="task-list">
          <TaskCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            @edit="handleEdit"
            @delete="handleDelete"
            @complete="handleComplete"
          />
        </div>
        <el-empty v-else description="暂无任务" :image-size="120" />
      </el-loading>
    </el-card>

    <!-- 创建/编辑任务对话框 -->
    <TaskForm
      v-model="showCreateDialog"
      v-model:task="editingTask"
      @success="handleTaskFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import type { Task } from '@/types/task'
import { Plus } from '@element-plus/icons-vue'
import TaskForm from '@/components/TaskForm.vue'
import TaskCard from '@/components/TaskCard.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const taskStore = useTaskStore()

const filterType = ref<boolean | null>(null)
const showCreateDialog = ref(false)
const editingTask = ref<Task | null>(null)

const { tasks, loading } = storeToRefs(taskStore)

const filteredTasks = computed(() => {
  const list = tasks.value || []
  if (filterType.value === null) return list
  return list.filter(task => task.completed === filterType.value)
})

onMounted(async () => {
  await taskStore.fetchTasks()
  // 检查URL参数，如果是创建任务，打开对话框
  if (route.query.action === 'create') {
    showCreateDialog.value = true
  }
})

const handleEdit = (task: Task) => {
  editingTask.value = task
  showCreateDialog.value = true
}

const handleDelete = async (task: Task) => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
      type: 'warning'
    })
    await taskStore.removeTask(task.id)
    ElMessage.success('任务已删除')
  } catch (error) {
    // 用户取消或错误
  }
}

const handleComplete = async (task: Task) => {
  try {
    await taskStore.completeTask(task.id)
    ElMessage.success('任务已完成')
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

const handleTaskFormSuccess = async () => {
  showCreateDialog.value = false
  editingTask.value = null
  await taskStore.fetchTasks()
}
</script>

<style scoped>
.tasks-container {
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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

