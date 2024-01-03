import * as React from 'react';
import { useEffect, useState } from "react";
import { getOwner } from './application';
import { isProgressing } from './applicationset';

const TITLE = "PROGRESSIVE SYNC";
const ID = "PROGRESSIVE_SYNC";

interface SectionInfo {
    title: string;
    helpContent?: string;
}

const sectionLabel = (info: SectionInfo) => (
    <label style={{fontSize: '12px', fontWeight: 600, color: "#6D7F8B"}}>
        {info.title}
    </label>
);

export const Extension = (props: {
    application: any;
    openFlyout: () => any;
}) => {
    const [progressing, setProgressing] = useState(false);
    const owner = getOwner(props.application);
    if(!owner) {
        return null;
    }

    useEffect(() => {
        let url = `/api/v1/applicationsets/${owner.name}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const prog = isProgressing(data, props.application.metadata.name);
                setProgressing(prog);
            })
            .catch(err => {
                console.error("res.data", err);
            });
    });

    if(!progressing) {
        return null;
    }
    return (
        <React.Fragment>
            <div className='application-status-panel__item' style={{position: 'relative'}}>
                {sectionLabel({
                    title: TITLE,
                })}
                <div className='application-status-panel__item-value' style={{ margin: 'auto 0' }}>
                    <a className='neutral'>
                        <i className={`fa fa-pause-circle`} /> Progressive Sync
                    </a>
                </div>
            </div>
        </React.Fragment>
    )
}

export const component = Extension;

// Register the component extension in ArgoCD
((window: any) => {
    window?.extensionsAPI?.registerStatusPanelExtension(component, TITLE, ID);
})(window)
