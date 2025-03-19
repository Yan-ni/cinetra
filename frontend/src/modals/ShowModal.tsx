import { useEffect, useState } from "react";
import axios from "axios";
import ShowControl from "../components/ShowControl.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";

interface ShowodalType {
    selectedShow: string | null;
    closeModal: () => void;
    shows: [];
    setShows: (shows: []) => void;
    type: "show" | "movie";
}

export default function ShowModal({
    selectedShow,
    closeModal,
    shows,
    setShows,
    type,
}: ShowodalType) {
    const [show, setShow] = useState({});
    const [overviewCollaplsed, setOverviewCollapsed] = useState(true);

    const update = async (e) => {
        const data = {};
        const op = e.target.textContent;
        const type = e.target.name;

        if (type === "seasons") {
            data.seasonsWatched = show.seasonsWatched + (op === "-" ? -1 : 1);
        } else {
            data.episodesWatched = show.episodesWatched + (op === "-" ? -1 : 1);
        }

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`,
                data
            );
            if (res.status === 200) {
                if (data.seasonsWatched !== undefined)
                    setShow((prev) => ({ ...prev, seasonsWatched: data.seasonsWatched }));
                else if (data.episodesWatched !== undefined)
                    setShow((prev) => ({
                        ...prev,
                        episodesWatched: data.episodesWatched,
                    }));
            }
        } catch (error) {
            console.error(
                "error occured when updating show's seasons count or episodes count"
            );
            if (import.meta.env.DEV) console.error(error);
        }
    };

    const toggleComplete = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_PATH || ""}/show/${selectedShow}`,
                {
                    completed: !show.completed,
                }
            );
            setShows(
                shows.map((s) => {
                    if (s.show_id === show.show_id) {
                        return {
                            ...show,
                            completed: !show.completed,
                        };
                    }
                    return s;
                })
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
            closeModal()
    }

    useEffect(() => {
        if (!selectedShow) return;

        const loadShow = async () => {
            try {
                const result = await axios.get(
                    `${import.meta.env.VITE_API_PATH || ""}/${type}/${selectedShow}`
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
        <Dialog open={selectedShow !== null} onOpenChange={setOpenModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{show.name}</DialogTitle>
                </DialogHeader>
                <p
                    className={`overview ${overviewCollaplsed ? "line-clamp-3" : "inline"}`}
                >
                    {show.overview}{" "}
                    <a
                        href=""
                        className="text-blue-600"
                        onClick={(e) => {
                            e.preventDefault();
                            setOverviewCollapsed(!overviewCollaplsed);
                        }}
                    >
                        read {overviewCollaplsed ? "more" : "less"}
                    </a>
                </p>


                <Button
                    className="bg-red-600"
                    onClick={() => {
                        if (window.confirm("are you sure you want to delete this show ?")) {
                            axios
                                .delete(
                                    `${import.meta.env.VITE_API_PATH || ""}/${type}/${selectedShow}`
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
                            className={`${
                                show.completed ? "bg-green-500" : ""
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
