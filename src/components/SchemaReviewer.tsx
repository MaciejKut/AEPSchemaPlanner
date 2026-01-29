import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Check, AlertCircle, Key, List, FileJson } from 'lucide-react';
import type { Field } from '../types';

export const SchemaReviewer: React.FC = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [rootNode, setRootNode] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const allFields: Field[] = [];

            // --- 1. EXTRACTION LOGIC (Keep finding Leaf Nodes) ---

            // Helper to process properties recursively
            const processProperties = (properties: any, prefix = '') => {
                if (!properties) return;
                Object.keys(properties).forEach(key => {
                    const prop = properties[key];
                    const currentPath = prefix ? `${prefix}.${key}` : key;

                    if (prop.type === 'object' && prop.properties) {
                        processProperties(prop.properties, currentPath);
                    } else {
                        // It's a leaf field (or array)
                        allFields.push({
                            name: prop.title || key,
                            type: prop.type,
                            path: currentPath,
                            isRequired: false, // Will calculate later if possible
                            // Preserve original prop for metadata extraction
                            original: prop
                        } as any);
                    }
                });
            };

            if (Array.isArray(parsed)) {
                // Find descriptors for identities
                const descriptors = parsed.filter(p => p['meta:resourceType'] === 'descriptors');

                parsed.forEach(mixin => {
                    // Check for definition structure
                    if (mixin.definitions && mixin.definitions.customFields) {
                        const customFields = mixin.definitions.customFields.properties;
                        Object.entries(customFields).forEach(([tenantKey, tenantObj]: [string, any]) => {
                            if (tenantObj.properties) {
                                // We want the path to start with the tenant ID
                                processProperties(tenantObj.properties, tenantKey);
                            }
                        });
                    }
                });

                // Add identity info
                descriptors.forEach(desc => {
                    if (desc['@type'] === 'xdm:descriptorIdentity') {
                        allFields.forEach((f: any) => {
                            if (desc['xdm:sourceProperty'] && desc['xdm:sourceProperty'].endsWith(f.path)) { // Use path matching for accuracy
                                f.isIdentity = true;
                            }
                        });
                    }
                });

            } else if (parsed.properties) {
                processProperties(parsed.properties);
            }

            // --- 2. RECONSTRUCTION LOGIC (Build Tree from Paths) ---

            const newRoot = { title: 'Schema Root', type: 'object', properties: {} };

            allFields.forEach((field: any) => {
                const parts = field.path.split('.');
                let currentLevel = newRoot.properties;

                parts.forEach((part: string, index: number) => {
                    const isLast = index === parts.length - 1;

                    if (!currentLevel[part]) {
                        currentLevel[part] = {
                            title: part, // Default title to key
                            type: 'object',
                            properties: {}
                        };
                    }

                    if (isLast) {
                        // Merge leaf data
                        currentLevel[part] = {
                            ...currentLevel[part],
                            ...field.original, // properties like enum, type, title
                            type: field.type,
                            title: field.name,
                            'xdm:identity': field.isIdentity
                        };
                        // Cleanup internal props if needed
                        delete currentLevel[part].original;
                    }

                    // Move down
                    if (!isLast) {
                        // Ensure properties exists if we created it as a placeholder
                        if (!currentLevel[part].properties) {
                            currentLevel[part].properties = {};
                        }
                        currentLevel = currentLevel[part].properties;
                    }
                });
            });

            setRootNode(newRoot);
            setError(null);
        } catch (e) {
            console.error(e);
            setError('Invalid JSON or Schema format');
            setRootNode(null);
        }
    };

    return (
        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>Schema Reviewer</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Paste your XDM Schema JSON to analyze structure, requirements, and identities.</p>
            </div>

            <div style={{ display: 'flex', flex: 1, gap: '20px', overflow: 'hidden' }}>
                {/* Input Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>JSON Input</span>
                        <button
                            onClick={handleAnalyze}
                            style={{
                                background: '#3b82f6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600
                            }}
                        >
                            Analyze
                        </button>
                    </div>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste Schema JSON here..."
                        style={{
                            flex: 1,
                            background: '#0f172a',
                            color: '#e2e8f0',
                            border: error ? '1px solid #ef4444' : '1px solid #334155',
                            borderRadius: '8px',
                            padding: '16px',
                            fontFamily: 'monospace',
                            resize: 'none',
                            outline: 'none'
                        }}
                    />
                    {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} /> {error}</div>}
                </div>

                {/* Tree View Area */}
                <div style={{ flex: 2, background: '#1e293b', borderRadius: '8px', padding: '20px', overflowY: 'auto', border: '1px solid #334155' }}>
                    {rootNode ? (
                        <SchemaNode
                            name={rootNode.title || "Root"}
                            node={rootNode}
                            isRequired={true}
                            isRoot={true}
                        />
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column', gap: '10px' }}>
                            <FileJson size={48} opacity={0.5} />
                            <span>Waiting for Schema...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface SchemaNodeProps {
    name: string;
    node: any;
    isRequired: boolean;
    isRoot?: boolean;
}

const SchemaNode: React.FC<SchemaNodeProps> = ({ name, node, isRequired, isRoot = false }) => {
    const [isExpanded, setIsExpanded] = useState(isRoot); // Auto-expand root

    // Determine Type
    const type = node.type || (node.properties ? 'object' : 'unknown');
    const isObject = type === 'object' && node.properties;
    const isArray = type === 'array' && node.items;

    // Metadata Checks
    const enums = node.enum || (node['meta:enum'] ? Object.keys(node['meta:enum'] as Record<string, string>) : null);
    const isIdentity = node['xdm:identity'] || name === '_id' || name === 'identityMap';

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    // Calculate Children
    const childrenRequest = useMemo(() => {
        if (isObject) {
            return Object.entries(node.properties).map(([key, value]: [string, any]) => ({
                key,
                value,
                required: node.required?.includes(key)
            }));
        }
        if (isArray) {
            // Arrays often have 'items' which is a single schema object for all items
            return [{ key: '[ ]', value: node.items, required: false }];
        }
        return [];
    }, [node, isObject, isArray]);

    return (
        <div style={{ marginLeft: isRoot ? 0 : '14px', marginBottom: '2px' }}>
            {/* Node Row */}
            <div
                onClick={toggle}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: (isObject || isArray) ? 'pointer' : 'default',
                    background: isExpanded && !isRoot ? 'rgba(255,255,255,0.03)' : 'transparent',
                    userSelect: 'none'
                }}
                className="hover:bg-gray-800"
            >
                {/* Expander Icon */}
                <span style={{ width: '16px', display: 'flex', alignItems: 'center' }}>
                    {(isObject || isArray) && (
                        isExpanded ? <ChevronDown size={14} color="#94a3b8" /> : <ChevronRight size={14} color="#94a3b8" />
                    )}
                </span>

                {/* Name */}
                <span style={{
                    fontWeight: isRoot ? 700 : 500,
                    color: isRoot ? '#f8fafc' : (isObject ? '#93c5fd' : '#cbd5e1'), // Slight color diff for objects
                    fontSize: isRoot ? '1rem' : '0.9rem'
                }}>
                    {name}
                </span>

                {/* Type Label (faint) */}
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '4px' }}>
                    {type}
                </span>

                {/* Badges */}
                <div style={{ display: 'flex', gap: '6px', marginLeft: '10px' }}>
                    {isRequired && (
                        <span title="Required Field" style={badgeStyle('#ef4444', '#fee2e2')}>
                            <Check size={10} strokeWidth={4} /> Required
                        </span>
                    )}

                    {enums && (
                        <span title={`Enum: ${enums.join(', ')}`} style={badgeStyle('#3b82f6', '#dbeafe')}>
                            <List size={10} strokeWidth={3} /> Enum ({enums.length})
                        </span>
                    )}

                    {isIdentity && (
                        <span title="Identity Field" style={badgeStyle('#eab308', '#fef9c3')}>
                            <Key size={10} strokeWidth={3} /> Identity
                        </span>
                    )}
                </div>
            </div>

            {/* Children Recursive */}
            {isExpanded && childrenRequest.length > 0 && (
                <div style={{ borderLeft: '1px solid #334155', marginLeft: '7px', paddingLeft: '2px' }}>
                    {childrenRequest.map((child, idx) => (
                        <SchemaNode
                            key={idx}
                            name={child.key}
                            node={child.value}
                            isRequired={!!child.required}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const badgeStyle = (color: string, bg: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: color,
    background: bg,
    padding: '1px 6px',
    borderRadius: '10px',
    textTransform: 'uppercase'
});
