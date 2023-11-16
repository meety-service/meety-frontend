import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainPage, LoginPage, MeetingCreatePage, MeetingFillPage, MeetingViewPage, VoteCreatePage, VoteFillPage, VoteViewPage, MeetingConfirmedPage, ErrorPage } from './component';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
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
