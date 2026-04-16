import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import {
  User,
  Calendar,
  Heart,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Check,
  UserCircle,
  MapPin,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';


const ProfilePage = () => {
  const { setUserProfile, processSymptoms, isLoading, initializeLocation } = useAppStore();

  React.useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    history: [],
    symptoms: ''
  });

  const navigate = useNavigate();

  const medicalHistoryOptions = [
    "Diabetes", "Hypertension", "Heart Disease", "Asthma",
    "Allergies", "Arthritis", "Thyroid Disorder", "None"
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = async () => {
    setAnalyzing(true);
    const success = await setUserProfile(formData);
    if (success) {
      if (formData.symptoms && formData.symptoms.trim().length > 0) {
        // Trigger autonomous routing
        await processSymptoms(formData.symptoms);
        
        // Artificial delay for 'Agent' feel
        setTimeout(() => {
          const { severity } = useAppStore.getState();
          // Both regular and high severity now go to /booking to show the "Aegis Pay" flow
          navigate('/booking');
        }, 500);
      } else {
        navigate('/health-hub');
      }
    } else {
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans text-center">
        <div className="w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <ShieldAlert className="absolute inset-0 m-auto text-sky-400 w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-4">Autonomous Node Analysis</h2>
        <div className="space-y-3">
          <p className="text-sky-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Syncing Hospital Nodes...</p>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <CheckCircle2 size={12} className="text-emerald-500" /> Bed Availability Verified
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
             <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></div>
             Specialist Routing Active
          </div>
        </div>
      </div>
    );
  }

  const toggleHistory = (condition) => {
    setFormData(prev => ({
      ...prev,
      history: prev.history.includes(condition)
        ? prev.history.filter(h => h !== condition)
        : [...prev.history, condition]
    }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.name.trim().length > 2;
    if (step === 2) return formData.age && formData.gender;
    if (step === 3) return true; // Medical history optional
    if (step === 4) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-3 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-gradient-to-r from-sky-500 to-indigo-500' : 'bg-slate-200'
                }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="px-10 pt-10 pb-8 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow">
                <Stethoscope className="w-8 h-8 text-sky-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter">Welcome to Aegis</h1>
                <p className="text-slate-500 mt-1">Let's build your secure health profile</p>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
                <div className="text-center">
                  <UserCircle className="w-20 h-20 mx-auto text-slate-300 mb-6" />
                  <h2 className="text-4xl font-black tracking-tighter mb-3">What's your name?</h2>
                  <p className="text-slate-500 text-lg">We'll use this to personalize your experience</p>
                </div>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 focus:bg-white p-6 rounded-2xl text-2xl font-medium outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="w-full py-7 rounded-2xl text-lg font-semibold"
                  icon={ChevronRight}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Age & Gender */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
                <header className="text-center">
                  <h2 className="text-4xl font-black tracking-tighter mb-3">Age & Gender</h2>
                  <p className="text-slate-500">This helps our AI assess risks more accurately</p>
                </header>

                <div className="space-y-8">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">Your Age</label>
                    <input
                      type="number"
                      placeholder="25"
                      className="w-full bg-slate-50 p-6 rounded-2xl text-3xl font-semibold outline-none border-2 border-transparent focus:border-sky-500 focus:bg-white"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-4">Gender</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`p-6 rounded-2xl border-2 font-semibold transition-all text-lg ${formData.gender === g
                              ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={handleBack} variant="secondary" className="flex-1 py-6 rounded-2xl">
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="flex-[2] py-6 rounded-2xl"
                    icon={ChevronRight}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Medical History */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
                <header>
                  <h2 className="text-4xl font-black tracking-tighter mb-3">Medical Background</h2>
                  <p className="text-slate-500">Select any conditions that apply to you (optional)</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {medicalHistoryOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleHistory(option)}
                      className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all text-left ${formData.history.includes(option)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <span className={`font-semibold ${formData.history.includes(option) ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {option}
                      </span>
                      {formData.history.includes(option) && (
                        <Check className="text-emerald-600" size={22} />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleBack} variant="secondary" className="flex-1 py-6 rounded-2xl">Back</Button>
                  <Button onClick={handleNext} className="flex-[2] py-6 rounded-2xl" icon={ChevronRight}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Symptoms + Final */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-sky-100 to-indigo-100 rounded-full flex items-center justify-center mb-8">
                    <ShieldCheck size={52} className="text-sky-600" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter mb-4">Almost Done!</h2>
                  <p className="text-slate-500 text-lg">Tell us about any current symptoms (optional)</p>
                </div>

                <textarea
                  placeholder="E.g., I've had a persistent cough for 3 days, mild fever, and fatigue..."
                  className="w-full h-40 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-3xl p-6 text-lg resize-y outline-none"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                />

                {/* Summary Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
                  <p className="text-xs uppercase font-black tracking-widest text-slate-400 mb-4">Your Profile Summary</p>
                  <div className="space-y-3">
                    <p className="text-xl font-semibold">{formData.name} • {formData.age} years • {formData.gender}</p>
                    {formData.history.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.history.map((h) => (
                          <span
                            key={h}
                            className="text-xs px-4 py-2 bg-white border border-slate-200 rounded-full font-medium text-slate-600"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>



                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  className="w-full py-7 rounded-2xl text-lg font-semibold shadow-xl shadow-sky-500/30 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700"
                >
                  Start AI Triage Analysis
                </Button>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 text-center">
          <p className="text-xs text-slate-400 font-medium">Aegis • Secure • Private • AI-Powered Health Intelligence</p>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePage;