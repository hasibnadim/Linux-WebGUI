import { connectIo } from "@/socket/io";
import { useEffect, useState } from "react";

const App = () => {
  const [list, setlist] = useState<string[]>([]);
  const [input, setinput] = useState("");
  useEffect(() => {
    connectIo();
  }, []);
  return (
    <div>
      <button
        onClick={() => {
          window.io.emit("ping", input);
          window.io.once("pong", (data) => {
            setlist([...list, data]);
          });
        }}
      >
        Add item
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setinput(e.target.value)}
      />
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
