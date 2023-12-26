import { Item, Picker } from '@adobe/react-spectrum';
import React from 'react';

function LiveStatusPicker({ onSelectionChange }) {
  return (
    <Picker
      label="Live Status"
      labelPosition="side"
      defaultSelectedKey="all"
      onSelectionChange={onSelectionChange}
    >
      <Item key="all">All</Item>
      <Item key="live">Live</Item>
      <Item key="non-live">Non-Live</Item>
    </Picker>
  )
}

export default LiveStatusPicker;
