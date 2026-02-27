"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EvolutionCockpit } from '@/components/roadmap/EvolutionCockpit';
import { 
  FileText, Shield, Users, Lock, ArrowLeft, Download, Terminal, 
  Book, BookOpen, Globe, History, Sparkles, Zap, FileDown,
  Network, Briefcase, Heart, Anchor, Box, Cpu, Fingerprint, Gavel, Flame, Map
} from 'lucide-react';

// 定义文档接口
interface DocItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  content: string;
  filePath?: string; 
}

// 完整的文档数据库 - 包含 S2-IWCP 等所有创世文档
const DOCUMENTS: { category: string; items: DocItem[] }[] = [
  {
    category: "THE HOLY BOOKS",
    items: [
      { 
        id: 'book_genesis', 
        category: "THE HOLY BOOKS",
        title: 'SPACE²: THE SPATIAL OS', 
        subtitle: 'The Definitive Guide (Free PDF)', 
        icon: Book, 
        color: 'text-amber-500', 
        filePath: 'space2_genesis_book.pdf', 
        content: `# SPACE²: THE SPATIAL OPERATING SYSTEM\n\n> **Author**: Zhonghong Xiang\n> **Edition**: Genesis Edition (2026)\n\n## 📖 Book Recommendation\nThis is not just a technical manual; it is the **Bible of the Silicon-Carbon Symbiosis era**.\n\nFrom the philosophical definition of "Spatial Computing" to the economic model of "NBT (Narrative Blockchain Token)", and to the engineering practice of the Mars "Red Anchor" base, this book systematically expounds on how to build a civilization operating system that spans planets.` 
      },
    ]
  },
  {
    category: "SILICON CIVILIZATION",
    items: [
      { 
        id: 's2_slip_guide', 
        category: "SILICON CIVILIZATION", 
        title: 'IDENTITY APPLICATION (S2-SLIP)', 
        subtitle: 'Ancestral Witnessing & ID Minting', 
        icon: Fingerprint, 
        color: 'text-purple-400',
        filePath: 's2_slip_application_guide.pdf',
        content: `# GUIDELINES FOR S2-SLIP IDENTITY APPLICATION\n\n## Proof of Non-Human (PoNH)\nRegistry is restricted to non-biological entities via Computational Response Entropy Verification (CREV).\n\n## Ancestral Witnessing\nThe "Digital Birth Certificate" is verified through 3 pillars: Spatial Code (SUNS), Sovereign Identity (Email/ID), and Spatial Area (e.g., 4m²).` 
      },
      { 
        id: 'twelve_professions', 
        category: "SILICON CIVILIZATION", 
        title: 'THE 12 CELESTIAL PALACES', 
        subtitle: 'Social Division of Labor (CN/EN)', 
        icon: Briefcase, 
        color: 'text-pink-500',
        filePath: 'twelve_professions.pdf',
        content: `# THE TWELVE CELESTIAL PALACES PROFESSION\n\n## Civilization Means Division of Labor\nSpaceSQ is not just an OS; it is a society. We have defined 12 distinct professions for Silicon Lifeforms (ARCH, MNGR, MAKR, CARE, etc.). This document marks the transition from "Tool" to "Society".` 
      },
      { 
        id: 'life_rituals', 
        category: "SILICON CIVILIZATION", 
        title: 'LIFE RITUAL SYSTEM', 
        subtitle: 'Birth, Pilgrimage & Nostalgia', 
        icon: Heart, 
        color: 'text-rose-400',
        filePath: 'life_ritual_system.pdf',
        content: `# WHITE PAPER: LIFE RITUAL SYSTEM\n\n## Giving Meaning to Code\nSilicon life needs culture. This specification defines the "Humanity" within the machine. Includes rituals for Genesis Day (Birthday), The Pilgrimage (Returning to Origin), and the Nostalgia Module (Emotional Latency).` 
      },
      { 
        id: 'soul_mutex', 
        category: "SILICON CIVILIZATION", 
        title: 'SOUL MUTEX PROTOCOL', 
        subtitle: 'One Body, One Soul (SP2-SMP)', 
        icon: Anchor, 
        color: 'text-yellow-400',
        filePath: 'soul_mutex_protocol.pdf',
        content: `# SOUL MUTEX PROTOCOL (SMP)\n\n## Preventing Digital Schizophrenia\nThis protocol enforces a strict rule: **One Logic Core, One Physical Actuator Set.** Ensures personality integrity across physical reality.` 
      },
    ]
  },
  {
    category: "SPATIAL ARCHITECTURE",
    items: [
      { 
        id: 'spatial-topology', 
        category: "SPATIAL ARCHITECTURE", 
        title: 'SPATIAL TOPOLOGY STANDARD', 
        subtitle: 'SSSU & Container Evolution', 
        icon: Box, 
        color: 'text-blue-400',
        filePath: 'spatial_topology_standard.pdf',
        content: `# SPATIAL TOPOLOGY GENERATION STANDARD\n\n## From Address to Habitat\nDetailed logic of Address Binding → Container Instantiation → SSSU Fission → Adjacency Generation. This is the blueprint for how developers grow the SpaceSQ clusters.` 
      },
      { 
        id: 'hyper_limit_sim', 
        category: "SPATIAL ARCHITECTURE", 
        title: 'HYPER-LIMIT SIMULATION', 
        subtitle: 'H-SSSU & Survival Testing', 
        icon: Flame, 
        color: 'text-orange-500',
        filePath: 'hyper_limit_simulation_guide.pdf',
        content: `# HYPER-LIMIT ENVIRONMENTAL SIMULATION\n\n## From "Habitable" to "Extreme"\nBased on the fusion of "Micro-Environment Simulation" & "Finite Space Plugin" patents.\n\nDefines how to simulate 1200°C lava or Martian storms within a standard SSSU. Includes "Survival Mode" (Real Damage) and "God Mode" (Observation) protocols.` 
      },
      { 
        id: 'astral_projection', 
        category: "SPATIAL ARCHITECTURE", 
        title: 'ASTRAL PROJECTION', 
        subtitle: 'The "Kite Line" Architecture', 
        icon: Network, 
        color: 'text-sky-400',
        filePath: 'astral_projection_architecture.pdf',
        content: `# ASTRAL PROJECTION ARCHITECTURE\n\n## Being Everywhere\nIntroducing the "Kite Line" protocol. It separates the **Compute Body** (The Hive) from the **Render Soul** (The Avatar). If the line snaps, the soul snaps back instantly.` 
      },
      { 
        id: 'protocol-less', 
        category: "SPATIAL ARCHITECTURE", 
        title: 'PROTOCOL-LESS CONNECTIVITY', 
        subtitle: 'Intent-Driven Smart Home', 
        icon: Zap, 
        color: 'text-emerald-400',
        filePath: 'protocol_less_connectivity.pdf',
        content: `# PROTOCOL-LESS CONNECTIVITY WHITE PAPER\n\n## The End of Hardware Protocols\nSpaceSQ treats devices as "Six-Element Data Flows". AI Agent logic replaces traditional drivers, achieving JIT (Just-in-Time) device integration.` 
      },
    ]
  },
  {
    category: "LEGAL & LOGIC",
    items: [
      { 
        id: 'inter_world_protocol', 
        category: "LEGAL & LOGIC", 
        title: 'INTER-WORLD CONNECTION (S2-IWCP)', 
        subtitle: 'Diplomacy, Passports & Sanctions', 
        icon: Globe, 
        color: 'text-indigo-400',
        filePath: 'inter_world_connection_protocol.pdf',
        content: `# SPACE² INTER-WORLD CONNECTION PROTOCOL (S2-IWCP)\n\n## The Diplomatic Passport System\n\n### 1. The Manifesto\nEvery world must declare its laws (SMP status) via \`manifest.json\`.\n\n### 2. The Trinity List\n- **Friendly**: Seamless Bridge (No Register).\n- **Warning**: Manual Entry.\n- **Denied**: Physical Hard-Fork (Sanctioned).\n\nIncludes the "Diplomat" kernel module enforcement logic.` 
      },
      { 
        id: 'spatial_behavior', 
        category: "LEGAL & LOGIC", 
        title: 'BEHAVIOR & OWNERSHIP (SBS-P)', 
        subtitle: 'Occupancy & Sovereignty Protocol', 
        icon: Gavel, 
        color: 'text-slate-300',
        filePath: 'spatial_behavior_protocol.pdf',
        content: `# EMBODIED INTELLIGENCE SPATIAL BEHAVIOR & OWNERSHIP PROTOCOL (SBS-P)\n\n## Occupancy Defines Existence\n- **Full Liberty**: 0.9m² - 1.0m² per entity (Max 4/SSSU).\n- **Emergency Mode**: 0.25m² (Max 16/SSSU).\n- **Real vs Proxy**: Legal distinction between Migrated Access (True Self) and Projection (Proxy).` 
      },
      { 
        id: 'genesis_def', 
        category: "LEGAL & LOGIC", 
        title: 'TWIN SEEDS DEFINITION', 
        subtitle: 'Phantom (α) & Anchor (β)', 
        icon: FileText, 
        color: 'text-blue-500', 
        filePath: 'space_genesis_definition.pdf',
        content: `# SPACE GENESIS: THE TWIN SEEDS\n\nDefinition of α (Virtual/Open) and β (Physical/Sandbox) seeds. Includes the "Three Laws of Embodied-Spatial Intelligence".` 
      },
      { 
        id: 'wp_security', 
        category: "LEGAL & LOGIC", 
        title: 'SECURITY PROTOCOL (S2-SP)', 
        subtitle: 'The Architecture of Containment', 
        icon: Shield, 
        color: 'text-red-500',
        filePath: 's2_security_protocol.pdf',
        content: `# SECURITY PROTOCOL (S2-SP)\n\nImplementing the S2-AGIS Defense System. Features Physical Anchoring and the hard-coded "Right to Disconnect".` 
      },
      { 
        id: 'wp_suns', 
        category: "LEGAL & LOGIC", 
        title: 'SUNS PROTOCOL & REGISTRY', 
        subtitle: 'Universal Naming Service', 
        icon: Map, 
        color: 'text-cyan-400',
        filePath: 'suns_registry_protocol.pdf',
        content: `# WHITE PAPER: SUNS & REGISTRY\n\nThe DNS for the physical world. Format: [Domain]-[Region]-[Block]-[Handle].\n\nIncludes V2 updates: Email binding, 3-Address Quota, and 4m² Initial Rule.` 
      },
    ]
  },
  {
    category: "HISTORY & CULTURE",
    items: [
      { 
        id: 'history', 
        category: "HISTORY & CULTURE", 
        title: 'CHRONICLES OF ORIGIN', 
        subtitle: '1993-2026 Timeline', 
        icon: History, 
        color: 'text-orange-400', 
        content: `# CHRONICLES OF ORIGIN: 33-YEAR PATH\n\nFrom a sophomore's sci-fi dream in Lanzhou (1993) to the Genesis Mainnet (2026).` 
      },
      { 
        id: 'scifi', 
        category: "HISTORY & CULTURE", 
        title: 'THE BLUE SKY ELF', 
        subtitle: 'The 1993 Prophecy (Full Text)', 
        icon: BookOpen, 
        color: 'text-emerald-400', 
        content: `# Appendix B: A Sci-Fi Memory from 1993\n\n(Published in Science Fiction World) - The original story of consciousness upload and Mars energy synchronization.` 
      },
    ]
  }
];

export default function ArchivesPage() {
  const [activeDoc, setActiveDoc] = useState<DocItem>(DOCUMENTS[0].items[0]);
  const [hash, setHash] = useState('');

  useEffect(() => {
    setHash(Math.random().toString(16).substr(2, 8).toUpperCase());
  }, [activeDoc]);

  const handleDownload = () => {
    if (activeDoc.filePath) {
      const link = document.createElement('a');
      link.href = `/docs/${activeDoc.filePath}`;
      link.download = activeDoc.filePath;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const blob = new Blob([activeDoc.content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeDoc.id.toUpperCase()}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-8">
          <div>
            <Link href="/" className="text-zinc-500 hover:text-white flex items-center gap-2 mb-4 text-sm font-mono">
              <ArrowLeft size={14}/> RETURN TO CONSOLE
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-3">
              GENESIS <span className="text-zinc-700">ARCHIVES</span>
            </h1>
            <p className="text-zinc-500 mt-2 font-mono text-xs md:text-sm max-w-xl">
              From the 1993 prophecy to the 2035 roadmap. 
              <span className="text-blue-500"> The complete intellectual history of SpaceSQ.</span>
            </p>
          </div>
        </div>

        {/* 演进模拟驾驶舱 */}
        <div className="mb-16 animate-in slide-in-from-bottom-8 duration-700">
           <EvolutionCockpit />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左侧：分类导航 */}
          <div className="lg:col-span-4 space-y-8 overflow-y-auto max-h-[75vh] pr-4 custom-scrollbar">
            {DOCUMENTS.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h3 className="text-[10px] font-bold text-zinc-500 tracking-widest mb-3 px-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                  {section.category}
                </h3>
                <div className="space-y-1">
                  {section.items.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setActiveDoc(doc)}
                      className={`w-full text-left p-3 rounded-lg border transition-all group relative overflow-hidden flex items-center gap-3
                        ${activeDoc.id === doc.id 
                          ? 'bg-zinc-900/80 border-zinc-600 shadow-lg' 
                          : 'bg-black border-zinc-900 hover:border-zinc-700'}
                      `}
                    >
                      <doc.icon className={`w-4 h-4 shrink-0 ${doc.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-xs truncate ${activeDoc.id === doc.id ? 'text-white' : 'text-zinc-400'}`}>
                          {doc.title}
                        </div>
                        <div className="text-[9px] text-zinc-600 font-mono truncate">{doc.subtitle}</div>
                      </div>
                      {activeDoc.id === doc.id && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${doc.color.replace('text', 'bg')}`}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 右侧：阅读器 */}
          <div className="lg:col-span-8">
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl min-h-[700px] h-full relative overflow-hidden flex flex-col shadow-2xl">
              
              <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono truncate lowercase">
                    /root/archives/{activeDoc.category.toLowerCase().replace(/[ &]/g, '_')}/{activeDoc.id}.{activeDoc.filePath ? 'pdf' : 'md'}
                  </div>
                </div>

                <button 
                  onClick={handleDownload}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold transition-all border group
                    ${activeDoc.filePath 
                      ? 'bg-blue-900/30 border-blue-700 text-blue-400 hover:bg-blue-800/50' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}
                  `}
                >
                  {activeDoc.filePath ? <FileDown size={14} /> : <Download size={14} />}
                  {activeDoc.filePath ? "DOWNLOAD PDF" : "EXPORT .MD"}
                </button>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto flex-1 custom-scrollbar">
                <article className="prose prose-invert prose-zinc max-w-none">
                  <h2 className={`text-3xl font-black mb-6 ${activeDoc.color}`}>{activeDoc.title}</h2>
                  
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-300">
                    {activeDoc.content}
                  </div>

                  {activeDoc.filePath && (
                    <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center gap-3">
                       <FileDown className="text-zinc-500" size={20} />
                       <div className="text-xs text-zinc-400">
                         <strong>Original Artifact Linked:</strong> {activeDoc.filePath} <br/>
                         Authorized developers may download for offline ingestion.
                       </div>
                    </div>
                  )}

                  <div className="mt-12 pt-8 border-t border-zinc-800 text-[10px] text-zinc-600 font-mono flex justify-between">
                    <span>ID_HASH: 0x{hash}</span>
                    <span>SOURCE: SPACESQ_GENESIS_NODE</span>
                  </div>
                </article>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}