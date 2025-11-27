export const translations = {
    en: {
        // System Selection
        selectSystem: 'Select a System...',
        selectAsset: 'Select an Asset...',
        systems: 'Systems',
        databases: 'Databases',
        servers: 'Servers',
        back: 'Back',

        // Layouts
        treeLayout: 'Tree Layout',
        circleLayout: 'Circle Layout',
        starLayout: 'Star Layout',

        // Controls
        expandAll: 'Expand All',
        collapseAll: 'Collapse All',

        // Legend
        connectionTypes: 'Connection Types',

        // Connection Drawer
        connectionDetails: 'Connection Details',
        connectionType: 'CONNECTION TYPE',
        parentSource: 'PARENT (SOURCE)',
        childTarget: 'CHILD (TARGET)',

        // Asset Drawer
        assetDetails: 'Asset Details',
        assetInformation: 'ASSET INFORMATION',
        outgoingConnections: 'OUTGOING CONNECTIONS',
        incomingConnections: 'INCOMING CONNECTIONS',
        noOutgoingConnections: 'No outgoing connections',
        noIncomingConnections: 'No incoming connections',

        // Asset Fields
        name: 'Name:',
        type: 'Type:',
        id: 'ID:',
        status: 'Status:',

        // Language
        language: 'Language',

        // Asset Types
        assetTypes: {
            'Hardware': 'Hardware',
            'Interfaces': 'Interfaces',
            'Entitlement Packages': 'Entitlement Packages',
            'Computers': 'Computers',
            'AD Groups': 'AD Groups',
            'Printers': 'Printers',
            'Monitors': 'Monitors',
            'Scanners': 'Scanners',
            'Peripheral Equipment': 'Peripheral Equipment',
            'Barcode Readers': 'Barcode Readers',
            'Storage Devices': 'Storage Devices',
            'Communication Equipment': 'Communication Equipment',
            'Permissions': 'Permissions',
            'Settings': 'Settings',
            'Software Items': 'Software Items',
            'Information Security': 'Information Security',
            'System': 'System',
            'Servers': 'Servers',
            'Miscellaneous': 'Miscellaneous',
            'Handheld Devices': 'Handheld Devices',
            'Databases': 'Databases',
            'Storage and Backup': 'Storage and Backup',
            'Service': 'Service',
            'Mobile Devices': 'Mobile Devices',
            'Unknown': 'Unknown',
        },
    },
    he: {
        // System Selection
        selectSystem: 'בחר מערכת...',
        selectAsset: 'בחר נכס...',
        systems: 'מערכות',
        databases: 'בסיסי נתונים',
        servers: 'שרתים',
        back: 'חזור',

        // Layouts
        treeLayout: 'תצוגת עץ',
        circleLayout: 'תצוגת מעגל',
        starLayout: 'תצוגת כוכב',

        // Controls
        expandAll: 'הרחב הכל',
        collapseAll: 'כווץ הכל',

        // Legend
        connectionTypes: 'סוגי חיבורים',

        // Connection Drawer
        connectionDetails: 'פרטי חיבור',
        connectionType: 'סוג חיבור',
        parentSource: 'הורה (מקור)',
        childTarget: 'ילד (יעד)',

        // Asset Drawer
        assetDetails: 'פרטי נכס',
        assetInformation: 'מידע על הנכס',
        outgoingConnections: 'חיבורים יוצאים',
        incomingConnections: 'חיבורים נכנסים',
        noOutgoingConnections: 'אין חיבורים יוצאים',
        noIncomingConnections: 'אין חיבורים נכנסים',

        // Asset Fields
        name: 'שם:',
        type: 'סוג:',
        id: 'מזהה:',
        status: 'סטטוס:',

        // Language
        language: 'שפה',

        // Asset Types
        assetTypes: {
            'Hardware': 'חומרה',
            'Interfaces': 'ממשקים',
            'Entitlement Packages': 'חבילות זכאות',
            'Computers': 'מחשבים',
            'AD Groups': 'קבוצות AD',
            'Printers': 'מדפסות',
            'Monitors': 'מסכים',
            'Scanners': 'סורקים',
            'Peripheral Equipment': 'ציוד היקפי',
            'Barcode Readers': 'קוראי ברקוד',
            'Storage Devices': 'אמצעי אחסון',
            'Communication Equipment': 'ציוד תקשורת',
            'Permissions': 'הרשאות',
            'Settings': 'הגדרות',
            'Software Items': 'פריטי תוכנה',
            'Information Security': 'אבטחת מידע',
            'System': 'מערכת',
            'Servers': 'שרתים',
            'Miscellaneous': 'שונות',
            'Handheld Devices': 'מסופונים',
            'Databases': 'בסיסי נתונים',
            'Storage and Backup': 'אחסון וגיבוי',
            'Service': 'שירות',
            'Mobile Devices': 'התקנים ניידים',
            'Unknown': 'לא ידוע',
        },
    },
};

export type Language = 'en' | 'he';
export type TranslationKey = keyof typeof translations.en;
