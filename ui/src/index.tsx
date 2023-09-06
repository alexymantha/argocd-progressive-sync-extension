import * as React from 'react';

export const Extension = (props: {
  application: any;
}) => {
  console.log(props.application)
  return (
    <div className='application-status-panel__item-value' style={{ margin: 'auto 0' }}>
      <a className='neutral'>
        <i className={`fa fa-pause-circle`} /> Progressive Sync
      </a>
    </div>
  )
}

export const AnotherExtension = (props: {
  application: any;
}) => {
  return (
    <div className='application-status-panel__item-value' style={{ margin: 'auto 0' }}>
      <a className='warning'>
        <i className={`fa fa-play-circle`} /> Extension
      </a>
    </div>
  )
}

export const component = Extension;
export const anotherComponent = AnotherExtension;

// Register the component extension in ArgoCD
((window: any) => {
  window?.extensionsAPI?.registerStatusPanelExtension(component, 'PROGRESSIVE SYNC');
  window?.extensionsAPI?.registerStatusPanelExtension(anotherComponent, 'ANOTHER EXTENSION', {helpContent: "Example of help content"});
})(window)
