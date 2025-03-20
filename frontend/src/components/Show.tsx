import { ShowType } from "@/types";
import axios from "axios";

interface ShowProps {
    _id: string;
    name: string;
    favorite: boolean;
    posterURL: string;
    setSelectedShow: React.Dispatch<React.SetStateAction<string>>;
    shows: ShowType[];
    setShows: React.Dispatch<React.SetStateAction<ShowType[]>>;
    type: "show" | "movie";
}

export default function Show({
  _id,
  name,
  favorite,
  posterURL,
  setSelectedShow,
  shows,
  setShows,
  type,
}: ShowProps) {
  const toggleFavorite = async (_id: string, favorite: boolean) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_PATH || ""}/${type}/${_id}`, {
        favorite: !favorite,
      });

      // TODO: check response status
      setShows(
        shows.map((show) => {
          if (show._id !== _id) return show;

          return { ...show, favorite: !favorite };
        }),
      );
    } catch (error) {
      console.error("error occured while toggling show favorite button");
      if (import.meta.env.DEV) console.error(error);
    }
  };

  return (
    <div className="show" onClick={() => setSelectedShow(_id)}>
      <img className="w-full h-full object-cover" src={posterURL} alt="" />
      <svg
        className="heart"
        viewBox="0 0 24 24"
        fill={favorite ? "#ff0000" : "#ffffff60"}
        xmlns="http://www.w3.org/2000/svg"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(_id, favorite);
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
      <h2 className="mb-3" title={name}>{name}</h2>
    </div>
  );
}
