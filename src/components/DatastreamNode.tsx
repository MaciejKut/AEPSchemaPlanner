import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Activity } from 'lucide-react';
import type { IngestNode } from '../types';

export const DatastreamNode: React.FC<NodeProps> = ({ data }) => {
    const details = data.details as IngestNode;

    return (
        <div style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'var(--color-surface)',
            border: '1px solid #a78bfa', /* Indigo/Purple Border */
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            minWidth: '200px',
            textAlign: 'left'
        }}>
            {/* Input from Schema/Source */}
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-400" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                    background: 'rgba(167, 139, 250, 0.2)',
                    padding: '6px',
                    borderRadius: '6px'
                }}>
                    <Activity size={16} color="#a78bfa" />
                </div>
                <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{details.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{details.type}</div>
                </div>
            </div>

            {/* Output to Dataset */}
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-400" />
        </div>
    );
};
