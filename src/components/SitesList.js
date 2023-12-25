import {
  ActionBar,
  ActionBarContainer,
  ActionButton,
  Button,
  ButtonGroup,
  Cell,
  Checkbox,
  Column,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Header,
  Heading,
  Item,
  Row,
  SearchField,
  TableBody,
  TableHeader,
  TableView,
  Text,
  Tooltip,
  TooltipTrigger,
  useAsyncList,
  useCollator,
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import Refresh from '@spectrum-icons/workflow/Refresh';
import Add from '@spectrum-icons/workflow/Add';
import Edit from '@spectrum-icons/workflow/Edit';
import Delete from '@spectrum-icons/workflow/Delete';
import Globe from '@spectrum-icons/workflow/Globe';
import Play from '@spectrum-icons/workflow/Play';
import Magnify from '@spectrum-icons/workflow/Magnify';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createSite, deleteSite, getSites, updateSite } from '../service/apiService';
import {
  copyToClipboard,
  formatDate,
  renderEmptyState, renderExternalLink,
  useDebounce,
} from '../utils/utils';
import SiteFormDialog from './dialogs/SiteFormDialog';
import AuditConfigStatus, { isAllAuditsDisabled, isSomeAuditsDisabled } from './content/AuditConfigStatus';
import LiveStatus from './content/LiveStatus';


const DEFAULT_SORT_DESCRIPTOR = { column: 'updatedAt', direction: 'descending' };

const SitesList = () => {
  const [currentEditingSite, setCurrentEditingSite] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSiteBeingDeleted, setIsSiteBeingDeleted] = useState(false);
  const [isSiteCreateDialogOpen, setIsSiteCreateDialogOpen] = useState(false);
  const [isSiteDeleteDialogOpen, setIsSiteDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [showAuditsDisabledOnly, setShowAuditsDisabledOnly] = useState(false);
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [showNonLiveOnly, setShowNonLiveOnly] = useState(false);
  const [showSomeAuditsDisabledOnly, setShowSomeAuditsDisabledOnly] = useState(false);


  const collator = useCollator({ numeric: true });
  const debouncedSearchQuery = useDebounce(searchQuery, 700);
  const navigate = useNavigate();

  const columns = useMemo(() => [
    { uid: 'id', name: 'Id' },
    { uid: 'baseURL', name: 'Base URL' },
    { uid: 'gitHubURL', name: 'GitHub URL' },
    { uid: 'isLive', name: 'Live', width: '0.2fr' },
    { uid: 'auditConfig', name: 'Audits', width: '0.3fr' },
    { uid: 'updatedAt', name: 'Updated At (UTC)', width: '0.6fr' },
    { uid: 'createdAt', name: 'Created At (UTC)', width: '0.6fr' },
  ], []);

  const initialActionBarItems = [
    { key: 'open', label: 'Open', icon: <Magnify/>, maxSelections: 1 },
    { key: 'edit', label: 'Edit', icon: <Edit/>, maxSelections: 1 },
    { key: 'delete', label: 'Delete', icon: <Delete/> },
    { key: 'toggle-live-status', label: 'Toggle Live Status', icon: <Globe/> },
    { key: 'toggle-audits-enabled', label: 'Toggle Audits Enabled', icon: <Play/> },
  ];

  // Dynamically adjust bar items based on the number of selected items and maxSelections
  const actualActionBarItems = initialActionBarItems.filter(item =>
    item.maxSelections === undefined || selectedKeys.size <= item.maxSelections
  );

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
    load: async ({ sortDescriptor }) => {
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

    if (showAuditsDisabledOnly) {
      items = items.filter(item => isAllAuditsDisabled(item));
    }

    if (showSomeAuditsDisabledOnly) {
      items = items.filter(item => isSomeAuditsDisabled(item));
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
  }, [
    sites.items,
    debouncedSearchQuery,
    showLiveOnly,
    showNonLiveOnly,
    showAuditsDisabledOnly,
    showSomeAuditsDisabledOnly,
    columns,
  ]);

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
        return (renderExternalLink(item[columnKey]));

      case 'isLive':
        return (<LiveStatus item={item}/>)

      case 'auditConfig':
        return (<AuditConfigStatus site={item}/>)

      default:
        return item[columnKey];
    }
  };

  const clearTableSelections = () => {
    setSelectedKeys(new Set([]));
  }

  const openSiteCreateDialog = () => {
    setIsSiteCreateDialogOpen(true);
  }

  const handleCreateSite = async (siteData) => {
    console.log('Creating site with data:', siteData);
    try {
      const newSite = await createSite(siteData);
      sites.insert(newSite.id, newSite);
      ToastQueue.positive(`Site ${newSite.id} created`, { timeout: 5000 });
    } catch (error) {
      console.log('Error creating site:', error);
      ToastQueue.negative('Error creating site', { timeout: 5000 });
    }
    setIsSiteCreateDialogOpen(false);
  }

  const handleEditSite = async (siteData) => {
    try {
      const siteId = currentEditingSite.id;
      const currentSite = sites.getItem(siteId);
      await updateSite(siteId, siteData);
      const updatedSite = { ...currentSite, ...siteData };
      sites.update(siteId, updatedSite);
      clearTableSelections();
      ToastQueue.positive(`Site ${siteId} updated`, { timeout: 5000 });
    } catch (error) {
      console.log('Error updating site:', error);
      ToastQueue.negative('Error updating site', { timeout: 5000 });
    }
    setIsSiteCreateDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditingSite(null);
  };

  const handleDeleteSite = async () => {
    setIsSiteBeingDeleted(true);
    console.log('Deleting site(s) with ids:', selectedKeys);
    try {
      for (const siteId of selectedKeys) {
        await deleteSite(siteId);
        sites.remove(siteId);
      }
      clearTableSelections();
      ToastQueue.positive(`Successfully deleted ${selectedKeys.size} site(s)`, { timeout: 5000 });
    } catch (error) {
      console.log('Error deleting site(s):', error);
      ToastQueue.negative('Error deleting site(s)', { timeout: 5000 });
    }
    setIsSiteBeingDeleted(false);
    setIsSiteDeleteDialogOpen(false);
  }

  const handleToggleAllAudits = async () => {
    try {
      for (const siteId of selectedKeys) {
        const currentSite = sites.getItem(siteId);
        const updatedSite = {
          ...currentSite,
          auditConfig: {
            ...currentSite.auditConfig,
            auditsDisabled: !currentSite.auditConfig.auditsDisabled
          }
        };
        await updateSite(siteId, { auditConfig: updatedSite.auditConfig });
        sites.update(siteId, updatedSite);
      }
      clearTableSelections();
      ToastQueue.positive(`Audits toggled for ${selectedKeys.size} site(s)`, { timeout: 5000 });
    } catch (error) {
      console.log('Error toggling audits:', error);
      ToastQueue.negative('Error toggling audits', { timeout: 5000 });
    }
  }

  const handleToggleLiveStatus = async () => {
    try {
      for (const siteId of selectedKeys) {
        const currentSite = sites.getItem(siteId);
        const updatedSite = { ...currentSite, isLive: !currentSite.isLive };
        await updateSite(siteId, { isLive: updatedSite.isLive });
        sites.update(siteId, updatedSite);
      }
      clearTableSelections();
      ToastQueue.positive(`Live status toggled for ${selectedKeys.size} site(s)`, { timeout: 5000 });
    } catch (error) {
      console.log('Error toggling live status:', error);
      ToastQueue.negative('Error toggling live status', { timeout: 5000 });
    }
  }

  const refreshSites = async () => {
    await sites.reload();
  };

  const handleAction = async (key) => {
    switch (key) {
      case 'open':
        const siteIdToOpen = Array.from(selectedKeys)[0];
        navigate(`/sites/${siteIdToOpen}`)
        break;
      case 'edit':
        const siteId = Array.from(selectedKeys)[0];
        const siteToEdit = sites.getItem(siteId);
        setCurrentEditingSite(siteToEdit);
        setIsEditMode(true);
        setIsSiteCreateDialogOpen(true);
        break;
      case 'delete':
        setIsSiteDeleteDialogOpen(true);
        break;
      case 'toggle-live-status':
        await handleToggleLiveStatus();
        break;
      case 'toggle-audits-enabled':
        await handleToggleAllAudits();
        break;
      default:
        console.log(`Unknown action: ${key}`);
    }
  };

  return (
    <div>
      <Flex direction="column" gap="size-200" width="100%">
        <Flex alignSelf="start" gap="size-150">
          <ActionButton
            aria-label="Create Site"
            alignSelf="start"
            onPress={openSiteCreateDialog}
          >
            <Add size="S"/>
            <Text>Add Site</Text>
          </ActionButton>
          <TooltipTrigger>
            <ActionButton onPress={refreshSites} aria-label="Refresh Sites">
              <Refresh size="S"/>
            </ActionButton>
            <Tooltip>Refresh Sites</Tooltip>
          </TooltipTrigger>
          <Divider orientation="vertical" size="S"/>
          <SearchField
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
          <Checkbox
            isSelected={showAuditsDisabledOnly}
            marginEnd="size-200"
            onChange={setShowAuditsDisabledOnly}
          >
            All Audits Disabled
          </Checkbox>
          <Checkbox
            isSelected={showSomeAuditsDisabledOnly}
            marginEnd="size-200"
            onChange={setShowSomeAuditsDisabledOnly}
          >
            Some Audits Disabled
          </Checkbox>
        </Flex>
        <Flex>
          <Header>Showing {filteredItems.length} of {sites.items.length} Sites</Header>
        </Flex>
        <ActionBarContainer
          height="size-6000"
        >
          <TableView
            aria-label="Sites"
            density="compact"
            flex
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
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
          <ActionBar
            isEmphasized
            items={actualActionBarItems}
            selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
            onAction={handleAction}
            onClearSelection={clearTableSelections}
          >
            {(item) => (
              <Item key={item.key}>
                {item.icon}
                <Text>{item.label}</Text>
              </Item>
            )}
          </ActionBar>
        </ActionBarContainer>
      </Flex>
      <SiteFormDialog
        isOpen={isSiteCreateDialogOpen}
        onClose={() => {
          setIsSiteCreateDialogOpen(false);
          setIsEditMode(false);
          setCurrentEditingSite(null);
        }}
        onSubmit={isEditMode ? handleEditSite : handleCreateSite}
        siteData={isEditMode ? currentEditingSite : null}
      />
      <DialogContainer
        onDismiss={() => setIsSiteDeleteDialogOpen(false)} type="modal"
      >
        {isSiteDeleteDialogOpen && (
          <Dialog aria-label="Delete Site">
            <Heading>Delete Site</Heading>
            <Content>
              <Text>Are you sure you want to delete {selectedKeys.size} selected site(s)?</Text>
            </Content>
            <ButtonGroup>
              <Button
                variant="secondary"
                onPress={() => setIsSiteDeleteDialogOpen(false)}
              >Cancel</Button>
              <Button
                isPending={isSiteBeingDeleted}
                variant="negative"
                style="fill"
                onPress={handleDeleteSite}
              >Delete</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogContainer>
    </div>
  );
};

export default SitesList;
