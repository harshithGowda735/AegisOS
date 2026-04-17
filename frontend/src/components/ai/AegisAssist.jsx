import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Mic, MicOff, 
  Volume2, VolumeX, Sparkles, User, Bot,
  Heart, Zap, Info, Navigation
} from 'lucide-react';

const DISEASE_DB = {
  diabetes: {
    name: "Diabetes",
    description: "A condition where your blood sugar levels are too high because your body cannot produce or use insulin properly.",
    tips: ["Monitor blood sugar regularly", "Stick to high-fiber, low-sugar meals", "Stay active with daily walks", "Keep a fast-acting carb source handy for lows"],
    warning: "Seek help if you experience extreme thirst, frequent urination, blurred vision, or confusion."
  },
  hypertension: {
    name: "Hypertension (High Blood Pressure)",
    description: "A condition where the force of the blood against your artery walls is too high, which can lead to heart disease.",
    tips: ["Reduce salt intake", "Manage stress through deep breathing", "Limit caffeine", "Take prescribed medication at the same time daily"],
    warning: "Seek help if you have severe headaches, chest pain, dizziness, or difficulty breathing."
  },
  asthma: {
    name: "Asthma",
    description: "A chronic condition where your airways narrow and swell, making it difficult to breathe.",
    tips: ["Identify and avoid triggers (dust, pollen)", "Keep your rescue inhaler accessible", "Practice breathing exercises", "Maintain a clean, allergen-free environment"],
    warning: "Seek help immediately if you have rapid worsening of shortness of breath or if an inhaler provides no relief."
  },
  "common cold": {
    name: "Common Cold",
    description: "A viral infection of your nose and throat that is usually harmless but uncomfortable.",
    tips: ["Stay hydrated with warm fluids", "Get plenty of rest", "Gargle with salt water for sore throat", "Use a humidifier to keep nasal passages clear"],
    warning: "Seek help if symptoms last more than 10 days or if you experience high fever."
  },
  fever: {
    name: "Fever",
    description: "A temporary increase in body temperature, often due to an infection as your body's natural defense.",
    tips: ["Drink lots of water to avoid dehydration", "Wear light clothing", "Take lukewarm sponge baths", "Rest in a cool room"],
    warning: "Seek help if fever exceeds 103°F (39.4°C) or is accompanied by a severe headache or stiff neck."
  },
  migraine: {
    name: "Migraine",
    description: "A type of headache characterized by severe throbbing pain or a pulsing sensation, usually on one side of the head.",
    tips: ["Rest in a quiet, dark room", "Apply a cold compress to your head", "Identify food triggers (like chocolate or cheese)", "Stay hydrated"],
    warning: "Seek help if you experience sudden, severe head pain, or if it is accompanied by fever or numbness."
  },
  gastritis: {
    name: "Gastritis",
    description: "Inflammation of the protective lining of the stomach.",
    tips: ["Eat smaller, more frequent meals", "Avoid spicy, acidic, or fried foods", "Limit alcohol and smoking", "Avoid NSAIDs if they irritate your stomach"],
    warning: "Seek help if you experience severe stomach pain, vomiting blood, or black stools."
  },
  arthritis: {
    name: "Arthritis",
    description: "The swelling and tenderness of one or more of your joints, causing pain and stiffness.",
    tips: ["Low-impact exercise like swimming", "Apply heat/cold therapy to stiff joints", "Maintain a healthy weight", "Use assistive devices if needed"],
    warning: "Seek help if you have sudden joint swelling, redness, or inability to move the joint."
  },
  "skin allergy": {
    name: "Skin Allergy",
    description: "An immune system reaction to a substance that comes into contact with your skin.",
    tips: ["Avoid known allergens or irritants", "Use mild, fragrance-free soaps", "Apply cool compresses to itchy areas", "Avoid scratching to prevent infection"],
    warning: "Seek help immediately if you experience hives along with swelling of lips/tongue or trouble breathing."
  },
  anemia: {
    name: "Anemia",
    description: "A condition in which you lack enough healthy red blood cells to carry adequate oxygen to your tissues.",
    tips: ["Increase iron-rich foods (spinach, lentils)", "Pair iron with Vitamin C for better absorption", "Get adequate rest to manage fatigue", "Monitor energy levels daily"],
    warning: "Seek help if you experience severe fatigue, chest pain, or irregular heartbeat."
  }
};

const AegisAssist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I am AegisAssist, your healthcare guide. I can help you navigate the app or provide health tips. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const chatEndRef = useRef(null);

  // --- Voice Assistant: SPEECH SYNTHESIS (TTS) ---
  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
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

  // --- Voice Assistant: SPEECH RECOGNITION (STT) ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      processQuery(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const processQuery = (userMessage) => {
    if (!userMessage.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    setTimeout(() => {
      const response = processLogic(userMessage.toLowerCase());
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
      speak(response);
    }, 600);
  };

  const handleSend = (e) => {
    e.preventDefault();
    processQuery(input);
  };

  const processLogic = (query) => {
    if (query.includes('navigate') || query.includes('how to use') || query.includes('where is')) {
      if (query.includes('profile')) return "Navigate to 'Patient Profiling' to update your clinical data.";
      if (query.includes('hospital')) return "Use 'Advanced Hospital Search' to find nodes near your GPS location.";
      if (query.includes('emergency')) return "The 'SOS Emergency' button triggers immediate ambulance dispatch.";
      return "I can guide you through Triage, Results, or the Admin Dashboard. What do you need?";
    }

    const diseaseKey = Object.keys(DISEASE_DB).find(key => query.includes(key));
    if (diseaseKey) {
      const db = DISEASE_DB[diseaseKey];
      return `${db.name}: ${db.description}. Recovery tips: ${db.tips.join('. ')}. Warning: ${db.warning}`;
    }

    if (query.includes('pain') || query.includes('hurt')) return "Rest and hydrate. Use the Triage tool if the pain is severe.";
    return "I am Aegis Assistant. I can help with clinical tips or app navigation. Try asking about Anemia or Diabetes.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => speak(messages[messages.length-1].text), 300);
          }}
          className="w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-sky-400 transition-all hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute inset-0 rounded-full bg-sky-500 animate-ping opacity-20"></div>
          <Bot size={28} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[380px] h-[550px] rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-50 duration-300">
          <div className="bg-sky-500 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">AegisAssist Voice</h3>
                <div className="flex items-center gap-1.5 opacity-80 text-[10px] font-bold uppercase tracking-widest">
                  <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`}></div>
                  {isListening ? 'Listening...' : 'Voice Enabled'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${voiceEnabled ? 'bg-white/20' : 'bg-rose-500'}`}>
                 {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
               </button>
               <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><X size={16} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${msg.role === 'user' ? 'bg-sky-100 border-sky-200 text-sky-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-4 rounded-3xl text-[13px] font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-sky-500 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {(isSpeaking || isListening) && (
              <div className="flex justify-start">
                <div className="flex gap-2 p-3 bg-sky-50 rounded-xl text-sky-500 text-[10px] font-black uppercase tracking-widest items-center border border-sky-100">
                   <div className="flex gap-0.5">
                      <div className="w-1.5 h-3 bg-sky-500 animate-pulse"></div>
                      <div className="w-1.5 h-3 bg-sky-500 animate-pulse delay-75"></div>
                   </div>
                   {isListening ? "Listening..." : "Speaking..."}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestion Chips Rail */}
          <div className="px-6 py-3 bg-white border-t border-slate-100">
             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {Object.keys(DISEASE_DB).map((key) => (
                  <button
                    key={key}
                    onClick={() => processQuery(DISEASE_DB[key].name)}
                    className="px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border border-sky-100 hover:bg-sky-500 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    {DISEASE_DB[key].name}
                  </button>
                ))}
             </div>
          </div>

          <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-3">
            <button type="button" onClick={startListening} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-sky-100 hover:text-sky-600'}`}>
              <Mic size={20} />
            </button>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or click a chip..." className="flex-1 bg-slate-50 px-4 py-3 rounded-xl outline-none text-xs font-medium" />
            <button type="submit" className="w-12 h-12 bg-sky-500 text-white rounded-xl flex items-center justify-center shadow-lg"><Send size={20} /></button>
          </form>
          <div className="px-6 pb-4 text-[9px] text-slate-400 font-bold text-center">AI Guidance • Click mic to speak</div>
        </div>
      )}
    </div>
  );
};

export default AegisAssist;
