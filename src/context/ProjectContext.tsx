import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Schema, Dataset, IngestNode } from '../types';
import { mockSchemas, mockDatasets, mockIngestNodes } from '../data/mockData';

interface ProjectState {
    schemas: Schema[];
    datasets: Dataset[];
    ingestNodes: IngestNode[];
}

interface ProjectContextType extends ProjectState {
    addSchema: (schema: Schema) => void;
    updateSchema: (schema: Schema) => void;
    deleteSchema: (id: string) => void;

    addDataset: (dataset: Dataset) => void;
    updateDataset: (dataset: Dataset) => void;
    deleteDataset: (id: string) => void;

    addIngestNode: (node: IngestNode) => void;
    updateIngestNode: (node: IngestNode) => void;
    deleteIngestNode: (id: string) => void;

    loadProject: (state: ProjectState) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize with mock data for now, but in future start empty or Load from local storage
    const [schemas, setSchemas] = useState<Schema[]>(mockSchemas);
    const [datasets, setDatasets] = useState<Dataset[]>(mockDatasets);
    const [ingestNodes, setIngestNodes] = useState<IngestNode[]>(mockIngestNodes as IngestNode[]);

    const loadProject = (state: ProjectState) => {
        setSchemas(state.schemas || []);
        setDatasets(state.datasets || []);
        setIngestNodes(state.ingestNodes || []);
    };


    // --- Schema Actions ---
    const addSchema = (schema: Schema) => {
        setSchemas(prev => [...prev, schema]);
    };

    const updateSchema = (updated: Schema) => {
        setSchemas(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    const deleteSchema = (id: string) => {
        // TODO: Warning if used by Dataset
        setSchemas(prev => prev.filter(s => s.id !== id));
    };

    // --- Dataset Actions ---
    const addDataset = (dataset: Dataset) => {
        setDatasets(prev => [...prev, dataset]);
    };

    const updateDataset = (updated: Dataset) => {
        setDatasets(prev => prev.map(d => d.id === updated.id ? updated : d));
    };

    const deleteDataset = (id: string) => {
        // TODO: Warning if used by Ingest
        setDatasets(prev => prev.filter(d => d.id !== id));
    };

    // --- Ingest Actions ---
    const addIngestNode = (node: IngestNode) => {
        setIngestNodes(prev => [...prev, node]);
    };

    const updateIngestNode = (updated: IngestNode) => {
        setIngestNodes(prev => prev.map(n => n.id === updated.id ? updated : n));
    };

    const deleteIngestNode = (id: string) => {
        setIngestNodes(prev => prev.filter(n => n.id !== id));
    };

    return (
        <ProjectContext.Provider value={{
            schemas,
            datasets,
            ingestNodes,
            addSchema,
            updateSchema,
            deleteSchema,
            addDataset,
            updateDataset,
            deleteDataset,
            addIngestNode,
            updateIngestNode,
            deleteIngestNode,
            loadProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};
