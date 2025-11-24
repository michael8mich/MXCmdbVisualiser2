import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faServer, faNetworkWired, faShield, faDatabase, faGlobe, faDesktop, faBox, faLayerGroup,
    faHdd, faPlug, faCube, faLaptop, faUsers, faPrint, faTv, faSatelliteDish,
    faCircle, faBarcode, faSave, faBroadcastTower, faLock, faCog, faFileCode, faShieldAlt,
    faMobileAlt, faQuestionCircle, faTabletAlt, faCloud, faWrench
} from '@fortawesome/free-solid-svg-icons';
import { useI18n } from '../i18n/I18nContext';

const iconMap: Record<string, any> = {
    'Hardware': faHdd,
    'Interfaces': faPlug,
    'Entitlement Packages': faCube,
    'Computers': faLaptop,
    'AD Groups': faUsers,
    'Printers': faPrint,
    'Monitors': faTv,
    'Scanners': faSatelliteDish,  // Using satellite dish as alternative
    'Peripheral Equipment': faCircle,  // Using circle as alternative
    'Barcode Readers': faBarcode,
    'Storage Devices': faSave,
    'Communication Equipment': faBroadcastTower,
    'Permissions': faLock,
    'Settings': faCog,
    'Software Items': faFileCode,
    'Information Security': faShieldAlt,
    'System': faBox,
    'Servers': faServer,
    'Miscellaneous': faQuestionCircle,
    'Handheld Devices': faTabletAlt,
    'Databases': faDatabase,
    'Storage and Backup': faCloud,
    'Service': faWrench,
    'Mobile Devices': faMobileAlt,
    // Legacy types
    'Server': faServer,
    'Switch': faNetworkWired,
    'Router': faGlobe,
    'Firewall': faShield,
    'Database': faDatabase,
    'Load Balancer': faLayerGroup,
    'Workstation': faDesktop,
    default: faBox,
};

const CustomNodeFontAwesome = ({ data }: NodeProps) => {
    const { t } = useI18n();
    const icon = iconMap[data.type] || iconMap.default;
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
                    <FontAwesomeIcon icon={icon} size={isSystem ? '2x' : 'lg'} />
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

export default memo(CustomNodeFontAwesome);
