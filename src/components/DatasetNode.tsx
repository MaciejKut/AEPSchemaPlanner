import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Database } from 'lucide-react';
import type { Dataset } from '../types';

export const DatasetNode = memo(({ data }: NodeProps<{ details: Dataset }>) => {
    const { details } = data;
    return (
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '12px',
            minWidth: '180px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'left'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: 'var(--color-text-secondary)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    padding: '6px',
                    borderRadius: '6px',
                    color: '#34d399'
                }}>
                    <Database size={16} />
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.5px' }}>Dataset</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{details.name}</div>
                </div>
            </div>

            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                Created: {details.created}
            </div>

            <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-accent)' }} />
        </div>
    );
});
