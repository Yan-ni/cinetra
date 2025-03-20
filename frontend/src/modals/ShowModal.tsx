import { useEffect, useState } from "react";
import axios from "axios";
import ShowControl from "../components/ShowControl.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { ShowType } from "@/types/index.ts";

interface ShowModalProps {
    selectedShow: string | null;
    closeModal: () => void;
    shows: ShowType[];
    setShows: React.Dispatch<React.SetStateAction<ShowType[]>>;
    type: "show" | "movie";
}

export default function ShowModal({
  selectedShow,
  closeModal,
  shows,
  setShows,
  type,
}: ShowModalProps) {
  const [show, setShow] = useState<ShowType>({
    _id: "",
    name: "",
    overview: "",
    posterURL: "",
    seasonsWatched: 0,
    episodesWatched: 0,
    completed: false,
    favorite: false,
    user_id: "",
    show_id: 0,
  });
  const [overviewCollapsed, setOverviewCollapsed] = useState(true);

  const update = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const payload: {
            seasonsWatched?: number;
            episodesWatched?: number;
        } = {};
    const target = e.target as HTMLButtonElement;
    const op = target.textContent;
    const type = target.name;

    if (op !== "+" && op !== "-") return;

    if (type !== "seasons" && type !== "episodes") return;

    if (type === "seasons")
      payload.seasonsWatched = show.seasonsWatched + (op === "-" ? -1 : 1);

    if (type === "episodes")
      payload.episodesWatched = show.episodesWatched + (op === "-" ? -1 : 1);

    await axios.put(
      `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`,
      payload,
    ).then((response) => {
      if (response.status !== 200) return;

      if (payload.seasonsWatched) {
        setShow((prev) => ({
          ...prev,
          seasonsWatched: payload.seasonsWatched as number,
        }));
      }

      if (payload.episodesWatched) {
        setShow((prev) => ({
          ...prev,
          episodesWatched: payload.episodesWatched as number, // Assert non-undefined
        }));
      }
    }).catch(error => {
      console.error(
        "error occurred when updating show's seasons count or episodes count",
      );
      if (import.meta.env.DEV) console.error(error);
    });
  };

  const toggleComplete = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`,
        {
          completed: !show.completed,
        },
      );
      setShows(
        shows.map<ShowType>((s) => {
          if (s.show_id === show.show_id) {
            return {
              ...show,
              completed: !show.completed,
            };
          }
          return s;
        }),
      );
      setShow({
        ...show,
        completed: !show.completed,
      });
    } catch (error) {
      console.error("something went wrong when setting the show as complete.");
      if (import.meta.env.DEV) console.error(error);
    }
  };

  const setOpenModal = (value: boolean) => {
    if (value === false)
      closeModal();
  };

  useEffect(() => {
    if (!selectedShow) return;

    const loadShow = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/${type}/${selectedShow}`,
        );

        setShow(result.data);
      } catch (error) {
        console.error(`error occured loading the ${type}`);
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadShow();
  }, [selectedShow, type]);

  return (
    <Dialog open={selectedShow?.length !== 0} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{show.name}</DialogTitle>
        </DialogHeader>
        <p
          className={`overview ${overviewCollapsed ? "line-clamp-3" : "inline"}`}
        >
          {show.overview}{" "}
          <a
            href=""
            className="text-blue-600"
            onClick={(e) => {
              e.preventDefault();
              setOverviewCollapsed(!overviewCollapsed);
            }}
          >
                        read {overviewCollapsed ? "more" : "less"}
          </a>
        </p>


        <Button
          className="bg-red-600"
          onClick={() => {
            if (window.confirm("are you sure you want to delete this show ?")) {
              axios
                .delete(
                  `${import.meta.env.VITE_API_PATH || ""}/${type}/${selectedShow}`,
                )
                .then((res) => {
                  if (res.status === 200) {
                    setShows(shows.filter((show) => show._id !== selectedShow));
                    closeModal();
                  }
                });
            }
          }}
        >
                    Delete
        </Button>

        {type === "show" && (
          <>
            <Button
              className={`${show.completed ? "bg-green-500" : ""
              }`}
              onClick={toggleComplete}
            >
              {show.completed ? "Show completed !" : "Mark as Complete"}
            </Button>
            <div className="flex justify-between">
              <ShowControl
                name="seasons"
                count={show.seasonsWatched}
                active={!show.completed}
                update={update}
              >
                                Seasons Watched
              </ShowControl>
              <ShowControl
                name="episodes"
                count={show.episodesWatched}
                active={!show.completed}
                update={update}
              >
                                Episodes Watched
              </ShowControl>
            </div>
          </>
        )}

        <DialogFooter>
          <Button onClick={closeModal}>close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
