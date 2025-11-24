import { X, ArrowRight, ArrowLeft } from 'lucide-react';

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
}

const AssetDrawer = ({ isOpen, onClose, asset, incomingConnections, outgoingConnections }: AssetDrawerProps) => {
    if (!isOpen || !asset) return null;

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
                    right: 0,
                    bottom: 0,
                    width: '450px',
                    backgroundColor: 'white',
                    boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease',
                    overflowY: 'auto',
                    padding: '24px',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Asset Details</h2>
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

                {/* Asset Information */}
                <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>
                        ASSET INFORMATION
                    </h3>
                    <div style={{
                        padding: '16px',
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        backgroundColor: '#eff6ff',
                    }}>
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Name:</span>
                            <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px', color: '#1f2937' }}>{asset.name}</div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Type:</span>
                            <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>{asset.type}</div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>ID:</span>
                            <div style={{ fontSize: '14px', marginTop: '4px', fontFamily: 'monospace', color: '#4b5563' }}>{asset.id}</div>
                        </div>
                        {asset.status && (
                            <div>
                                <span style={{ fontSize: '12px', color: '#6b7280' }}>Status:</span>
                                <div style={{ fontSize: '14px', marginTop: '4px', fontWeight: '600' }}>{asset.status}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Outgoing Connections */}
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowRight size={16} />
                        OUTGOING CONNECTIONS ({outgoingConnections.length})
                    </h3>
                    {outgoingConnections.length === 0 ? (
                        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', color: '#9ca3af', fontSize: '14px' }}>
                            No outgoing connections
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {outgoingConnections.map((conn, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        backgroundColor: '#fafafa',
                                    }}
                                >
                                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', marginBottom: '4px' }}>
                                        {conn.label}
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{conn.name}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{conn.type}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Incoming Connections */}
                <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowLeft size={16} />
                        INCOMING CONNECTIONS ({incomingConnections.length})
                    </h3>
                    {incomingConnections.length === 0 ? (
                        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', color: '#9ca3af', fontSize: '14px' }}>
                            No incoming connections
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {incomingConnections.map((conn, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '6px',
                                        backgroundColor: '#fafafa',
                                    }}
                                >
                                    <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', marginBottom: '4px' }}>
                                        {conn.label}
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{conn.name}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{conn.type}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AssetDrawer;
