import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord, faFilePowerpoint, faFileExcel, faDatabase } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const handleButtonClick = (appName) => {
    alert(`${appName} clicked!`);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard</h2>
      <div className="button-group">
        <button onClick={() => handleButtonClick('Word')}>
          <FontAwesomeIcon icon={faFileWord} size="2x" />
          <span className="tooltip">Word</span>
        </button>
        <button onClick={() => handleButtonClick('PowerPoint')}>
          <FontAwesomeIcon icon={faFilePowerpoint} size="2x" />
          <span className="tooltip">PowerPoint</span>
        </button>
        <button onClick={() => handleButtonClick('Excel')}>
          <FontAwesomeIcon icon={faFileExcel} size="2x" />
          <span className="tooltip">Excel</span>
        </button>
        <button onClick={() => handleButtonClick('Access')}>
          <FontAwesomeIcon icon={faDatabase} size="2x" />
          <span className="tooltip">Access</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
