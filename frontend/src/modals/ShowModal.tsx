import { useEffect, useState } from "react";
import { ShowService } from "@/services";
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
    id: "",
    name: "",
    overview: "",
    posterURL: "",
    seasonsWatched: 0,
    episodesWatched: 0,
    completed: false,
    favorite: false,
    userId: "",
    showId: 0,
    updatedAt: "",
    createdAt: "",
  });
  const [overviewCollapsed] = useState(true);

  const update = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const op = target.textContent;
    const type = target.name;

    if (op !== "+" && op !== "-") return;
    if (type !== "seasons" && type !== "episodes") return;
    if (!selectedShow) return;

    try {
      if (type === "seasons") {
        const newCount = show.seasonsWatched + (op === "-" ? -1 : 1);
        await ShowService.updateSeasons(selectedShow, newCount);
        setShow((prev) => ({ ...prev, seasonsWatched: newCount }));
      }

      if (type === "episodes") {
        const newCount = show.episodesWatched + (op === "-" ? -1 : 1);
        await ShowService.updateEpisodes(selectedShow, newCount);
        setShow((prev) => ({ ...prev, episodesWatched: newCount }));
      }
    } catch (error) {
      console.error(
        "error occurred when updating show's seasons count or episodes count",
        error,
      );
    }
  };

  const toggleComplete = async () => {
    if (!selectedShow) return;
    
    try {
      await ShowService.toggleCompleted(selectedShow, !show.completed);
      setShows(
        shows.map<ShowType>((s) => {
          if (s.showId === show.showId) {
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
      console.error("something went wrong when setting the show as complete.", error);
    }
  };

  const setOpenModal = (value: boolean) => {
    if (value === false) closeModal();
  };

  useEffect(() => {
    if (!selectedShow) return;

    const loadShow = async () => {
      try {
        const showData = await ShowService.getShowById(selectedShow);
        setShow(showData);
      } catch (error) {
        console.error(`error occurred loading the show`, error);
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
          className={`overview ${
            overviewCollapsed ? "line-clamp-3" : "inline"
          }`}
        >
          {show.overview}
        </p>

        <Button
          className="bg-red-600"
          onClick={() => {
            if (window.confirm("are you sure you want to delete this show ?")) {
              if (!selectedShow) return;
              
              ShowService.deleteShow(selectedShow)
                .then(() => {
                  setShows(shows.filter((show) => show.id !== selectedShow));
                  closeModal();
                })
                .catch((err) => {
                  console.error("Error deleting show", err);
                });
            }
          }}
        >
          Delete
        </Button>

        {type === "show" && (
          <>
            <Button
              className={`${show.completed ? "bg-green-500" : ""}`}
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
