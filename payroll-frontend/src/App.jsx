import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import AddUser from "./components/AddCustomer";
import Login from "./components/Login";
import Profile from "./components/ProfileCustomer";
import AddReservation from './components/AddReservation';
import ReportByLapsOrTime from './components/ReportByLapsOrTime';
import ReportByPerson from './components/ReportByPerson';
import Rack from './components/Rack';
import Navbar from "./components/Navbar"
import Home from './components/Home';
import Tarifa from './components/RateManagement';
import KartManagement from './components/KartManagement';
import Descuentos from './components/DiscountManagement';
import ContactPage from './components/ContactPage';
import Faq from './components/Faq';
import 'react-big-calendar/lib/css/react-big-calendar.css';


function App() {
  return (
      <Router>
          <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<AddUser />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reservation" element={<AddReservation />} />
              <Route path="/reportByLapsOrTime" element={<ReportByLapsOrTime />} />
              <Route path="/reportByPerson" element={<ReportByPerson />} />
              <Route path="/rack" element={<Rack />} />
              <Route path="/karts" element={<KartManagement />} />
              <Route path="/tarifas" element={<Tarifa />} />
              <Route path="/descuentos" element={<Descuentos />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<Faq />} />
            </Routes>
          </div>
      </Router>
  );
}

export default App
