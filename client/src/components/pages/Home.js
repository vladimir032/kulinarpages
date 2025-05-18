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
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/recipes/popular');
        setPopularRecipes(res.data);
      } catch (err) {
        console.error('Error fetching popular recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRecipes();
  }, []);

  const PopularRecipeSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton 
        variant="rectangular" 
        height={200} 
        animation="wave"
        sx={{ bgcolor: 'grey.200' }}
      />
      <CardContent>
        <Skeleton 
          variant="text" 
          height={32} 
          width="80%" 
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />
        <Box sx={{ mt: 2 }}>
          <Skeleton 
            variant="text" 
            height={20} 
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
          <Skeleton 
            variant="text" 
            height={20} 
            width="80%" 
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
        </Box>
        <Skeleton 
          variant="rectangular" 
          height={36} 
          width={120} 
          sx={{ mt: 2, borderRadius: 1, bgcolor: 'grey.200' }}
          animation="wave"
        />
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: isMobile ? 4 : 8,
          pb: isMobile ? 4 : 6,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          variant={isMobile ? 'h4' : 'h2'}
          color="text.primary"
          gutterBottom
        >
          Кулинария и рецепты для Вас!
        </Typography>
        <Typography variant={isMobile ? 'body1' : 'h5'} color="text.secondary" paragraph>
          Откройте для себя и своей семьи лучшие блюда!
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/recipes"
          sx={{ mt: 4 }}
          fullWidth={isMobile}
        >
          Перейти к рецептам
        </Button>
      </Box>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Популярные рецепты
        </Typography>
        <Grid container spacing={isMobile ? 2 : 4}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={isMobile ? 12 : 6} sm={6} md={4}>
              <PopularRecipeSkeleton />
            </Grid>
          ))
        ) : (
          popularRecipes.map((recipe) => (
            <Grid item key={recipe._id} xs={isMobile ? 12 : 6} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  sx={{ height: isMobile ? 200 : 150, objectFit: 'cover' }}
                  image={recipe.imageUrl}
                  alt={recipe.title}
                />
                <CardContent sx={{ flexGrow: 1, p: isMobile ? 2 : 1 }}>
                  <Typography
                    gutterBottom
                    variant={isMobile ? 'h6' : 'h6'}
                    component="h2"
                    sx={{ fontSize: isMobile ? '1.2rem' : '1rem' }}
                  >
                    {recipe.title}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? '1rem' : '0.9rem', mb: 1 }}>
                    {recipe.description.substring(0, isMobile ? 100 : 80)}...
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/recipes/${recipe._id}`}
                    sx={{ mt: 1 }}
                    size={isMobile ? 'medium' : 'small'}
                    variant="outlined"
                    fullWidth={isMobile}
                  >
                    Посмотреть
            </Button>
          </CardContent>
        </Card>
      </Grid>
        ))
      )}
    </Grid>
  </Box>
</Container>
  );
};

export default Home;
