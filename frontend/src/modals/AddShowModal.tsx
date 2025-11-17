import { useEffect, useState } from "react";
import { ShowService } from "@/services";
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
import { ShowType } from "@/types";
import SearchResultItem, { SearchResult } from "@/components/search-result-item";

interface AddShowModalProps {
  modalStatus: boolean;
  setModalStatus: (value: boolean) => void;
  shows: ShowType[];
  setShows: (value: ShowType[]) => void;
}

export default function AddShowModal({
  modalStatus,
  setModalStatus,
  shows,
  setShows,
}: AddShowModalProps) {
  const [searchTerm, setSearch] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResult] = useState<SearchResult[]>([]);

  const [show, setShow] = useState<SearchResult>({
    name: "",
    overview: "",
    posterURL: "",
  });

  const closeModal = () => {
    setModalStatus(false);
    setSearch("");
    setSearchResult([]);
    setShow({
      name: "",
      overview: "",
      posterURL: "",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!show.name || !show.overview || !show.posterURL) {
      closeModal();
      return;
    }

    ShowService.createShow(show)
      .then((newShow) => {
        setShows([newShow, ...shows]);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 409) {
          alert(
            `the show you're trying to add already exists in your list.`,
          );
        }
      })
      .finally(() => {
        closeModal();
      });
  };

  const onSearchResultClick = (searchResult: SearchResult) => {
    const { name, overview, posterURL } = searchResult;

    setShow({
      name,
      overview,
      posterURL,
    });
    setSearch("");
  };

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSearchResult([]);
      return;
    }
    
    ShowService.searchShows(debouncedSearchTerm)
      .then((results) => {
        setSearchResult(results);
      })
      .catch((err) => {
        console.error(err);
        alert(
          "something went wrong! please refresh the page and try again or contact the developer. Thank you 😘",
        );
      });
  }, [debouncedSearchTerm]);

  return (
    <Dialog open={modalStatus} onOpenChange={setModalStatus}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a show</DialogTitle>
          <DialogDescription>
            Add the show you watched and keep track of it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Section */}
          <div className="space-y-1">
            <Label htmlFor="searchInput" className="text-sm font-medium">
              Search the show you want to add
            </Label>
            <Input
              id="searchInput"
              placeholder={`Search show...`}
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md"
            />
            {searchResults.length > 0 && (
              <ScrollArea className="h-[200px] w-full rounded-md border">
                <ul className="p-2 space-y-1">
                  {searchResults.map((searchResult, index) => (
                    <li
                      key={index}
                      className="px-2 py-1 text-sm hover:bg-muted rounded cursor-pointer"
                    >
                      <SearchResultItem
                        index={index}
                        searchResult={searchResult}
                        onSearchResultClick={onSearchResultClick}
                      />
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
                value={show.name}
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
                value={show.overview}
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
                value={show.posterURL}
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
