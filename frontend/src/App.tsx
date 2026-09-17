import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Simulator } from './pages/Simulator';
import { GisMap } from './pages/GisMap';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { ModelGovernance } from './pages/ModelGovernance';
import { AuditLogs } from './pages/AuditLogs';
import { PortalGateway } from './components/PortalGateway';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('LandWatch Portal caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-14 w-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">LandWatch System Interface Notice</h1>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            A temporary rendering glitch was safely contained. Click below to reload the dashboard cleanly.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Refresh Command Center
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [gatewayCompleted, setGatewayCompleted] = React.useState<boolean>(() => {
    return sessionStorage.getItem('landwatch_intro_seen') === 'true';
  });
  const [showIntroModal, setShowIntroModal] = React.useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 font-sans text-xs gap-3">
        <div className="h-9 w-9 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span className="font-medium text-slate-600">Initializing LandWatch Decision Portal...</span>
      </div>
    );
  }

  if (!isAuthenticated || !gatewayCompleted || showIntroModal) {
    return (
      <PortalGateway
        initialStage="INTRO"
        isModalMode={showIntroModal}
        isOpen={true}
        onClose={() => {
          setShowIntroModal(false);
          setGatewayCompleted(true);
          sessionStorage.setItem('landwatch_intro_seen', 'true');
        }}
        onAuthenticated={() => {
          setGatewayCompleted(true);
          setShowIntroModal(false);
          sessionStorage.setItem('landwatch_intro_seen', 'true');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar onShowIntro={() => setShowIntroModal(true)} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedLayout>
                <Projects />
              </ProtectedLayout>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedLayout>
                <ProjectDetail />
              </ProtectedLayout>
            }
          />
          <Route
            path="/simulator"
            element={
              <ProtectedLayout>
                <Simulator />
              </ProtectedLayout>
            }
          />
          <Route
            path="/gis-map"
            element={
              <ProtectedLayout>
                <GisMap />
              </ProtectedLayout>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedLayout>
                <Alerts />
              </ProtectedLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedLayout>
                <Analytics />
              </ProtectedLayout>
            }
          />
          <Route
            path="/governance"
            element={
              <ProtectedLayout>
                <ModelGovernance />
              </ProtectedLayout>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedLayout>
                <AuditLogs />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
