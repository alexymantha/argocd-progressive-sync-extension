import * as React from 'react';
import * as dagre from '@dagrejs/dagre';
import { useEffect, useState, useMemo } from "react";
import { getOwner } from './application';
import { isProgressing } from './applicationset';
import {ResourceIcon} from 'argocd';

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

//    if(!progressing) {
//        return null;
//    }
    return (
        <React.Fragment>
            <div className='application-status-panel__item' style={{position: 'relative'}}>
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

const NODE_WIDTH = 282;
const NODE_HEIGHT = 52;

export const Flyout = (props: {
    application: any;
}) => {
    const [graphNodes, setGraphNodes] = useState<dagre.Node[]>([]);

    const owner = getOwner(props.application);
    console.log("owner", owner);
    if(!owner) {
        return null;
    }

    useEffect(() => {
        let url = `/api/v1/applicationsets/${owner.name}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const graph = new dagre.graphlib.Graph();
                graph.setGraph({nodesep: 80, rankdir: 'TB', marginy: 45, marginx: 45, ranksep: 25});
                graph.setDefaultEdgeLabel(() => ({}));

                // Refactor recursively? and add tests
                let previousStep = 0;
                let currentStep = 0;
                let previousLevel: string[] = [];
                let currentLevel: string[] = [];
                data.status.applicationStatus.sort((a: any, b: any) => parseInt(a.step) - parseInt(b.step)).forEach((app: any) => {
                    currentStep = parseInt(app.step);
                    if(currentStep > previousStep) {
                        previousLevel = currentLevel;
                        currentLevel = [];
                        previousStep = currentStep;
                    }

                    graph.setNode(app.application, {label: app.application, kind: app.kind, width: NODE_WIDTH, height: NODE_HEIGHT});
                    currentLevel.push(app.application);

                    if (previousLevel.length > 0) {
                        previousLevel.forEach((prev: any) => {
                            graph.setEdge(prev, app.application);
                        });
                    }
                });

                dagre.layout(graph);
                setGraphNodes(graph.nodes().map(id => graph.node(id)));
            })
            .catch(err => {
                console.error("res.data", err);
            });
    }, []);

    const size = useMemo(() => { 
        console.log("graphNodes", graphNodes);
        return getGraphSize(graphNodes)
    }, [graphNodes]);
    return (
        (graphNodes.length === 0 && (
            <h5>Could not generate graph.</h5>
        )) || (
                <div style={{width: size.width + 250, height: size.height + 150, transformOrigin: '0% 0%'}}>
                    {graphNodes.map(node => {
                       return (<div            
                           style={{
                                left: node.x,
                                top: node.y,
                                width: node.width,
                                height: node.height
                            }}
                            title="test"
                        >
                            <div>
                                <ResourceIcon kind={node.kind} />
                                <br />
                            </div>
                        </div>)
                    })}
                </div>
        )
    )
}

function getGraphSize(nodes: dagre.Node[]): {width: number; height: number} {
    let width = 0;
    let height = 0;
    nodes.forEach(node => {
        width = Math.max(node.x + node.width, width);
        height = Math.max(node.y + node.height, height);
    });
    return {width, height};
}

export const component = Extension;
export const flyout = Flyout;

// Register the component extension in ArgoCD
((window: any) => {
    window?.extensionsAPI?.registerStatusPanelExtension(component, TITLE, ID, flyout);
})(window)
