import { useEffect, useRef, useState } from "react";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, SetMessage] = useState("");
  const [FromMessage, SetFromMessage] = useState("");
  const [chatlog, SetChatLog] = useState([""]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://13.232.32.127:8080");
    newSocket.onopen = () => {
      console.log("Connection established");
      setSocket(newSocket);
    };
    newSocket.onmessage = (message) => {
      SetFromMessage(message.data);
    };
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (FromMessage != undefined && FromMessage != "") {
      if (FromMessage.includes("ServerMessage")) {
        SetChatLog([...chatlog, FromMessage]);
      } else {
        SetChatLog([...chatlog, "From: " + FromMessage]);
      }
      SetFromMessage("");
    }
  }, [FromMessage]);

  return (
    <>
      <div className="h-screen">
        <div className="text-white flex flex-col items-center h-5/6 overflow-scroll">
          {chatlog.map((msg) => (
            <p>{msg}</p>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <div className="flex flex-row justify-center items-end">
          <form className="flex flex-row">
            <div>
              <input
                className="p-2 m-2 border-green-600 border-solid rounded w-80"
                type="text"
                value={message}
                placeholder="Please type your message here"
                onChange={(evt) => {
                  SetMessage(evt.target.value);
                }}
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-600 px-4 py-2 m-2 rounded text-white"
                onClick={(evt) => {
                  evt.preventDefault();
                  if (message !== "" && message != undefined) {
                    SetChatLog([...chatlog, "You :" + message]);
                    socket?.send(message);
                  }
                  SetMessage("");
                }}
              >
                <img src="./src/assets/sendicon.png" alt="Send"></img>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
