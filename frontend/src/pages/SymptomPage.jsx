import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/ui/Button';
import { 
  Activity, 
  ArrowLeft, 
  Search, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';

const SymptomPage = () => {
  const { processSymptoms, isLoading, userProfile } = useAppStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const navigate = useNavigate();

  // 🔊 Voice Assistant: SPEECH SYNTHESIS (TTS)
  const speak = (text) => {
    if (!voiceGuidance || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => (v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Natural')) && v.lang.startsWith('en')) || voices[0];
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
  };
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-submit after voice input
      handleVoiceSubmit(transcript);
    };

    recognition.start();
  };

  const handleVoiceSubmit = async (voiceInput) => {
    if (!voiceInput.trim()) return;
    speak("Analyzing clinical data. Please wait.");
    const success = await processSymptoms(voiceInput);
    if (success) {
      const state = useAppStore.getState();
      const severityText = state.severity || 'Moderate';
      speak(`Analysis complete. ${severityText} severity detected. Routing to the best facility.`);
      
      setTimeout(() => {
        if (state.isAutonomouslyBooked) {
          navigate('/booking');
        } else {
          navigate('/results');
        }
      }, 1500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    speak("Analyzing symptoms. Syncing with Aegis Node.");
    const success = await processSymptoms(input);
    if (success) {
      const state = useAppStore.getState();
      const severityText = state.severity || 'Moderate';
      speak(`Triage data processed. Condition marked as ${severityText} severity.`);
      
      setTimeout(() => {
        if (state.isAutonomouslyBooked) {
          navigate('/booking');
        } else {
          navigate('/results');
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="p-6 md:p-10 flex items-center justify-between border-b border-slate-50">
        <button 
          onClick={() => navigate('/profiling')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-100">
            <ArrowLeft size={18} />
          </div>
          Back to Profile
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setVoiceGuidance(!voiceGuidance);
              if (!voiceGuidance) speak("Voice guidance enabled.");
            }}
            className={`p-3 rounded-xl transition-all ${voiceGuidance ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-400'}`}
            title="Toggle Voice Guidance"
          >
            {voiceGuidance ? <Volume2 size={20} /> : <MicOff size={20} />}
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-[10px]">
               {userProfile?.age || '25'}
            </div>
            <p className="text-sm font-black text-slate-900 tracking-tight">{userProfile?.gender || 'Patient'}</p>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 md:p-14">
        <div className="max-w-2xl w-full page-animate opacity-0">
          <header className="text-center mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-sky-100">
                <Sparkles size={12} /> AI Symptom Analysis
             </div>
             <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">How are you feeling?</h1>
             <p className="text-slate-500 font-medium">Describe your symptoms in natural language. Our AI node will analyze severity and match you with the best regional facility.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
               <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., I have a persistent sharp pain in my chest and difficulty breathing..."
                className="w-full h-48 bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-xl font-medium text-slate-700 outline-none transition-all focus:border-sky-500 focus:shadow-2xl focus:shadow-sky-500/5 resize-none"
               />
               <div className="absolute top-8 right-8 text-slate-100 group-focus-within:text-sky-100 transition-colors">
                  <Activity size={32} />
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="w-full md:w-auto px-10 py-5 rounded-2xl text-lg flex-1"
                icon={Search}
              >
                Analyze Symptoms
              </Button>

              <button 
                type="button"
                onClick={startSpeechRecognition}
                className={`w-full md:w-auto px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 border ${
                  isListening 
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                    : 'bg-slate-50 text-slate-900 border-slate-100 hover:bg-slate-100'
                }`}
              >
                {isListening ? (
                  <> <MicOff size={18}/> Listening... </>
                ) : (
                  <> <Mic size={18}/> Voice Analysis </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => navigate('/emergency')}
                className="w-full md:w-auto px-10 py-5 bg-rose-50 text-rose-600 font-black rounded-2xl text-sm hover:bg-rose-100 transition-all border border-rose-100"
              >
                Emergency
              </button>
            </div>
          </form>

          <footer className="mt-12 flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <ShieldCheck size={20} className="text-slate-400 shrink-0" />
             <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
               <span className="font-black text-slate-500">Security Note:</span> Your clinical data is processed by Aegis Node #01. No PII is shared externally during the routing process.
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default SymptomPage;
