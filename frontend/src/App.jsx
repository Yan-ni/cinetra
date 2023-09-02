import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// components
import Show from "./components/Show";

// modals
import ShowModal from "./modals/ShowModal";
import AddShowModal from "./modals/AddShowModal";

function App() {
  const [addShowModalStatus, setAddShowModalStatus] = useState(false);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    const loadShows = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/show`
        );

        if (result.status === 200 && Array.isArray(result.data))
          setShows(result.data);
      } catch (error) {
        console.error("error occured loading shows");
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadShows();
  }, []);

  return (
    <div className="app">
      <h1>Show List</h1>

      <button onClick={() => setAddShowModalStatus(true)}>Add a show</button>
      <AddShowModal
        modalStatus={addShowModalStatus}
        setModalStatus={setAddShowModalStatus}
        shows={shows}
        setShows={setShows}
      />

      <div className="shows">
        {shows?.map((show) => (
          <Show key={show._id} {...show} setSelectedShow={setSelectedShow} />
        ))}
      </div>

      <ShowModal
        selectedShow={selectedShow}
        closeModal={() => setSelectedShow(null)}
        shows={shows}
        setShows={setShows}
      />
    </div>
  );
}

export default App;
