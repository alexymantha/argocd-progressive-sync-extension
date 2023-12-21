import {HelpIcon} from 'argo-ui';
import * as React from 'react';

const TITLE = "PROGRESSIVE SYNC";
const ID = "PROGRESSIVE_SYNC";

interface SectionInfo {
    title: string;
    helpContent?: string;
}

const sectionLabel = (info: SectionInfo) => (
    <label style={{fontSize: '12px', fontWeight: 600, color: "#6D7F8B"}}>
        {info.title}
        {info.helpContent && <HelpIcon title={info.helpContent} />}
    </label>
);

export const Extension = (props: {
  application: any;
  openFlyout: () => any;
}) => {
  return (
    <React.Fragment>
      <div className='application-status-panel__item'>
        {sectionLabel({
          title: TITLE,
        })}
        <div className='application-status-panel__item-value' style={{ margin: 'auto 0' }}>
          <a className='neutral' onClick={() => props.openFlyout()}>
            <i className={`fa fa-pause-circle`} /> Progressive Sync
          </a>
        </div>
      </div>
    </React.Fragment>
  )
}

export const Flyout = (props: {
  application: any;
}) => {
  return (
    <React.Fragment>
      <div className='application-status-panel__item'>
        <p>Information about the extension</p> 
      </div>
    </React.Fragment>
  )
}

export const component = Extension;
export const flyout = Flyout;

// Register the component extension in ArgoCD
((window: any) => {
  window?.extensionsAPI?.registerStatusPanelExtension(component, TITLE, ID, flyout);
})(window)
