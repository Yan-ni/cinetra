import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { ShowService } from "@/services";

import ShowModal from "../modals/ShowModal.tsx";
import AddShowModal from "../modals/AddShowModal.tsx";

import Show from "@/components/Show.tsx";
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
import { ShowType } from "@/types/index.ts";
import { RefreshCw, Search } from "lucide-react";

interface ListFiltersType {
  favoriteFilter?: "favorite" | "notFavorite";
  completeFilter?: "completed" | "notCompleted";
  sortBy?: "nameAsc" | "nameDesc" | "dateNewest" | "dateOldest" | "updatedNewest" | "updatedOldest";
}

export default function ShowsPage() {
  const [addShowModalStatus, setAddShowModalStatus] = useState<boolean>(false);
  const [shows, setShows] = useState<ShowType[]>([]);
  const [selectedShow, setSelectedShow] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<ListFiltersType>(() => {
    const savedSort = localStorage.getItem('showsSortBy');
    return savedSort ? { sortBy: savedSort as ListFiltersType['sortBy'] } : {};
  });
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

  useEffect(() => {
    if (filters.sortBy) {
      localStorage.setItem('showsSortBy', filters.sortBy);
    } else {
      localStorage.removeItem('showsSortBy');
    }
  }, [filters.sortBy]);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Show List</h1>
        <div className="flex items-center gap-3">
          <InputGroup>
            <InputGroupInput
              id="search"
              type="text"
              name="search"
              placeholder="Search for a show..."
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              className="w-64"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button
            onClick={() => setAddShowModalStatus(true)}
            className="font-medium"
          >
            Add a Show
          </Button>
          <AddShowModal
            modalStatus={addShowModalStatus}
            setModalStatus={setAddShowModalStatus}
            shows={shows}
            setShows={setShows}
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

          <Select
            key={`complete-${key}`}
            name="completeFilter"
            onValueChange={(value: "completed" | "notCompleted") =>
              setFilters({ ...filters, completeFilter: value })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All completion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="notCompleted">Not Completed</SelectItem>
            </SelectContent>
          </Select>

          {(filters.favoriteFilter || filters.completeFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({
                  favoriteFilter: undefined,
                  completeFilter: undefined,
                  sortBy: filters.sortBy,
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

        <Select
          key={`sort-${key}`}
          name="sortBy"
          onValueChange={(value: "nameAsc" | "nameDesc" | "dateNewest" | "dateOldest" | "updatedNewest" | "updatedOldest") =>
            setFilters({ ...filters, sortBy: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
            <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
            <SelectItem value="dateNewest">Date Added (Newest)</SelectItem>
            <SelectItem value="dateOldest">Date Added (Oldest)</SelectItem>
            <SelectItem value="updatedNewest">Updated (Newest)</SelectItem>
            <SelectItem value="updatedOldest">Updated (Oldest)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="mb-6" />

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

        // Apply sorting
        const sortedShows = [...filteredShows].sort((a, b) => {
          switch (filters.sortBy) {
          case "nameAsc":
            return a.name.localeCompare(b.name);
          case "nameDesc":
            return b.name.localeCompare(a.name);
          case "dateNewest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "dateOldest":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "updatedNewest":
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          case "updatedOldest":
            return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          default:
            return 0;
          }
        });

        if (sortedShows.length === 0) {
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
            {sortedShows.map((show) => (
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
