import { Drawer, Card, Descriptions, Tag, Typography, Divider, Space } from 'antd';
import { CloseOutlined, SwapOutlined, ArrowDownOutlined, LinkOutlined } from '@ant-design/icons';
import { iconMap, assetTypeColorMap } from './CustomNode';
import { useI18n } from '../i18n/I18nContext';

const { Title, Text } = Typography;

interface ConnectionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    parentNode: {
        id: string;
        name: string;
        type: string;
        status?: string;
    } | null;
    childNode: {
        id: string;
        name: string;
        type: string;
        status?: string;
    } | null;
    connectionLabel: string;
}

const ConnectionDrawer = ({ isOpen, onClose, parentNode, childNode, connectionLabel }: ConnectionDrawerProps) => {
    const { t, dir } = useI18n();

    if (!parentNode || !childNode) return null;

    const ParentIcon = iconMap[parentNode.type] || iconMap.default;
    const parentColor = assetTypeColorMap[parentNode.type] || assetTypeColorMap.default;
    const parentTranslatedType = (t as any).assetTypes?.[parentNode.type] || parentNode.type;

    const ChildIcon = iconMap[childNode.type] || iconMap.default;
    const childColor = assetTypeColorMap[childNode.type] || assetTypeColorMap.default;
    const childTranslatedType = (t as any).assetTypes?.[childNode.type] || childNode.type;

    return (
        <Drawer
            title={
                <Space>
                    <LinkOutlined style={{ color: '#1890ff' }} />
                    <span>{t('connectionDetails')}</span>
                </Space>
            }
            placement={dir === 'rtl' ? 'left' : 'right'}
            onClose={onClose}
            open={isOpen}
            width={500}
            closeIcon={<CloseOutlined />}
            styles={{
                body: { padding: '24px' }
            }}
        >
            {/* Connection Type Card */}
            <Card
                bordered={false}
                className="animated-gradient-bg animate-fade-in-up"
                style={{
                    marginBottom: 24,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%)',
                    borderRadius: 12,
                    animationDelay: '0.1s',
                }}
                styles={{ body: { padding: '16px 24px' } }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        className="pulse-icon"
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            flexShrink: 0,
                        }}
                    >
                        <SwapOutlined style={{ fontSize: 24 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, display: 'block', marginBottom: 2, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                            {t('connectionType')}
                        </Text>
                        <Title level={4} style={{ margin: 0, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {connectionLabel}
                        </Title>
                    </div>
                </div>
            </Card>

            {/* Parent Node (Source) */}
            <Card
                title={
                    <Space>
                        <Text strong style={{ fontSize: 16 }}>
                            {t('parentSource')}
                        </Text>
                    </Space>
                }
                bordered={false}
                className="animate-fade-in-up premium-hover-card"
                style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    borderLeft: `4px solid ${parentColor}`,
                    animationDelay: '0.2s',
                }}
            >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 10,
                                background: `${parentColor}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: parentColor,
                            }}
                        >
                            <ParentIcon size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Title level={5} style={{ margin: 0 }}>
                                {parentNode.name}
                            </Title>
                            <Tag
                                color={parentColor}
                                style={{
                                    marginTop: 4,
                                    borderRadius: 6,
                                    padding: '2px 10px',
                                    fontSize: 12,
                                }}
                            >
                                {parentTranslatedType}
                            </Tag>
                        </div>
                    </div>
                    <Descriptions column={1} size="small">
                        {parentNode.status && (
                            <Descriptions.Item label={<Text strong>{t('status')}</Text>}>
                                <Tag color={parentNode.status === 'active' ? 'success' : 'default'}>
                                    {parentNode.status}
                                </Tag>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Space>
            </Card>

            {/* Animated Connection Flow */}
            <div className="connection-flow-container animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="connection-flow-line" />
                <div className="connection-flow-particle" />
                <div className="connection-flow-arrow">▼</div>
            </div>

            {/* Child Node (Target) */}
            <Card
                title={
                    <Space>
                        <Text strong style={{ fontSize: 16 }}>
                            {t('childTarget')}
                        </Text>
                    </Space>
                }
                bordered={false}
                className="animate-fade-in-up premium-hover-card"
                style={{
                    borderRadius: 12,
                    borderLeft: `4px solid ${childColor}`,
                    animationDelay: '0.4s',
                }}
            >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 10,
                                background: `${childColor}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: childColor,
                            }}
                        >
                            <ChildIcon size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Title level={5} style={{ margin: 0 }}>
                                {childNode.name}
                            </Title>
                            <Tag
                                color={childColor}
                                style={{
                                    marginTop: 4,
                                    borderRadius: 6,
                                    padding: '2px 10px',
                                    fontSize: 12,
                                }}
                            >
                                {childTranslatedType}
                            </Tag>
                        </div>
                    </div>
                    <Descriptions column={1} size="small">
                        {childNode.status && (
                            <Descriptions.Item label={<Text strong>{t('status')}</Text>}>
                                <Tag color={childNode.status === 'active' ? 'success' : 'default'}>
                                    {childNode.status}
                                </Tag>
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Space>
            </Card>
        </Drawer>
    );
};

export default ConnectionDrawer;
