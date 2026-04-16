import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortalPage from '../pages/PortalPage';
import ProfilePage from '../pages/ProfilePage';
import SymptomPage from '../pages/SymptomPage';
import HospitalResults from '../pages/HospitalResults';
import BookingPage from '../pages/BookingPage';
import EmergencyPage from '../pages/EmergencyPage';
import HospitalDashboard from '../pages/HospitalDashboard';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Entry Portal */}
        <Route path="/" element={<PortalPage />} />
        
        {/* Patient Onboarding & Triage Flows */}
        <Route path="/profiling" element={<ProfilePage />} />
        <Route path="/triage" element={<SymptomPage />} />
        <Route path="/results" element={<HospitalResults />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        
        {/* Hospital Admin Flows */}
        <Route path="/admin/dashboard" element={<HospitalDashboard />} />
        
        {/* Redirect unknown routes back to the main portal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
