import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: 'Главная', to: '/' },
    { label: 'Рецепты', to: '/recipes' },
  ];
  const userLinks = [
    { label: 'Мои рецепты', to: '/my-recipes' },
    { label: 'Холодильник', to: '/my-fridge' },
    { label: 'Профиль', to: '/profile' },
    { label: 'Поиск пользователей', to: '/user-search' },
  ];
  const guestLinks = [
    { label: 'Войти', to: '/login' },
    { label: 'Регистрация', to: '/register' },
  ];

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

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
              edge="start"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                color="inherit"
                component={RouterLink}
                to={link.to}
              >
                {link.label}
              </Button>
            ))}
            {user ? (
              <>
                {userLinks.map((link) => (
                  <Button
                    key={link.to}
                    color="inherit"
                    component={RouterLink}
                    to={link.to}
                  >
                    {link.label}
                  </Button>
                ))}
                {isAdmin() && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin"
                  >
                    Админ-панель
                  </Button>
                )}
                <Button color="inherit" onClick={logout}>Выйти</Button>
              </>
            ) : (
              <>
                {guestLinks.map((link) => (
                  <Button
                    key={link.to}
                    color="inherit"
                    component={RouterLink}
                    to={link.to}
                  >
                    {link.label}
                  </Button>
                ))}
              </>
            )}
          </Box>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
          >
            <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
              <List>
                {navLinks.map((link) => (
                  <ListItem key={link.to} disablePadding>
                    <ListItemButton component={RouterLink} to={link.to}>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider />
                {user ? (
                  <>
                    {userLinks.map((link) => (
                      <ListItem key={link.to} disablePadding>
                        <ListItemButton component={RouterLink} to={link.to}>
                          <ListItemText primary={link.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                    {isAdmin() && (
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/admin">
                          <ListItemText primary="Админ-панель" />
                        </ListItemButton>
                      </ListItem>
                    )}
                    <ListItem disablePadding>
                      <ListItemButton onClick={logout}>
                        <ListItemText primary="Выйти" />
                      </ListItemButton>
                    </ListItem>
                  </>
                ) : (
                  <>
                    {guestLinks.map((link) => (
                      <ListItem key={link.to} disablePadding>
                        <ListItemButton component={RouterLink} to={link.to}>
                          <ListItemText primary={link.label} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </>
                )}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
