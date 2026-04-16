import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Users, 
  Bed, 
  Stethoscope, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  RefreshCw,
  Activity,
  UserCheck,
  User,
  Plus,
  DollarSign,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const HospitalDashboard = () => {
  const { adminStats, recentBookings, doctors, fetchAdminData, registerDoctor, isLoading } = useAppStore();
  const [activeTab, setActiveTab] = useState('telemetry');
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', education: '' });

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.specialty) return;
    const success = await registerDoctor(newDoctor);
    if (success) {
      setShowAddDoctor(false);
      setNewDoctor({ name: '', specialty: '', education: '' });
    }
  };

  const menuItems = [
    { id: 'telemetry', label: 'Telemetry', icon: TrendingUp },
    { id: 'staff', label: 'Staff Management', icon: Stethoscope },
    { id: 'beds', label: 'Bed Mapping', icon: Bed },
    { id: 'patients', label: 'Patient Records', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar - Reference 3 Style */}
      <aside className="w-72 bg-indigo-700 text-white p-10 flex-col hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-xl">A</div>
          <span className="text-2xl font-black tracking-tight">Hospital<span className="text-indigo-200">App</span></span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 font-black text-sm transition-all ${activeTab === item.id ? 'bg-white text-indigo-700 shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-indigo-600/50">
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-2">System Status</p>
            <p className="text-xs font-bold leading-relaxed">AI Core v4.2 is optimizing staff flux mapping.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-14 overflow-y-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-14 page-animate opacity-0">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
              {activeTab === 'telemetry' ? 'Dashboard Overview' : activeTab === 'staff' ? 'Medical Staff' : 'Hospital Central'}
            </h1>
            <p className="text-slate-400 font-medium">Regional Healthcare Node #012 • Live Telemetry</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
              onClick={fetchAdminData}
              className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
             >
                <RefreshCw size={24} className={isLoading ? 'animate-spin' : ''} />
             </button>
             <div className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black flex items-center gap-4 shadow-2xl shadow-slate-900/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs">AM</div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Administrator</p>
                   <p className="text-sm">Antonio Murray</p>
                </div>
             </div>
          </div>
        </header>

        {activeTab === 'telemetry' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-indigo-100 group-hover:text-indigo-600 transition-colors">
                   <Users size={64} />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">New Patients</p>
                <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{adminStats?.totalPatients || 0}</h3>
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-black">
                   <TrendingUp size={14} /> +12% vs last month
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-blue-100 group-hover:text-blue-600 transition-colors">
                   <Stethoscope size={64} />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Our Doctors</p>
                <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{doctors.length}</h3>
                <div className="flex items-center gap-2 text-blue-500 text-xs font-black">
                   Active Personnel
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-emerald-100 group-hover:text-emerald-600 transition-colors">
                   <Activity size={64} />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">Operations</p>
                <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">14</h3>
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-black">
                   Successful today
                </div>
              </div>

              <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl shadow-indigo-600/30 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-white/10">
                   <DollarSign size={64} />
                </div>
                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-4 tracking-[0.2em]">Live Revenue</p>
                <h3 className="text-5xl font-black mb-2 tracking-tighter">${adminStats?.totalRevenue || 0}</h3>
                <div className="flex items-center gap-2 text-indigo-100 text-xs font-black">
                   <TrendingUp size={14} /> Projected $8.2k
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Analytics Chart Placeholder */}
              <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/10 h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Patient Status</h3>
                   <select className="bg-slate-50 border-none rounded-xl px-4 py-2 font-black text-xs text-slate-600 outline-none">
                      <option>This Year</option>
                      <option>This Month</option>
                   </select>
                </div>
                <div className="flex-1 w-full bg-slate-50/50 rounded-3xl relative overflow-hidden flex items-center justify-center">
                   {/* Simulated line chart with SVG */}
                   <svg className="w-full h-full" viewBox="0 0 800 200">
                      <path 
                        d="M0 150 Q 100 80 200 120 T 400 60 T 600 130 T 800 40" 
                        fill="none" 
                        stroke="#6366f1" 
                        strokeWidth="5" 
                        className="animate-pulse"
                      />
                      <path 
                        d="M0 180 Q 150 140 300 160 T 500 100 T 800 140" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3" 
                        opacity="0.4"
                      />
                   </svg>
                   <div className="absolute bottom-8 left-8 flex gap-6">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recovered</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Death</span></div>
                   </div>
                </div>
              </div>

              {/* Best Doctor Placeholder Card */}
              <div className="bg-indigo-700 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-700/30 flex flex-col items-center justify-center text-center">
                 <div className="w-40 h-40 rounded-[3rem] bg-indigo-500/30 p-2 mb-8 relative">
                    <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-tr from-white to-indigo-100 flex items-center justify-center text-indigo-700 text-5xl font-black">
                       JW
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-2xl border-4 border-indigo-700 flex items-center justify-center">
                       <UserCheck size={20} />
                    </div>
                 </div>
                 <h3 className="text-3xl font-black mb-2 tracking-tight">Dr. Jonathan Wallace</h3>
                 <p className="text-indigo-200 font-bold text-sm mb-10 tracking-widest uppercase text-[10px]">Endocrinologist • Sidney Hospital</p>
                 
                 <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                       <p className="text-[8px] font-black text-indigo-300 uppercase mb-1">Experience</p>
                       <p className="text-sm font-black italic">8 Years</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                       <p className="text-[8px] font-black text-indigo-300 uppercase mb-1">Patients</p>
                       <p className="text-sm font-black italic">2,598</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                       <p className="text-[8px] font-black text-indigo-300 uppercase mb-1">Reviews</p>
                       <p className="text-sm font-black italic">1,537</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Facility Doctors</h2>
                  <p className="text-slate-400 font-medium">Manage and register available medical personnel for triage routing.</p>
               </div>
               <Button 
                onClick={() => setShowAddDoctor(true)}
                icon={Plus}
                className="rounded-2xl px-8"
               >
                  Register Staff
               </Button>
            </div>

            {showAddDoctor && (
              <div className="bg-white p-10 rounded-[2.5rem] border-2 border-indigo-500 shadow-2xl mb-12 animate-in zoom-in-95 duration-300">
                 <h3 className="text-xl font-black mb-8 flex items-center gap-2"><Plus size={20} className="text-indigo-600" /> New Doctor Onboarding</h3>
                 <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                       <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border-2 border-transparent focus-within:border-indigo-500 transition-all">
                          <User size={18} className="text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Dr. John Doe"
                            className="bg-transparent border-none outline-none font-bold text-slate-700 w-full"
                            value={newDoctor.name}
                            onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Specialty</label>
                       <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border-2 border-transparent focus-within:border-indigo-500 transition-all">
                          <Briefcase size={18} className="text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Cardiologist"
                            className="bg-transparent border-none outline-none font-bold text-slate-700 w-full"
                            value={newDoctor.specialty}
                            onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Education</label>
                       <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border-2 border-transparent focus-within:border-indigo-500 transition-all">
                          <GraduationCap size={18} className="text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="M.B.B.S, MD"
                            className="bg-transparent border-none outline-none font-bold text-slate-700 w-full"
                            value={newDoctor.education}
                            onChange={(e) => setNewDoctor({...newDoctor, education: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="md:col-span-3 pt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => setShowAddDoctor(false)} className="px-8 py-3 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                        <Button type="submit" isLoading={isLoading} className="rounded-xl px-12">Register Doctor</Button>
                    </div>
                 </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {doctors.length > 0 ? doctors.map((doc, i) => (
                 <div key={doc._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/10 hover:-translate-y-2 transition-transform duration-500 group">
                    <div className="flex items-center gap-6 mb-8">
                       <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                          {doc.name[0]}
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-slate-900 tracking-tight">{doc.name}</h4>
                          <p className="text-xs font-bold text-indigo-600 underline decoration-indigo-200 underline-offset-4">{doc.specialty}</p>
                       </div>
                    </div>
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-3 text-slate-400">
                          <GraduationCap size={16} />
                          <span className="text-xs font-medium">{doc.education}</span>
                       </div>
                       <div className="flex items-center gap-3 text-emerald-500">
                          <CheckCircle2 size={16} />
                          <span className="text-[10px] font-black tracking-widest uppercase">Available Today</span>
                       </div>
                    </div>
                    <button className="w-full py-4 bg-slate-50 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                       View Calendar
                    </button>
                 </div>
               )) : (
                 <div className="md:col-span-3 py-20 bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-10">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 mb-6 shadow-xl shadow-slate-200/50">
                       <Users size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Registered Staff</h3>
                    <p className="text-slate-400 max-w-sm">Use the "Register Staff" button above to add doctor expertise to your facility.</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HospitalDashboard;
