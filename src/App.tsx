import React from 'react';
import Main from './pages/Main';
import { ErrorBoundary } from './components/Common/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  );
};

export default App;
