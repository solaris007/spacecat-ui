import { Item, Picker } from '@adobe/react-spectrum';
import React from 'react';

function AuditEnabledPicker({ onSelectionChange }) {
  return (
    <Picker
      label="Audit Enabled"
      labelPosition="side"
      defaultSelectedKey="all"
      onSelectionChange={onSelectionChange}
    >
      <Item key="all">All</Item>
      <Item key="disabled">All Disabled</Item>
      <Item key="enabled">All Enabled</Item>
      <Item key="some">Some Disabled</Item>
    </Picker>
  )
}

export default AuditEnabledPicker;
