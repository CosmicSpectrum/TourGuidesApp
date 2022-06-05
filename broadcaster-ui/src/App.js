import React, {useState,useEffect} from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Broadcaster from './components/broadcasterSide/BroadcasterSide';
import Listener from './components/listenerSide/Listenter';
import {socket} from './utils/initiateSocket';

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route exact path='/talker' element={<Broadcaster roomId={"1234"} socket={socket} />} />
          <Route path='/listener' element={<Listener roomId={"1234"} socket={socket} />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
