// scripts/toggle-maintenance.mjs
import fs from 'fs';
import path from 'path';

// Nécessite un fichier .env à la racine avec :
// CF_ACCOUNT_ID=...
// CF_NAMESPACE_ID=... (L'ID de ton KV MAINTENANCE_KV)
// CF_API_TOKEN=...
const envPath = path.resolve(process.cwd(), '.env');
const envVars = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const { CF_ACCOUNT_ID, CF_NAMESPACE_ID, CF_API_TOKEN } = envVars;
const TARGET_STATE = process.argv[2]; // 'true' ou 'false'

if (!['true', 'false'].includes(TARGET_STATE)) {
  console.error("Usage: pnpm run maintenance:toggle <true|false>");
  process.exit(1);
}

async function toggle() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_NAMESPACE_ID}/values/MAINTENANCE_MODE`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'text/plain'
    },
    body: TARGET_STATE
  });

  if (response.ok) {
    console.log(`✅ Mode maintenance défini sur : ${TARGET_STATE}`);
  } else {
    const error = await response.json();
    console.error(`❌ Erreur API Cloudflare :`, error);
  }
}

toggle();