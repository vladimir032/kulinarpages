import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const initialFormState = {
  title: '',
  description: '',
  ingredients: [{ name: '', amount: '' }],
  instructions: [''],
  imageUrl: '',
  difficulty: '',
  calories: '',
  prepTime: '',
  category: ''
};

const AdminPanelMain = () => {
  const { isAdmin } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(initialFormState);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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
        const [statsRes, usersRes, recipesRes] = await Promise.all([
          axios.get('/api/admin/statistics', config),
          axios.get('/api/admin/users', config),
          axios.get('/api/recipes')
        ]);
        setStatistics(statsRes.data);
        setUsers(usersRes.data);
        setRecipes(recipesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка загрузки данных');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...form.ingredients];
    newIngredients[index][field] = value;
    setForm(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: '', amount: '' }] }));
  };

  const removeIngredient = (index) => {
    const newIngredients = form.ingredients.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...form.instructions];
    newInstructions[index] = value;
    setForm(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setForm(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
  };

  const removeInstruction = (index) => {
    const newInstructions = form.instructions.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, instructions: newInstructions }));
  };

  const openForm = (recipe = null) => {
    if (recipe) {
      setEditingRecipeId(recipe._id);
      setForm({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients && recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', amount: '' }],
        instructions: recipe.instructions && recipe.instructions.length > 0 ? recipe.instructions : [''],
        imageUrl: recipe.imageUrl || '',
        difficulty: recipe.difficulty || '',
        calories: recipe.calories || '',
        prepTime: recipe.prepTime || '',
        category: recipe.category || ''
      });
    } else {
      setEditingRecipeId(null);
      setForm(initialFormState);
    }
    setOpenDialog(true);
  };

  const closeForm = () => {
    setOpenDialog(false);
    setEditingRecipeId(null);
    setForm(initialFormState);
  };

  const submitRecipe = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const recipeData = {
        ...form
      };

      if (editingRecipeId) {
        await axios.put(`/api/recipes/${editingRecipeId}`, recipeData, config);
      } else {
        await axios.post('/api/recipes', recipeData, config);
      }

      const recipesRes = await axios.get('/api/recipes');
      setRecipes(recipesRes.data);

      closeForm();
    } catch (err) {
      alert('Ошибка при сохранении рецепта');
    }
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm('Удалить рецепт?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.delete(`/api/recipes/${id}`, config);
      setRecipes(recipes.filter(r => r._id !== id));
    } catch (err) {
      const message = err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Ошибка при удалении рецепта';
      alert(message);
    }
  };

  const blockUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.put(`/api/admin/users/${userId}/block`, null, config);
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: true } : u));
    } catch (err) {
      alert('Ошибка при блокировке пользователя');
    }
  };

  const unblockUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.put(`/api/admin/users/${userId}/unblock`, null, config);
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: false } : u));
    } catch (err) {
      alert('Ошибка при разблокировке пользователя');
    }
  };

  const restrictUser = async (userId) => {
    const dateStr = prompt('Введите дату ограничения в формате ГГГГ-ММ-ДД');
    if (!dateStr) return;
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.put(`/api/admin/users/${userId}/restrict`, { restrictionUntil: dateStr }, config);
      setUsers(users.map(u => u._id === userId ? { ...u, restrictionUntil: dateStr } : u));
    } catch (err) {
      alert('Ошибка при ограничении пользователя');
    }
  };

  const removeRestriction = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.put(`/api/admin/users/${userId}/restrict`, { restrictionUntil: null }, config);
      setUsers(users.map(u => u._id === userId ? { ...u, restrictionUntil: null } : u));
    } catch (err) {
      alert('Ошибка при снятии ограничения пользователя');
    }
  };

  if (!isAdmin()) {
    return <Typography variant="h6" color="error">Доступ запрещён</Typography>;
  }

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Панель администратора</Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Статистика</Typography>
        <Typography>Пользователей: {statistics.totalUsers}</Typography>
        <Typography>Рецептов: {statistics.totalRecipes}</Typography>
        <Typography>Сохранённых рецептов: {statistics.totalSavedRecipes}</Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Пользователи</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Заблокирован</TableCell>
                <TableCell>Ограничение до</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isBlocked ? 'Да' : 'Нет'}</TableCell>
                  <TableCell>{user.restrictionUntil ? new Date(user.restrictionUntil).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    {!user.isBlocked ? (
                      <Button variant="contained" color="error" size="small" onClick={() => blockUser(user._id)}>Заблокировать</Button>
                    ) : (
                      <Button variant="contained" color="success" size="small" onClick={() => unblockUser(user._id)}>Разблокировать</Button>
                    )}
                    {user.restrictionUntil ? (
                      <Button variant="outlined" size="small" sx={{ ml: 1 }} onClick={() => removeRestriction(user._id)}>Снять ограничение</Button>
                    ) : (
                      <Button variant="outlined" size="small" sx={{ ml: 1 }} onClick={() => restrictUser(user._id)}>Ограничить</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Рецепты</Typography>
        <Button variant="contained" onClick={() => openForm()}>Добавить рецепт</Button>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Сложность</TableCell>
                <TableCell>Калории</TableCell>
                <TableCell>Время приготовления</TableCell>
                <TableCell>Действия</TableCell>
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
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => openForm(recipe)}>Редактировать</Button>{' '}
                    <Button variant="contained" color="error" size="small" onClick={() => deleteRecipe(recipe._id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={closeForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRecipeId ? 'Редактировать рецепт' : 'Добавить рецепт'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={submitRecipe} noValidate>
            <Typography variant="subtitle1" gutterBottom>Название</Typography>
            <TextField
              fullWidth
              required
              name="title"
              value={form.title}
              onChange={handleInputChange}
            />
            <Typography variant="subtitle1" gutterBottom>Описание</Typography>
            <TextField
              fullWidth
              required
              multiline
              name="description"
              value={form.description}
              onChange={handleInputChange}
            />
            <Typography variant="subtitle1" gutterBottom>Ингредиенты</Typography>
            {form.ingredients.map((ingredient, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Название"
                  name="name"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Количество"
                  name="amount"
                  value={ingredient.amount}
                  onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                  required
                  sx={{ width: '150px' }}
                />
                <IconButton
                  aria-label="удалить ингредиент"
                  onClick={() => removeIngredient(index)}
                  disabled={form.ingredients.length === 1}
                >
                  <Remove />
                </IconButton>
                {index === form.ingredients.length - 1 && (
                  <IconButton aria-label="добавить ингредиент" onClick={addIngredient}>
                    <Add />
                  </IconButton>
                )}
              </Box>
            ))}
            <Typography variant="subtitle1" gutterBottom>Инструкции</Typography>
            {form.instructions.map((instruction, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label={`Шаг ${index + 1}`}
                  value={instruction}
                  onChange={(e) => handleInstructionChange(index, e.target.value)}
                  required
                  fullWidth
                />
                <IconButton
                  aria-label="удалить шаг"
                  onClick={() => removeInstruction(index)}
                  disabled={form.instructions.length === 1}
                >
                  <Remove />
                </IconButton>
                {index === form.instructions.length - 1 && (
                  <IconButton aria-label="добавить шаг" onClick={addInstruction}>
                    <Add />
                  </IconButton>
                )}
              </Box>
            ))}
            <Typography variant="subtitle1" gutterBottom>URL изображения</Typography>
            <TextField
              fullWidth
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleInputChange}
            />
            <Typography variant="subtitle1" gutterBottom>Сложность</Typography>
            <TextField
              fullWidth
              name="difficulty"
              value={form.difficulty}
              onChange={handleInputChange}
            />
            <Typography variant="subtitle1" gutterBottom>Калории</Typography>
            <TextField
              fullWidth
              type="number"
              name="calories"
              value={form.calories}
              onChange={handleInputChange}
            />
            <Typography variant="subtitle1" gutterBottom>Время приготовления</Typography>
            <TextField
              fullWidth
              name="prepTime"
              value={form.prepTime}
              onChange={handleInputChange}
            />
            <Typography variant="subtitle1" gutterBottom>Категория</Typography>
            <TextField
              fullWidth
              name="category"
              value={form.category}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Отмена</Button>
          <Button onClick={submitRecipe} variant="contained">{editingRecipeId ? 'Сохранить' : 'Добавить'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanelMain;
