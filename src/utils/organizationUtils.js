import { ToastQueue } from '@react-spectrum/toast';

export function createActionHandler({
                                      organization,
                                      navigate,
                                      updateOrganizations,
                                    }) {
  return async (action) => {
    switch (action) {
      case 'open-organization':
        navigate(`/organizations/${organization.id}`);
        break;
      case 'copy-organization-id':
        await navigator.clipboard.writeText(organization.id);
        ToastQueue.positive('Copied Organization ID to clipboard', { timeout: 5000 });
        break;
      default:
        break;
    }
  }
}
