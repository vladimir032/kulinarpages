import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            Кулинарные рецепты
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
            >
              Главная
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/recipes"
            >
              Рецепты
            </Button>
            
            {user ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/my-recipes"
                >
                  Мои рецепты
                </Button>
                <Button
              color="inherit"
              component={RouterLink}
              to="/my-fridge"
           >
              Холодильник
            </Button>
                <Button
                  color="inherit"
                  onClick={logout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                >
                  Войти
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  Регистрация
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
