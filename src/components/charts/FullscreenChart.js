import React, { useState } from 'react';
import {
  ActionButton,
  Content,
  ContextualHelp,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Heading,
  Item,
  Picker,
  Text,
} from '@adobe/react-spectrum';
import Maximize from '@spectrum-icons/workflow/Maximize';
import Close from '@spectrum-icons/workflow/Close';

function FullscreenChart({ chart: ChartComponent, chartProps, title: chartTitle }) {
  const [contextualHelpText, setContextualHelpText] = useState('');
  const [defaultPickerOption, setDefaultPickerOption] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pickerOptions, setPickerOptions] = useState([]);
  const [pickerSelection, setPickerSelection] = useState('');


  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Flex direction="column" gap="size-200" width="100%">
      <Flex direction="row" alignItems="center" gap="size-200">
        <Heading level={3} margin="size-150">{chartTitle}</Heading>
        <ActionButton onPress={handleFullScreenToggle} isQuiet>
          <Maximize size="S"/>
        </ActionButton>
        <ContextualHelp variant="info">
          <Heading>{chartTitle} Help</Heading>
          <Content>
            <Text>{contextualHelpText}</Text>
          </Content>
        </ContextualHelp>
        {pickerOptions.length > 0 && (
          <Picker
            label="Options"
            name="options-picker"
            labelPosition="side"
            defaultSelectedKey={defaultPickerOption}
            onSelectionChange={setPickerSelection}
          >
            {pickerOptions.map((option) => <Item key={option.key}>{option.label}</Item>)}
          </Picker>
        )}
      </Flex>

      <DialogContainer onDismiss={handleFullScreenToggle} isDismissable type="fullscreen">
        {isFullScreen && (
          <Dialog>
            <Heading>
              <Flex direction="row" alignItems="center" justifyContent="space-between" gap="size-200">
                <Text>{chartTitle}</Text>
                {pickerOptions.length > 0 && (
                  <Picker
                    label="Options"
                    name="options-picker"
                    labelPosition="side"
                    defaultSelectedKey={defaultPickerOption}
                    onSelectionChange={setPickerSelection}
                  >
                    {pickerOptions.map((option) => <Item key={option.key}>{option.label}</Item>)}
                  </Picker>
                )}
                <ActionButton onPress={handleFullScreenToggle} isQuiet><Close size="L"/></ActionButton>
              </Flex>
            </Heading>
            <Divider/>
            <Content>
              <Flex direction="column" gap="size-150" height="100%">
                <ChartComponent
                  {...chartProps}
                  setContextualHelpText={setContextualHelpText}
                  setPickerOptions={setPickerOptions}
                  setDefaultPickerOption={setDefaultPickerOption}
                  isFullScreen={true}
                  pickerSelection={pickerSelection}
                />
                <Divider size="S"/>
              </Flex>
            </Content>
          </Dialog>
        )}
      </DialogContainer>

      {!isFullScreen && <ChartComponent
        {...chartProps}
        setContextualHelpText={setContextualHelpText}
        setPickerOptions={setPickerOptions}
        setDefaultPickerOption={setDefaultPickerOption}
        pickerSelection={pickerSelection}
      />}
    </Flex>
  );
}

export default FullscreenChart;
