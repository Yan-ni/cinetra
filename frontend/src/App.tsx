import "./assets/css/App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FC } from 'react';

// Screens
import ShowScreen from "./Screens/ShowScreen.tsx";
import MovieScreen from "./Screens/MovieScreen.tsx";
import LoginScreen from "./Screens/LoginScreen.tsx";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowScreen />} />
        <Route path="/movies" element={<MovieScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        {/* <Route path="*"  /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
