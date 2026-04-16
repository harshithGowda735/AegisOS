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
  Plus,
  DollarSign,
  Briefcase,
  GraduationCap,
  Calendar,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpRight,
  Heart
} from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const HospitalDashboard = () => {
  const { adminStats, recentBookings, doctors, fetchAdminData, registerDoctor, isLoading } = useAppStore();
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'medications', label: 'Medications', icon: Heart },
    { id: 'documents', label: 'Documents', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar - Reference 1 Style */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 flex-col hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">A</div>
          <span className="text-2xl font-black tracking-tighter">Hospital<span className="text-sky-500">App</span></span>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full px-5 py-4 rounded-xl flex items-center gap-4 font-bold text-sm transition-all ${activeTab === item.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
           <button className="flex items-center gap-4 text-slate-400 font-bold text-sm px-5 py-4 hover:text-rose-500 transition-colors">
              <RefreshCw size={20} /> Reload Session
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-14 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-14 page-animate opacity-0">
          <div className="relative flex-1 max-w-xl group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={20} />
             <input 
               type="text" 
               placeholder="Search for patients, doctors, or reports..."
               className="w-full bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-16 pr-8 text-sm font-medium outline-none shadow-sm focus:border-sky-500 transition-all"
             />
          </div>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white border border-slate-100 rounded-[1.25rem] flex items-center justify-center text-slate-400 relative">
                <Calendar size={20} />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></div>
             </div>
             <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-black text-slate-900">Antonio Murray</p>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Admin Node #01</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 border-4 border-white shadow-lg"></div>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Left Column: Stats & Trends */}
            <div className="xl:col-span-2 space-y-10">
               {/* Stats Row */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] saas-shadow-lg border border-slate-50 relative group">
                     <div className="absolute top-6 right-6 w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                        <ArrowUpRight size={20} />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Total Patients</p>
                     <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{adminStats?.totalPatients || 151}</h3>
                     <p className="text-xs font-bold text-sky-500">+15% vs last month</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] saas-shadow-lg border border-slate-50">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">In-clinic Visit</p>
                     <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">80</h3>
                     <p className="text-xs font-bold text-emerald-500">+3% vs last month</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] saas-shadow-lg border border-slate-50 text-white bg-sky-500">
                     <p className="text-[10px] font-black uppercase tracking-widest text-sky-100 mb-4">Total Revenue</p>
                     <h3 className="text-5xl font-black mb-2 tracking-tighter">${adminStats?.totalRevenue || 5728}</h3>
                     <p className="text-xs font-bold text-sky-100">Live projected nodal income</p>
                  </div>
               </div>

               {/* New Patients Table - Reference 1 Style */}
               <div className="bg-white rounded-[2.5rem] saas-shadow-lg border border-slate-50 overflow-hidden">
                  <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-2xl font-black tracking-tight">Recent Admittances</h3>
                     <div className="flex gap-4">
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest">See All</Button>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              <th className="px-10 py-5">Patient Name</th>
                              <th className="px-6 py-5">Wait Time</th>
                              <th className="px-6 py-5">Hospital</th>
                              <th className="px-6 py-5">Status</th>
                              <th className="px-10 py-5 text-center">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {recentBookings.map((booking) => (
                              <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs uppercase">
                                          {booking.patientName[0]}
                                       </div>
                                       <div>
                                          <p className="font-bold text-slate-900">{booking.patientName}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {booking.bookingId}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-6 font-bold text-slate-600">12 min</td>
                                 <td className="px-6 py-6 font-bold text-slate-600">{booking.hospitalName}</td>
                                 <td className="px-6 py-6">
                                    <span className="px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                                 </td>
                                 <td className="px-10 py-6 text-center">
                                    <button className="text-slate-300 hover:text-slate-900"><MoreHorizontal size={20} /></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Right Column: Mini Tables & Lists */}
            <div className="space-y-10">
               {/* Upcoming Appointments List */}
               <div className="bg-white rounded-[2.5rem] saas-shadow-lg border border-slate-50 p-10">
                  <div className="flex items-center justify-between mb-8">
                     <h4 className="text-xl font-black tracking-tight">Appointments</h4>
                     <ArrowUpRight size={20} className="text-slate-300" />
                  </div>
                  <div className="space-y-6">
                     {doctors.slice(0, 3).map((doc, i) => (
                        <div key={i} className="flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                 <div className="w-full h-full bg-gradient-to-tr from-sky-100 to-indigo-100 flex items-center justify-center font-black text-sky-700 text-lg">{doc.name[0]}</div>
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900">{doc.name}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.specialty}</p>
                              </div>
                           </div>
                           <p className="text-xs font-black text-slate-900">3:00 PM</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Medication Schedule Placeholder */}
               <div className="bg-white rounded-[2.5rem] saas-shadow-lg border border-slate-50 p-10">
                   <div className="flex items-center justify-between mb-8">
                     <h4 className="text-xl font-black tracking-tight">Operations</h4>
                     <button className="text-sky-500 font-black text-[10px] uppercase tracking-widest">See All</button>
                  </div>
                  <div className="space-y-4">
                     {[
                        { title: 'Cardiovascular', time: '9:00 AM' },
                        { title: 'Neuro Node 12', time: '11:45 AM' },
                     ].map((item, i) => (
                        <div key={i} className="p-5 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-transparent hover:border-sky-200 transition-all cursor-pointer">
                           <p className="font-bold text-slate-700">{item.title}</p>
                           <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{item.time}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2">Facility Doctors</h2>
                  <p className="text-slate-400 font-medium">Manage medical personnel and expertise clusters.</p>
               </div>
               <div className="flex gap-4">
                  <Button variant="secondary" icon={Filter}>Filters</Button>
                  <Button icon={Plus} onClick={() => setShowAddDoctor(true)}>Register Staff</Button>
               </div>
            </div>

            {showAddDoctor && (
              <div className="bg-white p-10 rounded-[2.5rem] saas-shadow-lg border-2 border-sky-500 mb-12 animate-in zoom-in-95">
                 <h3 className="text-xl font-black mb-8 flex items-center gap-2">Onboard New Personnel</h3>
                 <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</label>
                       <input 
                        type="text" 
                        placeholder="Dr. John Doe"
                        className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Specialty</label>
                       <input 
                        type="text" 
                        placeholder="Cardiologist"
                        className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all"
                        value={newDoctor.specialty}
                        onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Education</label>
                       <input 
                        type="text" 
                        placeholder="M.B.B.S"
                        className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all"
                        value={newDoctor.education}
                        onChange={(e) => setNewDoctor({...newDoctor, education: e.target.value})}
                       />
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-4">
                       <Button variant="ghost" onClick={() => setShowAddDoctor(false)}>Cancel</Button>
                       <Button type="submit" isLoading={isLoading}>Add Doctor</Button>
                    </div>
                 </form>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] saas-shadow-lg border border-slate-50 overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <th className="px-10 py-5">Doctor Name</th>
                        <th className="px-6 py-5">Specialization</th>
                        <th className="px-6 py-5">Education</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-10 py-5 text-center">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {doctors.map((doc) => (
                        <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">{doc.name[0]}</div>
                                 <span className="font-black text-slate-900">{doc.name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-6 font-bold text-slate-600">{doc.specialty}</td>
                           <td className="px-6 py-6 font-bold text-slate-400">{doc.education}</td>
                           <td className="px-6 py-6">
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                 <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Available</span>
                              </div>
                           </td>
                           <td className="px-10 py-6 text-center">
                              <button className="text-slate-300 hover:text-slate-900"><MoreHorizontal size={20} /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HospitalDashboard;
