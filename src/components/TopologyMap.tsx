import { useCallback, useEffect, useState, useRef } from 'react';
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
    BackgroundVariant,
    type Connection,

} from 'reactflow';
import { useSearchParams } from 'react-router-dom';
import { Maximize2, Minimize2 } from 'lucide-react';
import 'reactflow/dist/style.css';

import CustomNode, { assetTypeColorMap, iconMap } from './CustomNode';
import ConnectionDrawer from './ConnectionDrawer';
import AssetDrawer from './AssetDrawer';
import SearchableSelect from './SearchableSelect';
import AssetSelectionModal from './AssetSelectionModal';
import { getLayoutedElements, type LayoutType } from '../utils/layout';
import rawData from '../data/assets.json';
import { useI18n } from '../i18n/I18nContext';
import { useTheme } from '../contexts/ThemeContext';

import CustomEdge from './CustomEdge';

export const connectionColorMap: Record<string, string> = {
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
    const { theme } = useTheme();
    const [localData, setLocalData] = useState(rawData);
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
    const [rfInstance, setRfInstance] = useState<any>(null);
    const [addConnectionModalOpen, setAddConnectionModalOpen] = useState(false);
    const [addConnectionDirection, setAddConnectionDirection] = useState<'incoming' | 'outgoing'>('outgoing');
    const centeredSystemIdRef = useRef<string | null>(null);
    const lastClickedNodeRef = useRef<{ id: string; x: number; y: number } | null>(null);

    // Fit view when drawer closes to ensure map is visible
    useEffect(() => {
        if (!drawerOpen && !assetDrawerOpen && rfInstance) {
            // Wait for drawer animation to complete (usually 300-400ms)
            setTimeout(() => {
                console.log('Fitting view after drawer close...');
                rfInstance.fitView({ padding: 0.2, duration: 800 });
            }, 500);
        }
    }, [drawerOpen, assetDrawerOpen, rfInstance]);

    const selectedSystemId = searchParams.get('system');

    // Center selected node on load/change
    useEffect(() => {
        if (rfInstance && selectedSystemId && nodes.length > 0) {
            // Only center if we haven't centered this system yet
            if (centeredSystemIdRef.current !== selectedSystemId) {
                const selectedNode = nodes.find(n => n.id === selectedSystemId);
                if (selectedNode) {
                    // Wait for layout to stabilize
                    setTimeout(() => {
                        // Calculate center (approximate node center)
                        const nodeWidth = 220;
                        const nodeHeight = 60;
                        const x = selectedNode.position.x + nodeWidth / 2;
                        const y = selectedNode.position.y + nodeHeight / 2;

                        rfInstance.setCenter(x, y, { zoom: 1.0, duration: 800 });
                        centeredSystemIdRef.current = selectedSystemId;
                    }, 100);
                }
            }
        }
    }, [rfInstance, selectedSystemId, nodes]);

    // Pre-calculate child counts for all nodes
    const childCounts = new Map<string, number>();
    localData.connections.forEach(conn => {
        const current = childCounts.get(conn.source) || 0;
        childCounts.set(conn.source, current + 1);
    });

    // Helper to get direct connections for Databases and Servers
    const getDirectConnections = useCallback((assetId: string) => {
        const visibleNodeIds = new Set<string>([assetId]);
        const visibleEdgeIds = new Set<string>();

        // Get all connections where this asset is either source or target
        localData.connections.forEach((conn, index) => {
            if (conn.source === assetId || conn.target === assetId) {
                visibleNodeIds.add(conn.source);
                visibleNodeIds.add(conn.target);
                visibleEdgeIds.add(`e${index}`);
            }
        });

        const subNodes = localData.assets.filter(a => visibleNodeIds.has(a.id));
        const subEdges = localData.connections
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
                localData.connections.forEach((conn, index) => {
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

        const subNodes = localData.assets.filter(a => visibleNodeIds.has(a.id));
        const subEdges = localData.connections
            .map((c, i) => ({ ...c, id: `e${i}` }))
            .filter(c => visibleEdgeIds.has(c.id));

        return { subNodes, subEdges };
    }, []);

    // Load data based on URL and expansion state
    useEffect(() => {
        let targetNodes: typeof localData.assets = [];
        let targetEdges: { source: string; target: string; label: string; id: string }[] = [];

        if (!selectedSystemId) {
            targetNodes = [];
            targetEdges = [];
        } else {
            // Determine the asset type
            const selectedAsset = localData.assets.find(a => a.id === selectedSystemId);
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

        const initialNodes: Node[] = targetNodes.map((asset, index) => ({
            id: asset.id,
            type: 'custom',
            data: {
                ...asset,
                label: asset.name,
                childCount: childCounts.get(asset.id) || 0,
                expanded: expandedNodeIds.has(asset.id),
                isSelected: asset.id === selectedSystemId,
                animationDelay: `${index * 0.05}s`, // Staggered delay for nodes
            },
            position: { x: 0, y: 0 },
        }));

        const initialEdges: Edge[] = targetEdges.map((conn, index) => {
            const color = connectionColorMap[conn.label] || connectionColorMap.default;
            return {
                id: conn.id,
                source: conn.source,
                target: conn.target,
                label: conn.label,
                type: 'customEdge',
                animated: false,
                data: {
                    animationDelay: `${(targetNodes.length * 0.05) + (index * 0.02)}s`, // Edges appear after nodes
                },
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

            // Check if we need to restore a node's position
            if (lastClickedNodeRef.current && rfInstance) {
                const anchor = lastClickedNodeRef.current;
                const newNode = layoutedNodes.find(n => n.id === anchor.id);

                if (newNode) {
                    const currentViewport = rfInstance.getViewport();
                    const zoom = currentViewport.zoom;

                    // Calculate the difference in node position
                    const deltaX = newNode.position.x - anchor.x;
                    const deltaY = newNode.position.y - anchor.y;

                    // We need to shift the viewport by the opposite amount to keep the node stationary on screen
                    const newViewportX = currentViewport.x - (deltaX * zoom);
                    const newViewportY = currentViewport.y - (deltaY * zoom);

                    rfInstance.setViewport({ x: newViewportX, y: newViewportY, zoom: zoom });
                }
                // Reset the ref so we don't keep adjusting
                lastClickedNodeRef.current = null;
            }

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        } catch (error) {
            console.error('Layout failed:', error);
        }
    }, [selectedSystemId, expandedNodeIds, layoutType, getVisibleElements, getDirectConnections, setNodes, setEdges, rfInstance, localData]);

    const onConnect = useCallback((params: Connection) => {
        if (!params.source || !params.target) return;

        // Prevent self-connections
        if (params.source === params.target) return;

        // Add to localData
        setLocalData(prev => {
            // Check if connection already exists
            const exists = prev.connections.some(c =>
                (c.source === params.source && c.target === params.target)
            );

            if (exists) return prev;

            const newId = prev.connections.length > 0
                ? Math.max(...prev.connections.map(c => typeof c.id === 'string' ? parseInt(c.id) : c.id)) + 1
                : 1;

            const newConnection = {
                id: newId,
                source: params.source!,
                target: params.target!,
                label: 'connects to', // Default label
            };

            return {
                ...prev,
                connections: [...prev.connections, newConnection]
            };
        });
    }, []);

    const removeConnection = useCallback(() => {
        if (!selectedEdge) return;

        setLocalData(prev => ({
            ...prev,
            connections: prev.connections.filter(c =>
                !(c.source === selectedEdge.parentNode.id && c.target === selectedEdge.childNode.id)
            )
        }));

        setDrawerOpen(false);
        setSelectedEdge(null);
    }, [selectedEdge]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        // Store the clicked node's ID and current position before expansion triggers a re-layout
        lastClickedNodeRef.current = {
            id: node.id,
            x: node.position.x,
            y: node.position.y
        };

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

    const getAssetData = useCallback((assetId: string, currentData: typeof localData) => {
        const asset = currentData.assets.find(a => a.id === assetId);
        if (!asset) return null;

        const incoming = currentData.connections
            .filter(conn => conn.target === assetId)
            .map(conn => {
                const sourceAsset = currentData.assets.find(a => a.id === conn.source);
                return {
                    id: conn.source,
                    name: sourceAsset?.name || 'Unknown',
                    type: sourceAsset?.type || 'Unknown',
                    label: conn.label,
                    connectionId: conn.id // Add connection ID for reference if needed
                };
            });

        const outgoing = currentData.connections
            .filter(conn => conn.source === assetId)
            .map(conn => {
                const targetAsset = currentData.assets.find(a => a.id === conn.target);
                return {
                    id: conn.target,
                    name: targetAsset?.name || 'Unknown',
                    type: targetAsset?.type || 'Unknown',
                    label: conn.label,
                    connectionId: conn.id
                };
            });

        return { asset, incomingConnections: incoming, outgoingConnections: outgoing };
    }, []);

    const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        const assetData = getAssetData(node.id, localData);
        if (assetData) {
            setSelectedAsset(assetData);
            setAssetDrawerOpen(true);
        }
    }, [localData, getAssetData]);

    const handleDeleteConnectionFromDrawer = useCallback((connectedAssetId: string, direction: 'incoming' | 'outgoing') => {
        if (!selectedAsset?.asset) return;

        setLocalData(prev => {
            const currentAssetId = selectedAsset.asset.id;
            const newConnections = prev.connections.filter(c => {
                if (direction === 'outgoing') {
                    // Remove connection where source is current asset AND target is connected asset
                    return !(c.source === currentAssetId && c.target === connectedAssetId);
                } else {
                    // Remove connection where target is current asset AND source is connected asset
                    return !(c.target === currentAssetId && c.source === connectedAssetId);
                }
            });

            const newData = { ...prev, connections: newConnections };

            // Update selectedAsset immediate to reflect changes in UI
            // We need to do this here because selectedAsset is state, not derived
            // Use setTimeout to allow state update to propagate if needed, 
            // but actually we can just re-calculate based on new connections
            // However, we are inside setLocalData updater, so we have the new data "in hand"

            // Schedule the update of selectedAsset to run after this render cycle completes
            // or simply update it using the new data calculated

            return newData;
        });

        // We need to trigger a refresh of selectedAsset. 
        // Since setLocalData is async, we can't trust localData immediately.
        // But we can reproduce the filter logic.

        // Actually, let's just use effect or simply update selectedAsset with the known change.
        // Simpler: Just re-run getAssetData with the hypothetical new data, OR just filter the list in selectedAsset

        setSelectedAsset((prev: any) => {
            if (!prev) return null;
            if (direction === 'outgoing') {
                return {
                    ...prev,
                    outgoingConnections: prev.outgoingConnections.filter((c: any) => c.id !== connectedAssetId)
                };
            } else {
                return {
                    ...prev,
                    incomingConnections: prev.incomingConnections.filter((c: any) => c.id !== connectedAssetId)
                };
            }
        });

    }, [selectedAsset]);

    const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
        // Find parent and child nodes
        const parentNode = localData.assets.find(a => a.id === edge.source);
        const childNode = localData.assets.find(a => a.id === edge.target);

        if (parentNode && childNode) {
            setSelectedEdge({
                parentNode,
                childNode,
                connectionLabel: edge.label as string || 'Unknown',
            });
            setDrawerOpen(true);
        }
    }, [localData]);

    const handleAddConnectionStart = (direction: 'incoming' | 'outgoing') => {
        setAddConnectionDirection(direction);
        setAddConnectionModalOpen(true);
    };

    const handleAssetSelect = (targetAssetId: string, connectionType: string) => {
        if (!selectedAsset?.asset) return;

        const sourceId = addConnectionDirection === 'outgoing' ? selectedAsset.asset.id : targetAssetId;
        const targetId = addConnectionDirection === 'outgoing' ? targetAssetId : selectedAsset.asset.id;

        setLocalData(prev => {
            // Check if connection already exists
            const exists = prev.connections.some(c =>
                (c.source === sourceId && c.target === targetId)
            );

            if (exists) return prev;

            const newId = prev.connections.length > 0
                ? Math.max(...prev.connections.map(c => typeof c.id === 'string' ? parseInt(c.id) : c.id)) + 1
                : 1;

            const newConnection = {
                id: newId,
                source: sourceId,
                target: targetId,
                label: connectionType,
            };

            return {
                ...prev,
                connections: [...prev.connections, newConnection]
            };
        });

        setAddConnectionModalOpen(false);
        // Close asset drawer to refresh or keep open? Let's keep open but it needs to refresh data.
        // Actually, localData update will trigger re-render, but selectedAsset state is separate.
        // We should update selectedAsset state or close drawer. Closing is simpler for now to force refresh.
        setAssetDrawerOpen(false);
    };



    const systems = localData.assets.filter(a => a.type === 'System');
    const databases = localData.assets.filter(a => a.type === 'Databases');
    const servers = localData.assets.filter(a => a.type === 'Servers');

    const expandAll = () => {
        if (!selectedSystemId) return;

        const allNodeIds = new Set<string>();
        const queue = [selectedSystemId];
        const visited = new Set<string>([selectedSystemId]);

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            allNodeIds.add(currentId);

            localData.connections.forEach(conn => {
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



    // Auto-fit view when system or layout changes
    useEffect(() => {
        if (rfInstance && nodes.length > 0) {
            // Small delay to ensure nodes are rendered and measured
            const timer = setTimeout(() => {
                rfInstance.fitView({ duration: 800, padding: 0.2 });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [selectedSystemId, layoutType, rfInstance, nodes.length]);

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
                            background: 'var(--node-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: 'var(--text-primary)'
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
                        <option value="horizontal-tree">{t('horizontalTreeLayout')}</option>
                        <option value="circle">{t('circleLayout')}</option>
                        <option value="star">{t('starLayout')}</option>
                        <option value="grid">{t('gridLayout')}</option>
                        <option value="concentric">{t('concentricLayout')}</option>
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
                    background: 'var(--node-bg)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-md)',
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
                                color: 'var(--text-primary)'
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
                                                <span style={{ color: 'var(--text-primary)' }}>{label}</span>
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
                                color: 'var(--text-primary)'
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
                                        <span style={{ color: 'var(--text-primary)' }}>{label}</span>
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
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-right"
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    color={theme === 'dark' ? '#404040' : '#e5e7eb'}
                    gap={16}
                    style={{ backgroundColor: 'transparent' }}
                />
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
                onDelete={removeConnection}
            />

            {/* Asset Details Drawer */}
            <AssetDrawer
                isOpen={assetDrawerOpen}
                onClose={() => setAssetDrawerOpen(false)}
                asset={selectedAsset?.asset || null}
                incomingConnections={selectedAsset?.incomingConnections || []}
                outgoingConnections={selectedAsset?.outgoingConnections || []}
                onAddConnection={handleAddConnectionStart}
                onDeleteConnection={handleDeleteConnectionFromDrawer}
            />

            <AssetSelectionModal
                isOpen={addConnectionModalOpen}
                onClose={() => setAddConnectionModalOpen(false)}
                onSelect={handleAssetSelect}
                assets={localData.assets}
                excludeAssetId={selectedAsset?.asset?.id}
                direction={addConnectionDirection}
                connectionTypes={Object.keys(connectionColorMap).filter(k => k !== 'default')}
            />
        </div>
    );
};

export default TopologyMap;
