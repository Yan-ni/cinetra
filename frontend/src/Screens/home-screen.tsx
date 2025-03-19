import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Show from "../components/Show.tsx";

import ShowModal from "../modals/ShowModal.tsx";
import AddShowModal from "../modals/AddShowModal.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

export default function HomeScreen() {
    const [addShowModalStatus, setAddShowModalStatus] = useState(false);
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] =
            localStorage.getItem("Authorization");
        const loadShows = async () => {
            try {
                const result = await axios.get(
                    `${import.meta.env.VITE_API_PATH || ""}/show`
                );

                if (result.status === 200 && Array.isArray(result.data))
                    setShows(result.data);
            } catch (error) {
                if (error.response.status === 401) {
                    navigate("/login");
                }
                console.error("error occured loading shows");
                if (import.meta.env.DEV) console.error(error);
            }
        };

        loadShows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                {/* start */}
                                <div className="app">
                                    <h1 className="text-center">Show List</h1>

                                    <Input
                                        id="search"
                                        type="text"
                                        name="search"
                                        placeholder="Search for a show in your list"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value.toLowerCase())}
                                    />
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex flex-col gap-1 min-w-[200px]">
                                            <Button onClick={() => setAddShowModalStatus(true)}>
                                                Add a show
                                            </Button>
                                            {/* <AddShowModal
                                                type="show"
                                                modalStatus={addShowModalStatus}
                                                setModalStatus={setAddShowModalStatus}
                                                shows={shows}
                                                setShows={setShows}
                                            /> */}
                                        </div>

                                        <div className="flex flex-col gap-1 min-w-[200px]">
                                            <Label htmlFor="favoriteFilter">Filter by Favorite</Label>
                                            <Select
                                                name="favoriteFilter"
                                                onValueChange={(value) => setFilters({
                                                    ...filters,
                                                    "favoriteFilter": value,
                                                })}
                                            >
                                                <SelectTrigger id="favoriteFilter">
                                                    <SelectValue placeholder="Filter by Favorite" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="favorite">favorite</SelectItem>
                                                    <SelectItem value="notFavorite">not favorite</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex flex-col gap-1 min-w-[200px]">
                                            <Label htmlFor="completeFilter">Filter by Complete</Label>
                                            <Select
                                                name="completeFilter"
                                                onValueChange={(value) => setFilters({
                                                    ...filters,
                                                    "completeFilter": value,
                                                })}
                                            >
                                                <SelectTrigger id="completeFilter">
                                                    <SelectValue placeholder="Filter by Favorite" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="completed">completed</SelectItem>
                                                    <SelectItem value="notCompleted">not completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>

                                    <div className="shows w-full gap-1 mt-1">
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
                                        closeModal={() => setSelectedShow(null)}
                                        shows={shows}
                                        setShows={setShows}
                                    />
                                </div>
                                {/* end */}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
