import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  LayoutDashboard, 
  Target, 
  Briefcase, 
  CreditCard, 
  FileText, 
  Settings as SettingsIcon,
  Bell,
  Search,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Sub-components
import Dashboard from './components/Dashboard';
import DreamTracker from './components/DreamTracker';
import BusinessHub from './components/BusinessHub';
import Invoices from './components/Invoices';
import Subscriptions from './components/Subscriptions';
import Analytics from './components/Analytics';
import Debts from './components/Debts';
import Settings from './components/Settings';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: number;
  client: string;
  service: string;
  status: 'Proses' | 'Selesai';
  price: number;
  deadline: string;
}

export interface Wishlist {
  id: number;
  name: string;
  goal: number;
  current: number;
  type: 'Stabil' | 'Fluktuatif';
  fixedAmount?: number;
}

export interface Transaction {
  id: number;
  type: 'Pemasukan' | 'Pengeluaran';
  amount: number;
  category: string;
  timestamp: string; // "2026-04-18T10:47:00"
  note: string;
}

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'Lunas' | 'Pending';
  timestamp: string;
}

export interface Debt {
  id: number;
  person: string;
  amount: number;
  type: 'Hutang' | 'Piutang'; // Hutang: Saya hutang ke orang, Piutang: Orang hutang ke saya
  dueDate: string;
  status: 'Belum Lunas' | 'Lunas';
  note: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Persistence Keys
  const STORAGE_KEYS = {
    COACH: 'smartflow_coach_config',
    BALANCE: 'smartflow_balance',
    TARGETS: 'smartflow_targets',
    TRANSACTIONS: 'smartflow_transactions',
    PROJECTS: 'smartflow_projects',
    INVOICES: 'smartflow_invoices',
    DEBTS: 'smartflow_debts',
    USER: 'smartflow_user_profile'
  };

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : {
      name: 'Rizky Pratama',
      school: 'Universitas Pasundan',
      email: 'rizky.flow@student.ac.id'
    };
  });

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
    return saved ? JSON.parse(saved) : 4250000;
  });

  const [showAICoach, setShowAICoach] = useState(true);
  const [showCoachEditor, setShowCoachEditor] = useState(false);
  
  const [coachConfig, setCoachConfig] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COACH);
    return saved ? JSON.parse(saved) : {
      message: "\"Hey Rizky! Kamu sudah jajan kopi 4x minggu ini. Jika kamu kurangi jadi 1x, kamu bisa beli MacBook M3 Pro 3 bulan lebih cepat! 🚀\"",
      buttonText: "Oke, Noted!"
    };
  });
  
  const [targets, setTargets] = useState<Wishlist[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TARGETS);
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "MacBook M3 Pro", goal: 17000000, current: 4250000, type: 'Fluktuatif' },
      { id: 2, name: "Dana Darurat", goal: 5000000, current: 1200000, type: 'Stabil', fixedAmount: 50000 },
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'Pemasukan', amount: 500000, category: 'Freelance', timestamp: '2026-04-15T09:30:00', note: 'Project Logo' },
      { id: 2, type: 'Pengeluaran', amount: 35000, category: 'Makan', timestamp: '2026-04-17T12:45:00', note: 'Nasi Padang' },
    ];
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : [
      { id: 1, client: "Unpas Event", service: "Desain Poster", status: "Proses", price: 250000, deadline: 'Tomorrow' },
      { id: 2, client: "Dr. Wahyitno", service: "Web Undangan", status: "Selesai", price: 1500000, deadline: 'Done' },
      { id: 3, client: "Himpunan Teknik", service: "Logo Rebranding", status: "Proses", price: 600000, deadline: '3 days left' },
    ];
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : [
      { id: 'INV-001', client: 'Bima Satria', amount: 250000, status: 'Lunas', timestamp: '2026-04-15T10:00:00' },
      { id: 'INV-002', client: 'Kantin Teknik', amount: 120000, status: 'Pending', timestamp: '2026-04-17T14:30:00' },
    ];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEBTS);
    return saved ? JSON.parse(saved) : [
      { id: 1, person: 'Andi Kusuma', amount: 50000, type: 'Piutang', dueDate: '2026-04-20', status: 'Belum Lunas', note: 'Bayar makan siang' },
      { id: 2, person: 'Warung Bu Siti', amount: 25000, type: 'Hutang', dueDate: '2026-04-19', status: 'Belum Lunas', note: 'Nasi ayam (kredit)' },
    ];
  });

  // Persistence Effects
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COACH, JSON.stringify(coachConfig)); }, [coachConfig]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(balance)); }, [balance]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets)); }, [targets]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)); }, [user]);

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { id: 'dream', label: 'Dream Tracker', icon: Target },
    { id: 'business', label: 'Bisnis Saya', icon: Briefcase },
    { id: 'invoice', label: 'Tagihan & Invoice', icon: FileText },
    { id: 'debts', label: 'Hutang & Piutang', icon: CreditCard },
    { id: 'subscription', label: 'Langganan', icon: CreditCard },
    { id: 'analytics', label: 'Analisis & Laporan', icon: BarChart3 },
    { id: 'settings', label: 'Pengaturan', icon: SettingsIcon, mt: 'mt-auto' },
  ];

  const handleTransaction = (data: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx = { 
      ...data, 
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    if (data.type === 'Pemasukan') {
      setBalance(prev => prev + data.amount);
    } else {
      setBalance(prev => prev - data.amount);
    }
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleAllocate = (wishlistId: number, amount: number) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      setTargets(prev => prev.map(t => t.id === wishlistId ? { ...t, current: t.current + amount } : t));
    } else {
      alert("Saldo tidak mencukupi!");
    }
  };

  const addWishlist = (wishlist: Omit<Wishlist, 'id'>) => {
    setTargets(prev => [...prev, { ...wishlist, id: Date.now() }]);
  };

  const updateWishlist = (updated: Wishlist) => {
    setTargets(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteWishlist = (id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now() };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'timestamp'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString()
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const updateInvoiceStatus = (id: string, status: 'Lunas' | 'Pending') => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt: Debt = { ...debt, id: Date.now() };
    setDebts(prev => [newDebt, ...prev]);
  };

  const updateDebtStatus = (id: number, status: 'Lunas' | 'Belum Lunas') => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const deleteDebt = (id: number) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const resetApp = () => {
    if (confirm("Apakah Anda yakin ingin menghapus SEMUA data aplikasi? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const getDynamicMessage = () => {
    switch (activeTab) {
      case 'dashboard':
        return coachConfig.message;
      case 'dream': {
        const primary = targets.find(t => t.current < t.goal);
        if (!primary) return "Semua impianmu sudah tercapai! Saatnya membuat target baru. ✨";
        const progress = Math.round((primary.current / primary.goal) * 100);
        return `"Semangat menabung untuk ${primary.name}! Kamu sudah mencapai ${progress}%. Sedikit lagi laptop baru di tangan! 🚀"`;
      }
      case 'business': {
        const urgent = projects.find(p => p.status === 'Proses');
        if (!urgent) return "Semua proyek sudah selesai! Saatnya mencari klien baru untuk menambah pundi-pundi. 💼";
        return `"Ingat! Proyek '${urgent.client} - ${urgent.service}' harus segera dikerjakan. Fokus & berikan yang terbaik! 🔥"`;
      }
      case 'invoice': {
        const pending = invoices.find(inv => inv.status === 'Pending');
        if (!pending) return "Semua tagihan sudah terbayar! Keuangan bisnis dalam kondisi sehat. ✅";
        return `"Ada tagihan pending dari ${pending.client} sebesar Rp ${pending.amount.toLocaleString()}. Jangan lupa untuk follow up! ✉️"`;
      }
      case 'debts': {
        const urgentDebt = debts.find(d => d.type === 'Hutang' && d.status === 'Belum Lunas');
        const urgentPiutang = debts.find(d => d.type === 'Piutang' && d.status === 'Belum Lunas');
        
        if (urgentDebt) return `"Peringatan! Hutang ke ${urgentDebt.person} jatuh tempo pada ${urgentDebt.dueDate}. Pastikan saldo cukup untuk membayar! 🚨"`;
        if (urgentPiutang) return `"Jangan lupa tagih piutang ke ${urgentPiutang.person}. Uangnya bisa dikalokasikan ke dana tabunganmu! 💰"`;
        return "Catatan hutang piutangmu bersih. Pertahankan disiplin keuangan ini! 🛡️";
      }
      default:
        return coachConfig.message;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          balance={balance} 
          targets={targets} 
          projects={projects} 
          transactions={transactions}
          onAddTransaction={handleTransaction}
          onSwitchTab={setActiveTab}
        />;
      case 'dream':
        return <DreamTracker 
          targets={targets} 
          onAllocate={handleAllocate}
          onAdd={addWishlist}
          onUpdate={updateWishlist}
          onDelete={deleteWishlist}
        />;
      case 'business':
        return <BusinessHub 
          projects={projects} 
          onAdd={addProject} 
          onUpdate={updateProject} 
          onDelete={deleteProject} 
        />;
      case 'invoice':
        return <Invoices 
          invoices={invoices} 
          onAdd={addInvoice} 
          onUpdateStatus={updateInvoiceStatus} 
          onDelete={deleteInvoice} 
        />;
      case 'debts':
        return <Debts 
          debts={debts} 
          onAdd={addDebt} 
          onUpdateStatus={updateDebtStatus} 
          onDelete={deleteDebt}
          onAddAsTransaction={handleTransaction}
        />;
      case 'subscription':
        return <Subscriptions />;
      case 'analytics':
        return <Analytics 
          balance={balance} 
          targets={targets} 
          projects={projects} 
          transactions={transactions} 
        />;
      case 'settings':
        return <Settings 
          user={user} 
          onUpdateUser={setUser} 
          showAICoach={showAICoach}
          onToggleAICoach={setShowAICoach}
          onReset={resetApp}
        />;
      default:
        return <Dashboard 
          balance={balance} 
          targets={targets} 
          projects={projects} 
          transactions={transactions}
          onAddTransaction={handleTransaction}
          onSwitchTab={setActiveTab}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-bg-deep overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-bg-surface border-r border-glass-border p-8 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-electric-blue flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-xl font-extrabold text-electric-blue tracking-tight">SmartFlow</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 group text-left",
                item.mt,
                activeTab === item.id 
                  ? "bg-electric-blue/10 text-electric-blue font-semibold" 
                  : "text-text-dim hover:text-text-main hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-colors",
                activeTab === item.id ? "text-electric-blue" : "text-text-dim group-hover:text-text-main"
              )} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,_var(--color-bg-surface),_var(--color-bg-deep))] p-10 pb-40">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Halo, Rizky Maulana 👋</h1>
            <p className="text-text-dim text-sm mt-1">Pantau arus kas mahasiswa & bisnismu hari ini.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-white/5 rounded-xl p-1 border border-glass-border">
              <button className="p-2 text-text-dim hover:text-text-main transition-colors">
                <Search size={18} />
              </button>
              <button className="p-2 text-text-dim hover:text-text-main transition-colors relative border-l border-glass-border ml-1 pl-2">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-terracotta rounded-full border border-bg-surface shadow-[0_0_5px_rgba(226,115,91,0.5)]"></span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-text-main">Mahasiswa Kreatif</p>
                <p className="text-xs text-text-dim">Tingkat Pro</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-electric-blue to-emerald border-2 border-glass-border shadow-lg"></div>
            </div>
          </div>
        </header>

        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* AI Financial Coach Bubble (Always visible for smart tips) */}
        <AnimatePresence>
          {showAICoach && (
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              className="fixed bottom-10 right-10 w-[350px] bg-gradient-to-br from-bg-surface to-[#080C14] border border-electric-blue/40 rounded-[24px] p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] z-50 overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-electric-blue/20 blur-[60px] rounded-full group-hover:bg-electric-blue/30 transition-all duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-electric-blue px-2.5 py-1 rounded-md text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-lg shadow-electric-blue/20">
                    <Sparkles size={11} className="fill-white" />
                    <span>Financial Coach AI</span>
                  </div>
                  <button 
                    onClick={() => setShowCoachEditor(true)}
                    className="p-1 px-2.5 text-[9px] font-black text-text-dim hover:text-electric-blue transition-colors flex items-center gap-1 uppercase tracking-widest"
                  >
                    Edit
                  </button>
                </div>
                
                <p className="text-[13px] leading-relaxed text-text-main/90 font-medium whitespace-pre-line">
                  {getDynamicMessage()}
                </p>
                
                <div className="mt-5 flex gap-3">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-[10px] font-black tracking-widest uppercase py-3 rounded-xl border border-glass-border transition-all active:scale-95">Lihat Analisa</button>
                  <button 
                    onClick={() => setShowAICoach(false)}
                    className="bg-electric-blue hover:brightness-110 text-[10px] font-black tracking-widest uppercase py-3 px-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-electric-blue/20"
                  >
                    {coachConfig.buttonText}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* AI Coach Editor Modal */}
        <AnimatePresence>
          {showCoachEditor && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCoachEditor(false)}
                className="absolute inset-0 bg-bg-deep/90 backdrop-blur-md"
              ></motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-bg-surface border border-glass-border w-full max-w-md rounded-[32px] p-8 relative z-10 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-text-main tracking-tight uppercase italic">Edit Pengingat AI</h3>
                  <button onClick={() => setShowCoachEditor(false)} className="text-text-dim hover:text-text-main transition-colors">
                    <TrendingUp className="rotate-45" size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Pesan Pengingat</label>
                    <textarea 
                      value={coachConfig.message}
                      onChange={e => setCoachConfig({...coachConfig, message: e.target.value})}
                      className="w-full bg-white/5 border border-glass-border rounded-2xl p-4 text-text-main text-sm focus:outline-none focus:border-electric-blue transition-all h-32 resize-none leading-relaxed"
                      placeholder="Tulis pesan pengingat di sini..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Tekst Tombol Oke</label>
                    <input 
                      value={coachConfig.buttonText}
                      onChange={e => setCoachConfig({...coachConfig, buttonText: e.target.value})}
                      className="w-full bg-white/5 border border-glass-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-electric-blue transition-colors font-bold"
                      placeholder="Contoh: Oke, Noted!"
                    />
                  </div>
                  
                  <button 
                    onClick={() => setShowCoachEditor(false)}
                    className="w-full bg-electric-blue text-white py-4 rounded-2xl font-black shadow-lg shadow-electric-blue/20 hover:brightness-110 transition-all uppercase tracking-widest italic"
                  >
                    Simpan & Update AI Coach
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
