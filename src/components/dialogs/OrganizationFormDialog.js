import React, { useState, useEffect } from 'react';
import {
  Button,
  ButtonGroup,
  Content,
  ContextualHelp,
  Dialog,
  DialogContainer,
  Divider,
  Form,
  Heading,
  TextField,
} from '@adobe/react-spectrum';

const EMPTY_ORGANIZATION = {
  name: '',
  imsOrgId: '',
  config: {
    slack: {},
    alerts: [],
  }
};

function OrganizationFormDialog({ isOpen, onClose, onSubmit, organizationData }) {
  const [formValues, setFormValues] = useState({ ...EMPTY_ORGANIZATION });

  useEffect(() => {
    // If editing, populate form with existing organization data
    if (organizationData) {
      setFormValues(organizationData);
    }
  }, [organizationData]);

  const handleClose = () => {
    setFormValues({ ...EMPTY_ORGANIZATION });
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(formValues);
    onClose();
    setFormValues({ ...EMPTY_ORGANIZATION });
  };

  const handleChange = (name, value) => {
    setFormValues(prevValues => {
      const keys = name.split('.');
      const lastKey = keys.pop();
      const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, prevValues);
      lastObj[lastKey] = value;
      return { ...prevValues };
    });
  };

  const isValidIMSOrgID = (value) => {
    const regex = /^[A-Za-z0-9]+@AdobeOrg$/;
    return regex.test(value) ? null : 'Please enter a valid IMS Organization ID';
  }

  return (
    <DialogContainer
      onDismiss={onClose}
      type="modal"
    >
      {isOpen && (
        <Dialog>
          <Heading>{organizationData ? ('Edit Organization') : ('Add Organization')}</Heading>
          <Divider/>
          <Content>
            <Form
              onSubmit={e => {
                e.preventDefault();
                handleSubmit();
              }}
              validationBehavior="native"
            >
              {
                <TextField
                  isRequired
                  label="Name"
                  name="name"
                  onChange={(value) => handleChange('name', value)}
                  type="text"
                  value={formValues.name}
                  contextualHelp={
                    <ContextualHelp>
                      <Heading>Name</Heading>
                      <Content>Enter the name of the organization</Content>
                    </ContextualHelp>
                  }
                />
              }
              <TextField
                label="IMS Organization ID"
                name="imsOrgId"
                onChange={(value) => handleChange('imsOrgId', value)}
                value={formValues.imsOrgId || ''}
                validate={isValidIMSOrgID}
                contextualHelp={
                  <ContextualHelp>
                    <Heading>IMS Org ID</Heading>
                    <Content>The ID of the Organization's Adobe IMS Tenant, e.g. ABCD1234@AdobeOrg</Content>
                  </ContextualHelp>
                }
              />
              <Divider size="S"/>
              <ButtonGroup>
                <Button variant="secondary" onPress={handleClose}>Cancel</Button>
                <Button type="submit" variant="accent">Save</Button>
              </ButtonGroup>
            </Form>
          </Content>
        </Dialog>
      )}
    </DialogContainer>
  );
}

export default OrganizationFormDialog;
