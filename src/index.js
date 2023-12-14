import React from 'react';
import ReactDOM from 'react-dom/client'; // 修改引入路径
import {Provider} from 'react-redux';
import store from './store';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import './index.css';
import Login from './components/authorize/login';
import Signup from './components/authorize/signup';
import DashBoard from './components/index';
import StyleOne from './components/pages/styleOne';
import FourZeroFourPage from './components/FourZeroFourPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/dashboard/*" element={<DashBoard/>} />
            <Route path="/user/:userId/style 1"
              element={<StyleOne/>} />
            <Route path="/user/default" element={<FourZeroFourPage/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashBoard/*" element={<DashBoard />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </Provider>
    </React.StrictMode>,
);

reportWebVitals();
