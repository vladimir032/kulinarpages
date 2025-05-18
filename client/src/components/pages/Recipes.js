import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Grid, Card, CardMedia, CardContent, Typography, Button, Chip, TextField, Box, FormControl, InputLabel, Select, MenuItem, Slider, Paper, FormGroup, FormControlLabel, Switch, Skeleton, Collapse, IconButton, useTheme, useMediaQuery
} from '@mui/material';
import axios from 'axios';
import FilterListIcon from '@mui/icons-material/FilterList';

const categories = ['Салаты', 'Десерты', 'Супы', 'Пиццы', 'Напитки', 'Горячее'];
const difficulties = ['Легко', 'Средне', 'Сложно'];

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', difficulty: '', prepTime: [1, 500], sortByCalories: null, sortByIngredients: null });
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => { fetchRecipes(); }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrepTimeChange = (e, newValue) => { setFilters(prev => ({ ...prev, prepTime: newValue })); };

  const handleSortToggle = (field) => { setFilters(prev => ({ ...prev, [field]: prev[field] === null ? 'desc' : prev[field] === 'desc' ? 'asc' : null })); };

  const getIngredientWord = (count) => {
    if (count % 100 >= 11 && count % 100 <= 19) return 'ингредиентов';
    const lastDigit = count % 10;
    if (lastDigit === 1) return 'ингредиент';
    if (lastDigit >= 2 && lastDigit <= 4) return 'ингредиента';
    return 'ингредиентов';
  };

  const filteredAndSortedRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || recipe.category === filters.category;
    const matchesDifficulty = !filters.difficulty || recipe.difficulty === filters.difficulty;
    const matchesPrepTime = recipe.prepTime >= filters.prepTime[0] && recipe.prepTime <= filters.prepTime[1];
    return matchesSearch && matchesCategory && matchesDifficulty && matchesPrepTime;
  }).sort((a, b) => {
    if (filters.sortByCalories === 'desc') return b.calories - a.calories;
    if (filters.sortByCalories === 'asc') return a.calories - b.calories;
    if (filters.sortByIngredients === 'desc') return b.ingredients.length - a.ingredients.length;
    if (filters.sortByIngredients === 'asc') return a.ingredients.length - b.ingredients.length;
    return 0;
  });

  const RecipeSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" />
      </CardContent>
    </Card>
  );

  const FiltersBlock = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom>Фильтры</Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Категория</InputLabel>
        <Select value={filters.category} label="Категория" onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}>
          <MenuItem value="">Все</MenuItem>
          {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Сложность</InputLabel>
        <Select value={filters.difficulty} label="Сложность" onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}>
          <MenuItem value="">Все</MenuItem>
          {difficulties.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </Select>
      </FormControl>
      <Typography variant="subtitle1">Время приготовления (мин)</Typography>
      <Slider value={filters.prepTime} onChange={handlePrepTimeChange} valueLabelDisplay="auto" min={1} max={500} sx={{ mb: 3 }} />
      <FormGroup>
        <FormControlLabel control={<Switch checked={filters.sortByCalories !== null} onChange={() => handleSortToggle('sortByCalories')} />} label={`Сортировать по калориям ${filters.sortByCalories ? (filters.sortByCalories === 'desc' ? '▼' : '▲') : ''}`} />
        <FormControlLabel control={<Switch checked={filters.sortByIngredients !== null} onChange={() => handleSortToggle('sortByIngredients')} />} label={`Сортировать по ингредиентам ${filters.sortByIngredients ? (filters.sortByIngredients === 'desc' ? '▼' : '▲') : ''}`} />
      </FormGroup>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <FiltersBlock />
          </Grid>
        )}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TextField fullWidth label="Найти рецепт" variant="outlined" size="medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mr: 2 }} />
            {isMobile && (<IconButton onClick={() => setShowFilters(!showFilters)}><FilterListIcon /></IconButton>)}
          </Box>
          {isMobile && (<Collapse in={showFilters} sx={{ mb: 3 }}><FiltersBlock /></Collapse>)}
          {isMobile ? (
  <Grid container spacing={2}>
    {loading ? (
      Array.from(new Array(6)).map((_, i) => (
        <Grid item key={i} xs={12} sm={6} md={4}>
          <RecipeSkeleton />
        </Grid>
      ))
    ) : (
      filteredAndSortedRecipes.map(recipe => (
        <Grid item key={recipe._id} xs={12} sm={6} md={4}>
          <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: 3 }}>
            <CardMedia
              component="img"
              sx={{ height: 180, objectFit: 'cover' }}
              image={recipe.imageUrl}
              alt={recipe.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h6">{recipe.title}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label={recipe.difficulty} color={recipe.difficulty === 'Легко' ? 'success' : recipe.difficulty === 'Средне' ? 'warning' : 'error'} size="small" />
                <Chip label={`${recipe.calories} ккал`} variant="outlined" size="small" />
                <Chip label={`${recipe.prepTime} мин`} variant="outlined" size="small" />
              </Box>
              <Typography variant="body2">{recipe.ingredients.length} {getIngredientWord(recipe.ingredients.length)}</Typography>
              <Button component={RouterLink} to={`/recipes/${recipe._id}`} variant="contained" fullWidth size="small" sx={{ mt: 2 }}>
                Посмотреть
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))
    )}
  </Grid> ) : (
  <Grid container spacing={4}>
    {loading ? (
      Array.from(new Array(6)).map((_, index) => (
        <Grid item key={index} xs={12} sm={6} lg={4}>
          <RecipeSkeleton />
        </Grid>
      ))
    ) : (
      filteredAndSortedRecipes.map((recipe) => (
        <Grid item key={recipe._id} xs={12} sm={6} lg={4}>
          <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            boxShadow: 3
          }}>
            <CardMedia
              component="img"
              sx={{
                height: 300,
                objectFit: 'cover',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8
              }}
              image={recipe.imageUrl}
              alt={recipe.title}
            />
            <CardContent sx={{
              flexGrow: 1,
              p: 3,
              '&:last-child': { pb: 3 }
            }}>
              <Typography
                gutterBottom
                variant="h4"
                component="h2"
                sx={{
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  mb: 2
                }}
              >
                {recipe.title}
              </Typography>
              <Box sx={{
                mb: 3,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Chip
                  label={recipe.difficulty}
                  color={
                    recipe.difficulty === 'Легко' ? 'success' :
                    recipe.difficulty === 'Средне' ? 'warning' : 'error'
                  }
                  size="medium"
                />
                <Chip
                  label={`${recipe.calories} ккал`}
                  variant="outlined"
                  size="medium"
                />
                <Chip
                  label={`${recipe.prepTime} мин`}
                  variant="outlined"
                  size="medium"
                />
              </Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {recipe.ingredients.length} {getIngredientWord(recipe.ingredients.length)}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  lineHeight: 1.5,
                  color: 'text.secondary'
                }}
              >
                {recipe.description.substring(0, 120)}...
              </Typography>
              <Button
                component={RouterLink}
                to={`/recipes/${recipe._id}`}
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                Посмотреть
              </Button>
            </CardContent>
          </Card>
        </Grid>
            )))}
        </Grid>
          )}
    </Grid>
  </Grid>
</Container>
  );
}

export default Recipes;
