import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PortalPage from '../pages/PortalPage';
import ProfilePage from '../pages/ProfilePage';
import SymptomPage from '../pages/SymptomPage';
import HospitalResults from '../pages/HospitalResults';
import BookingPage from '../pages/BookingPage';
import EmergencyPage from '../pages/EmergencyPage';
import HospitalDashboard from '../pages/HospitalDashboard';
import HealthHub from '../pages/HealthHub';
import { useAppStore } from '../store/useAppStore';
import AegisAssist from '../components/ai/AegisAssist';

const GlobalNavigation = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.navigate = navigate;
  }, [navigate]);
  return null;
};

const AppRoutes = () => {
  const { initializeLocation } = useAppStore();

  useEffect(() => {
    if (initializeLocation) {
      initializeLocation();
    }
  }, [initializeLocation]);

  return (
    <Router>
      <GlobalNavigation />
      <Routes>
        {/* User Health Platform Flows */}
        <Route path="/" element={<PortalPage />} />
        <Route path="/profiling" element={<ProfilePage />} />
        <Route path="/health-hub" element={<HealthHub />} />
        <Route path="/triage" element={<SymptomPage />} />
        <Route path="/results" element={<HospitalResults />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />

        {/* Hospital Admin Flows */}
        <Route path="/admin/dashboard" element={<HospitalDashboard />} />

        {/* Redirect unknown routes back to the main portal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AegisAssist />
    </Router>
  );
};

export default AppRoutes;
