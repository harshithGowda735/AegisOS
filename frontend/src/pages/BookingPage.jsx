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
  Smartphone,
  Trophy,
  User,
  Heart
} from 'lucide-react';

const BookingPage = () => {
  const { bestHospital, doctors, confirmBooking, isLoading, booking } = useAppStore();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);

  // Pick the first available doctor registered via admin, or a fallback
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <Activity className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-4">No active triage session found</h2>
          <Button onClick={() => navigate('/')}>Return to Hub</Button>
        </div>
      </div>
    );
  }

  // --- SUCCESS VIEW (Healwise Ref 4) ---
  if (booking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
        <div className="max-w-6xl mx-auto">
          {/* Header Navigation */}
          <nav className="flex items-center gap-4 mb-10 text-slate-500 font-bold text-sm">
            <button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">Home</button>
            <ChevronRight size={14} />
            <span className="text-slate-900">My Health</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Confirmation Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/20 page-animate opacity-0">
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                   <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={32} />
                   </div>
                   <div>
                      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Appointment Booked!</h1>
                      <p className="text-slate-500 font-medium">You'll receive a confirmation mail and SMS shortly {booking.email ? `at ${booking.email}` : ''}.</p>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 mb-10">
                   <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 font-black text-lg border-2 border-slate-50">RM</div>
                      <div>
                         <p className="font-black text-slate-900 tracking-tight">Rohan Mehrotra</p>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Software Engineer at Google</p>
                      </div>
                   </div>
                   <div className="w-8 h-8 flex items-center justify-center text-slate-300">
                      <div className="h-0.5 flex-1 bg-slate-200 hidden md:block"></div>
                      <ArrowLeft className="rotate-180" size={24} />
                      <div className="h-0.5 flex-1 bg-slate-200 hidden md:block"></div>
                   </div>
                   <div className="flex items-center gap-4 flex-1 justify-end">
                      <div className="text-right">
                         <p className="font-black text-slate-900 tracking-tight">{assignedDoctor.name}</p>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{assignedDoctor.specialty}</p>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 font-black text-lg border-2 border-indigo-50">
                        {assignedDoctor.name.split(' ').pop()[0]}
                      </div>
                   </div>
                </div>

                {/* Map Placeholder View */}
                <div className="w-full h-64 bg-slate-200 rounded-[2rem] overflow-hidden relative border-4 border-white mb-8">
                   <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-indigo-50 flex items-center justify-center text-slate-400 font-bold">
                      <div className="text-center">
                         <MapPin size={48} className="mx-auto mb-2 text-indigo-400" />
                         <p>{bestHospital.name}</p>
                         <p className="text-xs">Location visualization active</p>
                      </div>
                   </div>
                   <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-white p-4 rounded-2xl shadow-xl">
                      <div className="flex items-center gap-3">
                         <MapPin size={20} className="text-slate-400" />
                         <p className="text-sm font-bold text-slate-700">{bestHospital.name}</p>
                      </div>
                      <button className="px-6 py-2 bg-slate-900 text-white text-xs font-black rounded-xl">View Location</button>
                   </div>
                </div>
              </div>

              {/* Checklist Section */}
              <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/20 page-animate opacity-0" style={{ animationDelay: '200ms' }}>
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Appointment Checklist</h2>
                    <ChevronRight className="text-slate-300 rotate-90" />
                 </div>
                 <div className="space-y-4">
                    {[
                      "Carry your original ID proof and AegisOS Triage ID.",
                      "Reach the facility 15 minutes before the scheduled time.",
                      "Wear a mask and follow node health protocols.",
                      "Bring any chronic medication records."
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                           <CheckCircle2 size={12} className="text-transparent group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <p className="text-slate-600 font-medium">{item}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Right Column: Checkout Sidebar */}
            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-600/20 page-animate opacity-0" style={{ animationDelay: '300ms' }}>
                <h2 className="text-2xl font-black mb-8 tracking-tight">Payment Summary</h2>
                <div className="space-y-6 mb-10 border-b border-white/10 pb-10">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Appointment Charge</span>
                    <span className="font-bold">₹999</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">GST (18%)</span>
                    <span className="font-bold">₹199</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400">
                    <span className="font-medium">Aegis Credits (Balance ₹0)</span>
                    <span className="font-bold">- ₹199</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-10">
                  <span className="text-xl font-bold">Total Paid</span>
                  <span className="text-3xl font-black tracking-tighter">₹2,999</span>
                </div>
                
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 mb-8">
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">E-Receipt Active</p>
                   <p className="text-sm font-medium text-slate-300 leading-relaxed mb-4">
                     Your payment of <span className="text-white">₹2,999</span> has been processed successfully via AegisGateway.
                   </p>
                   <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest">Download Receipt</button>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold justify-center pt-4">
                  <ShieldCheck size={16} className="text-emerald-400" /> Secure Payment Protocol
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <h3 className="text-xl font-black mb-4">Refer a friend and get rewarded!</h3>
                  <button className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Refer Now</button>
                  <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Trophy size={64} />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- REVIEW VIEW (Checkout Style) ---
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 md:p-14">
        {/* Navigation */}
        <div className="flex items-center gap-6 mb-14">
           <button onClick={() => navigate('/results')} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
              <ArrowLeft size={20} />
           </button>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Review & Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
           {/* Left Section: Details */}
           <div className="lg:col-span-2 space-y-12">
              <section>
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Selected Facility</h3>
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-48 h-32 bg-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
                       <MapPin size={32} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">
                          <CheckCircle2 size={12} /> Optimization Recommendation
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{bestHospital.name}</h2>
                       <div className="flex gap-4 text-slate-500 text-sm font-medium">
                          <div className="flex items-center gap-1.5"><MapPin size={14} /> {bestHospital.distance} away</div>
                          <div className="flex items-center gap-1.5 text-rose-500 font-bold"><Clock size={14} /> {bestHospital.waitTime} wait</div>
                       </div>
                    </div>
                 </div>
              </section>

              <section>
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Assigned Care Team</h3>
                 <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] flex items-center gap-8">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 font-black text-2xl shadow-lg border-2 border-indigo-100">
                       {assignedDoctor.name.split(' ').pop()[0]}
                    </div>
                    <div>
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight">{assignedDoctor.name}</h4>
                       <p className="text-indigo-600 font-bold text-sm underline decoration-indigo-200 underline-offset-4">{assignedDoctor.specialty}</p>
                       <p className="text-slate-500 text-xs mt-2 font-medium">Expertise: Triage Diagnostics, Emergency Care</p>
                    </div>
                 </div>
              </section>

              <section>
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Scheduling Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><Calendar size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</p>
                          <p className="font-bold text-slate-900">Today, 21st July</p>
                       </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><Clock size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Timeslot</p>
                          <p className="font-bold text-slate-900">3:00 - 5:00 PM</p>
                       </div>
                    </div>
                 </div>
              </section>
           </div>

           {/* Right Section: Payment Summary Sidebar */}
           <div className="relative">
              <div className="sticky top-10 bg-slate-50 rounded-[3rem] p-10 border border-slate-100">
                 <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Payment Summary</h2>
                 <div className="space-y-6 pb-8 border-b border-slate-200 mb-8">
                    <div className="flex justify-between items-center text-slate-600 font-medium">
                       <span>Consultation Fee</span>
                       <span className="font-black">₹999</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 font-medium">
                       <span>Service Tax (18%)</span>
                       <span className="font-black">₹199</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-500 font-bold">
                       <span>Aegis Discount</span>
                       <span>- ₹199</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center mb-10">
                    <span className="text-xl font-black text-slate-900">Final Total</span>
                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">₹2,999</span>
                 </div>

                 <Button 
                    onClick={handleBooking} 
                    isLoading={isConfirming} 
                    className="w-full py-6 rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 text-lg mb-6"
                    icon={CreditCard}
                  >
                    Confirm & Proceed
                 </Button>

                 <div className="flex items-center gap-3 justify-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <ShieldCheck className="text-emerald-500" size={14} /> 256-bit Secure Session
                 </div>
                 
                 <div className="mt-8 p-5 bg-white rounded-2xl border border-slate-100 text-[10px] font-medium text-slate-400 flex items-start gap-3">
                   <Info size={16} className="text-indigo-400 shrink-0" />
                   By proceeding, you agree to AegisOS HIPAA terms and node facility health protocols.
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
