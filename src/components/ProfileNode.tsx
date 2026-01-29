import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Users } from 'lucide-react';
import type { ProfileStore } from '../types';

export const ProfileNode: React.FC<NodeProps> = ({ data }) => {
    const details = data.details as ProfileStore;

    return (
        <div style={{
            padding: '16px',
            borderRadius: '50%', // Circular Node for distinction
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #fbbf24, #d97706)', // Amber/Gold gradient
            border: '4px solid #fff',
            boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            position: 'relative'
        }}>
            {/* Input from Datasets */}
            <Handle
                type="target"
                position={Position.Left}
                className="w-4 h-4"
                style={{
                    background: '#fff',
                    border: '2px solid #d97706',
                    left: '-6px'
                }}
            />

            <div style={{ marginBottom: '4px' }}>
                <Users size={32} />
            </div>
            <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.1 }}>Unified Profile</div>
            </div>

            {details.stats && (
                <div style={{
                    fontSize: '0.65rem',
                    marginTop: '4px',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '2px 6px',
                    borderRadius: '10px'
                }}>
                    {details.stats.totalProfiles.toLocaleString()}
                </div>
            )}
        </div>
    );
};
