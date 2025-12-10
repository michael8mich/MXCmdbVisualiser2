import { Modal, Select, Space, Tag } from 'antd';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { iconMap, assetTypeColorMap } from './CustomNode';
import { connectionColorMap } from './TopologyMap';

interface Asset {
    id: string;
    name: string;
    type: string;
}

interface AssetSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (assetId: string, connectionType: string) => void;
    assets: Asset[];
    excludeAssetId?: string;
    direction: 'incoming' | 'outgoing';
    connectionTypes: string[];
}

const AssetSelectionModal = ({
    isOpen,
    onClose,
    onSelect,
    assets,
    excludeAssetId,
    direction,
    connectionTypes
}: AssetSelectionModalProps) => {
    const { t, dir } = useI18n();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedConnectionType, setSelectedConnectionType] = useState<string | null>('connects to');

    const filteredAssets = assets.filter(a => a.id !== excludeAssetId);

    const handleOk = () => {
        if (selectedId && selectedConnectionType) {
            onSelect(selectedId, selectedConnectionType);
            setSelectedId(null);
            setSelectedConnectionType('connects to');
        }
    };

    const handleCancel = () => {
        setSelectedId(null);
        setSelectedConnectionType('connects to');
        onClose();
    };

    const title = direction === 'outgoing'
        ? (t('addOutgoingConnection') || 'Add Outgoing Connection')
        : (t('addIncomingConnection') || 'Add Incoming Connection');

    return (
        <Modal
            title={title}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={t('add') || 'Add'}
            cancelText={t('cancel') || 'Cancel'}
            okButtonProps={{ disabled: !selectedId || !selectedConnectionType }}
            dir={dir as any}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>{t('selectAsset') || 'Select Asset'}:</div>
                <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder={t('selectAsset') || 'Select Asset'}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        ((option as any)?.searchText ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={setSelectedId}
                    value={selectedId}
                    options={filteredAssets.map(asset => {
                        const Icon = iconMap[asset.type] || iconMap.default;
                        const iconColor = assetTypeColorMap[asset.type] || assetTypeColorMap.default;

                        return {
                            value: asset.id,
                            searchText: asset.name,
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Icon size={16} color={iconColor} />
                                    <span>{asset.name}</span>
                                    <Tag style={{ marginLeft: 'auto', marginRight: 0 }} color={iconColor === '#94a3b8' ? 'default' : iconColor}>
                                        {asset.type}
                                    </Tag>
                                </div>
                            )
                        };
                    })}
                />

                <div style={{ marginTop: 12 }}>{t('selectConnectionType') || 'Select Connection Type'}:</div>
                <Select
                    style={{ width: '100%' }}
                    placeholder={t('selectConnectionType') || 'Select Connection Type'}
                    onChange={setSelectedConnectionType}
                    value={selectedConnectionType}
                    options={connectionTypes.map(type => {
                        const color = connectionColorMap[type] || connectionColorMap.default;
                        return {
                            value: type,
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: color
                                    }} />
                                    <span>{type}</span>
                                </div>
                            )
                        };
                    })}
                />
            </Space>
        </Modal>
    );
};

export default AssetSelectionModal;
