import type { Schema, Dataset, Field } from '../types';

// Loose type for incoming JSON to be flexible
interface AEPJson {
    [key: string]: any;
}

/**
 * Heuristic mapper that tries to guess if the JSON is a Schema or Dataset
 * and converts it to our application format.
 */
export const mapJsonToNode = (json: AEPJson): Schema | Dataset | null => {
    // Check if it's a Schema (Schema Registry response)
    if (json.title && (json.$id || json.meta)) {
        return mapSchema(json);
    }

    // Check if it's a Dataset (Catalog response)
    if (json.name && json.files && json.schemaRef) {
        // Catalog datasets often have 'files' or 'schemaRef'
        return mapDataset(json);
    }

    // Fallback for simpler Dataset lookups without 'files'
    if (json.name && json.schemaRef) {
        return mapDataset(json);
    }

    console.warn("Could not determine type of JSON import:", json);
    return null;
};

const mapSchema = (json: AEPJson): Schema => {
    const fields: Field[] = [];

    // Very basic recursive property flattener to find fields
    const extractFields = (props: any, prefix = '') => {
        if (!props) return;
        Object.keys(props).forEach(key => {
            const prop = props[key];
            const path = prefix ? `${prefix}.${key}` : key;

            if (prop.type === 'object' && prop.properties) {
                extractFields(prop.properties, path);
            } else {
                fields.push({
                    name: prop.title || key,
                    type: prop.type || 'string',
                    path: path,
                    isRequired: false // Simplified
                });
            }
        });
    };

    if (json.properties) {
        extractFields(json.properties);
    }

    // Detect Profile eligibility (often inferred from tags or behaviors)
    // Real logic would check for specific union tags or mixins.
    // For demo, we check if title contains "Profile" or explicit meta tag.
    const isProfileEnabled =
        (json.meta && json.meta.immutableTags && json.meta.immutableTags.includes('union')) ||
        (json.title && json.title.toLowerCase().includes('profile'));

    return {
        id: json.$id || json.id || `schema-${Date.now()}`,
        name: json.title || 'Unknown Schema',
        class: json['meta:extends'] ? 'XDM Extended' : 'XDM Class', // Simplified
        isProfileEnabled: !!isProfileEnabled,
        fields: fields.slice(0, 50) // Limit for performance in demo
    };
};

const mapDataset = (json: AEPJson): Dataset => {
    let schemaId = 'unknown';
    if (json.schemaRef) {
        schemaId = json.schemaRef.id || json.schemaRef;
    }

    return {
        id: json.id || `dataset-${Date.now()}`,
        name: json.name || 'Unknown Dataset',
        schemaId: schemaId,
        created: json.created || new Date().toISOString()
    };
};
