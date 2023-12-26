import { Item, Picker } from '@adobe/react-spectrum';
import React from 'react';

function GitHubURLPicker({ onSelectionChange }) {
  return (
    <Picker
      label="GitHub URL"
      labelPosition="side"
      defaultSelectedKey="all"
      onSelectionChange={onSelectionChange}
    >
      <Item key="all">All</Item>
      <Item key="with">Has GitHub URL</Item>
      <Item key="without">No GitHub URL</Item>
    </Picker>
  )
}

export default GitHubURLPicker;
