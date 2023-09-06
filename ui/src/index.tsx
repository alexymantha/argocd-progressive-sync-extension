import * as React from 'react';

export const Extension = (props: {
  tree: any;
  resource: any;
}) => (
  <div>Hello {props.resource.metadata.name}!</div>
);

export const component = Extension;

// Register the component extension in ArgoCD
((window: any) => {
  window?.extensionsAPI?.registerStatusBarExtension(component, 'Progressive Sync', 'fa-hourglass');
})(window)
