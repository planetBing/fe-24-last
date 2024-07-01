import { useEffect } from "react";

interface OverlayProps {
  onClick: () => void;
}

function Overlay({ onClick }: OverlayProps) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      onClick();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onClick]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }} />
  );
}

export default Overlay;
