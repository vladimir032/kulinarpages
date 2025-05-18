import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Button,
  Divider,
} from '@mui/material';
import {
  Timer as TimerIcon,
  Restaurant as RestaurantIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false); 
  const [error, setError] = useState(''); 
  const { id } = useParams();
  const { user } = useAuth();

  // получение статуса для сохранения
  const fetchIsSaved = useCallback(async () => {
    if (!user) {
      setIsSaved(false);
      return;
    }
    try {
      const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };
      const res = await axios.get('/api/users/saved-recipes', config);
      const savedIds = res.data.map(r => r._id);
      setIsSaved(savedIds.includes(id));
    } catch (err) {
      setIsSaved(false);
    }
  }, [user, id]);

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await axios.get(`/api/recipes/${id}`);
      setRecipe(res.data);
      await fetchIsSaved();
    } catch (err) {
      console.error('Error fetching recipe:', err);
    }
  }, [id, fetchIsSaved]); 

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);
  
  const handleSaveRecipe = async () => {
    if (!user) return;
    setSaving(true);
    const prevSaved = isSaved;
    setIsSaved(!prevSaved); // смена статуса
    try {
      await axios.post(`/api/recipes/${id}/save`, null, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      await fetchIsSaved();
    } catch (err) {
      setIsSaved(prevSaved);
      setError('Не удалось сохранить рецепт. Попробуйте ещё раз.');
      console.error('Error saving recipe:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!recipe) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip
              icon={<TimerIcon />}
              label={`${recipe.prepTime} мин`}
              variant="outlined"
            />
            <Chip
              icon={<RestaurantIcon />}
              label={`${recipe.calories} ккал`}
              variant="outlined"
            />
            <Chip
              label={recipe.difficulty}
              color={
                recipe.difficulty === 'Легко'
                  ? 'success'
                  : recipe.difficulty === 'Средне'
                  ? 'warning'
                  : 'error'
              }
            />
          </Box>
          {user && (
            <Button
              variant={isSaved ? 'contained' : 'outlined'}
              startIcon={saving ? <span className="MuiCircularProgress-root MuiCircularProgress-indeterminate" style={{width:24,height:24,marginRight:8}}><svg viewBox="22 22 44 44"><circle className="MuiCircularProgress-circle" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" /></svg></span> : <FavoriteIcon />}
              onClick={handleSaveRecipe}
              fullWidth
              disabled={saving}
            >
              {saving ? 'Секунду...': (isSaved ? 'Сохранено' : 'Сохранить рецепт')}
            </Button>
          )}
          {error && (
            <Box sx={{ position: 'fixed', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
              <Paper elevation={6} sx={{ px: 3, py: 1, background: '#d32f2f', color: '#fff' }}>
                {error}
                <Button color="inherit" size="small" onClick={() => setError('')} sx={{ ml: 2 }}>
                  Закрыть
                </Button>
              </Paper>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {recipe.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {recipe.description}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Ингредиенты
          </Typography>
          <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
            <List>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText
                    primary={`${ingredient.name} - ${ingredient.amount}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Typography variant="h6" gutterBottom>
            Инструкция
          </Typography>
          <Paper elevation={1} sx={{ p: 2 }}>
            <List>
              {recipe.instructions.map((step, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Шаг ${index + 1}`}
                      secondary={step}
                    />
                  </ListItem>
                  {index < recipe.instructions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeDetail;
