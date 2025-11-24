import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const systems = [
  { id: 'sys-1', name: 'Mail Service', type: 'System' },
  { id: 'sys-2', name: 'HR', type: 'System' },
  { id: 'sys-3', name: 'Knowledge Base', type: 'System' },
  { id: 'sys-4', name: 'Billing', type: 'System' },
  { id: 'sys-5', name: 'Finance', type: 'System' }
];

const assetTypes = [
  'Hardware',
  'Interfaces',
  'Computers',
  'Printers',
  'Monitors',
  'Scanners',
  'Peripheral Equipment',
  'Barcode Readers',
  'Storage Devices',
  'Communication Equipment',
  'Software Items',
  'Servers',
  'Handheld Devices',
  'Databases',
  'Mobile Devices',
  'AD Groups',
  'Permissions',
  'Settings',
  'Information Security',
  'Service'
];

const statuses = ['active', 'warning', 'error', 'maintenance'];

const assets = [...systems];
const connections = [];

// Generate other assets and link them to systems
for (let i = 0; i < 150; i++) {
  const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
  const id = `asset-${i}`;
  const asset = {
    id: id,
    name: `${type} ${i + 1}`,
    type: type,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    ip: type === 'Servers' || type === 'Computers' ? `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : undefined,
    location: `Building ${Math.floor(Math.random() * 5) + 1}, Floor ${Math.floor(Math.random() * 10) + 1}`
  };
  assets.push(asset);

  // Connect to a random system
  const randomSystem = systems[Math.floor(Math.random() * systems.length)];
  connections.push({
    source: randomSystem.id,
    target: id,
    label: 'Hosts'
  });

  // Randomly connect to other assets to create depth
  if (i > 10 && Math.random() > 0.65) {
    const targetId = `asset-${Math.floor(Math.random() * i)}`;
    const connectionTypes = ['Connects to', 'Depends on', 'Installed on'];
    connections.push({
      source: id,
      target: targetId,
      label: connectionTypes[Math.floor(Math.random() * connectionTypes.length)]
    });
  }
}

// Add connections between systems
// Mail Service depends on HR and Finance
connections.push({
  source: 'sys-1',
  target: 'sys-2',
  label: 'Depends on'
});
connections.push({
  source: 'sys-1',
  target: 'sys-5',
  label: 'Depends on'
});

// HR connects to Knowledge Base
connections.push({
  source: 'sys-2',
  target: 'sys-3',
  label: 'Connects to'
});

// Billing depends on Finance and HR
connections.push({
  source: 'sys-4',
  target: 'sys-5',
  label: 'Depends on'
});
connections.push({
  source: 'sys-4',
  target: 'sys-2',
  label: 'Depends on'
});

// Knowledge Base connects to Mail Service
connections.push({
  source: 'sys-3',
  target: 'sys-1',
  label: 'Connects to'
});

const data = {
  assets: assets,
  connections: connections
};

const outputPath = path.join(__dirname, 'src', 'data', 'assets.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Generated ${assets.length} assets and ${connections.length} connections at ${outputPath}`);
