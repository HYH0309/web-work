/**
 * OJ 管理页面配置数据
 */

import { PlusIcon, EyeIcon, DocumentTextIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { OJActionButton, OJConfig, OJTableColumn } from '@/types/oj-admin'

/**
 * 表格列配置
 */
export const OJ_TABLE_COLUMNS: OJTableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: 'w-20',
    align: 'left',
  },
  {
    key: 'title',
    label: '标题',
    align: 'left',
  },
  {
    key: 'actions',
    label: '操作',
    width: 'w-48',
    align: 'right',
  },
]

/**
 * 操作按钮配置
 */
export const OJ_ACTION_BUTTONS: OJActionButton[] = [
  {
    type: 'add',
    icon: PlusIcon,
    title: '添加测试用例',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    hoverBg: 'hover:bg-green-100',
    handler: 'handleAddTestCase',
  },
  {
    type: 'preview',
    icon: EyeIcon,
    title: '预览题目内容',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    hoverBg: 'hover:bg-purple-100',
    handler: 'handlePreview',
  },
  {
    type: 'view',
    icon: DocumentTextIcon,
    title: '查看测试用例',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    hoverBg: 'hover:bg-blue-100',
    handler: 'handleViewTestCases',
  },
  {
    type: 'delete',
    icon: TrashIcon,
    title: '删除题目',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    hoverBg: 'hover:bg-red-100',
    handler: 'handleDelete',
  },
]

/**
 * OJ 系统配置
 */
export const OJ_CONFIG: OJConfig = {
  filePattern: /^(\d+)\.(in|out)$/,
  maxFileSize: 1024 * 1024, // 1MB
  supportedExtensions: ['.in', '.out'],
  defaultTestCase: {
    input: '',
    output: '',
  },
}

/**
 * 默认题目模板
 */
export const DEFAULT_PROBLEM_TEMPLATE = {
  title: '',
  content: '',
}

/**
 * 基础样式类
 */
export const OJ_BASE_CLASSES = {
  button:
    'p-2 rounded-md hover:scale-105 active:scale-95 transition-all duration-200 transform-gpu',
  card: 'bg-white rounded-lg shadow-md overflow-hidden',
  table: 'min-w-full divide-y divide-gray-200',
  tableHeader: 'bg-gray-50',
  tableRow: 'bg-white divide-y divide-gray-200',
  input: 'input w-full',
  textarea: 'textarea w-full',
  modal: 'space-y-4',
}

/**
 * 操作提示文本
 */
export const OJ_MESSAGES = {
  success: {
    created: '题目创建成功',
    deleted: '题目删除成功',
    testCaseAdded: '测试用例添加成功',
    fileUploaded: '文件上传成功',
  },
  error: {
    createFailed: '题目创建失败',
    deleteFailed: '题目删除失败',
    fileReadFailed: '文件读取失败，请检查文件格式',
    noValidFiles: '未找到有效的测试用例文件',
    missingFiles: '测试用例缺少输入或输出文件',
    selectProblem: '请先选择题目',
    noTestCases: '请至少添加一个测试用例',
  },
  confirm: {
    deleteProblem: '确定要删除这个题目吗？',
    clearTestCases: '确定要清空所有测试用例吗？',
  },
}
