import { Modal, Select, Space } from 'antd';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

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
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={setSelectedId}
                    value={selectedId}
                    options={filteredAssets.map(asset => ({
                        value: asset.id,
                        label: `${asset.name} (${asset.type})` // Simple display format
                    }))}
                />

                <div style={{ marginTop: 12 }}>{t('selectConnectionType') || 'Select Connection Type'}:</div>
                <Select
                    style={{ width: '100%' }}
                    placeholder={t('selectConnectionType') || 'Select Connection Type'}
                    onChange={setSelectedConnectionType}
                    value={selectedConnectionType}
                    options={connectionTypes.map(type => ({
                        value: type,
                        label: type
                    }))}
                />
            </Space>
        </Modal>
    );
};

export default AssetSelectionModal;
