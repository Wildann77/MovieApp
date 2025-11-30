import { useState, useCallback } from 'react';

const useSelection = (initialValue = null, multiple = false) => {
  const [selectedItem, setSelectedItem] = useState(initialValue);
  const [selectedItems, setSelectedItems] = useState(multiple ? [] : null);

  const handleSelect = useCallback((item) => {
    if (multiple) {
      setSelectedItems(prev => {
        const isSelected = prev.some(selected => selected.id === item.id || selected._id === item._id);
        if (isSelected) {
          return prev.filter(selected => selected.id !== item.id && selected._id !== item._id);
        }
        return [...prev, item];
      });
    } else {
      setSelectedItem(item);
    }
  }, [multiple]);

  const handleDeselect = useCallback((item) => {
    if (multiple) {
      setSelectedItems(prev => 
        prev.filter(selected => selected.id !== item.id && selected._id !== item._id)
      );
    } else {
      setSelectedItem(null);
    }
  }, [multiple]);

  const clearSelection = useCallback(() => {
    if (multiple) {
      setSelectedItems([]);
    } else {
      setSelectedItem(null);
    }
  }, [multiple]);

  const isSelected = useCallback((item) => {
    if (multiple) {
      return selectedItems.some(selected => selected.id === item.id || selected._id === item._id);
    }
    return selectedItem && (selectedItem.id === item.id || selectedItem._id === item._id);
  }, [multiple, selectedItem, selectedItems]);

  return {
    selectedItem: multiple ? null : selectedItem,
    selectedItems: multiple ? selectedItems : null,
    handleSelect,
    handleDeselect,
    clearSelection,
    isSelected,
  };
};

export default useSelection;
