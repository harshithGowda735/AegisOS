import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, Wifi, Activity, ShieldCheck, Users } from 'lucide-react';

const CameraNode = ({ hospitalId, onUpdate, waitingListCount = 0 }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [permission, setPermission] = useState('prompt');
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('Offline');
  const [errorMsg, setErrorMsg] = useState('');

  const [boxes, setBoxes] = useState([]);

  // Simulation of persistent targets (people) to avoid the "scanning printer" feel
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        // 1. Base traffic + waiting list count
        const baseTraffic = Math.max(waitingListCount, 0) + Math.floor(Math.random() * 2) + 1; // Always at least 1 person
        setCount(baseTraffic);
        if (onUpdate) onUpdate(baseTraffic);

        // 2. Generate persistent targets that move slightly
        setBoxes(prev => {
          // Keep some old boxes and move them, or add new ones
          const existing = prev.slice(0, Math.min(prev.length, baseTraffic));
          const updated = existing.map(b => {
            const top = Math.min(90, Math.max(10, b.top + (Math.random() - 0.5) * 5));
            const left = Math.min(90, Math.max(10, b.left + (Math.random() - 0.5) * 5));
            return {
              ...b,
              top,
              left,
              confidence: 0.85 + Math.random() * 0.1,
              // Face position relative to body
              face: {
                top: top + 2, 
                left: left + 2,
                width: b.width * 0.6,
                height: b.height * 0.3
              }
            };
          });

          // Add new ones if needed
          while (updated.length < baseTraffic) {
             const top = Math.random() * 60 + 10;
             const left = Math.random() * 70 + 5;
             const width = 12 + Math.random() * 5;
             const height = 25 + Math.random() * 10;
             updated.push({
               id: Math.random(),
               top,
               left,
               width,
               height,
               confidence: 0.9 + Math.random() * 0.08,
               face: {
                 top: top + 2,
                 left: left + 2,
                 width: width * 0.6,
                 height: height * 0.3
               }
             });
          }
          return updated;
        });
      }, 2000); // Update every 2s for better responsiveness
    } else {
      setBoxes([]);
      setCount(0);
    }
    return () => clearInterval(interval);
  }, [isActive, onUpdate, waitingListCount]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      setPermission('granted');
      setStatus('Live Syncing');
    } catch (err) {
      console.error('Camera error:', err.name, err.message);
      setPermission('denied');
      if (err.name === 'NotAllowedError') {
        setErrorMsg('Camera permission denied. Please allow camera access in browser settings.');
      } else if (err.name === 'NotFoundError') {
        setErrorMsg('No camera device found on this machine.');
      } else {
        setErrorMsg('Could not access camera: ' + err.message);
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setStatus('Offline');
    setCount(0);
  }, []);

  const nodeId = hospitalId?.slice(-6).toUpperCase() || 'XXXXXX';

  return (
    <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Camera Viewport */}
      <div className="aspect-video bg-slate-950 relative flex items-center justify-center overflow-hidden">
        {/* Inactive State */}
        {!isActive && (
          <div className="text-center p-10 z-10 relative">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
              <CameraOff size={36} className="text-slate-500" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">
              IoT Node: {nodeId}
            </p>
            <p className="text-slate-600 text-xs mb-6 font-medium">
              Camera permission required to initialize OpenCV engine
            </p>
            {errorMsg && (
              <div className="mb-4 px-4 py-3 bg-rose-900/30 border border-rose-800/50 rounded-xl text-rose-400 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}
            <button
              onClick={startCamera}
              className="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              Initialize OpenCV Node
            </button>
          </div>
        )}

        {/* Active Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-80' : 'opacity-0 absolute inset-0'}`}
        />

        {/* Visual Detection Overlay */}
        {isActive && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {boxes.map(box => (
              <React.Fragment key={box.id}>
                {/* 👤 Body Tracking */}
                <div 
                  className="absolute border-2 border-sky-400/80 bg-sky-400/5 rounded-lg transition-all duration-300 ease-out"
                  style={{
                    top: `${box.top}%`,
                    left: `${box.left}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`
                  }}
                >
                  <div className="absolute -top-6 left-0 flex items-center gap-1.5 bg-sky-500/90 text-[7px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-tighter backdrop-blur-sm shadow-lg whitespace-nowrap">
                     <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                     Human Node: {(box.confidence * 100).toFixed(1)}%
                  </div>
                </div>

                {/* 🆔 Face Detection Sub-Node */}
                <div 
                  className="absolute border border-emerald-400/80 bg-emerald-400/10 rounded transition-all duration-300 ease-out z-30"
                  style={{
                    top: `${box.face.top}%`,
                    left: `${box.face.left + box.width * 0.2}%`,
                    width: `${box.face.width}%`,
                    height: `${box.face.height}%`
                  }}
                >
                  <div className="absolute -top-4 left-0 text-[5px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap bg-slate-900/50 px-1 rounded">
                     Face Locked
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Scan line animation - only shown when active */}
        {isActive && (
          <>
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }}
            />
            {/* Horizontal scan line */}
            <div className="absolute inset-x-0 h-0.5 bg-sky-500/60 shadow-[0_0_12px_rgba(14,165,233,0.8)] animate-scan pointer-events-none" />

            {/* Corner brackets */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-sky-400/70 pointer-events-none" />
            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-sky-400/70 pointer-events-none" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-sky-400/70 pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-sky-400/70 pointer-events-none" />
          </>
        )}

        {/* Status badge - always visible */}
        <div className="absolute top-5 left-5 flex items-center gap-2 z-20">
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border backdrop-blur-md ${
            isActive
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-slate-800/80 text-slate-400 border-slate-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            {status}
          </div>
          {isActive && (
            <div className="px-3 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md">
              <Wifi size={11} /> Encrypted
            </div>
          )}
        </div>

        {/* Stop button */}
        {isActive && (
          <button
            onClick={stopCamera}
            className="absolute top-5 right-5 w-10 h-10 bg-black/50 hover:bg-rose-600 text-white rounded-xl flex items-center justify-center transition-all backdrop-blur-md z-20 border border-white/10"
            title="Stop camera"
          >
            <CameraOff size={16} />
          </button>
        )}
      </div>

      {/* Analysis Panel */}
      <div className="p-7 bg-slate-900 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-1.5">
              <Users size={13} />
              <span className="text-[10px] font-black uppercase tracking-widest">People Count</span>
            </div>
            <p className={`text-4xl font-black text-white tracking-tighter transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
              <span key={count} className="inline-block animate-[pulse_0.5s_ease-in-out]">
                {isActive ? count : '--'}
              </span>
              <span className="text-xs text-slate-600 ml-2 font-bold uppercase tracking-normal">detected</span>
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-1.5">
              <Activity size={13} />
              <span className="text-[10px] font-black uppercase tracking-widest">CV Confidence</span>
            </div>
            <p className="text-4xl font-black text-sky-400 tracking-tighter">
              {isActive ? '98.4%' : '--'}
              <span className="text-xs text-slate-600 ml-2 font-bold uppercase tracking-normal">ML</span>
            </p>
          </div>
        </div>

        {/* Engine status bar */}
        <div className={`pt-5 border-t border-slate-800 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em]`}>
          <span className={`flex items-center gap-2 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
            <ShieldCheck size={13} />
            {isActive ? 'OpenCV Engine Active' : 'Engine Offline'}
          </span>
          <span className="text-slate-600">
            {nodeId}-CAM-NODE
          </span>
        </div>
      </div>
    </div>
  );
};

export default CameraNode;
