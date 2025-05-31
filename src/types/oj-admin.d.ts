/**
 * OJ 管理相关的 TypeScript 类型定义
 */

import type { Component } from 'vue'

// 基础 OJ 题目接口
export interface OJProblem {
  id: number
  title: string
  content: string
}

// 测试用例接口
export interface OJTestCase {
  input: string
  output: string
}

// 文件映射接口
export interface FileMapEntry {
  input?: string
  output?: string
}

// 按钮操作类型
export type OJActionType = 'add' | 'preview' | 'view' | 'delete'

// 按钮配置接口
export interface OJActionButton {
  type: OJActionType
  icon: Component
  title: string
  bgColor: string
  textColor: string
  hoverBg: string
  handler: string
}

// OJ 配置接口
export interface OJConfig {
  filePattern: RegExp
  maxFileSize: number
  supportedExtensions: string[]
  defaultTestCase: OJTestCase
}

// 表格列配置
export interface OJTableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

// 导出类型
export type {
  OJProblem as Problem,
  OJTestCase as TestCase,
  FileMapEntry,
  OJActionType as ActionType,
  OJActionButton as ActionButton,
  OJConfig as Config,
  OJTableColumn as TableColumn,
}
