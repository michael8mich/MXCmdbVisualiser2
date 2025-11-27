import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    ControlButton,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    type Node,
    type Edge,
    MarkerType,
} from 'reactflow';
import { useSearchParams } from 'react-router-dom';
import { Maximize2, Minimize2 } from 'lucide-react';
import 'reactflow/dist/style.css';

import CustomNode, { assetTypeColorMap, iconMap } from './CustomNode';
import ConnectionDrawer from './ConnectionDrawer';
import AssetDrawer from './AssetDrawer';
import SearchableSelect from './SearchableSelect';
import { getLayoutedElements, type LayoutType } from '../utils/layout';
import rawData from '../data/assets.json';
import { useI18n } from '../i18n/I18nContext';

import CustomEdge from './CustomEdge';

const connectionColorMap: Record<string, string> = {
    'hosts': '#2563eb', // Blue
    'communicates with': '#10b981', // Emerald Green
    'connects to': '#16a34a', // Green
    'is contained by': '#8b5cf6', // Violet
    'provides to': '#f59e0b', // Amber
    'Replicates to': '#06b6d4', // Cyan
    'runs': '#ec4899', // Pink
    'serves': '#6366f1', // Indigo
    'services': '#14b8a6', // Teal
    'Triggers': '#f97316', // Orange
    'Uses': '#a855f7', // Purple
    'unknown': '#94a3b8', // Slate-400
    default: '#9ca3af', // Gray
};

const nodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    customEdge: CustomEdge,
};

const TopologyMap = () => {
    console.log('TopologyMap rendering...');
    const { t, language, setLanguage, dir } = useI18n();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());
    const [layoutType, setLayoutType] = useState<LayoutType>('tree');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedEdge, setSelectedEdge] = useState<{
        parentNode: any;
        childNode: any;
        connectionLabel: string;
    } | null>(null);
    const [assetDrawerOpen, setAssetDrawerOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [legendExpanded, setLegendExpanded] = useState(false);
    const [assetTypesExpanded, setAssetTypesExpanded] = useState(false);

    const selectedSystemId = searchParams.get('system');

    // Pre-calculate child counts for all nodes
    const childCounts = new Map<string, number>();
    rawData.connections.forEach(conn => {
        const current = childCounts.get(conn.source) || 0;
        childCounts.set(conn.source, current + 1);
    });

    // Helper to get direct connections for Databases and Servers
    const getDirectConnections = useCallback((assetId: string) => {
        const visibleNodeIds = new Set<string>([assetId]);
        const visibleEdgeIds = new Set<string>();

        // Get all connections where this asset is either source or target
        rawData.connections.forEach((conn, index) => {
            if (conn.source === assetId || conn.target === assetId) {
                visibleNodeIds.add(conn.source);
                visibleNodeIds.add(conn.target);
                visibleEdgeIds.add(`e${index}`);
            }
        });

        const subNodes = rawData.assets.filter(a => visibleNodeIds.has(a.id));
        const subEdges = rawData.connections
            .map((c, i) => ({ ...c, id: `e${i}` }))
            .filter(c => visibleEdgeIds.has(c.id));

        return { subNodes, subEdges };
    }, []);

    // Helper to get visible elements based on expansion state (shows both incoming and outgoing)
    const getVisibleElements = useCallback((rootId: string, expandedIds: Set<string>) => {
        const visibleNodeIds = new Set<string>([rootId]);
        const visibleEdgeIds = new Set<string>();
        const queue = [rootId];

        while (queue.length > 0) {
            const currentId = queue.shift()!;

            if (currentId === rootId || expandedIds.has(currentId)) {
                rawData.connections.forEach((conn, index) => {
                    // Show outgoing connections (where current is source)
                    if (conn.source === currentId) {
                        if (!visibleNodeIds.has(conn.target)) {
                            visibleNodeIds.add(conn.target);
                            queue.push(conn.target);
                        }
                        visibleEdgeIds.add(`e${index}`);
                    }
                    // Show incoming connections (where current is target)
                    if (conn.target === currentId) {
                        if (!visibleNodeIds.has(conn.source)) {
                            visibleNodeIds.add(conn.source);
                            queue.push(conn.source);
                        }
                        visibleEdgeIds.add(`e${index}`);
                    }
                });
            }
        }

        const subNodes = rawData.assets.filter(a => visibleNodeIds.has(a.id));
        const subEdges = rawData.connections
            .map((c, i) => ({ ...c, id: `e${i}` }))
            .filter(c => visibleEdgeIds.has(c.id));

        return { subNodes, subEdges };
    }, []);

    // Load data based on URL and expansion state
    useEffect(() => {
        let targetNodes: typeof rawData.assets = [];
        let targetEdges: { source: string; target: string; label: string; id: string }[] = [];

        if (!selectedSystemId) {
            targetNodes = [];
            targetEdges = [];
        } else {
            // Determine the asset type
            const selectedAsset = rawData.assets.find(a => a.id === selectedSystemId);
            const assetType = selectedAsset?.type;

            // Use different logic based on asset type
            if (assetType === 'Databases' || assetType === 'Servers') {
                // For Databases and Servers, show only direct connections
                const { subNodes, subEdges } = getDirectConnections(selectedSystemId);
                targetNodes = subNodes;
                targetEdges = subEdges;
            } else {
                // For Systems and other types, use hierarchical expansion
                const { subNodes, subEdges } = getVisibleElements(selectedSystemId, expandedNodeIds);
                targetNodes = subNodes;
                targetEdges = subEdges;
            }
        }

        const initialNodes: Node[] = targetNodes.map((asset) => ({
            id: asset.id,
            type: 'custom',
            data: {
                ...asset,
                label: asset.name,
                childCount: childCounts.get(asset.id) || 0,
                expanded: expandedNodeIds.has(asset.id),
                isSelected: asset.id === selectedSystemId
            },
            position: { x: 0, y: 0 },
        }));

        const initialEdges: Edge[] = targetEdges.map((conn) => {
            const color = connectionColorMap[conn.label] || connectionColorMap.default;
            return {
                id: conn.id,
                source: conn.source,
                target: conn.target,
                label: conn.label,
                type: 'customEdge',
                animated: false,
                style: { stroke: color, strokeWidth: 2, cursor: 'pointer' },
                labelStyle: { fill: color, fontWeight: 700 },
                interactionWidth: 20,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: color,
                },
            };
        });

        try {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                initialNodes,
                initialEdges,
                layoutType
            );
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        } catch (error) {
            console.error('Layout failed:', error);
        }
    }, [selectedSystemId, expandedNodeIds, layoutType, getVisibleElements, getDirectConnections, setNodes, setEdges]);

    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        // Left click - toggle expansion
        setExpandedNodeIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(node.id)) {
                newSet.delete(node.id);
            } else {
                newSet.add(node.id);
            }
            return newSet;
        });
    }, []);

    const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
        event.preventDefault(); // Prevent default context menu

        // Find the asset
        const asset = rawData.assets.find(a => a.id === node.id);
        if (!asset) return;

        // Find incoming connections (where this node is the target)
        const incoming = rawData.connections
            .filter(conn => conn.target === node.id)
            .map(conn => {
                const sourceAsset = rawData.assets.find(a => a.id === conn.source);
                return {
                    id: conn.source,
                    name: sourceAsset?.name || 'Unknown',
                    type: sourceAsset?.type || 'Unknown',
                    label: conn.label,
                };
            });

        // Find outgoing connections (where this node is the source)
        const outgoing = rawData.connections
            .filter(conn => conn.source === node.id)
            .map(conn => {
                const targetAsset = rawData.assets.find(a => a.id === conn.target);
                return {
                    id: conn.target,
                    name: targetAsset?.name || 'Unknown',
                    type: targetAsset?.type || 'Unknown',
                    label: conn.label,
                };
            });

        setSelectedAsset({
            asset,
            incomingConnections: incoming,
            outgoingConnections: outgoing,
        });
        setAssetDrawerOpen(true);
    }, []);

    const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
        // Find parent and child nodes
        const parentNode = rawData.assets.find(a => a.id === edge.source);
        const childNode = rawData.assets.find(a => a.id === edge.target);

        if (parentNode && childNode) {
            setSelectedEdge({
                parentNode,
                childNode,
                connectionLabel: edge.label as string || 'Unknown',
            });
            setDrawerOpen(true);
        }
    }, []);

    const systems = rawData.assets.filter(a => a.type === 'System');
    const databases = rawData.assets.filter(a => a.type === 'Databases');
    const servers = rawData.assets.filter(a => a.type === 'Servers');

    const expandAll = () => {
        if (!selectedSystemId) return;

        const allNodeIds = new Set<string>();
        const queue = [selectedSystemId];
        const visited = new Set<string>([selectedSystemId]);

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            allNodeIds.add(currentId);

            rawData.connections.forEach(conn => {
                if (conn.source === currentId && !visited.has(conn.target)) {
                    visited.add(conn.target);
                    queue.push(conn.target);
                }
            });
        }
        setExpandedNodeIds(allNodeIds);
    };

    const collapseAll = () => {
        setExpandedNodeIds(new Set());
    };

    const goBack = () => {
        setSearchParams({});
        setExpandedNodeIds(new Set());
    };

    return (
        <div className="topology-container" style={{ width: '100vw', height: '100vh', direction: dir }}>
            <div style={{
                position: 'absolute',
                top: 20,
                [dir === 'rtl' ? 'right' : 'left']: 20,
                zIndex: 10,
                display: 'flex',
                gap: '10px',
                flexDirection: dir === 'rtl' ? 'row-reverse' : 'row'
            }}>
                {selectedSystemId && (
                    <button
                        onClick={goBack}
                        style={{
                            padding: '8px 16px',
                            background: 'white',
                            border: '1px solid #ccc',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {dir === 'rtl' ? 'חזור ←' : '← ' + t('back')}
                    </button>
                )}


                <SearchableSelect
                    systems={systems}
                    databases={databases}
                    servers={servers}
                    selectedId={selectedSystemId}
                    onSelect={(id) => {
                        setSearchParams({ system: id });
                        setExpandedNodeIds(new Set([id]));
                    }}
                />

                {/* Layout Selector */}
                {selectedSystemId && (
                    <select
                        value={layoutType}
                        onChange={(e) => setLayoutType(e.target.value as LayoutType)}
                        style={{
                            padding: '8px',
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            minWidth: '120px'
                        }}
                    >
                        <option value="tree">{t('treeLayout')}</option>
                        <option value="circle">{t('circleLayout')}</option>
                        <option value="star">{t('starLayout')}</option>
                    </select>
                )}

                {/* Language Selector */}
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'he')}
                    style={{
                        padding: '8px',
                        borderRadius: 4,
                        border: '1px solid #ccc',
                        minWidth: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <option value="en">English</option>
                    <option value="he">עברית</option>
                </select>
            </div>

            {/* Right Side Controls Container */}
            <div style={{
                position: 'absolute',
                bottom: 20,
                [dir === 'rtl' ? 'left' : 'right']: 20,
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: dir === 'rtl' ? 'flex-start' : 'flex-end'
            }}>
                {/* Combined Legend Panel */}
                <div style={{
                    background: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    maxWidth: '280px',
                    maxHeight: '500px',
                    overflowY: 'auto'
                }}>
                    {/* Asset Types Section */}
                    <div style={{ marginBottom: '16px' }}>
                        <h4
                            onClick={() => setAssetTypesExpanded(!assetTypesExpanded)}
                            style={{
                                margin: '0 0 8px 0',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                userSelect: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
                                color: '#1f2937'
                            }}
                        >
                            <span>{assetTypesExpanded ? '▼' : '▶'}</span>
                            <span>Asset Types</span>
                        </h4>
                        {assetTypesExpanded && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '4px' }}>
                                {Object.entries(assetTypeColorMap)
                                    .filter(([key]) => key !== 'default' && !['Server', 'Switch', 'Router', 'Firewall', 'Database', 'Load Balancer', 'Workstation'].includes(key))
                                    .map(([label, color]) => {
                                        const Icon = iconMap[label] || iconMap.default;
                                        return (
                                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                                                <div style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: color,
                                                    flexShrink: 0
                                                }}>
                                                    <Icon size={16} />
                                                </div>
                                                <span style={{ color: '#374151' }}>{label}</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{
                        height: '1px',
                        background: '#e5e7eb',
                        margin: '12px 0'
                    }}></div>

                    {/* Connection Types Section */}
                    <div>
                        <h4
                            onClick={() => setLegendExpanded(!legendExpanded)}
                            style={{
                                margin: '0 0 8px 0',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                userSelect: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
                                color: '#1f2937'
                            }}
                        >
                            <span>{legendExpanded ? '▼' : '▶'}</span>
                            <span>{t('connectionTypes')}</span>
                        </h4>
                        {legendExpanded && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '4px' }}>
                                {Object.entries(connectionColorMap).filter(([key]) => key !== 'default').map(([label, color]) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                                        <div style={{
                                            width: '20px',
                                            height: '3px',
                                            background: color,
                                            borderRadius: '2px',
                                            flexShrink: 0
                                        }}></div>
                                        <span style={{ color: '#374151' }}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeClick={onEdgeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#e5e7eb" gap={16} />
                <Controls
                    position={dir === 'rtl' ? 'bottom-right' : 'bottom-left'}
                    style={{
                        marginBottom: '20px',
                        [dir === 'rtl' ? 'marginRight' : 'marginLeft']: '20px'
                    }}
                >
                    {selectedSystemId && (
                        <>
                            <ControlButton onClick={expandAll} title={t('expandAll')}>
                                <Maximize2 size={12} />
                            </ControlButton>
                            <ControlButton onClick={collapseAll} title={t('collapseAll')}>
                                <Minimize2 size={12} />
                            </ControlButton>
                        </>
                    )}
                </Controls>
            </ReactFlow>

            {/* Connection Details Drawer */}
            <ConnectionDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                parentNode={selectedEdge?.parentNode || null}
                childNode={selectedEdge?.childNode || null}
                connectionLabel={selectedEdge?.connectionLabel || ''}
            />

            {/* Asset Details Drawer */}
            <AssetDrawer
                isOpen={assetDrawerOpen}
                onClose={() => setAssetDrawerOpen(false)}
                asset={selectedAsset?.asset || null}
                incomingConnections={selectedAsset?.incomingConnections || []}
                outgoingConnections={selectedAsset?.outgoingConnections || []}
            />
        </div>
    );
};

export default TopologyMap;
