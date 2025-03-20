import { Button } from "./ui/button";

interface ShowControlProps {
  name: string;
  active: boolean;
  update: (e: React.MouseEvent<HTMLButtonElement>) => void;
  count: number;
  children: React.ReactNode
}

export default function ShowControl({ name, active, update, count, children }: ShowControlProps) {
  return (
    <div className="flex flex-col">
      <h3 className="text-center text-l font-bold mb-3">{children}</h3>
      <div className="button-group flex self-center items-center gap-2">
        {active && (
          <Button className="rounded-full" name={name} onClick={update}>
            -
          </Button>
        )}
        <p>{count}</p>
        {active && (
          <Button className="rounded-full" name={name} onClick={update}>
            +
          </Button>
        )}
      </div>
    </div>
  );
}
