import { useState, useEffect } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';
import { GraphView } from './components/GraphView';
import { DefinitionEditor } from './components/DefinitionEditor';

import { useProject } from './context/ProjectContext';
import { generateGraph } from './utils/graphGenerator';
import { generateMermaid, generateDOT } from './utils/exporters';
import { Layout, PenTool, Play, Copy, Share2, ClipboardCheck } from 'lucide-react';
import { SchemaReviewer } from './components/SchemaReviewer';

import './App.css';

function App() {
  // Modes: 'define' | 'visualize' | 'reviewer'
  const [mode, setMode] = useState<'define' | 'visualize' | 'reviewer'>('define');

  // ReactFlow State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Global Project State
  const { schemas, datasets, ingestNodes } = useProject();

  // --- GENERATE GRAPH ON MODE SWITCH ---
  useEffect(() => {
    if (mode === 'visualize') {
      const { nodes: newNodes, edges: newEdges } = generateGraph(schemas, datasets, ingestNodes);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [mode, schemas, datasets, ingestNodes, setNodes, setEdges]);

  // --- EXPORT HANDLERS ---
  const handleExport = (type: 'mermaid' | 'dot') => {
    const content = type === 'mermaid'
      ? generateMermaid(schemas, datasets, ingestNodes)
      : generateDOT(schemas, datasets, ingestNodes);

    navigator.clipboard.writeText(content).then(() => {
      alert(`${type === 'mermaid' ? 'Mermaid' : 'Graphviz/DOT'} definition copied to clipboard!`);
    });
  };

  return (
    <div className="App" style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* TOP NAVIGATION BAR */}
      <div style={{
        height: '60px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between',
        background: 'var(--color-surface)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', lineHeight: '1.1' }}>AEP Planner</span>
            <span style={{ fontSize: '0.65rem', opacity: 0.6, color: '#fbbf24' }}>by Maciej Kutzmann</span>
          </div>
          <span style={{ fontSize: '0.8rem', opacity: 0.3, border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}>v0.3</span>
        </div>

        <div style={{ display: 'flex', gap: '1px', background: '#333', padding: '2px', borderRadius: '6px' }}>
          <button
            onClick={() => setMode('define')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              background: mode === 'define' ? 'var(--color-bg)' : 'transparent',
              color: mode === 'define' ? '#fff' : '#aaa',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <PenTool size={16} /> Architecture
          </button>
          <button
            onClick={() => setMode('reviewer')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              background: mode === 'reviewer' ? 'var(--color-bg)' : 'transparent',
              color: mode === 'reviewer' ? '#fff' : '#aaa',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <ClipboardCheck size={16} /> Reviewer
          </button>
          <button
            onClick={() => setMode('visualize')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              background: mode === 'visualize' ? 'var(--color-bg)' : 'transparent',
              color: mode === 'visualize' ? '#fff' : '#aaa',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <Layout size={16} /> Visualize
          </button>
        </div>

        <div style={{ width: '200px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {/* Spacer or extra actions */}
          {mode === 'define' && (
            <button
              onClick={() => setMode('visualize')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <Play size={16} fill="white" /> Generate
            </button>
          )}

          {mode === 'visualize' && (
            <>
              <button
                onClick={() => handleExport('mermaid')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px',
                  background: '#334155',
                  color: 'white',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
                title="Copy Mermaid Definition"
              >
                <Copy size={14} /> Mermaid
              </button>
              <button
                onClick={() => handleExport('dot')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 12px',
                  background: '#334155',
                  color: 'white',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
                title="Copy Graphviz/DOT Definition"
              >
                <Share2 size={14} /> DOT
              </button>
            </>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {mode === 'define' && (
          <div style={{ flex: 1 }}>
            <DefinitionEditor />
          </div>
        )}

        {mode === 'reviewer' && (
          <div style={{ flex: 1 }}>
            <SchemaReviewer />
          </div>
        )}

        {mode === 'visualize' && (
          /* VISUALIZE MODE */
          <div style={{ flex: 1, position: 'relative' }}>
            <GraphView
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
