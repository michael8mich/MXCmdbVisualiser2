import dagre from 'dagre';
import { type Node, type Edge, Position } from 'reactflow';

const nodeWidth = 250;
const nodeHeight = 80;

export type LayoutType = 'tree' | 'circle' | 'star';

export const getLayoutedElements = (nodes: Node[], edges: Edge[], layoutType: LayoutType = 'tree', direction = 'TB') => {
    console.log(`Initializing layout: ${layoutType}`);

    if (layoutType === 'circle') {
        return getCircularLayout(nodes, edges);
    } else if (layoutType === 'star') {
        return getRadialLayout(nodes, edges);
    }

    // Default to Tree (Dagre)
    let dagreGraph;
    try {
        // Robust dagre initialization
        const Graph = dagre.graphlib?.Graph || (dagre as any).Graph;
        if (!Graph) {
            throw new Error('Could not find dagre.graphlib.Graph or dagre.Graph');
        }
        dagreGraph = new Graph();
    } catch (e) {
        console.error('Dagre init failed:', e);
        return { nodes, edges };
    }

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes: layoutedNodes, edges };
};

const getCircularLayout = (nodes: Node[], edges: Edge[]) => {
    const radius = Math.max(150, nodes.length * 20); // Very compact layout
    const angleStep = (2 * Math.PI) / nodes.length;

    const layoutedNodes = nodes.map((node, index) => {
        const angle = index * angleStep;
        node.position = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        };
        node.targetPosition = Position.Left;
        node.sourcePosition = Position.Right;
        return node;
    });

    return { nodes: layoutedNodes, edges };
};

const getRadialLayout = (nodes: Node[], edges: Edge[]) => {
    if (nodes.length === 0) return { nodes, edges };

    const root = nodes[0];
    const others = nodes.slice(1);

    root.position = { x: 0, y: 0 };

    const radius = Math.max(180, others.length * 25); // Very compact layout
    const angleStep = (2 * Math.PI) / others.length;

    others.forEach((node, index) => {
        const angle = index * angleStep;
        node.position = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        };
    });

    const layoutedNodes = [root, ...others];

    return { nodes: layoutedNodes, edges };
};
