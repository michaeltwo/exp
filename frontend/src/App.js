import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 导入 AuthProvider

import Navbar from './components/NavBar'; // 导入 Navbar 组件
import HomePage from './pages/HomePage'; // 导入 HomePage 组件
import LoginPage from './pages/LoginPage'; // 导入 LoginPage 组件
import SignupPage from './pages/SignupPage'; // 导入 SignupPage 组件
import ConsentPage from './pages/ConsentPage'; // 导入 ConsentPage 组件
import ExperimentPage from './pages/ExperimentPage'; // 导入 ExperimentPage 组件
import ProtectedRoute from './components/ProtectedRoute'; // 导入 ProtectedRoute 组件
import QuestionnairePage from './pages/QuestionnairePage';
import ThankYouPage from './pages/ThankYouPage';

function App() {
  // console.log("App is rendering..."); // Debug log
  return (
    <Router>
      <AuthProvider> {/* 确保 AuthProvider 包裹整个应用 */}
        <Navbar /> {/* 显示导航栏 */}
        <Routes>
          {/* 配置路由 */}
          <Route path="/" element={<HomePage />} /> {/* 默认页面 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/consent" element={<ConsentPage />} />
          
          {/* 保护的路由 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/experiment/:id" element={<ExperimentPage />} />
            <Route path="/questionnaire/:videoId" element={<QuestionnairePage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;