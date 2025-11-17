export interface SearchResult {
  name: string;
  overview: string;
  posterURL: string;
}

interface SearchResultItemProps {
  index: number;
  searchResult: SearchResult;
  onSearchResultClick: (searchResult: SearchResult) => void;
}

export default function SearchResultItem({ index, searchResult, onSearchResultClick }: SearchResultItemProps) {
  const { name, overview, posterURL } = searchResult;

  return <li
    key={index}
    className="py-2 px-3 hover:bg-accent rounded-md cursor-pointer flex gap-2.5"
    onClick={() => onSearchResultClick(searchResult)}
  >
    <img src={posterURL} className="h-16 aspect-[3/4]" alt="" />
    <div>
      <p className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">
        {name}
      </p>
      <p className="custom-clamp overflow-hidden text-ellipsis text-sm font-light">
        {overview}
      </p>
    </div>
  </li>;
};
