import {
  ActionButton,
  Cell, Checkbox,
  Column, Content,
  Flex, Header, Heading, IllustratedMessage, Link,
  Row, StatusLight,
  TableBody,
  TableHeader,
  TableView, TextField,
  useAsyncList, useCollator
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import Refresh from '@spectrum-icons/workflow/Refresh';
import Add from '@spectrum-icons/workflow/Add';
import React, { useEffect, useMemo, useState } from 'react';

import { getSites } from '../service/apiService';

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
    ToastQueue.positive('Value copied!', { timeout: 5000 })
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
};

const DEFAULT_SORT_DESCRIPTOR = { column: 'updatedAt', direction: 'descending' };

const SitesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [showNonLiveOnly, setShowNonLiveOnly] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  const collator = useCollator({ numeric: true });
  const debouncedSearchQuery = useDebounce(searchQuery, 700);

  const columns = useMemo(() => [
    { uid: 'id', name: 'Id' },
    { uid: 'baseURL', name: 'Base URL' },
    { uid: 'gitHubURL', name: 'GitHub URL' },
    { uid: 'isLive', name: 'Live', width: '0.2fr' },
    { uid: 'updatedAt', name: 'Updated At (UTC)' },
    { uid: 'createdAt', name: 'Created At (UTC)' },
  ], []);

  const sortItems = (items, sortDescriptor) => {
    if (!sortDescriptor) return items;

    return items.sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];
      let comparison = collator.compare(first.toString(), second.toString());
      return sortDescriptor.direction === 'descending' ? -comparison : comparison;
    });
  };

  const sites = useAsyncList({
    load: async ({ signal, sortDescriptor }) => {
      let json = await getSites();
      return { items: sortItems(json, sortDescriptor || DEFAULT_SORT_DESCRIPTOR) };
    },
    sort: async ({ items, sortDescriptor }) => {
      return { items: sortItems(items, sortDescriptor) };
    },
    initialSortDescriptor: DEFAULT_SORT_DESCRIPTOR,
  });

  useEffect(() => {
    let items = sites.items;

    if (showLiveOnly && !showNonLiveOnly) {
      items = items.filter(item => item.isLive);
    }

    if (showNonLiveOnly && !showLiveOnly) {
      items = items.filter(item => !item.isLive);
    }

    if (debouncedSearchQuery) {
      items = items.filter(item => {
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

    setFilteredItems(items);
  }, [sites.items, debouncedSearchQuery, showLiveOnly, showNonLiveOnly, columns]);

  const renderCellContent = (item, columnKey) => {
    switch (columnKey) {
      case 'id':
        return (
          <div onDoubleClick={() => copyToClipboard(item[columnKey])}>
            {item[columnKey]}
          </div>
        );
      case 'createdAt':
      case 'updatedAt':
        return formatDate(item[columnKey]);
      case 'baseURL':
      case 'gitHubURL':
        if (item[columnKey]) {
          return (
            <Link target="_blank" rel="noopener noreferrer" href={item[columnKey]}>
              {item[columnKey]}
            </Link>
          );
        }
        break;

      case 'isLive':
        return (
          <StatusLight
            aria-label={item[columnKey] ? 'Live' : 'Not Live'}
            role="img"
            variant={item[columnKey] ? 'positive' : 'negative'}
          ></StatusLight>
        )

      default:
        return item[columnKey];
    }
  };

  const renderEmptyState = () => {
    return (
      <IllustratedMessage>
        <Heading>No results</Heading>
        <Content>No results found</Content>
      </IllustratedMessage>
    );
  }

  const refreshSites = async () => {
    await sites.reload();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth returns 0-11
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

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
          <Header>Showing {filteredItems.length} of {sites.items.length} Sites</Header>
        </Flex>
        <Flex alignSelf="start" gap="size-150">
          <ActionButton alignSelf="start">
            <Add size="S" />
          </ActionButton>
          <ActionButton onPress={refreshSites} aria-label="Refresh Sites">
            <Refresh size="S" />
          </ActionButton>
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
            Live Only
          </Checkbox>
          <Checkbox
            isSelected={showNonLiveOnly}
            marginEnd="size-200"
            onChange={setShowNonLiveOnly}
          >
            Non-Live Only
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
            items={filteredItems}
            loadingState={sites.loadingState}
          >
            {item => (
              <Row>
                {columnKey => (
                  <Cell>
                    {renderCellContent(item, columnKey)}
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
