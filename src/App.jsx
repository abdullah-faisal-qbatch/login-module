import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import MainApp from "./pages/MainApp/MainApp";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GuardedRoute from "./components/GuardedRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId="421364465267-vh598bceke9h8eml70qu38cr0g5du9h6.apps.googleusercontent.com">
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
          />2
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
