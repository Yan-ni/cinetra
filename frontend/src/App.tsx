import "./assets/css/App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FC } from 'react';

// Screens
import HomeScreen from "./Screens/home-screen.tsx";
import MovieScreen from "./Screens/MovieScreen.tsx";
import LoginScreen from "./Screens/LoginScreen.tsx";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/movies" element={<MovieScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        {/* <Route path="*"  /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
