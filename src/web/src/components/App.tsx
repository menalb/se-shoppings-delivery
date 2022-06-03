import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import logo from '../logo.svg';
import CustomerPage from './CustomerPage';
import CustomersPage from './CustomersPage';
import Login from './Login';
import { AdminRoutes, ProtectedRoutes, PublicRoutes } from './PrivateRoute';
import { AuthProvider } from "../context/AuthContext";
import EditCustomerPage from './EditCustomerPage';
import NotAuth from './NotAuth';
import AddCustomerPage from './AddCustomerPage';

function App() {
  return (<>
    <h1>
      <img className='logo' src={logo} aria-hidden="true" alt="Logo Comunita Sant'Egidio" />
      Consegna Spesa
    </h1>
    <Container>
      <div>
        <AuthProvider>
          <BrowserRouter>
            <Routes>

              <Route path="/" element={<ProtectedRoutes />} >
                {/* <Route path="/" element={<CustomersPage />} /> */}
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/customer/:customerId" element={<CustomerPage />} />
                <Route path="/edit/:customerId" element={<AdminRoutes />} >
                  <Route path="/edit/:customerId" element={<EditCustomerPage />} />
                </Route>
                <Route path="/add" element={<AdminRoutes />} >
                  <Route path="/add" element={<AddCustomerPage />} />
                </Route>
              </Route>


              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/" element={<PublicRoutes />} >
                <Route path="/login" element={<Login />} />
              </Route>
              <Route path="/no-auth" element={<NotAuth />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </Container>
  </>
  );
}

export default App;
