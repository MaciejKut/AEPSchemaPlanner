import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { FileJson, CheckCircle } from 'lucide-react';
import type { Schema } from '../types';

export const SchemaNode = memo(({ data }: NodeProps<{ details: Schema }>) => {
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    padding: '6px',
                    borderRadius: '6px',
                    color: '#60a5fa'
                }}>
                    <FileJson size={16} />
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.5px' }}>Schema</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{details.name}</div>
                </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                {details.class}
            </div>

            {details.isProfileEnabled && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.7rem',
                    color: '#4ade80',
                    background: 'rgba(74, 222, 128, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    width: 'fit-content'
                }}>
                    <CheckCircle size={10} /> Profile Enabled
                </div>
            )}

            <Handle type="source" position={Position.Bottom} style={{ background: 'var(--color-accent)' }} />
        </div>
    );
});
