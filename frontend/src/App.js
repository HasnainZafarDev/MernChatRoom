import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";
import RoomPage from "./pages/RoomPage";
function App() {
  return (
    <>
      <div className="App">
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={ChatPage} />
        <Route path="/room" component={RoomPage} />
      </div>
    </>
  );
}

export default App;
