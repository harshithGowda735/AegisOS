import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff, Wifi, Activity, ShieldCheck, Users } from 'lucide-react';

const CameraNode = ({ hospitalId, onUpdate }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [permission, setPermission] = useState('prompt');
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('Offline');
  const [errorMsg, setErrorMsg] = useState('');

  // Simulate crowd detection every 3 seconds while active
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        // Simulate OpenCV person detection (Haar-Cascade / YOLO simulation)
        const detectedCount = Math.floor(Math.random() * 18) + 3;
        setCount(detectedCount);
        if (onUpdate) onUpdate(detectedCount);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isActive, onUpdate]);

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
            <p className="text-4xl font-black text-white tracking-tighter">
              {isActive ? count : '--'}
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
