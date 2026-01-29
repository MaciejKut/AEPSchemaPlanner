import dagre from 'dagre';
import { type Node, type Edge } from 'reactflow';

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 }); // Top to Bottom

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 220, height: 150 }); // Estimate node size
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        // Ensure nodeWithPosition exists to avoid crash on empty graph
        if (nodeWithPosition) {
            node.position = {
                x: nodeWithPosition.x - 220 / 2,
                y: nodeWithPosition.y - 150 / 2,
            };
        }
        return node;
    });

    return { nodes: layoutedNodes, edges };
};
