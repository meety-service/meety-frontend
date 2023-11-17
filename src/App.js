import React from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar, MainPage, LoginPage, MeetingCreatePage, MeetingFillPage, MeetingViewPage, VoteCreatePage, VoteFillPage, VoteViewPage, MeetingConfirmedPage, ErrorPage } from './component';

function setScreenSize() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
useEffect(() => {
  setScreenSize();
});

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage/>} />
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
    </div>
  );
}

export default App;