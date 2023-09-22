import "./assets/css/App.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// Screens
import ShowScreen from "./Screens/ShowScreen";
import MovieScreen from "./Screens/MovieScreen";

function App() {
  return (
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route path="/" element={<ShowScreen />} />
            <Route path="/movies" element={<MovieScreen />} />
          </>
        )
      )}
    />
  );
}

export default App;
