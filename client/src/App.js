import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import MyFridge from './components/pages/MyFridge';


// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Recipes from './components/pages/Recipes';
import MyRecipes from './components/pages/MyRecipes';
import Profile from './components/pages/Profile';
import UserSearch from './components/users/UserSearch';
import RecipeDetail from './components/pages/RecipeDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import AdminPanel from './components/pages/AdminPanel';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5722',
    },
    secondary: {
      main: '#2196f3',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route
                path="/user-search"
                element={
                  <PrivateRoute>
                    <UserSearch />
                  </PrivateRoute>
                }
              />
              <Route path="/my-fridge" element={<MyFridge />} />
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/my-recipes"
                element={
                  <PrivateRoute>
                    <MyRecipes />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
