import {Container} from "./Components/styles";
import Login from "./Pages/Login";
import Registrazione from "./Pages/Registrazione";
import DashBoard from "./Pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthRoute from "./Auth/Authroute.js";
import BasicRoute from "./Auth/Basicroute.js";
import { NotificheProvider } from "./Layout/Notifiche/NotificheProvider";

function App() {
  return (
    <Router>
      <Container>
          <Routes>
            <Route path="/" element={<BasicRoute> <Login/> </BasicRoute>}/>
            <Route path="/Registrazione" element={<BasicRoute> <Registrazione/> </BasicRoute>}/>
            <Route path="/Dashboard" element={<AuthRoute><NotificheProvider> <DashBoard/> </NotificheProvider> </AuthRoute>}/>
          </Routes>
      </Container> 
    </Router>
  );
}

export default App;
