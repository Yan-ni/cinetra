import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// components
import Show from "../components/Show";

// modals
import ShowModal from "../modals/ShowModal";
import AddShowModal from "../modals/AddShowModal";

function ShowScreen() {
  const [addShowModalStatus, setAddShowModalStatus] = useState(false);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("Authorization");
    const loadShows = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/show`
        );

        if (result.status === 200 && Array.isArray(result.data))
          setShows(result.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login");
        }
        console.error("error occured loading shows");
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <h1 className="text-align-center">Show List</h1>

      <input
        type="text"
        name="search"
        placeholder="search for a show in your list"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <button
        className="btn-primary"
        onClick={() => setAddShowModalStatus(true)}
      >
        Add a show
      </button>
      <AddShowModal
        type="show"
        modalStatus={addShowModalStatus}
        setModalStatus={setAddShowModalStatus}
        shows={shows}
        setShows={setShows}
      />

      <div className="shows w-100 gap-1 mt-1">
        {shows
          ?.filter((show) => show.name.toLowerCase().includes(search))
          .map((show) => (
            <Show
              type="show"
              key={show._id}
              {...show}
              shows={shows}
              setShows={setShows}
              setSelectedShow={setSelectedShow}
            />
          ))}
      </div>

      <ShowModal
        type="show"
        selectedShow={selectedShow}
        closeModal={() => setSelectedShow(null)}
        shows={shows}
        setShows={setShows}
      />
    </div>
  );
}

export default ShowScreen;
