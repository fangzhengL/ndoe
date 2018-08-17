import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'antd/dist/antd.css';
import 'element-theme-default';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
