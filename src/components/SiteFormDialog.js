import React, { useState, useEffect } from 'react';
import {
  Button,
  ButtonGroup,
  Checkbox,
  Content,
  ContextualHelp,
  Dialog,
  DialogContainer,
  Divider,
  Form,
  Heading,
  TextField,
} from '@adobe/react-spectrum';
import { hasText, isValidUrl } from '@adobe/spacecat-shared-utils';

const EMPTY_SITE = {
  baseURL: '',
  gitHubURL: '',
  isLive: false,
  auditConfig: {
    auditsDisabled: false,
    auditTypeConfigs: {}
  }
};

function SiteFormDialog({ isOpen, onClose, onSubmit, siteData }) {
  const [formValues, setFormValues] = useState({ ...EMPTY_SITE });

  useEffect(() => {
    // If editing, populate form with existing site data
    if (siteData) {
      setFormValues(siteData);
    }
  }, [siteData]);

  const handleClose = () => {
    setFormValues({ ...EMPTY_SITE });
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(formValues);
    onClose();
    setFormValues({ ...EMPTY_SITE });
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

  const validateGitHubURL = (value) => {
    return !hasText(value) || (isValidUrl(value) && value.startsWith('https://github.com/')) ? null : 'Please enter a valid GitHub repository URL';
  }

  return (
    <DialogContainer
      onDismiss={onClose}
      type="modal"
    >
      {isOpen && (
        <Dialog>
          <Heading>{siteData ? ('Edit Site') : ('Add Site')}</Heading>
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
                siteData ? (
                  <div>
                    <strong>Base URL:</strong> {formValues.baseURL}
                    <br/><small>Base URL is not editable</small>
                  </div>
                ) : (
                  <TextField
                    isRequired
                    label="Base URL"
                    name="baseURL"
                    onChange={(value) => handleChange('baseURL', value)}
                    type="url"
                    value={formValues.baseURL}
                    contextualHelp={
                      <ContextualHelp>
                        <Heading>Base URL</Heading>
                        <Content>Enter the Base URL of the site, e.g. https://my-site.com/blog</Content>
                      </ContextualHelp>
                    }
                  />
                )
              }
              <TextField
                label="GitHub URL"
                name="gitHubURL"
                onChange={(value) => handleChange('gitHubURL', value)}
                value={formValues.gitHubURL}
                validate={validateGitHubURL}
                contextualHelp={
                  <ContextualHelp>
                    <Heading>GitHub URL</Heading>
                    <Content>Optionally you can enter the URL of the GitHub Repo backing your site, e.g.
                      https://github.com/myOrg/myRepo</Content>
                  </ContextualHelp>
                }
              />
              <Checkbox
                isSelected={formValues.isLive}
                onChange={(value) => handleChange('isLive', value)}
                value="true"
              >
                Site is Live
              </Checkbox>
              <Checkbox
                isSelected={formValues.auditConfig.auditsDisabled}
                onChange={(value) => handleChange('auditConfig.auditsDisabled', value)}
                value="true"
              >
                Disable All Audits
              </Checkbox>
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

export default SiteFormDialog;
