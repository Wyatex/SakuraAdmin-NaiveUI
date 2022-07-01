<template>
  <div>
    <slot :data="{ dataSource, checkRows }"></slot>
    <n-data-table
      :pagination="paginationComputed"
      :loading="loading"
      :columns="insColumns"
      :data="dataSource"
      :flex-height="flexHeight"
      :max-height="maxHeight"
      :row-props="rowProps"
      :row-key="row => row[rowKey]"
      :remote="remote"
      @update:checked-row-keys="handleCheck"
      @update-page-size="handleSizeChange"
      @update-page="handlePageChange"
    />
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="menuOption"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
      @select="onDropDownSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, type Ref } from 'vue'
import type { PaginationProps, DataTableColumns } from 'naive-ui'
import useDropdown from './useDropdown'
import useDataTable from './useDataTable'
import useRequest from './useRequest'
import type { ActionItem, PageParams, PageResult } from './types'

// vue还不支持从外部文件引入props定义
interface SDataTableProps {
  /** 操作菜单类型：右键、操作栏、都有、都取消 */
  actionType?: 'rightClick' | 'actionColumn' | 'all' | 'none'
  /** 操作菜单项 */
  actions?: ActionItem[]
  /** 分页栏控制：关闭、父组件传入、SDataTable自己控制 */
  pagination?: false | Ref<PaginationProps> | 'self'
  /** 表格重新加载时调用的函数 */
  request: (pageParams?: PageParams) => Promise<Partial<PageResult<any>>>
  /** 表头 */
  columns: DataTableColumns<any>
  /** 每一行的key */
  rowKey?: string
  /** 是否开启弹性高度 */
  flexHeight?: boolean
  /** 开启弹性高度时，设置的高度 */
  height?: number
  /** 行点击事件(会和点击操作栏按钮冲突) */
  onRowClick?: (row: Common.Recordable) => void
  /** 是否显示勾选框 */
  showCheck?: boolean
  /** 最高高度 */
  maxHeight?: number
}

const props = withDefaults(defineProps<SDataTableProps>(), {
  actionType: 'none',
  actions: () => [],
  pagination: false,
  rowKey: 'id',
  flexHeight: false,
  height: 500,
  onRowClick: undefined,
  showCheck: false,
  maxHeight: 1000,
})

// 下拉菜单相关
const {
  x,
  y,
  showDropdown,
  menuOption,
  rightClickRow,
  onClickoutside,
  onDropDownSelect,
} = useDropdown(props.actions)

const remote = !!props.pagination

// 表格相关
const { insColumns, insPagination, paginationComputed, checkRows, handleCheck } = useDataTable(
  props.pagination,
  props.showCheck,
  props.columns,
  props.actionType,
  props.actions
)

// 请求和数据
const { dataSource, loading, reload } = useRequest(props.request, insPagination)

// 行属性配置
const rowProps = (row: Common.Recordable) => {
  const insRowProps: any = {}
  if (props.onRowClick) {
    insRowProps.style = 'cursor: pointer;'
    insRowProps.onClick = () => {
      props.onRowClick?.(row)
    }
  }
  // 添加右键菜单
  if (['rightClick', 'all'].includes(props.actionType)) {
    insRowProps.onContextmenu = (e: MouseEvent) => {
      e.preventDefault()
      rightClickRow.value = row
      showDropdown.value = false
      nextTick(() => {
        x.value = e.clientX
        y.value = e.clientY
        showDropdown.value = true
      })
    }
  }
  return insRowProps
}

// 页面跳转
const handlePageChange = (page: number) => {
  if (insPagination && insPagination.value) {
    insPagination.value = {
      ...insPagination.value,
      page,
    }
  }
  reload()
}

// 分页数量选择
const handleSizeChange = (pageSize: number) => {
  if (insPagination && insPagination.value) {
    insPagination.value = {
      ...insPagination.value,
      pageSize,
    }
  }
  reload()
}

defineExpose({ reload, checkRows })
</script>
