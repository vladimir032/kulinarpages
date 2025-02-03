import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const MyRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  const fetchSavedRecipes = async () => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      };
      const res = await axios.get('/api/users/saved-recipes', config);
      setSavedRecipes(res.data);
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
    }
  };

  const handleUnsaveRecipe = async (recipeId) => {
    try {
      await axios.post(
        `/api/recipes/${recipeId}/save`,
        null,
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      console.error('Error unsaving recipe:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Мои рецепты
      </Typography>

      {savedRecipes.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Вы не сохранили ни один рецепт.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {savedRecipes.map((recipe) => (
            <Grid item key={recipe._id} xs={12} sm={6} md={4}>
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
                              recipe.difficulty === 'Легко' ? 'success' :
                              recipe.difficulty === 'Средне' ? 'warning' : 'error'
                      }
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`${recipe.calories} kcal`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Typography sx={{ mb: 2 }}>
                    {recipe.description.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component={RouterLink}
                      to={`/recipes/${recipe._id}`}
                      variant="contained"
                      fullWidth
                    >
                      Посмотреть
                    </Button>
                    <Button
                      onClick={() => handleUnsaveRecipe(recipe._id)}
                      variant="outlined"
                      color="error"
                    >
                      Удалить
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyRecipes;
