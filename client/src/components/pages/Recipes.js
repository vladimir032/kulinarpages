import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import axios from 'axios';

const categories = ['Салаты', 'Десерты', 'Супы', 'Пиццы', 'Напитки', 'Горячее'];
const difficulties = ['Легко', 'Средне', 'Сложно'];

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    prepTime: [1, 500],
    sortByCalories: null, // null, 'asc', 'desc'
    sortByIngredients: null, // null, 'asc', 'desc'
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('/api/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const handlePrepTimeChange = (event, newValue) => {
    setFilters(prev => ({ ...prev, prepTime: newValue }));
  };

  const handleSortToggle = (field) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field] === null ? 'desc' : prev[field] === 'desc' ? 'asc' : null
    }));
  };

  const getIngredientWord = (count) => {
    if (count % 100 >= 11 && count % 100 <= 19) {
      return 'ингредиентов';
    }
    const lastDigit = count % 10;
    if (lastDigit === 1) {
      return 'ингредиент'; 
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'ингредиента'; 
    }
    return 'ингредиентов'; 
  };

  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || recipe.category === filters.category;
      const matchesDifficulty = !filters.difficulty || recipe.difficulty === filters.difficulty;
      const matchesPrepTime = recipe.prepTime >= filters.prepTime[0] && 
                            recipe.prepTime <= filters.prepTime[1];
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesPrepTime;
    })
    .sort((a, b) => {
      if (filters.sortByCalories === 'desc') {
        return b.calories - a.calories;
      } else if (filters.sortByCalories === 'asc') {
        return a.calories - b.calories;
      }
      
      if (filters.sortByIngredients === 'desc') {
        return b.ingredients.length - a.ingredients.length;
      } else if (filters.sortByIngredients === 'asc') {
        return a.ingredients.length - b.ingredients.length;
      }
      
      return 0;
    });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Фильтры
            </Typography>
            
            {/* Category Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Категория</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="">Все</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Difficulty Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Сложность</InputLabel>
              <Select
                value={filters.difficulty}
                label="Difficulty"
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              >
                <MenuItem value="">Все</MenuItem>
                {difficulties.map(difficulty => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Prep Time Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Время приготовления (минут)</Typography>
              <Slider
                value={filters.prepTime}
                onChange={handlePrepTimeChange}
                valueLabelDisplay="auto"
                min={1}
                max={500}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {filters.prepTime[0]} мин
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filters.prepTime[1]} мин
                </Typography>
              </Box>
            </Box>

            {/* Sorting Options */}
            <FormGroup>
            <FormControlLabel
                control={
                  <Switch
                    checked={filters.sortByCalories !== null}
                    onChange={() => handleSortToggle('sortByCalories')}
                  />
                }
                label={`Сортировать по калориям ${filters.sortByCalories === 'desc' ? '(От большего к меньшему)' : filters.sortByCalories === 'asc' ? '(От меньшего к большему)' : ''}`}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.sortByIngredients !== null}
                    onChange={() => handleSortToggle('sortByIngredients')}
                  />
                }
                label={`Сортировать по количеству ингредиентов ${filters.sortByIngredients === 'desc' ? '(От большего к меньшему)' : filters.sortByIngredients === 'asc' ? '(От меньшего к большему)' : ''}`}
              />
            </FormGroup>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* Search Bar */}
          <TextField
            fullWidth
            label="Найти рецепт"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Recipes Grid */}
          <Grid container spacing={3}>
            {filteredAndSortedRecipes.map((recipe) => (
              <Grid item key={recipe._id} xs={12} sm={6} lg={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 200 }}
                    image={recipe.imageUrl}
                    alt={recipe.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {recipe.title}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={recipe.difficulty}
                        color={
                          recipe.difficulty === 'Легко'
                            ? 'success'
                            : recipe.difficulty === 'Средне'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${recipe.calories} ккал`}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={`${recipe.prepTime} мин`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {recipe.ingredients.length} {getIngredientWord(recipe.ingredients.length)}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      {recipe.description.substring(0, 100)}...
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={`/recipes/${recipe._id}`}
                      variant="contained"
                      fullWidth
                    >
                      Посмотреть
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Recipes;
