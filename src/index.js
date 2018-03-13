import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const mountNode = document.currentScript.getAttribute('mountNode') || 'savings-calculator';

ReactDOM.render(<App />, document.getElementById(mountNode));
registerServiceWorker();
