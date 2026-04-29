import React, { createContext, useContext, useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Default fallback map (copied from original source)
const defaultIconMap: Record<string, string> = {
    'Hardware': 'HardDrive',
    'Interfaces': 'Plug',
    'Entitlement Packages': 'Package',
    'Computers': 'Laptop',
    'AD Groups': 'Users',
    'Printers': 'Printer',
    'Monitors': 'Tv',
    'Scanners': 'ScanLine',
    'Peripheral Equipment': 'Usb',
    'Barcode Readers': 'Barcode',
    'Storage Devices': 'Save',
    'Communication Equipment': 'Radio',
    'Permissions': 'Lock',
    'Settings': 'Settings',
    'Software Items': 'FileCode',
    'Information Security': 'ShieldCheck',
    'System': 'Box',
    'Servers': 'Server',
    'Miscellaneous': 'HelpCircle',
    'Handheld Devices': 'Tablet',
    'Databases': 'Database',
    'Storage and Backup': 'Cloud',
    'Service': 'Wrench',
    'Mobile Devices': 'Smartphone',
    'Unknown': 'HelpCircle',
    'Server': 'Server',
    'Switch': 'Network',
    'Router': 'Globe',
    'Firewall': 'Shield',
    'Database': 'Database',
    'Load Balancer': 'Layers',
    'Workstation': 'Monitor'
};

interface IconContextType {
    // Returns the Lucide Icon component for a given asset type
    getIcon: (type: string) => LucideIcon;
    isLoading: boolean;
}

const IconContext = createContext<IconContextType | undefined>(undefined);

export const IconProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [iconNameMap, setIconNameMap] = useState<Record<string, string>>(defaultIconMap);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIcons = async () => {
            try {
                const response = await fetch('/icons.json');
                if (response.ok) {
                    const data = await response.json();
                    setIconNameMap(prev => ({ ...prev, ...data }));
                } else {
                    console.warn('Failed to fetch/parse icons.json, using default map.');
                }
            } catch (error) {
                console.warn('Error loading icons.json:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIcons();
    }, []);

    const getIcon = (type: string): LucideIcon => {
        const iconName = iconNameMap[type] || iconNameMap['Unknown'] || 'HelpCircle';
        // @ts-ignore - Dynamic access to LucideIcons
        const Icon = LucideIcons[iconName];
        // @ts-ignore
        return Icon || LucideIcons.Box;
    };

    return (
        <IconContext.Provider value={{ getIcon, isLoading }}>
            {children}
        </IconContext.Provider>
    );
};

export const useIconMap = () => {
    const context = useContext(IconContext);
    if (context === undefined) {
        throw new Error('useIconMap must be used within an IconProvider');
    }
    return context;
};
