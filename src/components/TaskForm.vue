<template>
  <el-dialog
    v-model="dialogVisible"
    :title="task ? '编辑任务' : '创建任务'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="任务标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入任务标题"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formData.startTime"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DDTHH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="任务时长" prop="durationHours">
        <el-input-number
          v-model="formData.durationHours"
          :min="0.1"
          :step="0.5"
          :precision="1"
          placeholder="小时"
          style="width: 100%"
        />
        <span class="form-tip">小时</span>
      </el-form-item>

      <el-form-item label="截止日期" prop="dueDate">
        <el-date-picker
          v-model="formData.dueDate"
          type="datetime"
          placeholder="选择截止日期"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DDTHH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-select v-model="formData.priority" placeholder="选择优先级" style="width: 100%">
          <el-option label="1 - 最高优先级" :value="1" />
          <el-option label="2 - 高优先级" :value="2" />
          <el-option label="3 - 中等优先级" :value="3" />
          <el-option label="4 - 低优先级" :value="4" />
          <el-option label="5 - 最低优先级" :value="5" />
        </el-select>
        <div class="form-tip">1为最高优先级，5为最低优先级</div>
      </el-form-item>

      <el-form-item label="最终截止" prop="finalDeadline">
        <el-date-picker
          v-model="formData.finalDeadline"
          type="datetime"
          placeholder="选择最终截止日期（可选）"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DDTHH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="依赖任务" prop="dependsOn">
        <el-select
          v-model="formData.dependsOn"
          multiple
          placeholder="选择依赖的任务（可选）"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="t in availableTasks"
            :key="t.id"
            :label="t.title"
            :value="t.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="task" label="完成状态" prop="completed">
        <el-switch v-model="formData.completed" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import type { Task, TaskCreate, TaskUpdate } from '@/types/task'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'

const props = defineProps<{
  modelValue: boolean
  task?: Task | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:task': [task: Task | null]
  success: []
}>()

const taskStore = useTaskStore()
const formRef = ref<FormInstance>()
const submitting = ref(false)

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = ref<TaskCreate | TaskUpdate>({
  title: '',
  startTime: '',
  durationHours: 1,
  dueDate: '',
  priority: 3,
  dependsOn: [],
  finalDeadline: null
})

const rules: FormRules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 1, max: 200, message: '标题长度在 1 到 200 个字符', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  durationHours: [
    { required: true, message: '请输入任务时长', trigger: 'blur' },
    { type: 'number', min: 0.1, message: '时长必须大于0', trigger: 'blur' }
  ],
  dueDate: [
    { required: true, message: '请选择截止日期', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ]
}

const availableTasks = computed(() => {
  const list = taskStore.tasks || []
  return list.filter(t => !props.task || t.id !== props.task.id)
})

// 监听task变化，填充表单
watch(
  () => props.task,
  (task) => {
    if (task) {
      formData.value = {
        title: task.title,
        startTime: task.startTime,
        durationHours: task.durationHours,
        dueDate: task.dueDate,
        priority: task.priority,
        dependsOn: task.dependsOn,
        finalDeadline: task.finalDeadline,
        completed: task.completed
      }
    } else {
      // 重置表单
      formData.value = {
        title: '',
        startTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        durationHours: 1,
        dueDate: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm:ss'),
        priority: 3,
        dependsOn: [],
        finalDeadline: null
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  dialogVisible.value = false
  emit('update:task', null)
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  submitting.value = true
  try {
    if (props.task) {
      // 更新任务
      await taskStore.updateTask(props.task.id, formData.value as TaskUpdate)
      ElMessage.success('任务更新成功')
    } else {
      // 创建任务
      await taskStore.createTask(formData.value as TaskCreate)
      ElMessage.success('任务创建成功')
    }
    // 确保对话框关闭并重置
    dialogVisible.value = false
    emit('update:modelValue', false)
    emit('update:task', null)
    formRef.value?.resetFields()
    emit('success')
  } catch (error) {
    // 错误已在拦截器中处理
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

