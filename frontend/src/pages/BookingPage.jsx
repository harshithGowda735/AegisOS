import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Info,
  Trophy,
  Activity
} from 'lucide-react';

const BookingPage = () => {
  const { bestHospital, doctors, confirmBooking, isLoading, booking, currentPatientId } = useAppStore();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);

  const assignedDoctor = doctors[0] || { name: 'Dr. Ramnik Patel', specialty: 'General Physician', education: 'Stanford University' };

  const handleBooking = async () => {
    setIsConfirming(true);
    const success = await confirmBooking({
      doctorName: assignedDoctor.name,
      appointmentType: 'In-person'
    });
    if (!success) setIsConfirming(false);
  };

  if (!bestHospital && !booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <Activity className="w-16 h-16 text-sky-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">No active triage ID found</h2>
          <Button onClick={() => navigate('/')}>Return to Terminal</Button>
        </div>
      </div>
    );
  }

  // --- SUCCESS VIEW ---
  if (booking) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-14 font-sans text-slate-900 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 saas-shadow-lg page-animate opacity-0">
             <div className="flex flex-col items-center text-center mb-12">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8">
                   <CheckCircle2 size={40} />
                </div>
                <h1 className="text-5xl font-black tracking-tighter mb-4">Reservation Active</h1>
                <p className="text-slate-500 font-medium text-lg">Your medical slot has been reserved at {bestHospital.name}.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 mb-6 shadow-sm"><Calendar size={24} /></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Appointment</p>
                   <p className="font-bold text-slate-900">Today, 3:00 PM</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 mb-6 shadow-sm"><MapPin size={24} /></div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Direction</p>
                   <p className="font-bold text-slate-900">{bestHospital.name}</p>
                </div>
             </div>

             <div className="border-t border-slate-100 pt-10 flex flex-col items-center gap-6">
                 <div className="flex items-center gap-3 py-2 px-6 bg-sky-50 text-sky-600 rounded-full text-xs font-black uppercase tracking-widest border border-sky-100">
                    <ShieldCheck size={14} /> Triage ID: {currentPatientId?.slice(-6).toUpperCase() || 'AG-82X'}
                 </div>
                 <Button onClick={() => navigate('/')} variant="secondary" className="rounded-2xl px-12">Return to Dashboard</Button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- REVIEW VIEW (Minimalist Checkout) ---
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 md:p-14">
        {/* Navigation */}
        <div className="flex items-center gap-6 mb-16">
           <button onClick={() => navigate('/results')} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all group">
              <ArrowLeft size={18} />
           </button>
           <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
           {/* Left Section: Details */}
           <div className="lg:col-span-2 space-y-12">
              <section>
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Selected Facility</h3>
                 <div className="p-10 saas-card flex flex-col md:flex-row gap-10 items-start">
                    <div className="w-full md:w-56 h-36 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                       <MapPin size={32} className="text-slate-300" />
                    </div>
                    <div className="flex-1">
                       <div className="inline-flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-widest mb-4">
                          <CheckCircle2 size={12} /> Optimization Recommendation
                       </div>
                       <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{bestHospital.name}</h2>
                       <div className="flex gap-6 text-slate-500 text-sm font-medium">
                          <div className="flex items-center gap-1.5"><MapPin size={16} /> {bestHospital.distance}</div>
                          <div className="flex items-center gap-1.5 text-rose-500 font-bold"><Clock size={16} /> {bestHospital.waitTime} Wait</div>
                       </div>
                    </div>
                 </div>
              </section>

              <section>
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Scheduling Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 saas-card flex items-center gap-6">
                       <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Calendar size={24} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Appointment Date</p>
                          <p className="text-lg font-black text-slate-900">Today, 21st July</p>
                       </div>
                    </div>
                    <div className="p-8 saas-card flex items-center gap-6">
                       <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Clock size={24} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Reserved Slot</p>
                          <p className="text-lg font-black text-slate-900">3:00 - 5:00 PM</p>
                       </div>
                    </div>
                 </div>
              </section>

              <div className="p-8 bg-sky-50 rounded-[2rem] border border-sky-100 flex items-start gap-6">
                 <Info className="text-sky-500 mt-1" />
                 <div>
                    <h4 className="font-black text-sky-900 mb-1">Security & Protocols</h4>
                    <p className="text-sm text-sky-700 leading-relaxed font-medium">Your triage code matches {bestHospital.name} specialty nodes. Please present your digital ID upon arrival at the autonomous check-in terminal.</p>
                 </div>
              </div>
           </div>

           {/* Right Section: Payment Summary Sidebar */}
           <div>
              <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 sticky top-10">
                 <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Payment Summary</h2>
                 <div className="space-y-6 pb-8 border-b border-slate-200 mb-8">
                    <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                       <span>Consultation Fee</span>
                       <span className="text-slate-900 truncate">₹999</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                       <span>Service Tax (18%)</span>
                       <span className="text-slate-900">₹199</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-500 font-black text-sm">
                       <span>Aegis Discount</span>
                       <span>- ₹199</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center mb-10">
                    <span className="text-xl font-black text-slate-900">Total Due</span>
                    <span className="text-4xl font-black text-sky-600 tracking-tighter">₹2,999</span>
                 </div>

                 <Button 
                    onClick={handleBooking} 
                    isLoading={isConfirming} 
                    className="w-full py-6 rounded-2xl shadow-xl shadow-sky-500/20 text-lg mb-8"
                    icon={CreditCard}
                  >
                    Confirm Booking
                 </Button>

                 <div className="flex items-center gap-3 justify-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <ShieldCheck className="text-emerald-500" size={14} /> Secure Triage Node
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
