export interface Field {
  name: string;
  type: string;
  path: string;
  isIdentity?: boolean;
  isRequired?: boolean;
}

export interface Schema {
  id: string;
  name: string;
  class: string; // e.g., XDM ExperienceEvent
  fields: Field[];
  isProfileEnabled: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  schemaId: string;
  created: string;
}

// For Visualization
export interface FlowNodeData {
  label: string;
  type: 'schema' | 'dataset' | 'ingest' | 'profile';
  details?: Schema | Dataset | IngestNode | ProfileStore;
}

export interface ProfileStore {
  id: string; // usually 'unified_profile'
  name: string;
  stats?: {
    totalProfiles: number;
    totalFragments: number;
  }
}

export interface IngestNode {
  id: string;
  name: string;
  schemaId?: string; // The schema this flow is based on
  targetDatasetIds?: string[]; // Where data lands (Multi-target support)
  type: 'HTTP API' | 'Datastream' | 'Static' | 'Other'; // Subtype of ingestion
}
