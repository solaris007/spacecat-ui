import { ActionButton, Flex } from '@adobe/react-spectrum';
import Copy from '@spectrum-icons/workflow/Copy';
import React from 'react';

import { copyToClipboard } from '../../utils/utils';

function ElementWithCopyAction({ element, value }) {
  return (
    <Flex direction="row" alignItems="center" gap="size-150">
      {element}
      <ActionButton onPress={() => copyToClipboard(value)}>
        <Copy size="S"/>
      </ActionButton>
    </Flex>
  );
}

export default ElementWithCopyAction;
