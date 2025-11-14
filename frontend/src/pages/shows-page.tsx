import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { ShowService } from "@/services";

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
    const loadShows = async () => {
      try {
        const showsData = await ShowService.getAllShows();
        setShows(showsData);
      } catch (error) {
        console.error("error occurred loading shows", error);
        navigate("/login");
      }
    };

    loadShows();
  }, []);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <h1 className="text-2xl font-semibold mb-6">Show List</h1>

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

      {(() => {
        const filteredShows = shows?.filter((show) => {
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
        });

        if (filteredShows.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {shows.length === 0 ? "No shows yet" : "No shows found"}
                </h3>
                <p className="text-gray-500 max-w-md">
                  {shows.length === 0
                    ? "Start building your collection by adding your first show!"
                    : "Try adjusting your search or filters to find what you're looking for."}
                </p>
                {shows.length === 0 && (
                  <Button
                    onClick={() => setAddShowModalStatus(true)}
                    className="mt-4"
                  >
                    Add Your First Show
                  </Button>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8  gap-4 w-full gap-1 mt-1">
            {filteredShows.map((show) => (
              <Show
                type="show"
                key={show.id}
                {...show}
                shows={shows}
                setShows={setShows}
                setSelectedShow={setSelectedShow}
              />
            ))}
          </div>
        );
      })()}
    

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
