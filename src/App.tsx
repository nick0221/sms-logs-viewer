import ChatPage from "./pages/ChatPage";

import "./App.css";

export default function App() {
  return (
    <div className="container max-w-screen ">
      {/* flex row container */}
      <div className="h-screen flex">
        <ChatPage />
      </div>
    </div>
  );
}
