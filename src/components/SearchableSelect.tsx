import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';

interface Asset {
    id: string;
    name: string;
    type: string;
}

interface SearchableSelectProps {
    systems: Asset[];
    databases: Asset[];
    servers: Asset[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const SearchableSelect = ({ systems, databases, servers, selectedId, onSelect }: SearchableSelectProps) => {
    const { t, dir } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get selected asset name
    const selectedAsset = [...systems, ...databases, ...servers].find(a => a.id === selectedId);
    const displayText = selectedAsset?.name || t('selectAsset');

    // Filter assets based on search term
    const filterAssets = (assets: Asset[]) => {
        if (!searchTerm) return assets;
        return assets.filter(asset =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredSystems = filterAssets(systems);
    const filteredDatabases = filterAssets(databases);
    const filteredServers = filterAssets(servers);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (id: string) => {
        onSelect(id);
        setIsOpen(false);
        setSearchTerm('');
    };

    const renderAssetGroup = (label: string, assets: Asset[]) => {
        if (assets.length === 0) return null;

        return (
            <div key={label}>
                <div style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-color)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {label}
                </div>
                {assets.map(asset => (
                    <div
                        key={asset.id}
                        onClick={() => handleSelect(asset.id)}
                        style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            backgroundColor: asset.id === selectedId ? 'var(--accent-color)' : 'var(--node-bg)',
                            borderLeft: asset.id === selectedId ? '3px solid var(--accent-color)' : '3px solid transparent',
                            transition: 'all 0.15s',
                            color: asset.id === selectedId ? 'white' : 'var(--text-primary)'
                        }}
                        onMouseEnter={(e) => {
                            if (asset.id !== selectedId) {
                                e.currentTarget.style.backgroundColor = 'var(--bg-color)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (asset.id !== selectedId) {
                                e.currentTarget.style.backgroundColor = 'var(--node-bg)';
                            }
                        }}
                    >
                        {asset.name}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative', minWidth: '250px' }}>
            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '8px 32px 8px 12px',
                    borderRadius: 4,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--node-bg)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: selectedAsset ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                    {displayText}
                </span>
                <span style={{
                    position: 'absolute',
                    right: '8px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }}>
                    ▼
                </span>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'var(--node-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 4,
                    boxShadow: 'var(--shadow-md)',
                    maxHeight: '400px',
                    overflow: 'hidden',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Search Input */}
                    <div style={{
                        padding: '8px',
                        borderBottom: '1px solid var(--border-color)',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'var(--node-bg)',
                        zIndex: 1
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={dir === 'rtl' ? 'חפש...' : 'Search...'}
                            style={{
                                width: '100%',
                                padding: '6px 10px',
                                border: '1px solid var(--border-color)',
                                borderRadius: 4,
                                fontSize: '14px',
                                outline: 'none',
                                direction: dir,
                                backgroundColor: 'var(--node-bg)',
                                color: 'var(--text-primary)'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    {/* Asset List */}
                    <div style={{
                        overflowY: 'auto',
                        maxHeight: '340px'
                    }}>
                        {filteredSystems.length === 0 && filteredDatabases.length === 0 && filteredServers.length === 0 ? (
                            <div style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: 'var(--text-secondary)'
                            }}>
                                {dir === 'rtl' ? 'לא נמצאו תוצאות' : 'No results found'}
                            </div>
                        ) : (
                            <>
                                {renderAssetGroup(t('systems'), filteredSystems)}
                                {renderAssetGroup(t('databases'), filteredDatabases)}
                                {renderAssetGroup(t('servers'), filteredServers)}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
