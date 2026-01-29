import React, { useCallback } from 'react';
import ReactFlow, {
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    Controls,
    Background,
    BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';

import { SchemaNode } from './SchemaNode';
import { DatasetNode } from './DatasetNode';
import { DatastreamNode } from './DatastreamNode';
import { ProfileNode } from './ProfileNode';

interface GraphViewProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
}

const nodeTypes = {
    schema: SchemaNode,
    dataset: DatasetNode,
    ingest: DatastreamNode, // Mapped to 'ingest' type in App.tsx
    profile: ProfileNode
};

export const GraphView: React.FC<GraphViewProps> = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange
}) => {

    const onNodeClick = useCallback(() => {
        // No-op or future selection logic
    }, []);

    const onPaneClick = useCallback(() => {
        // No-op
    }, []);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                fitView
            >
                <Background color="#334155" variant={BackgroundVariant.Dots} gap={20} size={1} />
                <Controls />
            </ReactFlow>
        </div>
    );
};
