import React, { useState } from 'react';
import { Search as SearchIcon, BookOpen, Users, Home, LogIn } from 'lucide-react';
import LandingPage from './components/LandingPage';
import SearchPage from './components/SearchPage';
import SubjectSearchPage from './components/SubjectSearchPage';
import ContributionPage from './components/ContributionPage';
import LoginPage from './components/LoginPage';
import rbuLogo from './assets/rbu-logo.png';

const NAV_TABS = [
  { id: 'home',    label: 'Home',             icon: <Home size={17} /> },
  { id: 'search',  label: 'Question Search',  icon: <SearchIcon size={17} /> },
  { id: 'subject', label: 'Subject Wise',     icon: <BookOpen size={17} /> },
  { id: 'contrib', label: 'Contribute',        icon: <Users size={17} /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveTab('contrib');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setActiveTab('home');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':    return <LandingPage onNavigate={setActiveTab} />;
      case 'search':  return <div className="container"><SearchPage /></div>;
      case 'subject': return <div className="container"><SubjectSearchPage /></div>;
      case 'contrib': 
        if (!isLoggedIn) {
          return <div className="container"><LoginPage onLoginSuccess={handleLoginSuccess} /></div>;
        }
        return <div className="container"><ContributionPage /></div>;
      case 'login':   return <div className="container"><LoginPage onLoginSuccess={handleLoginSuccess} /></div>;
      default:        return <LandingPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="top-nav">
        {/* Brand */}
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <img src={rbuLogo} alt="RBU Logo" className="nav-logo" />
          <div className="nav-heading">
            <span className="nav-heading-main">RBU (RCOEM)</span>
            <span className="nav-heading-sub">Intelligent Question Search</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-links">
          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          {isLoggedIn && (
            <button className="nav-link logout-btn" onClick={handleLogout} style={{ color: '#e53e3e' }}>
              <LogIn size={17} style={{ transform: 'rotate(180deg)' }} />
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main>
        {renderPage()}
      </main>
    </>
  );
}

export default App;
