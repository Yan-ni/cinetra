import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { MovieService } from "@/services";

import MovieModal from "../modals/MovieModal.tsx";
import AddMovieModal from "../modals/AddMovieModal.tsx";

import Movie from "@/components/Movie.tsx";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MovieType } from "@/types/index.ts";
import { RefreshCw, Search } from "lucide-react";

interface ListFiltersType {
  favoriteFilter?: "favorite" | "notFavorite";
}

export default function MoviesPage() {
  const [addMovieModalStatus, setAddMovieModalStatus] = useState<boolean>(false);
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<ListFiltersType>({});
  const navigate = useNavigate();
  const [key, setKey] = useState(+new Date());

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const moviesData = await MovieService.getAllMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error("error occurred loading movies", error);
        navigate("/login");
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Movie List</h1>
        <div className="flex items-center gap-3">
          <InputGroup>
            <InputGroupInput
              id="search"
              type="text"
              name="search"
              placeholder="Search for a movie..."
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              className="w-64"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button
            onClick={() => setAddMovieModalStatus(true)}
            className="font-medium"
          >
            Add a Movie
          </Button>
          <AddMovieModal
            modalStatus={addMovieModalStatus}
            setModalStatus={setAddMovieModalStatus}
            movies={movies}
            setMovies={setMovies}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Select
            key={`favorite-${key}`}
            name="favoriteFilter"
            onValueChange={(value: "favorite" | "notFavorite") =>
              setFilters({ ...filters, favoriteFilter: value })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All favorites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="favorite">Favorite</SelectItem>
              <SelectItem value="notFavorite">Not Favorite</SelectItem>
            </SelectContent>
          </Select>

          {filters.favoriteFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({
                  favoriteFilter: undefined,
                });
                setKey(+new Date());
              }}
              className="flex items-center gap-1.5 h-9"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-6" />

      {(() => {
        const filteredMovies = movies?.filter((movie) => {
          if (!movie.name.toLowerCase().includes(search)) return false;

          if (filters.favoriteFilter === "favorite" && movie.favorite !== true)
            return false;

          if (
            filters.favoriteFilter === "notFavorite" &&
            movie.favorite !== false
          )
            return false;

          return true;
        });

        if (filteredMovies.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {movies.length === 0 ? "No movies yet" : "No movies found"}
                </h3>
                <p className="text-gray-500 max-w-md">
                  {movies.length === 0
                    ? "Start building your collection by adding your first movie!"
                    : "Try adjusting your search or filters to find what you're looking for."}
                </p>
                {movies.length === 0 && (
                  <Button
                    onClick={() => setAddMovieModalStatus(true)}
                    className="mt-4"
                  >
                    Add Your First Movie
                  </Button>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8  gap-4 w-full gap-1 mt-1">
            {filteredMovies.map((movie) => (
              <Movie
                key={movie.id}
                {...movie}
                movies={movies}
                setMovies={setMovies}
                setSelectedMovie={setSelectedMovie}
              />
            ))}
          </div>
        );
      })()}

      <MovieModal
        selectedMovie={selectedMovie}
        closeModal={() => setSelectedMovie("")}
        movies={movies}
        setMovies={setMovies}
      />
    </div>
  );
}
