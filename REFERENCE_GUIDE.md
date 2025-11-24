# CMDB Topology Visualizer - Reference Guide

## 📊 Asset Types

### Infrastructure (Blue tones 🔵)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **Servers** | `#3b82f6` | Server | Physical or virtual servers |
| **Databases** | `#1d4ed8` | Database | Database systems |
| **Hardware** | `#60a5fa` | Hard Drive | Physical hardware components |

### Network & Communication (Green tones 🟢)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **Communication Equipment** | `#10b981` | Broadcast Tower | Network communication devices |
| **Interfaces** | `#059669` | Plug | System interfaces and connectors |

### Security & Permissions (Red/Orange tones 🔴)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **Permissions** | `#ef4444` | Lock | Access permissions and rights |
| **Information Security** | `#f97316` | Shield | Security-related assets |

### Devices (Purple tones 🟣)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **Mobile Devices** | `#a855f7` | Smartphone | Mobile phones and tablets |
| **Handheld Devices** | `#c084fc` | Tablet | Handheld computing devices |
| **Computers** | `#8b5cf6` | Laptop | Desktop and laptop computers |
| **Monitors** | `#7c3aed` | TV | Display monitors |

### Peripherals (Yellow/Amber tones 🟡)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **Printers** | `#f59e0b` | Printer | Printing devices |
| **Scanners** | `#fbbf24` | Satellite Dish | Scanning equipment |
| **Barcode Readers** | `#eab308` | Barcode | Barcode scanning devices |
| **Peripheral Equipment** | `#d97706` | USB | Other peripheral devices |

### Software & Services (Cyan/Teal tones 🔷)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **Software Items** | `#06b6d4` | File Code | Software applications |
| **Service** | `#14b8a6` | Wrench | System services |
| **System** | `#0891b2` | Box | System-level assets |

### Storage (Indigo tones 🟦)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **Storage Devices** | `#6366f1` | Save | Storage hardware |
| **Storage and Backup** | `#818cf8` | Cloud | Backup and storage systems |

### Groups & Users (Pink tones 🩷)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **AD Groups** | `#ec4899` | Users | Active Directory groups |

### Settings & Configuration (Gray tones ⚫)
| Asset Type | Color | Icon | Description |
|------------|-------|------|-------------|
| **Settings** | `#6b7280` | Settings | Configuration settings |
| **Miscellaneous** | `#9ca3af` | Help Circle | Other uncategorized assets |
| **Entitlement Packages** | `#78716c` | Package | Software entitlements |

---

## 🔗 Connection Types

### All Supported Connection Types

| Connection Type | Color | Description |
|----------------|-------|-------------|
| **hosts** | `#2563eb` (Blue) | Asset hosts another asset |
| **communicates with** | `#10b981` (Emerald Green) | Assets communicate with each other |
| **connects to** | `#16a34a` (Green) | Direct connection between assets |
| **is contained by** | `#8b5cf6` (Violet) | Asset is contained within another |
| **provides to** | `#f59e0b` (Amber) | Asset provides service to another |
| **Replicates to** | `#06b6d4` (Cyan) | Data replication relationship |
| **runs** | `#ec4899` (Pink) | Asset runs on another asset |
| **serves** | `#6366f1` (Indigo) | Asset serves another asset |
| **services** | `#14b8a6` (Teal) | Service relationship |
| **Triggers** | `#f97316` (Orange) | Asset triggers another asset |
| **Uses** | `#a855f7` (Purple) | Asset uses another asset |
| **is the child of** | `#64748b` (Gray) | Parent-child relationship |
| **Default** | `#9ca3af` (Gray) | Any other connection type |

---

## 📖 Usage Guide

### How to Use the Topology Map

1. **Select an Asset**
   - Use the searchable dropdown to find and select an asset
   - Assets are grouped by type: Systems, Databases, Servers

2. **View Connections**
   - The map shows both incoming and outgoing connections
   - Connection colors indicate the relationship type
   - Arrow direction shows the flow (source → target)

3. **Interact with Nodes**
   - **Left-click**: Expand/collapse hierarchical connections
   - **Right-click**: View detailed asset information and all connections

4. **Change Layout**
   - **Tree Layout**: Hierarchical top-down view
   - **Circle Layout**: Circular arrangement
   - **Star Layout**: Radial from center

5. **Legend**
   - Click "Connection Types" to expand/collapse the legend
   - Shows all connection types with their colors

### Asset Status Colors

| Status | Indicator |
|--------|-----------|
| **Active** | No indicator |
| **Warning** | Yellow dot |
| **Error** | Red dot (red border) |
| **Maintenance** | Blue dot |

---

## 🎨 Visual Design

### Color Categories

Assets are color-coded by category for easy identification:
- **Blue** = Infrastructure (servers, databases, hardware)
- **Green** = Network & Communication
- **Red/Orange** = Security & Permissions
- **Purple** = Devices (computers, mobile)
- **Yellow** = Peripherals (printers, scanners)
- **Cyan/Teal** = Software & Services
- **Indigo** = Storage
- **Pink** = Groups & Users
- **Gray** = Settings & Misc

### Node Features

- **Icon**: Type-specific icon in category color
- **Title**: Asset name
- **Subtitle**: Asset type (translated)
- **Expansion Indicator**: Green (+) or Red (-) for expandable nodes
- **Status Indicator**: Colored dot for error/warning states

---

## 🌐 Internationalization

The topology map supports:
- **English** (default)
- **Hebrew** (RTL layout)

All asset types and connection types are translated in both languages.

---

## 📝 Data Format

### Asset Object
```json
{
  "id": "unique-id",
  "name": "Asset Name",
  "type": "Servers",
  "status": "active",
  "location": "Building 1, Floor 2",
  "ip": "192.168.1.1"
}
```

### Connection Object
```json
{
  "id": "connection-id",
  "source": "source-asset-id",
  "target": "target-asset-id",
  "label": "hosts"
}
```

---

**Total Asset Types**: 25+  
**Total Connection Types**: 12  
**Supported Languages**: 2 (English, Hebrew)
