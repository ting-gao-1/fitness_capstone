import { useEffect } from "react";
import "./toast.css";

export default function Toast({ text, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return <div className="toast">{text}</div>;
}
