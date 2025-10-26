import React, { useState, useEffect } from 'react';
import RequestForm from './components/RequestForm.jsx';
import IssueForm from './components/IssueForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import MyRequests from './components/MyRequests.jsx';
import MyIssues from './components/MyIssues.jsx';
import './app.css';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user information
    fetch('/api/now/table/sys_user?sysparm_query=user_name=' + window.NOW.user.userID + '&sysparm_limit=1', {
      headers: {
        'Accept': 'application/json',
        'X-UserToken': window.g_ck
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.result && data.result.length > 0) {
        setUser(data.result[0]);
      }
    })
    .catch(error => console.error('Error fetching user:', error));
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'request':
        return <RequestForm onSuccess={() => setCurrentView('my-requests')} />;
      case 'issue':
        return <IssueForm onSuccess={() => setCurrentView('my-issues')} />;
      case 'my-requests':
        return <MyRequests />;
      case 'my-issues':
        return <MyIssues />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="facility-portal">
      <header className="portal-header">
        <div className="header-content">
          <h1>🏢 Facilities Management Portal</h1>
          {user && <span className="welcome-text">Welcome, {user.first_name} {user.last_name}</span>}
        </div>
      </header>

      <nav className="portal-nav">
        <button 
          className={currentView === 'dashboard' ? 'nav-button active' : 'nav-button'}
          onClick={() => handleViewChange('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={currentView === 'request' ? 'nav-button active' : 'nav-button'}
          onClick={() => handleViewChange('request')}
        >
          📝 Submit Request
        </button>
        <button 
          className={currentView === 'issue' ? 'nav-button active' : 'nav-button'}
          onClick={() => handleViewChange('issue')}
        >
          🚨 Report Issue
        </button>
        <button 
          className={currentView === 'my-requests' ? 'nav-button active' : 'nav-button'}
          onClick={() => handleViewChange('my-requests')}
        >
          📋 My Requests
        </button>
        <button 
          className={currentView === 'my-issues' ? 'nav-button active' : 'nav-button'}
          onClick={() => handleViewChange('my-issues')}
        >
          🔧 My Issues
        </button>
      </nav>

      <main className="portal-content">
        {renderCurrentView()}
      </main>
    </div>
  );
}