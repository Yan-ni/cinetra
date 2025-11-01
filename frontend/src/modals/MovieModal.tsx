import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { MovieType } from "@/types/index.ts";

interface MovieModalProps {
  selectedMovie: string | null;
  closeModal: () => void;
  movies: MovieType[];
  setMovies: React.Dispatch<React.SetStateAction<MovieType[]>>;
}

export default function MovieModal({
  selectedMovie,
  closeModal,
  movies,
  setMovies,
}: MovieModalProps) {
  const [movie, setMovie] = useState<MovieType>({
    id: "",
    name: "",
    overview: "",
    posterURL: "",
    favorite: false,
    userId: "",
    showId: 0,
    updatedAt: "",
    createdAt: "",
  });

  const setOpenModal = (value: boolean) => {
    if (value === false) closeModal();
  };

  useEffect(() => {
    if (!selectedMovie) return;

    const loadMovie = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/api/v1/movie/${selectedMovie}`,
        );

        setMovie(result.data);
      } catch (error) {
        console.error(`error occurred loading the movie`);
        if (import.meta.env.DEV) console.error(error);
      }
    };

    loadMovie();
  }, [selectedMovie]);

  return (
    <Dialog open={selectedMovie?.length !== 0} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{movie.name}</DialogTitle>
        </DialogHeader>
        <p className="overview line-clamp-3">
          {movie.overview}
        </p>

        <Button
          className="bg-red-600"
          onClick={() => {
            if (window.confirm("are you sure you want to delete this movie?")) {
              axios
                .delete(
                  `${import.meta.env.VITE_API_PATH || ""}/api/v1/movie/${selectedMovie}`,
                )
                .then((res) => {
                  if (res.status === 200) {
                    setMovies(movies.filter((movie) => movie.id !== selectedMovie));
                    closeModal();
                  }
                });
            }
          }}
        >
          Delete
        </Button>

        <DialogFooter>
          <Button onClick={closeModal}>close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
