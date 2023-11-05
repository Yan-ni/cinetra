import "./assets/css/App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

// Screens
import ShowScreen from "./Screens/ShowScreen";
import MovieScreen from "./Screens/MovieScreen";
import LoginScreen from "./Screens/LoginScreen";

function App() {
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
