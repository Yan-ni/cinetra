import { ShowType } from "@/types";
import { ShowService } from "@/services";

interface ShowProps {
  id: string;
  name: string;
  favorite: boolean;
  posterURL: string;
  setSelectedShow: React.Dispatch<React.SetStateAction<string>>;
  shows: ShowType[];
  setShows: React.Dispatch<React.SetStateAction<ShowType[]>>;
  type: "show" | "movie";
}

export default function Show({
  id,
  name,
  favorite,
  posterURL,
  setSelectedShow,
  shows,
  setShows,
}: ShowProps) {
  const toggleFavorite = async (id: string, favorite: boolean) => {
    try {
      await ShowService.toggleFavorite(id, !favorite);

      setShows(
        shows.map((show) => {
          if (show.id !== id) return show;

          return { ...show, favorite: !favorite };
        }),
      );
    } catch (error) {
      console.error("error occurred while toggling show favorite button", error);
    }
  };

  return (
    <div
      className="aspect-[2/3] relative cursor-pointer rounded-md overflow-hidden"
      onClick={() => setSelectedShow(id)}
    >
      <img className="w-full h-full object-cover" src={posterURL} alt="" />
      <svg
        className="w-6 aspect-square absolute top-1 right-1"
        viewBox="0 0 24 24"
        fill={favorite ? "#ff0000" : "#ffffff60"}
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(id, favorite);
        }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
          stroke="#000000dd"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h2
        className="mb-3 w-[12ch] text-white text-base font-normal absolute bottom-0 left-2 z-10 whitespace-nowrap overflow-hidden text-ellipsis"
        title={name}
      >
        {name}
      </h2>
      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
}
