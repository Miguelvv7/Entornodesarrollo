import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';
import './index.css';
import App from './App';
import PrintView from './PrintView';
import PresenterWindow from './PresenterWindow';

const params = new URLSearchParams(location.search);
const view = params.has('print') ? <PrintView /> : params.has('presenter') ? <PresenterWindow /> : <App />;

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode>{view}</React.StrictMode>);
