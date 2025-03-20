import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

import ShowModal from "../modals/ShowModal.tsx";
import AddShowModal from "../modals/AddShowModal.tsx";

import Show from "@/components/Show.tsx";
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
import { ShowType } from "@/types/index.ts";
import { RefreshCw } from "lucide-react";

interface ListFiltersType {
  favoriteFilter?: "favorite" | "notFavorite";
  completeFilter?: "completed" | "notCompleted";
}

export default function ShowsPage() {
  const [addShowModalStatus, setAddShowModalStatus] = useState<boolean>(false);
  const [shows, setShows] = useState<ShowType[]>([]);
  const [selectedShow, setSelectedShow] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<ListFiltersType>({});
  const navigate = useNavigate();
  const [key, setKey] = useState(+new Date());

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("Authorization");
    const loadShows = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_PATH || ""}/show`,
        );

        if (result.status === 200 && Array.isArray(result.data))
          setShows(result.data);
      } catch (error) {
        if (error instanceof Error && "response" in error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            navigate("/login");
          }
          console.error("error occured loading shows");
          if (import.meta.env.DEV) console.error(error);
        }
      }
    };

    loadShows();
  }, []);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Show List</h1>

      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => setAddShowModalStatus(true)}
          className="font-medium"
        >
          Add a Show
        </Button>
        <div className="flex items-center gap-4">
          <Input
            id="search"
            type="text"
            name="search"
            placeholder="Search for a show..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <AddShowModal
            type="show"
            modalStatus={addShowModalStatus}
            setModalStatus={setAddShowModalStatus}
            shows={shows}
            setShows={setShows}
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

        <div className="flex flex-col gap-1 min-w-[180px]">
          <Label
            htmlFor="completeFilter"
            className="text-sm font-medium text-gray-700"
          >
            Filter by Completion
          </Label>
          <Select
            key={key}
            name="completeFilter"
            onValueChange={(value: "completed" | "notCompleted") =>
              setFilters({ ...filters, completeFilter: value })
            }
          >
            <SelectTrigger
              id="completeFilter"
              className="w-full border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
            >
              <SelectValue placeholder="All completion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="notCompleted">Not Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              favoriteFilter: undefined,
              completeFilter: undefined,
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

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8  gap-4 w-full gap-1 mt-1">
        {shows
          ?.filter((show) => {
            if (!show.name.toLowerCase().includes(search)) return false;

            if (filters.favoriteFilter === "favorite" && show.favorite !== true)
              return false;

            if (
              filters.favoriteFilter === "notFavorite" &&
              show.favorite !== false
            )
              return false;

            if (
              filters.completeFilter === "completed" &&
              show.completed !== true
            )
              return false;

            if (
              filters.completeFilter === "notCompleted" &&
              show.completed !== false
            )
              return false;

            return true;
          })
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
        closeModal={() => setSelectedShow("")}
        shows={shows}
        setShows={setShows}
      />
    </div>
  );
}
