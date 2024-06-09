import './App.css';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';

function App() {
    // call refresh endpoint
    const { loading } = useLoadingWithRefresh();

    return loading ? (
        <Loader message="Loading, please wait.." />
    ) : (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/">
                    <Route index element={
                        <GuestRoute>
                            <Home />
                        </GuestRoute>
                    }/>

                    <Route path="/authenticate" element={
                        <GuestRoute>
                            <Authenticate />
                        </GuestRoute>
                    }/>

                    <Route path="/activate" element={
                        <SemiProtectedRoute>
                            <Activate />
                        </SemiProtectedRoute>
                    } />

                    <Route path="/rooms" element={
                        <ProtectedRoute>
                            <Rooms />
                        </ProtectedRoute>
                    } />

                    <Route path="/room/:id" element={
                        <ProtectedRoute>
                            <Room />
                        </ProtectedRoute>
                    } />
                </Route>
                {/* <GuestRoute path="/" exact>
                    <Home />
                </GuestRoute>
                <GuestRoute path="/authenticate">
                    <Authenticate />
                </GuestRoute>
                <SemiProtectedRoute path="/activate">
                    <Activate />
                </SemiProtectedRoute>
                <ProtectedRoute path="/rooms">
                    <Rooms />
                </ProtectedRoute>
                <ProtectedRoute path="/room/:id">
                    <Room />
                </ProtectedRoute> */}
            </Routes>
        </BrowserRouter>
    );
}

const GuestRoute = ({ children }) => {
    const { isAuth } = useSelector((state) => state.auth);
    let location = useLocation();

    return isAuth ? (
        <Navigate
            to={{
                pathname: '/rooms',
                state: { from: location },
            }}
        />
    ) : (
        children
    ); 
};

const SemiProtectedRoute = ({ children }) => {
    const { user, isAuth } = useSelector((state) => state.auth);
    let location = useLocation();

    return !isAuth ? (
        <Navigate
            to={{
                pathname: '/',
                state: { from: location },
            }}
        />
    ) : isAuth && !user.activated ? (
        children
    ) : (
        <Navigate
            to={{
                pathname: '/rooms',
                state: { from: location },
            }}
        />
    );
};

const ProtectedRoute = ({ children, ...rest }) => {
    const { user, isAuth } = useSelector((state) => state.auth);
    let location = useLocation();

    return !isAuth ? (
        <Navigate
            to={{
                pathname: '/',
                state: { from: location },
            }}
        />
    ) : isAuth && !user.activated ? (
        <Navigate
            to={{
                pathname: '/activate',
                state: { from: location },
            }}
        />
    ) : (
        children
    );
};

export default App;
