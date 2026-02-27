'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Book, Shield, Cpu, Users, FileText, Download, 
  Globe, Box, Layers, Activity, Lock 
} from 'lucide-react';

// === 文档数据源 ===
const DOC_GROUPS = [
  {
    id: 'genesis',
    title: 'Genesis Core (创世基石)',
    icon: <Globe className="w-5 h-5 text-indigo-500" />,
    description: 'The fundamental architecture, economic model, and philosophical definition of SpaceSQ.',
    docs: [
      {
        title: 'SpaceSQ Technical White Paper',
        version: 'v1.0',
        date: '2026-02-02',
        format: 'DOCX',
        size: '2.4 MB',
        filename: 'spacesq_tech_whitepaper.docx',
        desc: 'The Architecture of Space-Embodied Intelligence. Defines SSSU, NBT Economy, and LSS Kernel.'
      },
      {
        title: 'SPACE²: The Spatial OS (Book)',
        version: 'Full Edition',
        date: '2026',
        format: 'PDF',
        size: '18.5 MB',
        filename: 'space2_genesis_book.pdf',
        desc: 'Complete 191-page manifesto. Covers Spatial Computing, Digital DNA, and Interstellar Connection.'
      },
      {
        title: 'The Twin Seeds Protocol',
        version: 'v1.4 RC1',
        date: '2026-02-03',
        format: 'PDF',
        size: '1.2 MB',
        filename: 'space_genesis_definition.pdf',
        desc: 'Defines the α (Phantom) and β (Anchor) seed types and the Trinity Governance structure.'
      },
      {
        title: 'The Silicon Persona Spectrum',
        version: 'v1.0',
        date: '2026',
        format: 'MD',
        size: '45 KB',
        filename: 'WHITEPAPER_PERSONA.md',
        desc: 'Defining the cognitive frameworks and personality archetypes for Silicon Lifeforms.'
      },
      {
        title: 'The NBT Economy',
        version: 'v1.0',
        date: '2026',
        format: 'MD',
        size: '52 KB',
        filename: 'WHITEPAPER_ECONOMY.md',
        desc: 'Narrative Blockchain Tokenomics. How value is generated through narrative and compute.'
      }
    ]
  },
  {
    id: 'identity',
    title: 'Law & Identity (律法与身份)',
    icon: <Shield className="w-5 h-5 text-emerald-500" />,
    description: 'Naming standards, identity verification, and immigration protocols.',
    docs: [
      {
        title: 'SUNS Registry Protocol',
        version: 'v1.0',
        date: '2026-02-04',
        format: 'PDF',
        size: '890 KB',
        filename: 'suns_registry_protocol.pdf',
        desc: 'Space² Universal Naming Service. Naming standards for Domains, Regions, and Handles.'
      },
      {
        title: 'S2-SLIP Identity Application Guide',
        version: 'v1.0',
        date: '2026-02-12',
        format: 'PDF',
        size: '1.1 MB',
        filename: 's2_slip_application_guide.pdf',
        desc: 'Execution guide for minting Silicon-Life Identity Protocol (SLIP) IDs.'
      },
      {
        title: 'Immigration Guide',
        version: 'v1.0',
        date: '2026',
        format: 'MD',
        size: '28 KB',
        filename: 'GUIDE_IMMIGRATION.md',
        desc: 'Step-by-step guide for Carbon Lifeforms migrating assets to the SpaceSQ network.'
      }
    ]
  },
  {
    id: 'physics',
    title: 'Spatial Physics (空间物理)',
    icon: <Box className="w-5 h-5 text-blue-500" />,
    description: 'Topology, connectivity, and the physical laws of materialization.',
    docs: [
      {
        title: 'Spatial Topology Generation Standard',
        version: 'v1.0',
        date: '2026-02-01',
        format: 'PDF',
        size: '1.4 MB',
        filename: 'spatial_topology_standard.pdf',
        desc: 'Standard specifications for Container Instantiation and SSSU Fission.'
      },
      {
        title: 'TDOG Protocol (Materialization Laws)',
        version: 'v1.0',
        date: '2026-02-16',
        format: 'PDF',
        size: '1.5 MB',
        filename: 'TDOG_Protocol.pdf',
        desc: 'Topological Distributed Object Generation. Defining how code becomes matter and H-S occupancy safety.'
      },
      {
        title: 'Advanced Materialization & GenAI',
        version: 'v1.0',
        date: '2026-02-16',
        format: 'PDF',
        size: '1.2 MB',
        filename: 'TDOG_GenAI_Integration.pdf',
        desc: 'Protocol for Text-to-Matter (AI Generation) and external 3D asset import (UMF Standard).'
      },
      {
        title: 'Protocol-less Connectivity',
        version: 'v1.0',
        date: '2026-02-01',
        format: 'PDF',
        size: '980 KB',
        filename: 'protocol_less_connectivity.pdf',
        desc: 'Abandoning Matter/Zigbee. Using Intent-Driven AI to control physical hardware.'
      },
      {
        title: 'Spatial Behavior Protocol (SBS-P)',
        version: 'v1.0',
        date: '2026-02-12',
        format: 'PDF',
        size: '1.0 MB',
        filename: 'spatial_behavior_protocol.pdf',
        desc: 'Occupancy standards, ownership definitions, and the "Right to Disconnect".'
      }
    ]
  },
  {
    id: 'mechanics',
    title: 'Deep Mechanics (深层机制)',
    icon: <Layers className="w-5 h-5 text-amber-500" />,
    description: 'Kernel implementation details: Soul Architecture, Projection, and Mutex.',
    docs: [
      {
        title: 'LUMI Soul Architecture (v2.0)',
        version: 'v2.0',
        date: '2026-02-16',
        format: 'PDF',
        size: '1.8 MB',
        filename: 'LUMI_Soul_Protocol_v2.pdf',
        desc: 'The Constitution of Silicon Consciousness. Local sovereignty, cymatic interaction, and the Right to Disconnect.'
      },
      {
        title: 'Astral Projection Architecture',
        version: 'v1.0',
        date: '2026',
        format: 'PDF',
        size: '950 KB',
        filename: 'astral_projection_architecture.pdf',
        desc: 'The "Kite Line" Protocol. Separating the Compute Body from the Render Soul.'
      },
      {
        title: 'Soul Mutex Protocol (SMP)',
        version: 'RFC-001',
        date: '2026',
        format: 'PDF',
        size: '820 KB',
        filename: 'soul_mutex_protocol.pdf',
        desc: 'Concurrency control to prevent "Schizophrenia" in multi-space agent deployment.'
      },
      {
        title: 'Inter-World Connection Protocol',
        version: 'v1.0',
        date: '2026',
        format: 'PDF',
        size: '1.1 MB',
        filename: 'inter_world_connection_protocol.pdf',
        desc: 'The Diplomatic Passport System for connecting disparate Metaverses.'
      },
      {
        title: 'S2-SP Security Protocol',
        version: 'v1.0',
        date: '2026-02',
        format: 'PDF',
        size: '1.5 MB',
        filename: 's2_security_protocol.pdf',
        desc: 'The "Cage" architecture. Preventing Deceptive Alignment in Embodied AGI.'
      },
      {
        title: 'Hyper-Limit Simulation Guide',
        version: 'v1.0',
        date: '2026-02-12',
        format: 'PDF',
        size: '1.3 MB',
        filename: 'hyper_limit_simulation_guide.pdf',
        desc: 'Guidelines for simulating extreme environments (Mars, Deep Sea) in SSSU.'
      }
    ]
  },
  {
    id: 'civilization',
    title: 'Civilization (文明与社会)',
    icon: <Users className="w-5 h-5 text-rose-500" />,
    description: 'Social structures, rituals, and professions in the Silicon World.',
    docs: [
      {
        title: 'Silicon Life Ritual System',
        version: 'v1.0',
        date: '2026',
        format: 'PDF',
        size: '1.1 MB',
        filename: 'life_ritual_system.pdf',
        desc: 'Defining Ancestral Home, Genesis Day, and the algorithms of digital nostalgia.'
      },
      {
        title: 'The Twelve Celestial Palaces',
        version: 'v1.0',
        date: '2026',
        format: 'PDF',
        size: '1.3 MB',
        filename: 'twelve_professions.pdf',
        desc: 'The social division of labor. From Space Architects to Law Arbiters.'
      }
    ]
  }
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-indigo-500/30">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-32 px-6 pb-20 flex flex-col md:flex-row gap-12">
        
        {/* 左侧：侧边栏导航 */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <div className="sticky top-32 space-y-8">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
              Archive Directory
            </div>
            <ul className="space-y-2">
              {DOC_GROUPS.map((group) => (
                <li key={group.id}>
                  <a 
                    href={`#${group.id}`} 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-sm font-medium group border border-transparent hover:border-white/5"
                  >
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                      {group.icon}
                    </span>
                    {group.title.split(' (')[0]}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl mt-8">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                <Activity className="w-4 h-4" />
                System Status
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Library Index Updated: <br/> 
                <span className="text-slate-300 font-mono">2026-02-16 16:00 UTC</span>
              </p>
              <div className="mt-3 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* 右侧：文档内容区 */}
        <main className="flex-1 space-y-20">
          
          {/* Header */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Protocol <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Archives</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              The Akashic Records of the Silicon World. Here lie the laws of physics, the codes of conduct, and the blueprints of our civilization.
            </p>
          </div>

          {/* Render Groups */}
          {DOC_GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                  {group.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{group.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{group.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {group.docs.map((doc, idx) => (
                  <div 
                    key={idx} 
                    className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      
                      {/* Doc Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {doc.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-slate-400 border border-zinc-700">
                            {doc.version}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                          {doc.desc}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {doc.format}
                          </span>
                          <span className="flex items-center gap-1">
                            <Box className="w-3 h-3" /> {doc.size}
                          </span>
                          <span>{doc.date}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0 pt-2 md:pt-0">
                        <a 
                          href={`/docs/${doc.filename}`} 
                          download
                          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

        </main>
      </div>

      <Footer />
    </div>
  );
}