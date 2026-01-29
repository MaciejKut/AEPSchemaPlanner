import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { PlusCircle, Trash2, Sliders, Database, Layers, ArrowRight } from 'lucide-react';
import type { Schema, Dataset, IngestNode } from '../types';

const Tab = {
    SCHEMAS: 'Schemas',
    DATASETS: 'Datasets',
    INGESTIONS: 'Ingestions'
} as const;

type Tab = typeof Tab[keyof typeof Tab];

export const DefinitionEditor: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.SCHEMAS);
    const {
        schemas, datasets, ingestNodes,
        addSchema, updateSchema, deleteSchema,
        addDataset, updateDataset, deleteDataset,
        addIngestNode, updateIngestNode, deleteIngestNode
    } = useProject();

    return (
        <div style={{
            height: '100%',
            overflowY: 'auto',
            background: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center' // Center the content
        }}>
            <div style={{
                width: '100%',
                maxWidth: '1000px', // Constrain width
                padding: '40px 20px',
            }}>
                {/* --- HEADER --- */}
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 10px 0', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        XDM Architecture
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        Define your schemas, datasets, and ingestion sources below.
                    </p>
                </div>

                {/* --- TABS --- */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '30px',
                    padding: '4px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    width: 'fit-content',
                    margin: '0 auto 30px auto'
                }}>
                    {Object.values(Tab).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '8px 24px',
                                background: activeTab === tab ? '#334155' : 'transparent',
                                color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab === Tab.SCHEMAS ? <Layers size={16} /> : tab === Tab.DATASETS ? <Database size={16} /> : <Sliders size={16} />}
                            {tab}
                            <span style={{
                                fontSize: '0.75rem',
                                background: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                minWidth: '20px',
                                textAlign: 'center'
                            }}>
                                {tab === Tab.SCHEMAS ? schemas.length : tab === Tab.DATASETS ? datasets.length : ingestNodes.length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* --- CONTENT AREA (Card Based) --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeTab === Tab.SCHEMAS && (
                        <SchemasList
                            schemas={schemas}
                            onDelete={deleteSchema}
                            onUpdate={updateSchema}
                            onAdd={addSchema}
                        />
                    )}
                    {activeTab === Tab.DATASETS && (
                        <DatasetsList
                            datasets={datasets}
                            schemas={schemas}
                            onDelete={deleteDataset}
                            onUpdate={updateDataset}
                            onAdd={addDataset}
                        />
                    )}
                    {activeTab === Tab.INGESTIONS && (
                        <IngestionsList
                            ingestNodes={ingestNodes}
                            datasets={datasets}
                            onDelete={deleteIngestNode}
                            onUpdate={updateIngestNode}
                            onAdd={addIngestNode}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components (Card Lists) ---

// Reusable Card Container
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'border-color 0.2s',
        position: 'relative'
    }} className="hover:border-blue-500/50">
        {children}
    </div>
);

const SchemasList: React.FC<{
    schemas: Schema[],
    onDelete: (id: string) => void,
    onUpdate: (s: Schema) => void,
    onAdd: (s: Schema) => void
}> = ({ schemas, onDelete, onUpdate, onAdd }) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <button onClick={() => onAdd({
                    id: `schema-${Date.now()}`,
                    name: 'New Schema',
                    class: 'XDM ExperienceEvent',
                    isProfileEnabled: false,
                    fields: []
                })} style={addButtonStyle}>
                    <PlusCircle size={16} /> Add Schema
                </button>
            </div>
            {schemas.map(schema => (
                <Card key={schema.id}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Schema Name</label>
                        <input
                            value={schema.name}
                            onChange={e => onUpdate({ ...schema, name: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Class</label>
                        <select
                            value={schema.class}
                            onChange={e => onUpdate({ ...schema, class: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="XDM ExperienceEvent">XDM ExperienceEvent</option>
                            <option value="XDM Individual Profile">XDM Individual Profile</option>
                        </select>
                    </div>
                    <div style={{ width: '150px' }}>
                        <label style={labelStyle}>Profile</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: schema.isProfileEnabled ? '#fbbf24' : 'inherit' }}>
                            <input
                                type="checkbox"
                                checked={schema.isProfileEnabled}
                                onChange={e => onUpdate({ ...schema, isProfileEnabled: e.target.checked })}
                                style={{ accentColor: '#fbbf24', width: '16px', height: '16px' }}
                            />
                            {schema.isProfileEnabled ? 'Enabled' : 'Disabled'}
                        </label>
                    </div>
                    <button onClick={() => onDelete(schema.id)} style={deleteButtonStyle} title="Delete">
                        <Trash2 size={18} />
                    </button>
                </Card>
            ))}
        </>
    );
};

const DatasetsList: React.FC<{
    datasets: Dataset[],
    schemas: Schema[],
    onDelete: (id: string) => void,
    onUpdate: (d: Dataset) => void,
    onAdd: (d: Dataset) => void
}> = ({ datasets, schemas, onDelete, onUpdate, onAdd }) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <button onClick={() => onAdd({
                    id: `dataset-${Date.now()}`,
                    name: 'New Dataset',
                    schemaId: '',
                    created: new Date().toISOString().split('T')[0]
                })} style={addButtonStyle}>
                    <PlusCircle size={16} /> Add Dataset
                </button>
            </div>
            {datasets.map(ds => (
                <Card key={ds.id}>
                    <div style={{ flex: 1.5 }}>
                        <label style={labelStyle}>Dataset Name</label>
                        <input
                            value={ds.name}
                            onChange={e => onUpdate({ ...ds, name: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowRight size={20} color="var(--color-text-secondary)" />
                    </div>
                    <div style={{ flex: 1.5 }}>
                        <label style={labelStyle}>Linked Schema</label>
                        <select
                            value={ds.schemaId}
                            onChange={e => onUpdate({ ...ds, schemaId: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">-- Select Schema --</option>
                            {schemas.map(s => (
                                <option key={s.id} value={s.id}>{s.name} {s.isProfileEnabled ? '(Profile)' : ''}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => onDelete(ds.id)} style={deleteButtonStyle} title="Delete">
                        <Trash2 size={18} />
                    </button>
                </Card>
            ))}
        </>
    );
};

const IngestionsList: React.FC<{
    ingestNodes: IngestNode[],
    datasets: Dataset[],
    onDelete: (id: string) => void,
    onUpdate: (n: IngestNode) => void,
    onAdd: (n: IngestNode) => void
}> = ({ ingestNodes, datasets, onDelete, onUpdate, onAdd }) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <button onClick={() => onAdd({
                    id: `ingest-${Date.now()}`,
                    name: 'New Source',
                    type: 'Datastream',
                    targetDatasetIds: []
                })} style={addButtonStyle}>
                    <PlusCircle size={16} /> Add Ingestion
                </button>
            </div>
            {ingestNodes.map(node => (
                <Card key={node.id}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Source Name</label>
                        <input
                            value={node.name}
                            onChange={e => onUpdate({ ...node, name: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ width: '140px' }}>
                        <label style={labelStyle}>Type</label>
                        <select
                            value={node.type}
                            onChange={e => onUpdate({ ...node, type: e.target.value as 'Datastream' | 'HTTP API' | 'Static' | 'Other' })}
                            style={inputStyle}
                        >
                            <option value="Datastream">Datastream</option>
                            <option value="HTTP API">HTTP API</option>
                            <option value="Static">Static File</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ flex: 1.5 }}>
                        <label style={labelStyle}>Target Datasets</label>
                        {/* Compact Scrollable List Box for Targets */}
                        <div style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            background: '#1e293b',
                            height: '80px', // Fixed height for consistency
                            overflowY: 'auto',
                            padding: '4px'
                        }}>
                            {datasets.length === 0 ? (
                                <div style={{ padding: '4px', opacity: 0.5, fontSize: '0.8rem' }}>No datasets available</div>
                            ) : (
                                datasets.map(ds => (
                                    <label key={ds.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px' }} className="hover:bg-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={node.targetDatasetIds?.includes(ds.id) || false}
                                            onChange={e => {
                                                const current = node.targetDatasetIds || [];
                                                const updated = e.target.checked
                                                    ? [...current, ds.id]
                                                    : current.filter(id => id !== ds.id);
                                                onUpdate({ ...node, targetDatasetIds: updated });
                                            }}
                                            style={{ accentColor: '#a78bfa' }}
                                        />
                                        <span style={{
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            maxWidth: '180px'
                                        }} title={ds.name}>
                                            {ds.name}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <button onClick={() => onDelete(node.id)} style={deleteButtonStyle} title="Delete">
                        <Trash2 size={18} />
                    </button>
                </Card>
            ))}
        </>
    );
};

// --- Styles ---

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '4px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s'
};

const addButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
};

const deleteButtonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s'
};
