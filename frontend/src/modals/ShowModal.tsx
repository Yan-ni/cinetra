import { useEffect, useState } from "react";
import { ShowService } from "@/services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShowType } from "@/types/index.ts";
import { Trash2, Check, Plus, Minus, Calendar, Clock } from "lucide-react";

interface ShowModalProps {
  selectedShow: string | null;
  closeModal: () => void;
  shows: ShowType[];
  setShows: React.Dispatch<React.SetStateAction<ShowType[]>>;
  type: "show" | "movie";
}

export default function ShowModal({
  selectedShow,
  closeModal,
  shows,
  setShows,
  type,
}: ShowModalProps) {
  const [show, setShow] = useState<ShowType>({
    id: "",
    name: "",
    overview: "",
    posterURL: "",
    seasonsWatched: 0,
    episodesWatched: 0,
    completed: false,
    favorite: false,
    userId: "",
    updatedAt: "",
    createdAt: "",
  });
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [tempSeasons, setTempSeasons] = useState(0);
  const [tempEpisodes, setTempEpisodes] = useState(0);

  const updateSeasons = async (newValue: number) => {
    if (!selectedShow || newValue < 0) return;

    try {
      await ShowService.updateSeasons(selectedShow, newValue);
      setShow((prev) => ({ ...prev, seasonsWatched: newValue }));
      setShows(
        shows.map((s) =>
          s.id === selectedShow ? { ...s, seasonsWatched: newValue } : s,
        ),
      );
    } catch (error) {
      console.error("Error updating seasons", error);
    }
  };

  const updateEpisodes = async (newValue: number) => {
    if (!selectedShow || newValue < 0) return;

    try {
      await ShowService.updateEpisodes(selectedShow, newValue);
      setShow((prev) => ({ ...prev, episodesWatched: newValue }));
      setShows(
        shows.map((s) =>
          s.id === selectedShow ? { ...s, episodesWatched: newValue } : s,
        ),
      );
    } catch (error) {
      console.error("Error updating episodes", error);
    }
  };

  const toggleComplete = async () => {
    if (!selectedShow) return;

    try {
      await ShowService.toggleCompleted(selectedShow, !show.completed);
      const updatedShow = { ...show, completed: !show.completed };
      setShow(updatedShow);
      setShows(shows.map((s) => (s.id === selectedShow ? updatedShow : s)));
    } catch (error) {
      console.error("Error toggling completion", error);
    }
  };

  const deleteShow = async () => {
    if (!selectedShow) return;

    try {
      await ShowService.deleteShow(selectedShow);
      setShows(shows.filter((s) => s.id !== selectedShow));
      closeModal();
    } catch (error) {
      console.error("Error deleting show", error);
    }
  };

  const setOpenModal = (value: boolean) => {
    if (value === false) closeModal();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!selectedShow) return;

    const loadShow = async () => {
      try {
        const showData = await ShowService.getShowById(selectedShow);
        setShow(showData);
        setTempSeasons(showData.seasonsWatched);
        setTempEpisodes(showData.episodesWatched);
      } catch (error) {
        console.error("Error loading show", error);
      }
    };

    loadShow();
  }, [selectedShow]);

  return (
    <Dialog open={selectedShow?.length !== 0} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{show.name}</DialogTitle>
              {type === "show" && show.completed && (
                <Badge variant="default" className="bg-green-600">
                  <Check className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Poster Image */}
            <div className="md:col-span-1">
              <img
                src={show.posterURL}
                alt={show.name}
                className="w-full rounded-lg shadow-md"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x450?text=No+Image";
                }}
              />
            </div>

            {/* Details Section */}
            <div className="md:col-span-2 space-y-4">
              {/* Overview */}
              <div>
                <Label className="text-base font-semibold mb-2 block">
                  Overview
                </Label>
                <DialogDescription className="text-sm leading-relaxed">
                  {show.overview && show.overview.length > 70 ? (
                    <>
                      {showFullOverview
                        ? show.overview
                        : `${show.overview.slice(0, 70)}...`}{" "}
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 h-auto inline"
                        onClick={() => setShowFullOverview(!showFullOverview)}
                      >
                        {showFullOverview ? "Read less" : "Read more"}
                      </Button>
                    </>
                  ) : (
                    show.overview || "No overview available."
                  )}
                </DialogDescription>
              </div>

              <Separator />

              {/* Seasons and Episodes Controls - Only for Shows */}
              {type === "show" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="seasons"
                        className="text-sm font-medium mb-2 block"
                      >
                        Seasons Watched
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = tempSeasons - 1;
                            setTempSeasons(newValue);
                            updateSeasons(newValue);
                          }}
                          disabled={tempSeasons <= 0 || show.completed}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          id="seasons"
                          type="number"
                          value={tempSeasons}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setTempSeasons(value);
                          }}
                          onBlur={() => updateSeasons(tempSeasons)}
                          disabled={show.completed}
                          className="text-center w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = tempSeasons + 1;
                            setTempSeasons(newValue);
                            updateSeasons(newValue);
                          }}
                          disabled={show.completed}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="episodes"
                        className="text-sm font-medium mb-2 block"
                      >
                        Episodes Watched
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = tempEpisodes - 1;
                            setTempEpisodes(newValue);
                            updateEpisodes(newValue);
                          }}
                          disabled={tempEpisodes <= 0 || show.completed}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          id="episodes"
                          type="number"
                          value={tempEpisodes}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setTempEpisodes(value);
                          }}
                          onBlur={() => updateEpisodes(tempEpisodes)}
                          disabled={show.completed}
                          className="text-center w-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = tempEpisodes + 1;
                            setTempEpisodes(newValue);
                            updateEpisodes(newValue);
                          }}
                          disabled={show.completed}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadata and Actions  */}
        <div className="mt-2">
          {/* Metadata */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>Added: {formatDate(show.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>Last updated: {formatDate(show.updatedAt)}</span>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {type === "show" && (
              <Button
                onClick={toggleComplete}
                variant={show.completed ? "default" : "outline"}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                {show.completed ? "Completed" : "Mark as Complete"}
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the show &ldquo;{show.name}&rdquo; from your collection.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteShow}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
