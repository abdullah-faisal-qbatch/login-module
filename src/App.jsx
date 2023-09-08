import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import MainApp from "./pages/MainApp/MainApp";
import GuardedRoute from "./components/GuardedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <GuardedRoute>
              <MainApp />
            </GuardedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
