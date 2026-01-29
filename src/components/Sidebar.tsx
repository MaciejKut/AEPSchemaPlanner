import React from 'react';
import type { Schema, Dataset } from '../types';
import { X, Database, FileJson, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    selectedItem: Schema | Dataset | null;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedItem, onClose }) => {
    return (
        <AnimatePresence>
            {selectedItem && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '350px',
                        maxWidth: '90vw', /* Responsive fix */
                        backgroundColor: 'var(--color-surface)',
                        borderLeft: '1px solid var(--color-border)',
                        padding: '20px',
                        zIndex: 60, /* Higher than toolbar (50) */
                        boxShadow: 'var(--shadow-lg)',
                        overflowY: 'auto'
                    }}
                    className="sidebar"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {(selectedItem as Schema).class ? <FileJson size={20} className="text-blue-400" /> : <Database size={20} className="text-green-400" />}
                            Details
                        </h2>
                        <button onClick={onClose} style={{ padding: '4px 8px', background: 'transparent', border: 'none' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ paddingBottom: '40px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>ID</label>
                            <div style={{
                                fontFamily: 'monospace',
                                background: 'rgba(0,0,0,0.2)',
                                padding: '6px',
                                borderRadius: '4px',
                                wordBreak: 'break-all',
                                fontSize: '0.85rem'
                            }}>
                                {selectedItem.id}
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Name</label>
                            <div style={{ fontWeight: 600 }}>{selectedItem.name}</div>
                        </div>

                        {(selectedItem as Schema).fields && (
                            <>
                                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {(selectedItem as Schema).isProfileEnabled ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4ade80', fontSize: '0.9rem' }}>
                                            <CheckCircle size={14} /> Profile Enabled
                                        </span>
                                    ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            <AlertCircle size={14} /> Profile Disabled
                                        </span>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1rem', marginTop: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Fields</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {(selectedItem as Schema).fields.map((field) => (
                                        <li key={field.path} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: 500 }}>{field.name}</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{field.type}</span>
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-secondary)',
                                                fontFamily: 'monospace',
                                                wordBreak: 'break-all'
                                            }}>
                                                {field.path}
                                            </div>
                                            {field.isIdentity && (
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    background: 'rgba(59, 130, 246, 0.2)',
                                                    color: '#60a5fa',
                                                    padding: '2px 6px',
                                                    borderRadius: '10px',
                                                    marginTop: '4px',
                                                    display: 'inline-block'
                                                }}>
                                                    Identity
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {(selectedItem as Dataset).schemaId && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Linked Schema</label>
                                <div style={{
                                    fontFamily: 'monospace',
                                    wordBreak: 'break-all'
                                }}>{(selectedItem as Dataset).schemaId}</div>
                            </div>
                        )}

                        {(selectedItem as Dataset).created && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Created At</label>
                                <div>{(selectedItem as Dataset).created}</div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
