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
  const { id } = useParams();
  const { user } = useAuth();

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await axios.get(`/api/recipes/${id}`);
      setRecipe(res.data);
      if (user) {
        setIsSaved(user.savedRecipes.includes(id));
      }
    } catch (err) {
      console.error('Error fetching recipe:', err);
    }
  }, [id, user]);
  
  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);
  
  const handleSaveRecipe = async () => {
    if (!user) return;
    try {
      await axios.post(`/api/recipes/${id}/save`, null, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
  };

  if (!recipe) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Image and Basic Info */}
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
              startIcon={<FavoriteIcon />}
              onClick={handleSaveRecipe}
              fullWidth
            >
              {isSaved ? 'Сохранено' : 'Сохранить рецепт'}
            </Button>
          )}
        </Grid>

        {/* Right Column - Recipe Details */}
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
