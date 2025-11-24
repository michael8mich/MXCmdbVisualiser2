import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import {
    Server, Network, Shield, Database, Globe, Monitor, Box, Layers,
    HardDrive, Plug, Package, Laptop, Users, Printer, Tv, ScanLine,
    Usb, Barcode, Save, Radio, Lock, Settings, FileCode, ShieldCheck,
    Smartphone, HelpCircle, Tablet, Cloud, Wrench
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const iconMap: Record<string, React.ElementType> = {
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

const CustomNode = ({ data }: NodeProps) => {
    const { t, language } = useI18n();
    const Icon = iconMap[data.type] || iconMap.default;
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
                <div className={`icon-wrapper ${isError ? 'error' : ''} ${isSystem ? 'system-icon' : ''}`}>
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
