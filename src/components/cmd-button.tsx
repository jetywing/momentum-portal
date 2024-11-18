import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";

export function CmdButton() {
  const isMobile = useIsMobile();

  const isMac = navigator.userAgent.includes("Mac");

  const toggleCommand = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      keyCode: 75, // KeyCode for 'K'
      code: "KeyK",
      ctrlKey: !isMac, // `true` for Windows/Linux
      metaKey: isMac, // `true` for macOS
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };

  if (isMobile) {
    return (
      <Button
        className="px-3 py-2"
        variant={"secondary"}
        onClick={() => toggleCommand()}
      >
        <SearchIcon />
      </Button>
    );
  }

  return (
    <Button
      className="h-6 w-36 justify-between px-2 text-left"
      variant={"secondary"}
      onClick={() => toggleCommand()}
    >
      <span className="text-sm text-muted-foreground">Search...</span>
      <kbd className="ml-2 text-xs text-gray-500">{isMac ? "⌘" : "ctrl+"}k</kbd>
    </Button>
  );
}
