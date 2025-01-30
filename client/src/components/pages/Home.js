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
  Box,
} from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [popularRecipes, setPopularRecipes] = useState([]);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const res = await axios.get('/api/recipes/popular');
        setPopularRecipes(res.data);
      } catch (err) {
        console.error('Error fetching popular recipes:', err);
      }
    };

    fetchPopularRecipes();
  }, []);

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          Кулинарные рецепты для Вас и Вашей семьи
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Откройте для себя и своей семьи лучшие блюда!
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/recipes"
          sx={{ mt: 4 }}
        >
          Перейти к рецептам
        </Button>
      </Box>

      {/* Popular Recipes Section */}
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Популярные рецепты
        </Typography>
        <Grid container spacing={4}>
          {popularRecipes.map((recipe) => (
            <Grid item key={recipe._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: 200,
                  }}
                  image={recipe.imageUrl}
                  alt={recipe.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {recipe.title}
                  </Typography>
                  <Typography>
                    {recipe.description.substring(0, 100)}...
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/recipes/${recipe._id}`}
                    sx={{ mt: 2 }}
                  >
                    Посмотреть
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
