import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { MessengerProvider } from './context/MessengerContext';
import MessengerTrigger from './components/messenger/MessengerTrigger';
import MyFridge from './components/pages/MyFridge';


// Components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Recipes from './components/pages/Recipes';
import MyRecipes from './components/pages/MyRecipes';
import Profile from './components/pages/Profile';
import UserSearchWrapper from './components/users/UserSearchWrapper';
import RecipeDetail from './components/pages/RecipeDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import AdminPanel from './components/pages/AdminPanel';
import Footer from './components/layout/Footer';
import { FriendsListWrapper, FollowersListWrapper, FriendRequestsWrapper } from './components/friends/FriendsWrapper';

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
        <MessengerProvider>
          <Router>
            <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <MessengerTrigger />
              <main style={{ flex: 1 }}>
                <Routes>
              <Route
                path="/friends"
                element={
                  <PrivateRoute>
                    <FriendsListWrapper />
                  </PrivateRoute>
                }
              />
              <Route
                path="/followers"
                element={
                  <PrivateRoute>
                    <FollowersListWrapper />
                  </PrivateRoute>
                }
              />
              <Route
                path="/friend-requests"
                element={
                  <PrivateRoute>
                    <FriendRequestsWrapper />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user-search"
                element={
                  <PrivateRoute>
                    <UserSearchWrapper />
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
            </main>
            <Footer />
          </div>
        </Router>
      </MessengerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
