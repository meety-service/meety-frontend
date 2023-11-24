import React, { useEffect, useState } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar, MainPage, LoginPage, MeetingCreatePage, MeetingFillPage, MeetingViewPage, VoteCreatePage, VoteFillPage, VoteViewPage, MeetingConfirmedPage, ErrorPage } from './component';
import { CookiesProvider } from 'react-cookie';

function setScreenSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

function App() {
  const [currPath, setCurrPath] = useState('/login')

  useEffect(() => {
    setCurrPath(window.location.pathname);
  })

  useEffect(() => {
    setScreenSize();
  }, []);

  return (
    <div className="App">
      <CookiesProvider>
        <BrowserRouter>
          {
            // 로그인 페이지인 경우, 상단 네비게이션 바 숨김 처리
            currPath != '/login' && <Navbar />
          }
          <Routes>
            <Route exact path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/meeting/create" element={<MeetingCreatePage />} />
            <Route path="/meeting/fill/:id" element={<MeetingFillPage />} />
            <Route path="/meeting/view/:id" element={<MeetingViewPage />} />
            <Route path="/vote/create/:id" element={<VoteCreatePage />} />
            <Route path="/vote/fill/:id" element={<VoteFillPage />} />
            <Route path="/vote/view/:id" element={<VoteViewPage />} />
            <Route path="/meeting/confirmed/:id" element={<MeetingConfirmedPage />} />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </div>
  );
}

export default App;