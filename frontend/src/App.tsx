import "./assets/css/App.css";

import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/use-auth.tsx";

import ShowsScreen from "./Screens/shows-screen.tsx";
import MovieScreen from "./Screens/MovieScreen.tsx";
import LoginScreen from "./Screens/login-screen.tsx";
import { AuthProvider } from "./context/auth-context.tsx";


const App: FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/shows" replace />} />
                    <Route path="/shows" element={
                        <ProtectedRoute>
                            <ShowsScreen />
                        </ProtectedRoute>
                    } />
                    <Route path="/movies" element={
                        <ProtectedRoute>
                            <MovieScreen />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={
                        <LoginScreen />
                    } />
                </Routes>
            </BrowserRouter >
        </AuthProvider>
    );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        console.log("you're not authenticated!")
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default App;
