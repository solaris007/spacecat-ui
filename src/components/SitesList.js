import {
  ActionButton,
  Cell, Checkbox,
  Column, Content,
  Flex, Header, Heading, IllustratedMessage, Link,
  Row,
  TableBody,
  TableHeader,
  TableView, TextField,
  useAsyncList, useCollator
} from '@adobe/react-spectrum';
import React, { useEffect, useState } from 'react';
import { getSites } from '../service/apiService';
import { ToastQueue } from '@react-spectrum/toast';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ToastQueue.positive('Value copied!')
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
};

const SitesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  const collator = useCollator({ numeric: true });
  const debouncedSearchQuery = useDebounce(searchQuery, 700);

  const columns = [
    { uid: 'id', name: 'Id' },
    { uid: 'baseURL', name: 'Base URL' },
    { uid: 'gitHubURL', name: 'GitHub URL' },
    { uid: 'isLive', name: 'Live', width: '0.5fr' },
    { uid: 'updatedAt', name: 'Updated At' },
    { uid: 'createdAt', name: 'Created At' },
  ];

  const sites = useAsyncList({
    async load({ signal }) {
      let json = await getSites();
      return {
        items: json,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp = collator.compare(first, second);
          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }
          return cmp;
        })
      };
    }
  });

  // default sorting
  if (!sites.sortDescriptor) {
    sites.sort({ column: 'baseURL', direction: 'ascending' });
  }

  if (showLiveOnly) {
    console.log('Filtering sites with showLiveOnly');
    sites.items = sites.items
      .filter(item => {
        return !(showLiveOnly && !item.isLive);
      });
  }

  if (debouncedSearchQuery) {
    console.log(`Filtering sites with search query: ${debouncedSearchQuery}`);
    sites.items = sites.items
      .filter(item => {
        return columns.some(column => {
          if (!item[column.uid]) {
            return false;
          }

          const value = item[column.uid].toString().toLowerCase();
          const query = debouncedSearchQuery.toLowerCase();
          return value.includes(query);
        });
      });
  }

  function renderEmptyState() {
    return (
      <IllustratedMessage>
        <Heading>No results</Heading>
        <Content>No results found</Content>
      </IllustratedMessage>
    );
  }

  return (
    <div>
      <Flex
        direction="column"
        gap="size-200"
        height="size-6000"
        minHeight="size-6000"
        width="100%"
      >
        <Flex>
          <Header>sdfsdfdf {sites.length}</Header>
        </Flex>
        <Flex alignSelf="start" gap="size-150">
          <ActionButton alignSelf="start">Add</ActionButton>
          <ActionButton alignSelf="start" isDisabled>Edit</ActionButton>
          <ActionButton alignSelf="start" isDisabled>Remove</ActionButton>
          <TextField
            aria-label="Search"
            description="Search sites..."
            marginEnd="size-200"
            onChange={setSearchQuery}
            value={searchQuery}
            width="auto"
          />
          <Checkbox
            isSelected={showLiveOnly}
            marginEnd="size-200"
            onChange={setShowLiveOnly}
          >
            Show Live Only
          </Checkbox>
        </Flex>
        <TableView
          aria-label="Sites"
          density="compact"
          flex
          onSortChange={sites.sort}
          renderEmptyState={renderEmptyState}
          selectionMode="multiple"
          selectionStyle="checkbox"
          sortDescriptor={sites.sortDescriptor}
        >
          <TableHeader columns={columns}>
            {column => (
              <Column
                key={column.uid}
                allowsSorting
                width={column.width}
              >{column.name}</Column>
            )}
          </TableHeader>
          <TableBody
            items={sites.items}
            loadingState={sites.loadingState}
          >
            {item => (
              <Row>
                {columnKey => (
                  <Cell>
                    {columnKey === 'id' || columnKey === 'createdAt' || columnKey === 'updatedAt' ? (
                      <div onDoubleClick={(e) => copyToClipboard(item[columnKey], e)}>
                        {item[columnKey]}
                      </div>
                    ) : columnKey === 'baseURL' && item[columnKey] ? (
                      <Link target="_blank" rel="noopener noreferrer" href={item[columnKey]}>{item[columnKey]}</Link>
                    ) : columnKey === 'gitHubURL' && item[columnKey] ? (
                      <Link target="_blank" rel="noopener noreferrer" href={item[columnKey]}>{item[columnKey]}</Link>
                    ) : columnKey === 'isLive' ? (
                      item[columnKey] ? 'Yes' : 'No'
                    ) : (
                      item[columnKey]
                    )}
                  </Cell>
                )}
              </Row>

            )}
          </TableBody>
        </TableView>
      </Flex>
    </div>
  );
};

export default SitesList;
