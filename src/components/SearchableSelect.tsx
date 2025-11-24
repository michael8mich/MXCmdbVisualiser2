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
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
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
                            backgroundColor: asset.id === selectedId ? '#e0e7ff' : 'white',
                            borderLeft: asset.id === selectedId ? '3px solid #4f46e5' : '3px solid transparent',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            if (asset.id !== selectedId) {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (asset.id !== selectedId) {
                                e.currentTarget.style.backgroundColor = 'white';
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
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
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
                    color: selectedAsset ? '#000' : '#9ca3af'
                }}>
                    {displayText}
                </span>
                <span style={{
                    position: 'absolute',
                    right: '8px',
                    fontSize: '12px',
                    color: '#6b7280',
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
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxHeight: '400px',
                    overflow: 'hidden',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Search Input */}
                    <div style={{
                        padding: '8px',
                        borderBottom: '1px solid #e5e7eb',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'white',
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
                                border: '1px solid #d1d5db',
                                borderRadius: 4,
                                fontSize: '14px',
                                outline: 'none',
                                direction: dir
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
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
                                color: '#9ca3af'
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
