import {
  ActionBar,
  ActionBarContainer,
  ActionButton,
  Button,
  ButtonGroup,
  Cell,
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
import Magnify from '@spectrum-icons/workflow/Magnify';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
} from '../service/apiService';

import {
  copyToClipboard,
  createActionBarItems,
  formatDate,
  renderEmptyState,
  useDebounce,
} from '../utils/utils';

import OrganizationFormDialog from './dialogs/OrganizationFormDialog';
import Close from '@spectrum-icons/workflow/Close';
import OrganizationRowActions from './tables/actions/OrganizationRowActions';


const DEFAULT_SORT_DESCRIPTOR = { column: 'name', direction: 'ascending' };

const OrganizationsList = () => {
  const [currentEditingOrganization, setCurrentEditingOrganization] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOrganizationBeingDeleted, setIsOrganizationBeingDeleted] = useState(false);
  const [isOrganizationCreateDialogOpen, setIsOrganizationCreateDialogOpen] = useState(false);
  const [isOrganizationDeleteDialogOpen, setIsOrganizationDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const collator = useCollator({ numeric: true });
  const debouncedSearchQuery = useDebounce(searchQuery, 700);
  const navigate = useNavigate();

  const columns = useMemo(() => [
    { uid: 'id', name: 'Id' },
    { uid: 'name', name: 'Name' },
    { uid: 'imsOrgId', name: 'IMS Org ID' },
    { uid: 'config', name: 'Configuration' },
    { uid: 'updatedAt', name: 'Updated At (UTC)', width: '0.5fr' },
    { uid: 'createdAt', name: 'Created At (UTC)', width: '0.5fr' },
    { uid: 'actions', name: '', width: '0.2fr' },
  ], []);

  const actionBarItemConfig = useMemo(() => [
    { key: 'open', label: 'Open', icon: <Magnify/>, maxSelections: 1 },
    { key: 'edit', label: 'Edit', icon: <Edit/>, maxSelections: 1 },
    { key: 'delete', label: 'Delete', icon: <Delete/> },
  ], []);

  const actionBarItems = useMemo(() => createActionBarItems(actionBarItemConfig, selectedKeys), []);

  const sortItems = (items, sortDescriptor) => {
    if (!sortDescriptor) return items;

    return items.sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];
      let comparison = collator.compare(first.toString(), second.toString());
      return sortDescriptor.direction === 'descending' ? -comparison : comparison;
    });
  };

  const organizations = useAsyncList({
    load: async ({ sortDescriptor }) => {
      let json = await getOrganizations();
      return { items: sortItems(json, sortDescriptor || DEFAULT_SORT_DESCRIPTOR) };
    },
    sort: async ({ items, sortDescriptor }) => {
      return { items: sortItems(items, sortDescriptor) };
    },
    initialSortDescriptor: DEFAULT_SORT_DESCRIPTOR,
  });

  useEffect(() => {
    let items = organizations.items;

    // items = items.filter(item => hasLiveStatus(item, liveStatus));
    // items = items.filter(item => hasAuditEnabledStatus(item, auditEnabledStatus));
    // items = items.filter(item => hasGitHubURLStatus(item, gitHubURLStatus));

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
    organizations.items,
    debouncedSearchQuery,
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
      case 'config':
        return JSON.stringify(item[columnKey]);
      case 'createdAt':
      case 'updatedAt':
        return formatDate(item[columnKey]);
      default:
        return item[columnKey];
    }
  };

  const clearTableSelections = () => {
    setSelectedKeys(new Set([]));
  }

  const openOrganizationCreateDialog = () => {
    setIsOrganizationCreateDialogOpen(true);
  }

  const resetControls = () => {
    setSearchQuery('');
  }

  const handleOrganizationUpdate = (updatedOrganization) => {
    organizations.update(updatedOrganization.id, updatedOrganization);
  }

  const handleCreateOrganization = async (orgData) => {
    console.log('Creating organization with data:', orgData);
    try {
      const newOrg = await createOrganization(orgData);
      organizations.insert(newOrg.id, newOrg);
      ToastQueue.positive(`Organization ${newOrg.id} created`, { timeout: 5000 });
    } catch (error) {
      console.log('Error creating organization:', error);
      ToastQueue.negative('Error creating organization', { timeout: 5000 });
    }
    setIsOrganizationCreateDialogOpen(false);
  }

  const handleEditOrganization = async (orgData) => {
    try {
      const organizationId = currentEditingOrganization.id;
      const currentOrganization = organizations.getItem(organizationId);
      await updateOrganization(organizationId, orgData);
      const updatedOrganization = { ...currentOrganization, ...orgData };
      handleOrganizationUpdate(updatedOrganization);
      clearTableSelections();
      ToastQueue.positive(`Organization ${organizationId} updated`, { timeout: 5000 });
    } catch (error) {
      console.log('Error updating organization:', error);
      ToastQueue.negative('Error updating organization', { timeout: 5000 });
    }
    setIsOrganizationCreateDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditingOrganization(null);
  };

  const handleDeleteOrganization = async () => {
    setIsOrganizationBeingDeleted(true);
    console.log('Deleting organization(s) with ids:', selectedKeys);
    try {
      for (const organizationId of selectedKeys) {
        await deleteOrganization(organizationId);
        organizations.remove(organizationId);
      }
      clearTableSelections();
      ToastQueue.positive(`Successfully deleted ${selectedKeys.size} organization(s)`, { timeout: 5000 });
    } catch (error) {
      console.log('Error deleting organization(s):', error);
      ToastQueue.negative('Error deleting organization(s)', { timeout: 5000 });
    }
    setIsOrganizationBeingDeleted(false);
    setIsOrganizationDeleteDialogOpen(false);
  }

  const refreshOrganizations = async () => {
    await organizations.reload();
  };

  const handleAction = async (key) => {
    switch (key) {
      case 'open':
        const organizationIdToOpen = Array.from(selectedKeys)[0];
        navigate(`/organizations/${organizationIdToOpen}`)
        break;
      case 'edit':
        const organizationId = Array.from(selectedKeys)[0];
        const orgToEdit = organizations.getItem(organizationId);
        setCurrentEditingOrganization(orgToEdit);
        setIsEditMode(true);
        setIsOrganizationCreateDialogOpen(true);
        break;
      case 'delete':
        setIsOrganizationDeleteDialogOpen(true);
        break;
      default:
        console.log(`Unknown action: ${key}`);
    }
  };

  return (
    <div>
      <Flex direction="column" gap="size-200" width="100%">
        <Flex alignSelf="start" gap="size-150" wrap="wrap">
          <ActionButton
            aria-label="Create Organization"
            alignSelf="start"
            onPress={openOrganizationCreateDialog}
          >
            <Add size="S"/>
            <Text>Add Organization</Text>
          </ActionButton>
          <TooltipTrigger>
            <ActionButton onPress={refreshOrganizations} aria-label="Refresh Organizations">
              <Refresh size="S"/>
            </ActionButton>
            <Tooltip>Refresh Organizations</Tooltip>
          </TooltipTrigger>
          <Divider orientation="vertical" size="S"/>
          <SearchField
            aria-label="Search"
            description="Search organizations..."
            marginEnd="size-200"
            onChange={setSearchQuery}
            value={searchQuery}
            width="auto"
          />
          <ActionButton onPress={resetControls} aria-label="Reset Controls">
            <Close size="S"/>
          </ActionButton>
        </Flex>
        <Flex>
          <Header>Showing {filteredItems.length} of {organizations.items.length} Organizations</Header>
        </Flex>
        <ActionBarContainer
          height="size-6000"
        >
          <TableView
            aria-label="Organizations"
            density="compact"
            flex
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            onSortChange={organizations.sort}
            renderEmptyState={renderEmptyState}
            selectionMode="multiple"
            selectionStyle="checkbox"
            sortDescriptor={organizations.sortDescriptor}
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
              loadingState={organizations.loadingState}
            >
              {item => (
                <Row>
                  {columnKey => (
                    <Cell>
                      {columnKey === 'actions' ? (
                        <OrganizationRowActions organization={item} updateOrganizations={handleOrganizationUpdate}/>
                      ) : (
                        renderCellContent(item, columnKey)
                      )}
                    </Cell>
                  )}
                </Row>
              )}
            </TableBody>
          </TableView>
          <ActionBar
            isEmphasized
            items={actionBarItems}
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
      <OrganizationFormDialog
        isOpen={isOrganizationCreateDialogOpen}
        onClose={() => {
          setIsOrganizationCreateDialogOpen(false);
          setIsEditMode(false);
          setCurrentEditingOrganization(null);
        }}
        onSubmit={isEditMode ? handleEditOrganization : handleCreateOrganization}
        organizationData={isEditMode ? currentEditingOrganization : null}
      />
      <DialogContainer
        onDismiss={() => setIsOrganizationDeleteDialogOpen(false)} type="modal"
      >
        {isOrganizationDeleteDialogOpen && (
          <Dialog aria-label="Delete Organization">
            <Heading>Delete Organization</Heading>
            <Content>
              <Text>Are you sure you want to delete {selectedKeys.size} selected organization(s)?</Text>
            </Content>
            <ButtonGroup>
              <Button
                variant="secondary"
                onPress={() => setIsOrganizationDeleteDialogOpen(false)}
              >Cancel</Button>
              <Button
                isPending={isOrganizationBeingDeleted}
                variant="negative"
                style="fill"
                onPress={handleDeleteOrganization}
              >Delete</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogContainer>
    </div>
  );
};

export default OrganizationsList;
