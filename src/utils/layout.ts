import dagre from 'dagre';
import { type Node, type Edge, Position } from 'reactflow';

const nodeWidth = 250;
const nodeHeight = 80;

export type LayoutType = 'tree' | 'circle' | 'star' | 'grid' | 'concentric' | 'horizontal-tree';

export const getLayoutedElements = (nodes: Node[], edges: Edge[], layoutType: LayoutType = 'tree', direction = 'TB') => {
    console.log(`Initializing layout: ${layoutType}`);

    if (layoutType === 'circle') {
        return getCircularLayout(nodes, edges);
    } else if (layoutType === 'star') {
        return getRadialLayout(nodes, edges);
    } else if (layoutType === 'grid') {
        return getGridLayout(nodes, edges);
    } else if (layoutType === 'concentric') {
        return getConcentricLayout(nodes, edges);
    } else if (layoutType === 'horizontal-tree') {
        // Recursive call with LR direction, but we need to avoid infinite recursion if we just passed 'horizontal-tree' again.
        // Instead, we use the dagre logic below with 'LR'.
        direction = 'LR';
    }

    // Default to Tree (Dagre) - Vertical or Horizontal
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

const getGridLayout = (nodes: Node[], edges: Edge[]) => {
    const count = nodes.length;
    const cols = Math.ceil(Math.sqrt(count));
    const spacingX = 300;
    const spacingY = 150;

    const layoutedNodes = nodes.map((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        node.position = {
            x: col * spacingX,
            y: row * spacingY,
        };
        node.targetPosition = Position.Top;
        node.sourcePosition = Position.Bottom;
        return node;
    });

    return { nodes: layoutedNodes, edges };
};

const getConcentricLayout = (nodes: Node[], edges: Edge[]) => {
    if (nodes.length === 0) return { nodes, edges };

    // Group nodes by some criteria, e.g., type, or just layers
    let layer = 0;
    let radius = 0;
    let angleStep = 0;
    let nodesInLayer = 1;
    let currentInLayer = 0;

    const finalNodes: Node[] = [];

    // Sort nodes so root/system is first (usually is)
    // Assuming nodes[0] is root

    nodes.forEach((node, index) => {
        if (index === 0) {
            node.position = { x: 0, y: 0 };
            finalNodes.push(node);
            layer = 1;
            radius = 300;
            nodesInLayer = 6;
            angleStep = (2 * Math.PI) / nodesInLayer;
            return;
        }

        const angle = currentInLayer * angleStep;
        node.position = {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        };

        currentInLayer++;
        if (currentInLayer >= nodesInLayer) {
            layer++;
            radius += 250;
            nodesInLayer = Math.floor(2 * Math.PI * radius / 150); // Approximate circumference / node width
            currentInLayer = 0;
            angleStep = (2 * Math.PI) / nodesInLayer;
        }

        node.targetPosition = Position.Left;
        node.sourcePosition = Position.Right;
        finalNodes.push(node);
    });

    return { nodes: finalNodes, edges };
};
