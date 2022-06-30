import { ref } from 'vue';
import type { DropdownMixedOption } from 'naive-ui/lib/dropdown/src/interface';
import type { RowData } from 'naive-ui/lib/data-table/src/interface';
import type { ActionItem } from './types';

export default function useDropdown(actionList: ActionItem[]) {
  const x = ref(0);
  const y = ref(0);
  const showDropdown = ref(false);
  const menuOption: DropdownMixedOption[] = actionList.map(item => ({
    label: item.title,
    key: item.title
  }));

  // 右键时选中的行
  const rightClickRow = ref<RowData>();

  // 右键菜单选择
  const onDropDownSelect = (key: string | number) => {
    actionList.find(({ title, handler }) => {
      if (title === key) {
        handler(rightClickRow.value as Common.Recordable);
        showDropdown.value = false;
        return true;
      }
      return false;
    });
  };

  // 点击菜单以外的地方
  const onClickoutside = () => {
    showDropdown.value = false;
  };
  return { x, y, showDropdown, menuOption, rightClickRow, onClickoutside, onDropDownSelect };
}
