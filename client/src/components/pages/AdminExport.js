import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminExport = () => {
  const { isAdmin } = useAuth();
  const [exportTypeUsers, setExportTypeUsers] = useState('');
  const [exportTypeRecipes, setExportTypeRecipes] = useState('');
  const [loadingExportUsers, setLoadingExportUsers] = useState(false);
  const [loadingExportRecipes, setLoadingExportRecipes] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin()) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        const [usersRes, recipesRes] = await Promise.all([
          axios.get('/api/admin/users', config),
          axios.get('/api/recipes', config)
        ]);
        setUsers(usersRes.data);
        setRecipes(recipesRes.data);
        setLoadingData(false);
      } catch (err) {
        setError('Ошибка загрузки данных');
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleExportUsersChange = (event) => {
    setExportTypeUsers(event.target.value);
  };

  const handleExportRecipesChange = (event) => {
    setExportTypeRecipes(event.target.value);
  };

  const handleExportUsers = async () => {
    if (!exportTypeUsers) return;
    setLoadingExportUsers(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        },
        responseType: 'blob'
      };
      const response = await axios.get(`/api/statistics/export?type=${exportTypeUsers}`, config);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_export.${exportTypeUsers}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSnackbar({ open: true, message: 'Экспорт пользователей успешно выполнен', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка при экспорте пользователей', severity: 'error' });
    } finally {
      setLoadingExportUsers(false);
    }
  };

  const handleExportRecipes = async () => {
    if (!exportTypeRecipes) return;
    setLoadingExportRecipes(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        },
        responseType: 'blob'
      };
      const response = await axios.get(`/api/statistics/export?type=${exportTypeRecipes}&data=recipes`, config);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recipes_export.${exportTypeRecipes}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSnackbar({ open: true, message: 'Экспорт рецептов успешно выполнен', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка при экспорте рецептов', severity: 'error' });
    } finally {
      setLoadingExportRecipes(false);
    }
  };

  if (!isAdmin()) {
    return <Typography variant="h6" color="error">Доступ запрещён</Typography>;
  }

  if (loadingData) {
    return <Typography>Загрузка данных...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Экспорт данных</Typography>

      <Typography variant="h6" gutterBottom>Пользователи</Typography>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel id="export-type-users-label">Формат экспорта</InputLabel>
        <Select
          labelId="export-type-users-label"
          value={exportTypeUsers}
          label="Формат экспорта"
          onChange={handleExportUsersChange}
        >
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
          <MenuItem value="xlsx">XLSX</MenuItem>
          <MenuItem value="txt">TXT</MenuItem>
          <MenuItem value="sql">SQL</MenuItem>
        </Select>
      </FormControl>
      <Box>
        <Button variant="contained" onClick={handleExportUsers} disabled={!exportTypeUsers || loadingExportUsers}>
          {loadingExportUsers ? <CircularProgress size={24} /> : 'Экспортировать пользователей'}
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 300, mt: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Заблокирован</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isBlocked ? 'Да' : 'Нет'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Рецепты</Typography>
      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel id="export-type-recipes-label">Формат экспорта</InputLabel>
        <Select
          labelId="export-type-recipes-label"
          value={exportTypeRecipes}
          label="Формат экспорта"
          onChange={handleExportRecipesChange}
        >
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
          <MenuItem value="xlsx">XLSX</MenuItem>
          <MenuItem value="txt">TXT</MenuItem>
          <MenuItem value="sql">SQL</MenuItem>
        </Select>
      </FormControl>
      <Box>
        <Button variant="contained" onClick={handleExportRecipes} disabled={!exportTypeRecipes || loadingExportRecipes}>
          {loadingExportRecipes ? <CircularProgress size={24} /> : 'Экспортировать рецепты'}
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 300, mt: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Сложность</TableCell>
              <TableCell>Калории</TableCell>
              <TableCell>Время приготовления</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map(recipe => (
              <TableRow key={recipe._id}>
                <TableCell>{recipe.title}</TableCell>
                <TableCell>{recipe.category}</TableCell>
                <TableCell>{recipe.difficulty}</TableCell>
                <TableCell>{recipe.calories}</TableCell>
                <TableCell>{recipe.prepTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminExport;
