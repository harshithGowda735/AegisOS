import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  Users, Stethoscope, CheckCircle2, Clock, RefreshCw,
  Activity, UserCheck, Plus, Calendar, MoreHorizontal,
  Search, Filter, ArrowUpRight, Heart, BedDouble, Trash2,
  Wifi, AlertTriangle, PenLine, ShieldCheck
} from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import CameraNode from '../components/dashboard/CameraNode';
import { hospitalService } from '../services/hospitalService';

const HospitalDashboard = () => {
  const {
    adminStats, recentBookings, doctors, adminHospitals, allPatients,
    fetchAdminData, registerDoctor, updateBeds, addBedType, removeBedType,
    deletePatient, deleteBooking
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', education: '' });
  
  // Bed management state
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showAddBed, setShowAddBed] = useState(false);
  const [newBed, setNewBed] = useState({ type: '', total: '', available: '' });

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Set first hospital as default when loaded
  useEffect(() => {
    if (adminHospitals?.length > 0 && !selectedHospital) {
      setSelectedHospital(adminHospitals[0]);
    }
  }, [adminHospitals]);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.specialty) return;
    const success = await registerDoctor(newDoctor);
    if (success) {
      setShowAddDoctor(false);
      setNewDoctor({ name: '', specialty: '', education: '' });
    }
  };

  const handleAddBedType = async (e) => {
    e.preventDefault();
    if (!selectedHospital || !newBed.type) return;
    const success = await addBedType(selectedHospital._id, {
      type: newBed.type,
      total: parseInt(newBed.total) || 0,
      available: parseInt(newBed.available) || 0,
    });
    if (success) { 
        setShowAddBed(false); 
        setNewBed({ type: '', total: '', available: '' }); 
    }
  };

  const handleRemoveBed = async (type) => {
    if (!selectedHospital) return;
    await removeBedType(selectedHospital._id, type);
    // Refresh local selected hospital from updated list
    const updated = useAppStore.getState().adminHospitals.find(h => h._id === selectedHospital._id);
    if (updated) setSelectedHospital(updated);
  };

  const handleAvailableChange = async (type, value) => {
    if (!selectedHospital) return;
    const bed = selectedHospital.beds.find(b => b.type === type);
    await updateBeds(selectedHospital._id, type, parseInt(value), bed?.total);
    const updated = useAppStore.getState().adminHospitals.find(h => h._id === selectedHospital._id);
    if (updated) setSelectedHospital(updated);
  };

  const getCrowdColor = (score) => {
    if (score >= 75) return 'text-rose-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'beds', label: 'Beds', icon: BedDouble },
    { id: 'vision', label: 'Vision Hub', icon: ShieldCheck },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'patients', label: 'Patients', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 flex-col hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">A</div>
          <span className="text-2xl font-black tracking-tighter">Aegis<span className="text-sky-500">OS</span></span>
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
           <button 
             onClick={() => window.location.reload()}
             className="flex items-center gap-4 text-slate-400 font-bold text-sm px-5 py-4 hover:text-rose-500 transition-colors w-full"
           >
              <RefreshCw size={20} /> Reload Session
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-14 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-14">
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
                   <p className="text-sm font-black text-slate-900">Admin Node</p>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Control Center</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 border-4 border-white shadow-lg"></div>
             </div>
          </div>
        </header>

        {/* ─── DASHBOARD TAB ─── */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-10">
               {/* Stats Row */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm relative group">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Total Patients</p>
                     <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{adminStats?.totalPatients || 0}</h3>
                     <p className="text-xs font-bold text-sky-500">+15% vs last month</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Admissions</p>
                     <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{adminStats?.totalBookings || 0}</h3>
                     <p className="text-xs font-bold text-emerald-500">+3% vs last month</p>
                  </div>
                  <div className="bg-sky-500 p-8 rounded-[2.5rem] text-white shadow-lg shadow-sky-500/20">
                     <p className="text-[10px] font-black uppercase tracking-widest text-sky-100 mb-4">Live Revenue</p>
                     <h3 className="text-5xl font-black mb-2 tracking-tighter">₹{adminStats?.totalRevenue?.toLocaleString() || 0}</h3>
                     <p className="text-xs font-bold text-sky-100">Projected nodal income</p>
                  </div>
               </div>

               {/* Recent Patients Table */}
               <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                  <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-2xl font-black tracking-tight">Recent Admittances</h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              <th className="px-10 py-5">Patient Name</th>
                              <th className="px-6 py-5">Facility</th>
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
                                 <td className="px-6 py-6 font-bold text-slate-600">{booking.hospitalName}</td>
                                 <td className="px-6 py-6 font-bold text-emerald-500">Active</td>
                                 <td className="px-10 py-6 text-center">
                                    <button 
                                      onClick={() => {
                                        const id = booking._id || booking.id;
                                        if (id && window.confirm("Purge admission record?")) {
                                          deleteBooking(id);
                                        }
                                      }}
                                      className="text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                      <Trash2 size={20} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Right Column */}
            <div className="space-y-10">
               <div className="bg-white rounded-[2.5rem] border border-slate-50 p-10 shadow-sm">
                  <h4 className="text-xl font-black tracking-tight mb-8">Active Doctors</h4>
                  <div className="space-y-6">
                     {doctors.slice(0, 4).map((doc, i) => (
                        <div key={i} className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-tr from-sky-400 to-blue-500 rounded-full flex items-center justify-center font-black text-white text-lg">{doc.name ? doc.name[0] : 'D'}</div>
                              <div>
                                 <p className="font-bold text-slate-900">{doc.name}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.specialty}</p>
                              </div>
                           </div>
                           <p className="text-xs font-black text-emerald-500">Online</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ─── BEDS TAB ─── */}
        {activeTab === 'beds' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black tracking-tighter mb-2">Resource Center</h2>
                <p className="text-slate-400 font-medium">Manage bed availability and hospital capacity in real-time.</p>
              </div>
              <Button icon={Plus} onClick={() => setShowAddBed(true)}>Add Bed Type</Button>
            </div>

            {/* Hospital Selector */}
            <div className="flex flex-wrap gap-3 mb-10">
              {(adminHospitals || []).map(h => (
                <button
                  key={h._id}
                  onClick={() => setSelectedHospital(h)}
                  className={`px-5 py-3 rounded-2xl text-sm font-black transition-all ${selectedHospital?._id === h._id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-white border border-slate-100 text-slate-500 hover:border-sky-300'}`}
                >
                  {h.name}
                </button>
              ))}
            </div>

            {selectedHospital && (
              <>
                {/* Hospital overview */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 mb-8 flex flex-wrap gap-8 items-center shadow-sm">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Selected Facility</p>
                    <h3 className="text-2xl font-black text-slate-900">{selectedHospital.name}</h3>
                  </div>
                  <div className="flex gap-10 ml-auto">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Live Crowd</p>
                      <p className={`text-2xl font-black ${getCrowdColor(selectedHospital.crowdScore)}`}>{selectedHospital.crowdScore || 0}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Capacity</p>
                      <p className="text-2xl font-black text-slate-900">{selectedHospital.capacity || 0}</p>
                    </div>
                    <div className="text-center bg-sky-50 px-6 py-2 rounded-2xl border border-sky-100">
                      <p className="text-[10px] font-black uppercase text-sky-600 tracking-widest mb-1">Facility Income</p>
                      <p className="text-2xl font-black text-sky-600">₹{selectedHospital.revenue?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Add Bed Modal UI */}
                {showAddBed && (
                  <div className="bg-white p-8 rounded-[2rem] border-2 border-sky-500 mb-8 shadow-xl">
                    <h4 className="text-lg font-black mb-6">Add New Bed Type</h4>
                    <form onSubmit={handleAddBedType} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</label>
                        <input type="text" placeholder="e.g. ICU" value={newBed.type} onChange={e => setNewBed({...newBed, type: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total</label>
                        <input type="number" value={newBed.total} onChange={e => setNewBed({...newBed, total: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Available</label>
                        <input type="number" value={newBed.available} onChange={e => setNewBed({...newBed, available: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl outline-none" />
                      </div>
                      <div className="flex gap-2 items-end">
                        <Button type="submit" className="flex-1">Add</Button>
                        <Button type="button" variant="ghost" onClick={() => setShowAddBed(false)}>Cancel</Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <th className="px-10 py-5">Bed Type</th>
                        <th className="px-6 py-5">Total</th>
                        <th className="px-6 py-5">Available</th>
                        <th className="px-6 py-5">Occupancy</th>
                        <th className="px-10 py-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(selectedHospital.beds || []).map(bed => {
                        const occupancy = bed.total > 0 ? Math.round(((bed.total - bed.available) / bed.total) * 100) : 0;
                        return (
                          <tr key={bed.type} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-10 py-6 font-black text-slate-900">{bed.type}</td>
                            <td className="px-6 py-6 font-bold text-slate-600">{bed.total}</td>
                            <td className="px-6 py-6">
                              <input 
                                type="number" 
                                defaultValue={bed.available}
                                onBlur={(e) => handleAvailableChange(bed.type, e.target.value)}
                                className="w-20 bg-slate-50 p-2 rounded-xl text-center font-black outline-none focus:ring-2 focus:ring-sky-500" 
                              />
                            </td>
                            <td className="px-6 py-6">
                               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                  <div className={`h-full ${occupancy >= 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${occupancy}%` }} />
                               </div>
                            </td>
                            <td className="px-10 py-6 text-center">
                              <button onClick={() => handleRemoveBed(bed.type)} className="text-slate-300 hover:text-rose-500"><Trash2 size={18} /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── VISION HUB TAB ─── */}
        {activeTab === 'vision' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black tracking-tighter mb-2">Vision Hub</h2>
                <p className="text-slate-400 font-medium">Aegis OpenCV Intelligence Engine - IoT Central.</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    OpenCV Engine: Active
                 </div>
              </div>
            </div>

            {/* Hospital Selector */}
            <div className="flex flex-wrap gap-3 mb-10">
              {(adminHospitals || []).map(h => (
                <button
                  key={h._id}
                  onClick={() => setSelectedHospital(h)}
                  className={`px-5 py-3 rounded-2xl text-sm font-black transition-all ${selectedHospital?._id === h._id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-white border border-slate-100 text-slate-500 hover:border-sky-300'}`}
                >
                  {h.name}
                </button>
              ))}
            </div>

            {selectedHospital ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {/* IoT Camera Component */}
                 <div className="lg:col-span-2">
                    <CameraNode 
                       hospitalId={selectedHospital._id} 
                       onUpdate={async (count) => {
                         try {
                           await hospitalService.syncFrameMetadata(selectedHospital._id, count);
                         } catch (err) {
                           console.warn('Frame sync failed:', err.message);
                         }
                       }}
                    />
                 </div>

                 {/* Intel Summary */}
                 <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                       <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                          <Activity className="text-sky-500" size={24} />
                          Clinical Stress Analysis
                       </h3>
                       <div className="space-y-6">
                          <div>
                             <div className="flex justify-between mb-2">
                                <span className="text-[10px] font-black uppercase text-slate-400">Total Load Score</span>
                                <span className={`text-xs font-black ${getCrowdColor(selectedHospital.crowdScore)}`}>{selectedHospital.crowdScore}%</span>
                             </div>
                             <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${selectedHospital.crowdScore > 70 ? 'bg-rose-500' : 'bg-sky-500'}`} style={{ width: `${selectedHospital.crowdScore}%` }}></div>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-4">
                             <div className="bg-slate-50 p-6 rounded-3xl">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">OpenCV Count</p>
                                <p className="text-2xl font-black text-sky-500">
                                   {selectedHospital.crowdCount || 0}
                                </p>
                             </div>
                             <div className="bg-slate-50 p-6 rounded-3xl">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Wait List</p>
                                <p className="text-2xl font-black text-slate-900">
                                   {recentBookings.filter(b => b.hospitalId === selectedHospital._id).length}
                                </p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                             <div className="bg-slate-50 p-6 rounded-3xl">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Bed Stress</p>
                                <p className="text-2xl font-black text-slate-900">
                                   {Math.round((1 - (selectedHospital.beds.reduce((s,b) => s+b.available, 0) / (selectedHospital.capacity || 1))) * 100)}%
                                </p>
                             </div>
                        </div>
                     </div>
                    </div>

                    <div className="bg-sky-500 p-10 rounded-[2.5rem] text-white shadow-xl shadow-sky-500/20 relative overflow-hidden">
                        <ShieldCheck className="absolute top-10 right-10 text-white/10" size={120} />
                        <h4 className="text-xl font-black mb-4 relative z-10">Aegis Intelligence</h4>
                        <p className="text-sm font-medium text-sky-100 leading-relaxed relative z-10">
                           Our OpenCV engine is analyzing visual density in real-time. This data is combined with doctor shifts and bed availability to calculate the most accurate hospital stress index in the city.
                        </p>
                    </div>
                 </div>
              </div>
            ) : (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                    <Wifi size={48} className="mx-auto text-slate-200 mb-6" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select a hospital to initialize IoT Node</p>
                </div>
            )}
          </div>
        )}

        {/* ─── DOCTORS TAB ─── */}
        {activeTab === 'doctors' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2">Medical Staff</h2>
                  <p className="text-slate-400 font-medium">Manage on-duty personnel and specialists.</p>
               </div>
               <Button icon={Plus} onClick={() => setShowAddDoctor(true)}>Onboard Doctor</Button>
            </div>

            {showAddDoctor && (
              <div className="bg-white p-10 rounded-[2.5rem] border-2 border-sky-500 shadow-xl">
                 <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</label>
                       <input type="text" placeholder="Dr. Name" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Specialty</label>
                       <input type="text" placeholder="Cardiology" value={newDoctor.specialty} onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none" />
                    </div>
                    <div className="flex items-end gap-3">
                       <Button type="submit" className="flex-1 py-5">Register</Button>
                       <Button type="button" variant="ghost" className="py-5" onClick={() => setShowAddDoctor(false)}>Cancel</Button>
                    </div>
                 </form>
              </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <th className="px-10 py-5">Doctor</th>
                        <th className="px-6 py-5">Specialty</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-10 py-5 text-center">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {doctors.map((doc) => (
                        <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-10 py-6 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">{doc.name ? doc.name[0] : 'D'}</div>
                              <span className="font-black text-slate-900">{doc.name}</span>
                           </td>
                           <td className="px-6 py-6 font-bold text-slate-600">{doc.specialty}</td>
                           <td className="px-6 py-6"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span></td>
                           <td className="px-10 py-6 text-center"><button className="text-slate-300"><MoreHorizontal size={18} /></button></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* ─── PATIENTS TAB ─── */}
        {activeTab === 'patients' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2">Patient Registry</h2>
                  <p className="text-slate-400 font-medium">Full clinical repository and diagnostic records.</p>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <th className="px-10 py-5">Patient</th>
                        <th className="px-6 py-5">Age/Sex</th>
                        <th className="px-6 py-5">Live Severity</th>
                        <th className="px-10 py-5 text-center">Purge</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {(allPatients || []).map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-10 py-6">
                              <p className="font-black text-slate-900">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{new Date(p.createdAt).toLocaleDateString()}</p>
                           </td>
                           <td className="px-6 py-6 font-bold text-slate-600">{p.age}Y | {p.gender}</td>
                           <td className="px-6 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                p.severity === 'High' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-sky-50 text-sky-500 border-sky-100'
                              }`}>
                                {p.severity || 'Normal'}
                              </span>
                           </td>
                           <td className="px-10 py-6 text-center">
                              <button 
                                onClick={() => {
                                   const id = p._id || p.id;
                                   console.log('Attempting to delete patient:', id);
                                   if (id && window.confirm(`Are you sure you want to PURGE all records for ${p.name}? This action is irreversible.`)) {
                                      deletePatient(id);
                                   }
                                }}
                                className="p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                                title="Purge Clinical Record"
                              >
                                 <Trash2 size={16} />
                              </button>
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
