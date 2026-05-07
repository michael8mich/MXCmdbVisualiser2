import React, { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useI18n } from '../i18n/I18nContext';

// iconMap removed - now using IconContext
import { useIconMap } from '../context/IconContext';


// Color mapping by asset type category
export const assetTypeColorMap: Record<string, string> = {
    // Infrastructure (Blue tones)
    'Servers': '#3b82f6',
    'Databases': '#1d4ed8',
    'Hardware': '#60a5fa',

    // Network & Communication (Green tones)
    'Communication Equipment': '#10b981',
    'Interfaces': '#059669',

    // Security & Permissions (Red/Orange tones)
    'Permissions': '#ef4444',
    'Information Security': '#f97316',

    // Devices (Purple tones)
    'Mobile Devices': '#a855f7',
    'Handheld Devices': '#c084fc',
    'Computers': '#8b5cf6',
    'Monitors': '#7c3aed',

    // Peripherals (Yellow/Amber tones)
    'Printers': '#f59e0b',
    'Scanners': '#fbbf24',
    'Barcode Readers': '#eab308',
    'Peripheral Equipment': '#d97706',

    // Software & Services (Cyan/Teal tones)
    'Software Items': '#06b6d4',
    'Service': '#14b8a6',
    'System': '#0891b2',

    // Storage (Indigo tones)
    'Storage Devices': '#6366f1',
    'Storage and Backup': '#818cf8',

    // Groups & Users (Pink tones)
    'AD Groups': '#ec4899',
    'Users': '#f472b6',

    // Settings & Config (Gray tones)
    'Settings': '#6b7280',
    'Miscellaneous': '#9ca3af',
    'Entitlement Packages': '#78716c',

    // Unknown (Distinct gray)
    'Unknown': '#94a3b8', // Slate-400

    // Legacy types
    'Server': '#3b82f6',
    'Switch': '#10b981',
    'Router': '#059669',
    'Firewall': '#ef4444',
    'Database': '#1d4ed8',
    'Load Balancer': '#14b8a6',
    'Workstation': '#8b5cf6',

    default: '#64748b', // Slate gray
};

// Helper to convert hex to rgba with opacity
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const CustomNode = ({ data }: NodeProps) => {
    const { t } = useI18n();
    const { getIcon } = useIconMap();
    const Icon = getIcon(data.type);
    const iconColor = assetTypeColorMap[data.type] || assetTypeColorMap.default;
    const isError = data.status === 'error';
    const hasChildren = data.childCount > 0;
    const isExpanded = data.expanded;
    const isSystem = data.type === 'System';
    const isSelected = data.isSelected;

    // Get translated type name
    const translatedType = (t as any).assetTypes?.[data.type] || data.type;
    const animationDelay = data.animationDelay || '0s';

    // Dynamic styles using CSS variables
    const dynamicStyle = isSelected ? { animationDelay } : {
        '--node-color': iconColor,
        '--node-bg-start': hexToRgba(iconColor, 0.05),
        '--node-bg-end': hexToRgba(iconColor, 0.15),
        '--node-shadow': hexToRgba(iconColor, 0.2),
        animationDelay
    } as React.CSSProperties;

    // Network status for Servers
    const [netStatus, setNetStatus] = useState<'unknown' | 'reachable' | 'unreachable'>('unknown');
    const [netTooltip, setNetTooltip] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Icon for network status
    const NetworkIcon = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="10" r="8" />
            <path d="M6 10a4 4 0 0 1 8 0" />
            <circle cx="10" cy="10" r="2" />
        </svg>
    );

    // Spinner for loading
    const Spinner = () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
            <circle cx="10" cy="10" r="8" stroke="#aaa" strokeWidth="3" opacity="0.2" />
            <path d="M18 10a8 8 0 0 1-8 8" stroke="#888" strokeWidth="3" strokeLinecap="round" />
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </svg>
    );

    // Color for icon
    let netColor = '#aaa';
    if (netStatus === 'reachable') netColor = '#22c55e';
    if (netStatus === 'unreachable') netColor = '#ef4444';

    const handleNetCheck = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        setNetTooltip('Checking...');
        try {
            const resp = await fetch(`http://localhost:44321/networkinfo?nameOrIp=${encodeURIComponent(data.name)}`);
            const json = await resp.json();
            if (json.reachable) {
                setNetStatus('reachable');
                setNetTooltip(`Reachable: ${json.ipAddresses?.join(', ')}`);
            } else {
                setNetStatus('unreachable');
                setNetTooltip(json.error ? `Unreachable: ${json.error}` : 'Unreachable');
            }
        } catch (err) {
            setNetStatus('unreachable');
            setNetTooltip('Error contacting API');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`custom-node ${isError ? 'error' : ''} ${isSystem ? 'system-node' : ''} ${isSelected ? 'selected-system' : ''} animate-scale-in`}
            style={dynamicStyle}
        >
            <Handle type="target" position={Position.Top} className="handle" />

            <div className="node-content" style={{ position: 'relative' }}>
                <div
                    className={`icon-wrapper ${isError ? 'error' : ''} ${isSystem ? 'system-icon' : ''}`}
                    style={{ color: iconColor }}
                >
                    <Icon size={isSystem ? 28 : 20} />
                </div>
                <div className="node-details">
                    <div className={`node-title ${isSystem ? 'system-title' : ''}`}>{data.label}</div>
                    <div className="node-subtitle">{isSystem && data.englishName ? data.englishName : translatedType}</div>
                </div>
                {isError && <div className="status-indicator error" />}

                {/* Network status icon for Servers */}
                {data.type === 'Servers' && (
                    <button
                        type="button"
                        title={netTooltip || 'Check network status'}
                        style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            cursor: loading ? 'wait' : 'pointer',
                            color: netColor,
                            background: '#222',
                            border: 'none',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                            zIndex: 2,
                            padding: 0,
                            outline: 'none',
                        }}
                        onClick={handleNetCheck}
                        onMouseOver={e => { if (!loading) e.currentTarget.style.cursor = 'pointer'; }}
                        onMouseOut={e => { if (!loading) e.currentTarget.style.cursor = loading ? 'wait' : 'pointer'; }}
                        tabIndex={0}
                        aria-label="Check network status"
                    >
                        {loading ? <Spinner /> : <NetworkIcon />}
                    </button>
                )}

                {/* Expansion Indicator */}
                {hasChildren && (
                    <div style={{
                        position: 'absolute',
                        bottom: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: isExpanded ? '#ef4444' : '#22c55e',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 10
                    }}>
                        {isExpanded ? '-' : '+'}
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="handle" />
        </div>
    );
};

export default memo(CustomNode);
