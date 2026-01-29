import type { Node, Edge } from 'reactflow';
import { MarkerType } from 'reactflow';
import type { Schema, Dataset, IngestNode } from '../types';
import { getLayoutedElements } from './layout';

export const generateGraph = (
    schemas: Schema[],
    datasets: Dataset[],
    ingestNodes: IngestNode[]
): { nodes: Node[], edges: Edge[] } => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // 1. Ingest Nodes (Roots/Sources)
    ingestNodes.forEach((ds) => {
        initialNodes.push({
            id: ds.id,
            type: 'ingest',
            data: {
                details: ds,
                label: `${ds.name} (${ds.type})`
            },
            position: { x: 0, y: 0 }
        });
    });

    // 2. Datasets (Storage / Hubs)
    datasets.forEach((d) => {
        initialNodes.push({
            id: d.id,
            type: 'dataset',
            data: { details: d },
            position: { x: 0, y: 0 }
        });

        // Edge: Stream -> Dataset (Flows INTO)
        const targetingStreams = ingestNodes.filter(stream =>
            stream.targetDatasetIds?.includes(d.id)
        );

        targetingStreams.forEach(stream => {
            // Determine edge style based on whether this dataset creates a profile
            const targetSchema = schemas.find(s => s.id === d.schemaId);
            const isProfilePath = targetSchema?.isProfileEnabled;

            initialEdges.push({
                id: `e-${stream.id}-${d.id}`,
                source: stream.id,
                target: d.id,
                animated: true,
                style: isProfilePath
                    ? { stroke: '#fbbf24', strokeWidth: 2 } // Gold for Profile
                    : { stroke: 'var(--color-text-secondary)' }, // Grey for Events
                markerEnd: { type: MarkerType.ArrowClosed }
            });
        });

        // Edge: Dataset -> Schema (DEFINED BY)
        if (d.schemaId) {
            initialEdges.push({
                id: `e-${d.id}-${d.schemaId}`,
                source: d.id,
                target: d.schemaId,
                animated: true,
                style: { stroke: '#a78bfa', strokeDasharray: '5,5' },
                label: 'defined by',
                labelStyle: { fill: '#a78bfa', fontSize: 10 }
            });
        }
    });

    // 3. Schemas (Definitions / End of Chain)
    schemas.forEach((s) => {
        initialNodes.push({
            id: s.id,
            type: 'schema',
            data: { details: s },
            position: { x: 0, y: 0 }
        });
    });

    // 4. Unified Profile (Branch from Profile-Enabled Datasets)
    const profileEnabledDatasets = datasets.filter(d => {
        const linkedSchema = schemas.find(s => s.id === d.schemaId);
        return linkedSchema?.isProfileEnabled;
    });

    if (profileEnabledDatasets.length > 0) {
        const profileNode: Node = {
            id: 'unified_profile',
            type: 'profile',
            data: {
                details: {
                    id: 'unified_profile',
                    name: 'Unified Profile',
                    stats: { totalProfiles: 1250000, totalFragments: 5600000 }
                }
            },
            position: { x: 0, y: 0 }
        };
        initialNodes.push(profileNode);

        profileEnabledDatasets.forEach(d => {
            initialEdges.push({
                id: `e-${d.id}-profile`,
                source: d.id,
                target: 'unified_profile',
                animated: true,
                style: { stroke: '#fbbf24', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed }
            });
        });
    }

    return getLayoutedElements(initialNodes, initialEdges);
};
