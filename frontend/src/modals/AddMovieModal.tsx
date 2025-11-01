import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDebounce from "@/hooks/use-debounce";
import { MovieType } from "@/types";

interface AddMovieModalProps {
  modalStatus: boolean;
  setModalStatus: (value: boolean) => void;
  movies: MovieType[];
  setMovies: (value: MovieType[]) => void;
}

interface FoundMovie {
  showId: number;
  name: string;
  overview: string;
  posterURL: string;
}

export default function AddMovieModal({
  modalStatus,
  setModalStatus,
  movies,
  setMovies,
}: AddMovieModalProps) {
  const [searchTerm, setSearch] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResult, setSearchResult] = useState([]);

  const [movie, setMovie] = useState<FoundMovie>({
    showId: 0,
    name: "",
    overview: "",
    posterURL: "",
  });

  const closeModal = () => {
    setModalStatus(false);
    setSearch("");
    setSearchResult([]);
    setMovie({
      showId: 0,
      name: "",
      overview: "",
      posterURL: "",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!movie.name || !movie.overview || !movie.posterURL) {
      closeModal();
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_PATH || ""}/api/v1/movie`, movie)
      .then((res) => {
        if (res.status === 201) setMovies([res.data, ...movies]);
      })
      .catch((err) => {
        console.error(err.response.status);
        if (err.response.status === 409)
          alert(
            `the movie you're trying to add already exists in your list.`,
          );
      })
      .finally(() => {
        closeModal();
      });
  };

  const filterAndMapSearchResult = (
    searchResult: FoundMovie[],
  ): JSX.Element[] => {
    const result: JSX.Element[] = [];

    searchResult.forEach(({ showId: showId, name, overview, posterURL }, index) => {
      if (
        name &&
        overview &&
        posterURL &&
        !movies.find((movie) => movie.showId === showId)
      ) {
        result.push(
          <li
            key={index}
            className="py-2 px-3 hover:bg-accent rounded-md cursor-pointer flex gap-2.5"
            onClick={() => {
              setMovie({
                showId: showId,
                name,
                overview,
                posterURL,
              });
              setSearch("");
            }}
          >
            <img src={posterURL} className="h-16 aspect-[3/4]" alt="" />
            <div>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                {name}
              </p>
              <p className="custom-clamp overflow-hidden text-ellipsis text-sm font-light">
                {overview}
              </p>
            </div>
          </li>,
        );
      }
    });

    return result;
  };

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSearchResult([]);
      return;
    } else {
      axios
        .get(
          `${
            import.meta.env.VITE_API_PATH || ""
          }/api/v1/movie/search?q=${debouncedSearchTerm}`,
        )
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) setSearchResult(res.data);
          else
            alert(
              "something went wrong! please refresh the page and try again or contact the developer. Thank you 😘",
            );
        });
    }
  }, [debouncedSearchTerm]);

  return (
    <Dialog open={modalStatus} onOpenChange={setModalStatus}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a movie</DialogTitle>
          <DialogDescription>
            Add the movie you watched and keep track of it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Section */}
          <div className="space-y-1">
            <Label htmlFor="searchInput" className="text-sm font-medium">
              Search the movie you want to add
            </Label>
            <Input
              id="searchInput"
              placeholder={`Search movie...`}
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md"
            />
            {searchResult.length > 0 && (
              <ScrollArea className="h-[200px] w-full rounded-md border">
                <ul className="p-2 space-y-1">
                  {filterAndMapSearchResult(searchResult).map((item, index) => (
                    <li
                      key={index}
                      className="px-2 py-1 text-sm hover:bg-muted rounded cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={movie.name}
                required
                readOnly
                className="w-full rounded-md bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="overview" className="text-sm font-medium">
                Overview
              </Label>
              <Textarea
                id="overview"
                name="overview"
                rows={3}
                value={movie.overview}
                required
                readOnly
                className="w-full rounded-md bg-muted text-muted-foreground cursor-not-allowed resize-none"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="posterURL" className="text-sm font-medium">
                Poster URL
              </Label>
              <Input
                id="posterURL"
                name="posterURL"
                type="text"
                value={movie.posterURL}
                required
                readOnly
                className="w-full rounded-md bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => closeModal()}
            >
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
