import React from 'react';
import { PlusCircle, Database, FileJson } from 'lucide-react';

interface ToolbarProps {
    onAddSchema: () => void;
    onAddDataset: () => void;
}

export const PlannerToolbar: React.FC<ToolbarProps> = ({ onAddSchema, onAddDataset }) => {
    return (
        <div style={{
            position: 'absolute',
            left: '20px',
            top: '100px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 50, /* Increased z-index */
            background: 'rgba(15, 23, 42, 0.5)', /* Semi-transparent backdrop */
            padding: '10px',
            borderRadius: '12px',
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-text-secondary)',
                letterSpacing: '1px',
                paddingLeft: '4px',
                marginBottom: '4px'
            }}>
                Planner Mode
            </div>

            <button
                onClick={onAddSchema}
                style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    boxShadow: 'var(--shadow-lg)',
                    backgroundColor: 'var(--color-surface)', /* Explicit bg */
                    color: '#ffffff', /* Explicit text color */
                    height: '40px',
                    minWidth: '140px',
                    border: '1px solid var(--color-border)'
                }}
                title="Add New Schema"
            >
                <PlusCircle size={18} color="#60a5fa" />
                <FileJson size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Schema</span>
            </button>

            <button
                onClick={onAddDataset}
                style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    boxShadow: 'var(--shadow-lg)',
                    backgroundColor: 'var(--color-surface)',
                    color: '#ffffff',
                    height: '40px',
                    minWidth: '140px',
                    border: '1px solid var(--color-border)'
                }}
                title="Add New Dataset"
            >
                <PlusCircle size={18} color="#34d399" />
                <Database size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Dataset</span>
            </button>
        </div>
    );
};
