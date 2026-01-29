import type { Schema, Dataset, IngestNode } from '../types';

export const generateMermaid = (
    schemas: Schema[],
    datasets: Dataset[],
    ingestNodes: IngestNode[]
): string => {
    let mermaid = 'graph LR;\n';

    // Nodes
    ingestNodes.forEach(node => {
        mermaid += `  ${node.id}["${node.name} (${node.type})"]:::ingest;\n`;
    });

    datasets.forEach(ds => {
        mermaid += `  ${ds.id}[("${ds.name}")]:::dataset;\n`;
    });

    schemas.forEach(s => {
        mermaid += `  ${s.id}(["${s.name}"])` + (s.isProfileEnabled ? ':::profileSchema' : ':::schema') + ';\n';
    });

    const profileEnabled = schemas.some(s => s.isProfileEnabled);
    if (profileEnabled) {
        mermaid += `  unified_profile(("Unified Profile")):::profile;\n`;
    }

    // Styles
    mermaid += `
  classDef ingest fill:#e0e7ff,stroke:#6366f1,stroke-width:2px;
  classDef dataset fill:#dcfce7,stroke:#22c55e,stroke-width:2px;
  classDef schema fill:#f3e8ff,stroke:#a855f7,stroke-width:2px;
  classDef profileSchema fill:#fef3c7,stroke:#eab308,stroke-width:2px;
  classDef profile fill:#fef3c7,stroke:#f59e0b,stroke-width:4px;
  `;

    // Edges
    ingestNodes.forEach(node => {
        node.targetDatasetIds?.forEach(dsId => {
            mermaid += `  ${node.id} --> ${dsId};\n`;
        });
    });

    datasets.forEach(ds => {
        if (ds.schemaId) {
            mermaid += `  ${ds.id} -.-> ${ds.schemaId};\n`;

            const schema = schemas.find(s => s.id === ds.schemaId);
            if (schema?.isProfileEnabled) {
                mermaid += `  ${ds.id} ==> unified_profile;\n`;
            }
        }
    });

    return mermaid;
};

export const generateDOT = (
    schemas: Schema[],
    datasets: Dataset[],
    ingestNodes: IngestNode[]
): string => {
    let dot = 'digraph AEP_Architecture {\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [fontname="Arial", shape=box, style=filled];\n';

    // Nodes
    ingestNodes.forEach(node => {
        dot += `  "${node.id}" [label="${node.name}\\n(${node.type})", fillcolor="#e0e7ff", color="#6366f1", shape=hexagon];\n`;
    });

    datasets.forEach(ds => {
        dot += `  "${ds.id}" [label="${ds.name}", fillcolor="#dcfce7", color="#22c55e", shape=cylinder];\n`;
    });

    schemas.forEach(s => {
        const color = s.isProfileEnabled ? "#fef3c7" : "#f3e8ff";
        const border = s.isProfileEnabled ? "#eab308" : "#a855f7";
        dot += `  "${s.id}" [label="${s.name}", fillcolor="${color}", color="${border}", shape=ellipse];\n`;
    });

    const profileEnabled = schemas.some(s => s.isProfileEnabled);
    if (profileEnabled) {
        dot += `  "unified_profile" [label="Unified Profile", fillcolor="#fef3c7", color="#f59e0b", shape=doublecircle, style="filled,bold"];\n`;
    }

    // Edges
    ingestNodes.forEach(node => {
        node.targetDatasetIds?.forEach(dsId => {
            dot += `  "${node.id}" -> "${dsId}";\n`;
        });
    });

    datasets.forEach(ds => {
        if (ds.schemaId) {
            dot += `  "${ds.id}" -> "${ds.schemaId}" [style=dashed, label="defined by"];\n`;

            const schema = schemas.find(s => s.id === ds.schemaId);
            if (schema?.isProfileEnabled) {
                dot += `  "${ds.id}" -> "unified_profile" [color="#f59e0b", penwidth=2];\n`;
            }
        }
    });

    dot += '}';
    return dot;
};
