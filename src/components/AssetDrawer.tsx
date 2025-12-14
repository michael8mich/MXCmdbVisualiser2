import { useState } from 'react';
import { Drawer, Card, Tag, Typography, Empty, Space, Button, Popconfirm } from 'antd';
import { CloseOutlined, ArrowRightOutlined, ArrowLeftOutlined, InfoCircleOutlined, PlusOutlined, DeleteOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { iconMap, assetTypeColorMap } from './CustomNode';
import { useI18n } from '../i18n/I18nContext';

const { Title, Text } = Typography;

interface Connection {
    id: string;
    name: string;
    type: string;
    label: string;
}

interface AssetDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    asset: {
        id: string;
        name: string;
        type: string;
        status?: string;
    } | null;
    incomingConnections: Connection[];
    outgoingConnections: Connection[];
    onAddConnection?: (direction: 'incoming' | 'outgoing') => void;
    onDeleteConnection?: (connectedAssetId: string, direction: 'incoming' | 'outgoing') => void;
}

const AssetDrawer = ({ isOpen, onClose, asset, incomingConnections, outgoingConnections, onAddConnection, onDeleteConnection }: AssetDrawerProps) => {
    const { t, dir } = useI18n();
    const [showOutgoing, setShowOutgoing] = useState(false);
    const [showIncoming, setShowIncoming] = useState(false);

    if (!asset) return null;

    const Icon = iconMap[asset.type] || iconMap.default;
    const iconColor = assetTypeColorMap[asset.type] || assetTypeColorMap.default;
    const translatedType = (t as any).assetTypes?.[asset.type] || asset.type;

    return (
        <Drawer
            title={
                <Space>
                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                    <span>{t('assetDetails')}</span>
                </Space>
            }
            placement={dir === 'rtl' ? 'left' : 'right'}
            onClose={onClose}
            open={isOpen}
            width={500}
            closeIcon={<CloseOutlined />}
            mask={false}
            getContainer={false}
            styles={{
                body: { padding: '24px' },
                wrapper: { boxShadow: 'none' }
            }}
        >
            {/* Asset Header Card with Gradient */}
            <Card
                bordered={false}
                className="animated-gradient-bg animate-fade-in-up"
                style={{
                    marginBottom: 24,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                    borderRadius: 12,
                    animationDelay: '0.1s',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        className="pulse-icon"
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 12,
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                        }}
                    >
                        <Icon size={36} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Title level={3} style={{ margin: 0, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {asset.name}
                        </Title>
                        <Tag
                            color={iconColor}
                            style={{
                                marginTop: 8,
                                borderRadius: 6,
                                padding: '4px 14px',
                                fontWeight: 500,
                                fontSize: 13,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                border: 'none',
                            }}
                        >
                            {translatedType}
                        </Tag>
                    </div>
                </div>
            </Card>

            {/* Outgoing Flow Animation */}
            {outgoingConnections.length > 0 && (
                <div className="connection-flow-container animate-fade-in-up" style={{ height: 40, margin: '0 0 16px 0', animationDelay: '0.2s' }}>
                    <div className="connection-flow-line" />
                    <div className="connection-flow-particle" />
                    <div className="connection-flow-arrow">▼</div>
                </div>
            )}

            {/* Outgoing Connections */}
            <Card
                title={
                    <div
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', cursor: 'pointer' }}
                        onClick={() => setShowOutgoing(!showOutgoing)}
                    >
                        <Space>
                            {showOutgoing ? <DownOutlined /> : <RightOutlined />}
                            <ArrowRightOutlined style={{ color: '#52c41a' }} />
                            <Text strong>
                                {t('outgoingConnections')} ({outgoingConnections.length})
                            </Text>
                        </Space>
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddConnection?.('outgoing');
                            }}
                        />
                    </div>
                }
                bordered={false}
                className="animate-fade-in-up"
                style={{ marginBottom: 24, borderRadius: 12, animationDelay: '0.3s' }}
            >
                {showOutgoing && (
                    outgoingConnections.length === 0 ? (
                        <Empty
                            description={t('noOutgoingConnections')}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {outgoingConnections.map((conn, index) => {
                                const ConnIcon = iconMap[conn.type] || iconMap.default;
                                const connColor = assetTypeColorMap[conn.type] || assetTypeColorMap.default;
                                const connTranslatedType = (t as any).assetTypes?.[conn.type] || conn.type;

                                return (
                                    <Card
                                        key={index}
                                        size="small"
                                        className="premium-hover-card"
                                        style={{
                                            borderRadius: 8,
                                            borderLeft: `4px solid ${connColor}`,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                            <Tag color="green" style={{ marginBottom: 4 }}>
                                                {conn.label}
                                            </Tag>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <ConnIcon size={16} color={connColor} />
                                                <Text strong>{conn.name}</Text>
                                            </div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {connTranslatedType}
                                            </Text>
                                        </Space>

                                        {onDeleteConnection && (
                                            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }} onClick={e => e.stopPropagation()}>
                                                <Popconfirm
                                                    title={t('deleteConnectionConfirm' as any) || "Delete?"}
                                                    onConfirm={(e) => {
                                                        e?.stopPropagation();
                                                        onDeleteConnection(conn.id, 'outgoing');
                                                    }}
                                                    okText={t('yes' as any)}
                                                    cancelText={t('no' as any)}
                                                >
                                                    <Button
                                                        type="text"
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                    />
                                                </Popconfirm>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </Space>
                    )
                )}
            </Card>

            {/* Incoming Flow Animation */}
            {
                incomingConnections.length > 0 && (
                    <div className="connection-flow-container animate-fade-in-up" style={{ height: 40, margin: '0 0 16px 0', animationDelay: '0.4s' }}>
                        <div className="connection-flow-line" />
                        <div className="connection-flow-particle reverse" />
                        <div className="connection-flow-arrow reverse">▼</div>
                    </div>
                )
            }

            {/* Incoming Connections */}
            <Card
                title={
                    <div
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', cursor: 'pointer' }}
                        onClick={() => setShowIncoming(!showIncoming)}
                    >
                        <Space>
                            {showIncoming ? <DownOutlined /> : <RightOutlined />}
                            <ArrowLeftOutlined style={{ color: '#1890ff' }} />
                            <Text strong>
                                {t('incomingConnections')} ({incomingConnections.length})
                            </Text>
                        </Space>
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddConnection?.('incoming');
                            }}
                        />
                    </div>
                }
                className="animate-fade-in-up"
                bordered={false}
                style={{ borderRadius: 12, animationDelay: '0.5s' }}
            >
                {showIncoming && (
                    incomingConnections.length === 0 ? (
                        <Empty
                            description={t('noIncomingConnections')}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {incomingConnections.map((conn, index) => {
                                const ConnIcon = iconMap[conn.type] || iconMap.default;
                                const connColor = assetTypeColorMap[conn.type] || assetTypeColorMap.default;
                                const connTranslatedType = (t as any).assetTypes?.[conn.type] || conn.type;

                                return (
                                    <Card
                                        key={index}
                                        size="small"
                                        className="premium-hover-card"
                                        style={{
                                            borderRadius: 8,
                                            borderLeft: `4px solid ${connColor}`,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                            <Tag color="blue" style={{ marginBottom: 4 }}>
                                                {conn.label}
                                            </Tag>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <ConnIcon size={16} color={connColor} />
                                                <Text strong>{conn.name}</Text>
                                            </div>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {connTranslatedType}
                                            </Text>
                                        </Space>
                                        {onDeleteConnection && (
                                            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }} onClick={e => e.stopPropagation()}>
                                                <Popconfirm
                                                    title={t('deleteConnectionConfirm' as any) || "Delete?"}
                                                    onConfirm={(e) => {
                                                        e?.stopPropagation();
                                                        onDeleteConnection(conn.id, 'incoming');
                                                    }}
                                                    okText={t('yes' as any)}
                                                    cancelText={t('no' as any)}
                                                >
                                                    <Button
                                                        type="text"
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                    />
                                                </Popconfirm>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </Space>
                    )
                )}
            </Card >
        </Drawer >
    );
};

export default AssetDrawer;
