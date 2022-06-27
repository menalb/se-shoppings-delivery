import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import logo from '../logo.svg';
import CustomerPage from './Customers/View/CustomerPage';
import CustomersPage from './Customers/List/CustomersPage';
import Login from './Login';
import { AdminRoutes, ProtectedRoutes, PublicRoutes } from './PrivateRoute';
import { AuthProvider } from "../context/AuthContext";
import EditCustomerPage from './Customers/Edit/EditCustomerPage';
import NotAuth from './NotAuth';
import AddCustomerPage from './Customers/Add/AddCustomerPage';
import UserProfilePage from './UserProfilePage';
import { UserProfileButton } from './Buttons';
import { DeliveriesPage } from './Deliveries/DeliveriesPage';
import { AddDeliveryPage } from './Deliveries/AddDeliveryPage';
import EditDeliveryPage from './Deliveries/EditDeliveryPage';
import DeliveriesBoardPage from './Deliveries/Board/DeliveriesBoardPage';

function App() {
  return (<>
    <h1>
      <a href="/" title="Home" className='page-title'>
        <img className='logo' src={logo} aria-hidden="true" alt="Logo Comunita Sant'Egidio" />
        <span className='text'>
          Consegna Spesa
        </span>
      </a>
      <span className='user-profile'>
        <UserProfileButton></UserProfileButton>
      </span>
    </h1>
    <Container>
      <div>
        <AuthProvider>
          <BrowserRouter>
            <Routes>

              <Route path="/" element={<ProtectedRoutes />} >
                <Route path="/" element={<CustomersPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/customer/:customerId" element={<CustomerPage />} />
                <Route path="/edit/:customerId" element={<AdminRoutes />} >
                  <Route path="/edit/:customerId" element={<EditCustomerPage />} />
                </Route>
                <Route path="/deliveries" element={<DeliveriesPage />} />
                <Route path="/deliveries" element={<AdminRoutes />} >
                  <Route path="board" element={<DeliveriesBoardPage />} ></Route>
                  <Route path="board/:deliveryId" element={<DeliveriesBoardPage />} ></Route>
                  <Route path="add" element={<AddDeliveryPage />} />
                  <Route path="edit/:deliveryId" element={<EditDeliveryPage />} ></Route>
                </Route>
                <Route path="/" element={<AdminRoutes />} >
                  <Route path="/add" element={<AddCustomerPage />} />
                  {/* <Route path="/add-delivery" element={<AddDeliveryPage />} /> */}
                  {/* <Route path="/edit-delivery/:deliveryId" element={<EditDeliveryPage />} ></Route> */}

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
