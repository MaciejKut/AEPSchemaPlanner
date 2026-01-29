import type { Schema, Dataset } from '../types';

export const mockSchemas: Schema[] = [
    {
        id: 'schema_crm_profile',
        name: 'CRM Loyalty Profile',
        class: 'XDM Individual Profile',
        isProfileEnabled: true,
        fields: [
            { name: 'loyaltyId', type: 'string', path: 'loyalty.id', isIdentity: true, isRequired: true },
            { name: 'firstName', type: 'string', path: 'person.name.firstName' },
            { name: 'lastName', type: 'string', path: 'person.name.lastName' },
            { name: 'email', type: 'string', path: 'personalEmail.address' },
            { name: 'points', type: 'integer', path: 'loyalty.points' },
        ]
    },
    {
        id: 'schema_web_events',
        name: 'Web Interaction Events',
        class: 'XDM ExperienceEvent',
        isProfileEnabled: true,
        fields: [
            { name: 'ecid', type: 'string', path: 'identityMap.ecid', isIdentity: true },
            { name: 'eventType', type: 'string', path: 'eventType', isRequired: true },
            { name: 'timestamp', type: 'date-time', path: 'timestamp', isRequired: true },
            { name: 'webPageDetails', type: 'object', path: 'web.webPageDetails' },
        ]
    },
    {
        id: 'schema_offline_orders',
        name: 'Offline Orders',
        class: 'XDM ExperienceEvent',
        isProfileEnabled: false,
        fields: [
            { name: 'orderId', type: 'string', path: 'commerce.order.orderID', isIdentity: true },
            { name: 'totalAmount', type: 'number', path: 'commerce.order.priceTotal' },
            { name: 'storeId', type: 'string', path: 'placeContext.placeId' },
        ]
    }
];

export const mockDatasets: Dataset[] = [
    {
        id: 'ds_loyalty_daily',
        name: 'Daily Loyalty Export',
        schemaId: 'schema_crm_profile',
        created: '2025-01-10'
    },
    {
        id: 'ds_web_stream',
        name: 'Website Activity Stream',
        schemaId: 'schema_web_events',
        created: '2025-01-12'
    },
    {
        id: 'ds_pos_dump',
        name: 'POS Transaction Dump',
        schemaId: 'schema_offline_orders',
        created: '2025-01-15'
    }
];

export const mockIngestNodes = [
    {
        id: 'dstr_web',
        name: 'Main Website Stream',
        schemaId: 'schema_web_events',
        targetDatasetIds: ['ds_web_stream'],
        type: 'Datastream'
    },
    {
        id: 'dstr_mobile',
        name: 'iOS App Stream',
        schemaId: 'schema_crm_profile',
        targetDatasetIds: ['ds_loyalty_daily'],
        type: 'Datastream'
    },
    {
        id: 'dstr_legacy_import',
        name: 'Legacy CRM Import',
        schemaId: 'schema_crm_profile',
        targetDatasetIds: ['ds_loyalty_daily'],
        type: 'Static'
    }
];
