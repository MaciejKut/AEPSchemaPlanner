/**
 * AEP Data Fetcher
 * 
 * Usage: 
 *   export AEP_ACCESS_TOKEN="your_token"
 *   export AEP_ORG_ID="your_org_id"
 *   export AEP_API_KEY="your_api_key"
 *   node fetch_aep_data.js
 * 
 * Output: aep_export.json
 */

const fs = require('fs');
const https = require('https');

const config = {
    orgId: process.env.AEP_ORG_ID,
    apiKey: process.env.AEP_API_KEY,
    token: process.env.AEP_ACCESS_TOKEN,
    sandbox: process.env.AEP_SANDBOX_NAME || 'prod'
};

if (!config.orgId || !config.token || !config.apiKey) {
    console.error('Error: Missing environment variables (AEP_ORG_ID, AEP_API_KEY, AEP_ACCESS_TOKEN)');
    process.exit(1);
}

const headers = {
    'Authorization': `Bearer ${config.token}`,
    'x-api-key': config.apiKey,
    'x-gw-ims-org-id': config.orgId,
    'x-sandbox-name': config.sandbox,
    'Accept': 'application/json'
};

/* --- Helpers --- */
const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error(`API Error ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
    });
};

/* --- Main Logic --- */
async function main() {
    try {
        console.log('1. Fetching Schemas from Schema Registry...');
        // Note: In production, you might need pagination logic (start=...&limit=...)
        // This fetches the first 100 classes/mixins/schemas.
        const schemasUrl = `https://platform.adobe.io/data/foundation/schemaregistry/tenant/schemas?limit=100`;
        const schemaRes = await fetchUrl(schemasUrl);
        const schemas = schemaRes.results || [];
        console.log(`   Found ${schemas.length} schemas.`);

        console.log('2. Fetching Datasets from Catalog Service...');
        const catalogUrl = `https://platform.adobe.io/data/foundation/catalog/dataSets?limit=100`;
        const catalogRes = await fetchUrl(catalogUrl);
        // Catalog API returns object map or array depending on version/endpoint, usually map { "id": {...} }
        const datasets = Object.values(catalogRes || {});
        console.log(`   Found ${datasets.length} datasets.`);

        const output = {
            generatedAt: new Date().toISOString(),
            schemas: schemas,
            datasets: datasets
        };

        fs.writeFileSync('aep_export.json', JSON.stringify(output, null, 2));
        console.log('Success! Data saved to aep_export.json');
        console.log('You can now paste the contents of this file into the AEP Schema Planner "Import" modal.');

    } catch (err) {
        console.error('Failed to fetch data:', err.message);
    }
}

main();
