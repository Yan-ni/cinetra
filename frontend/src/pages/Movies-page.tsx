import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

import MovieModal from "../modals/MovieModal.tsx";
import AddMovieModal from "../modals/AddMovieModal.tsx";

import Movie from "@/components/Movie.tsx";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieType } from "@/types/index.ts";
import { RefreshCw } from "lucide-react";

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
    axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("Authorization");
    const loadMovies = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/api/v1/movie`,
        );

        if (result.status === 200 && Array.isArray(result.data))
          setMovies(result.data);
      } catch (error) {
        if (error instanceof Error && "response" in error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            navigate("/login");
          }
          console.error("error occurred loading movies");
          if (import.meta.env.DEV) console.error(error);
        }
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Movie List</h1>

      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => setAddMovieModalStatus(true)}
          className="font-medium"
        >
          Add a Movie
        </Button>
        <div className="flex items-center gap-4">
          <Input
            id="search"
            type="text"
            name="search"
            placeholder="Search for a movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <AddMovieModal
            modalStatus={addMovieModalStatus}
            setModalStatus={setAddMovieModalStatus}
            movies={movies}
            setMovies={setMovies}
          />
        </div>
      </div>

      <div className="flex items-end gap-6 mb-6">
        <div className="flex flex-col gap-1 min-w-[180px]">
          <Label
            htmlFor="favoriteFilter"
            className="text-sm font-medium text-gray-700"
          >
            Filter by Favorite
          </Label>
          <Select
            key={key}
            name="favoriteFilter"
            onValueChange={(value: "favorite" | "notFavorite") =>
              setFilters({ ...filters, favoriteFilter: value })
            }
          >
            <SelectTrigger
              id="favoriteFilter"
              className="w-full border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
            >
              <SelectValue placeholder="All favorites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="favorite">Favorite</SelectItem>
              <SelectItem value="notFavorite">Not Favorite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              favoriteFilter: undefined,
            });
            setKey(+new Date());
          }}
          className="flex items-center gap-2 h-10"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Filters</span>
        </Button>
      </div>

      <hr className="border-t border-gray-200 mb-6" />

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
