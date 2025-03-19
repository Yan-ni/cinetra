import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDebounce from "@/hooks/use-debounce";

export default function AddShowModal({
    modalStatus,
    setModalStatus,
    shows,
    setShows,
    type,
}) {
    const [searchTerm, setSearch] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [searchResult, setSearchResult] = useState([]);

    const [show, setShow] = useState({
        show_id: "",
        name: "",
        overview: "",
        posterURL: "",
    });

    const closeModal = () => {
        setModalStatus(false);
        setSearch("");
        setSearchResult([]);
        setShow({
            show_id: "",
            name: "",
            overview: "",
            posterURL: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!show.name || !show.overview || !show.posterURL) {
            closeModal();
            return;
        }

        axios
            .post(`${import.meta.env.VITE_API_PATH || ""}/${type}`, show)
            .then((res) => {
                if (res.status === 201) setShows([res.data, ...shows]);
            })
            .catch((err) => {
                console.error(err.response.status);
                if (err.response.status === 409)
                    alert(
                        `the ${type} you're trying to add already exists in your list.`
                    );
            })
            .finally(() => {
                closeModal();
            });
    };

    const filterAndMapSearchResult = (searchResult) => {
        const result = [];

        // Time complexity : O(n)
        searchResult.forEach(({ show_id, name, overview, posterURL }, index) => {
            if (
                name &&
                overview &&
                posterURL &&
                !shows.find((show) => show.show_id === show_id)
            )
                result.push(
                    <li
                        key={index}
                        className="py-2 px-3 hover:bg-accent rounded-md cursor-pointer flex gap-2.5"
                        onClick={() => {
                            setShow({
                                show_id,
                                name,
                                overview,
                                posterURL,
                            });
                            setSearch("");
                        }}
                    >
                        <img src={posterURL} className="h-16 aspect-[3/4]" alt="" />
                        <div>
                            <p className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">{name}</p>
                            <p className="custom-clamp overflow-hidden text-ellipsis text-sm font-light">{overview}</p>
                        </div>
                    </li>
                );
        });

        return result;
    };

    useEffect(() => {
        if (!debouncedSearchTerm) {
            setSearchResult([]);
            return;
        }
        else {
            axios
                .get(
                    `${import.meta.env.VITE_API_PATH || ""}/search/${type}?q=${debouncedSearchTerm}`
                )
                .then((res) => {
                    if (res.status === 200) setSearchResult(res.data);
                    else
                        alert(
                            "something went wrong! please refresh the page and try again or contact the developer. Thank you 😘"
                        );
                });
        }
    }, [debouncedSearchTerm, type]);

    return (
        <Dialog open={modalStatus} onOpenChange={setModalStatus}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a {type}</DialogTitle>
                    <DialogDescription>Add the {type} you watched and keep track of it.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Label htmlFor="searchInput">Search the {type} you want to add</Label>
                    <Input
                        id="searchInput"
                        placeholder={`Search ${type}...`}
                        value={searchTerm}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {searchResult.length > 0 && 
                        <ScrollArea className="h-[200px] w-full rounded-md border">
                        <ul className="p-2">
                            {filterAndMapSearchResult(searchResult)}
                        </ul>
                    </ScrollArea>
                    }
                    

                    <div className="input-group">
                        <Label htmlFor="name">name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={show.name}
                            required
                            readOnly
                        />
                    </div>

                    <div className="input-group">
                        <Label htmlFor="overview">overview</Label>
                        <Textarea
                            id="overview"
                            name="overview"
                            rows="3"
                            value={show.overview}
                            required
                            readOnly
                        />
                    </div>

                    <div className="input-group">
                        <Label htmlFor="posterURL">poster URL</Label>
                        <Input
                            id="posterURL"
                            name="posterURL"
                            type="text"
                            value={show.posterURL}
                            required
                            readOnly
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            className="bg-gray-500"
                            type="button"
                            onClick={() => closeModal()}
                        >
                            cancel
                        </Button>
                        <Button className="btn-primary inline-block ml-1" type="submit">
                            Add
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}

AddShowModal.propTypes = {
    modalStatus: PropTypes.bool.isRequired,
    setModalStatus: PropTypes.func.isRequired,
    shows: PropTypes.array.isRequired,
    setShows: PropTypes.func.isRequired,
    type: PropTypes.oneOf(["show", "movie"]).isRequired,
};
