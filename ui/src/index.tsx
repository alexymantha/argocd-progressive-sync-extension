import * as React from 'react';

export const Extension = (props: {
  tree: any;
  resource: any;
}) => {
  console.log(props.tree)
  return (
    <div className='application-status-panel__item-value' style={{ margin: 'auto 0' }}>
      <a className='neutral'>
        <i className={`fa fa-pause-circle`} /> Progressive Sync
      </a>
    </div>
  )
}

export const component = Extension;

// Register the component extension in ArgoCD
((window: any) => {
  window?.extensionsAPI?.registerStatusBarExtension(component, 'PROGRESSIVE SYNC');
})(window)
