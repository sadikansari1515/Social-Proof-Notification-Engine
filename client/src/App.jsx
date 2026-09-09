import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("welcome");
    };
  }, []);

  return (
    <div>
      <h1>Social Proof Notification Engine</h1>
      <p>Real-time system is working 🚀</p>
    </div>
  );
}

export default App;
