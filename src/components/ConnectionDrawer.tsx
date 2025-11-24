import { X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

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

    if (!isOpen || !parentNode || !childNode) return null;

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999,
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Drawer */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    [dir === 'rtl' ? 'left' : 'right']: 0,
                    bottom: 0,
                    width: '400px',
                    backgroundColor: 'white',
                    boxShadow: dir === 'rtl' ? '2px 0 8px rgba(0, 0, 0, 0.15)' : '-2px 0 8px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    transform: isOpen ? 'translateX(0)' : `translateX(${dir === 'rtl' ? '-' : ''}100%)`,
                    transition: 'transform 0.3s ease',
                    overflowY: 'auto',
                    padding: '24px',
                    direction: dir,
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{t('connectionDetails')}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Connection Type */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                        {t('connectionType')}
                    </h3>
                    <div style={{
                        padding: '12px 16px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                    }}>
                        {connectionLabel}
                    </div>
                </div>

                {/* Parent Node */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>
                        {t('parentSource')}
                    </h3>
                    <div style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#fafafa',
                    }}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{t('name')}</span>
                            <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>{parentNode.name}</div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{t('type')}</span>
                            <div style={{ fontSize: '14px', marginTop: '4px' }}>{parentNode.type}</div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{t('id')}</span>
                            <div style={{ fontSize: '14px', marginTop: '4px', fontFamily: 'monospace' }}>{parentNode.id}</div>
                        </div>
                        {parentNode.status && (
                            <div>
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>{t('status')}</span>
                                <div style={{ fontSize: '14px', marginTop: '4px' }}>{parentNode.status}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Arrow Indicator */}
                <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '24px', color: '#9ca3af' }}>
                    ↓
                </div>

                {/* Child Node */}
                <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>
                        {t('childTarget')}
                    </h3>
                    <div style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#fafafa',
                    }}>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{t('name')}</span>
                            <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>{childNode.name}</div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{t('type')}</span>
                            <div style={{ fontSize: '14px', marginTop: '4px' }}>{childNode.type}</div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{t('id')}</span>
                            <div style={{ fontSize: '14px', marginTop: '4px', fontFamily: 'monospace' }}>{childNode.id}</div>
                        </div>
                        {childNode.status && (
                            <div>
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>{t('status')}</span>
                                <div style={{ fontSize: '14px', marginTop: '4px' }}>{childNode.status}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConnectionDrawer;
