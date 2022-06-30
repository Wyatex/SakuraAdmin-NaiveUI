import type { PaginationSetting } from './setting';

interface ActionItem {
  title: string;
  type?: 'default' | 'tertiary' | 'primary' | 'success' | 'info' | 'warning' | 'error';
  text?: boolean;
  color?: string;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  handler: (row: Common.Recordable) => void;
}

type PageParams = Record<PaginationSetting['pageField' | 'sizeField'], number>;
type PageResult<T> = PageParams &
  Record<PaginationSetting['listField'], T[]> &
  Record<PaginationSetting['totalField'], number>;

export type { ActionItem, PageParams, PageResult };
