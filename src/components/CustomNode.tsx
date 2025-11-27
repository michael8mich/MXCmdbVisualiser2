import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import {
    Server, Network, Shield, Database, Globe, Monitor, Box, Layers,
    HardDrive, Plug, Package, Laptop, Users, Printer, Tv, ScanLine,
    Usb, Barcode, Save, Radio, Lock, Settings, FileCode, ShieldCheck,
    Smartphone, HelpCircle, Tablet, Cloud, Wrench
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const iconMap: Record<string, React.ElementType> = {
    'Hardware': HardDrive,
    'Interfaces': Plug,
    'Entitlement Packages': Package,
    'Computers': Laptop,
    'AD Groups': Users,
    'Printers': Printer,
    'Monitors': Tv,
    'Scanners': ScanLine,
    'Peripheral Equipment': Usb,
    'Barcode Readers': Barcode,
    'Storage Devices': Save,
    'Communication Equipment': Radio,
    'Permissions': Lock,
    'Settings': Settings,
    'Software Items': FileCode,
    'Information Security': ShieldCheck,
    'System': Box,
    'Servers': Server,
    'Miscellaneous': HelpCircle,
    'Handheld Devices': Tablet,
    'Databases': Database,
    'Storage and Backup': Cloud,
    'Service': Wrench,
    'Mobile Devices': Smartphone,
    'Unknown': HelpCircle,
    // Legacy types
    'Server': Server,
    'Switch': Network,
    'Router': Globe,
    'Firewall': Shield,
    'Database': Database,
    'Load Balancer': Layers,
    'Workstation': Monitor,
    default: Box,
};

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

const CustomNode = ({ data }: NodeProps) => {
    const { t, language } = useI18n();
    const Icon = iconMap[data.type] || iconMap.default;
    const iconColor = assetTypeColorMap[data.type] || assetTypeColorMap.default;
    const isError = data.status === 'error';
    const hasChildren = data.childCount > 0;
    const isExpanded = data.expanded;
    const isSystem = data.type === 'System';
    const isSelected = data.isSelected;

    // Get translated type name
    const translatedType = (t as any).assetTypes?.[data.type] || data.type;

    return (
        <div className={`custom-node ${isError ? 'error' : ''} ${isSystem ? 'system-node' : ''} ${isSelected ? 'selected-system' : ''}`}>
            <Handle type="target" position={Position.Top} className="handle" />

            <div className="node-content">
                <div
                    className={`icon-wrapper ${isError ? 'error' : ''} ${isSystem ? 'system-icon' : ''}`}
                    style={{ color: iconColor }}
                >
                    <Icon size={isSystem ? 28 : 20} />
                </div>
                <div className="node-details">
                    <div className={`node-title ${isSystem ? 'system-title' : ''}`}>{data.label}</div>
                    <div className="node-subtitle">{translatedType}</div>
                </div>
                {isError && <div className="status-indicator error" />}

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
