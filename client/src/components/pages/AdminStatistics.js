import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToggleButton, ToggleButtonGroup, Button, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import { exportStatsJSON, exportStatsTXT, exportStatsXLSX, exportStatsDOCX, exportStatsSQL } from '../../utils/statsExport';
import { Box, Typography, Paper, CircularProgress, Grid } from '@mui/material';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const AdminStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [period, setPeriod] = useState('day');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        const byParam = period === 'hour' ? '?by=hour' : '';
        const [users, recipes, topUsers, topRecipes, likesDyn, viewsDyn, categories, topIps] = await Promise.all([
          axios.get(`/api/admin-stats/new-users${byParam}`, config),
          axios.get(`/api/admin-stats/new-recipes${byParam}`, config),
          axios.get('/api/admin-stats/top-users', config),
          axios.get('/api/admin-stats/top-recipes', config),
          axios.get(`/api/admin-stats/likes-dynamics${byParam}`, config),
          axios.get(`/api/admin-stats/views-dynamics${byParam}`, config),
          axios.get('/api/admin-stats/categories', config),
          axios.get('/api/admin-stats/top-ips', config),
        ]);
        setStats({
          users: users.data,
          recipes: recipes.data,
          topUsers: topUsers.data,
          topRecipes: topRecipes.data,
          likesDyn: likesDyn.data,
          viewsDyn: viewsDyn.data,
          categories: categories.data,
          topIps: topIps.data,
        });
        setLoading(false);
      } catch (err) {
        setError('Ошибка загрузки статистики');
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error">{error}</Typography></Box>;

  const handlePeriod = (event, value) => {
    if (value) setPeriod(value);
  };

  const usersByDay = {
    labels: stats.users?.map(u => u._id),
    datasets: [{
      label: 'Новые пользователи',
      data: stats.users?.map(u => u.count),
      backgroundColor: '#1976d2',
    }],
  };
  const recipesByDay = {
    labels: stats.recipes?.map(r => r._id),
    datasets: [{
      label: 'Новые рецепты',
      data: stats.recipes?.map(r => r.count),
      backgroundColor: '#43a047',
    }],
  };
  const topUsers = {
    labels: stats.topUsers?.map(u => u.username),
    datasets: [{
      label: 'Входы',
      data: stats.topUsers?.map(u => u.loginCount || 0),
      backgroundColor: '#fbc02d',
    }],
  };
  const topRecipes = {
    labels: stats.topRecipes?.map(r => r.title),
    datasets: [
      {
        label: 'Лайки',
        data: stats.topRecipes?.map(r => r.likes),
        backgroundColor: '#e53935',
      },
      {
        label: 'Просмотры',
        data: stats.topRecipes?.map(r => r.views),
        backgroundColor: '#1e88e5',
      },
      {
        label: 'Комментарии',
        data: stats.topRecipes?.map(r => r.commentsCount),
        backgroundColor: '#43a047',
      },
    ],
  };
  const likesDyn = {
    labels: stats.likesDyn?.map(l => l._id),
    datasets: [{
      label: 'Лайки по дням',
      data: stats.likesDyn?.map(l => l.likes),
      fill: false,
      borderColor: '#e53935',
      tension: 0.1,
    }],
  };
  const viewsDyn = {
    labels: stats.viewsDyn?.map(v => v._id),
    datasets: [{
      label: 'Просмотры по дням',
      data: stats.viewsDyn?.map(v => v.views),
      fill: false,
      borderColor: '#1e88e5',
      tension: 0.1,
    }],
  };
  const categories = {
    labels: stats.categories?.map(c => c._id),
    datasets: [{
      label: 'Рецепты по категориям',
      data: stats.categories?.map(c => c.count),
      backgroundColor: [
        '#1976d2', '#43a047', '#fbc02d', '#e53935', '#1e88e5', '#8e24aa'
      ],
    }],
  };
  const topIps = {
    labels: stats.topIps?.map(ip => ip._id),
    datasets: [{
      label: 'Входы с IP',
      data: stats.topIps?.map(ip => ip.count),
      backgroundColor: ['#8e24aa', '#1976d2', '#43a047', '#fbc02d', '#e53935', '#1e88e5'],
    }],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Глубокая статистика</Typography>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => exportStatsJSON(stats)}
          >
            JSON
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DescriptionIcon />}
            onClick={() => exportStatsTXT(stats)}
          >
            TXT
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<TableChartIcon />}
            onClick={() => exportStatsXLSX(stats)}
          >
            Excel
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<ArticleIcon />}
            onClick={() => exportStatsDOCX(stats)}
          >
            DOCX
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<CodeIcon />}
            onClick={() => exportStatsSQL(stats)}
          >
            SQL
          </Button>
        </Stack>
      </Box>
      <ToggleButtonGroup
        value={period}
        exclusive
        onChange={handlePeriod}
        sx={{ mb: 3 }}
        size="small"
      >
        <ToggleButton value="day">По дням</ToggleButton>
        <ToggleButton value="hour">По часам</ToggleButton>
      </ToggleButtonGroup>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Новые пользователи {period === 'hour' ? 'по часам' : 'по дням'}</Typography>
            <Bar data={usersByDay} options={{ responsive: true }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Новые рецепты {period === 'hour' ? 'по часам' : 'по дням'}</Typography>
            <Bar data={recipesByDay} options={{ responsive: true }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Самые активные пользователи</Typography>
            <Bar data={topUsers} options={{ responsive: true }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Самые популярные рецепты</Typography>
            <Bar data={topRecipes} options={{ responsive: true, plugins: { legend: { display: true } } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Динамика лайков {period === 'hour' ? 'по часам' : 'по дням'}</Typography>
            <Line data={likesDyn} options={{ responsive: true }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Динамика просмотров {period === 'hour' ? 'по часам' : 'по дням'}</Typography>
            <Line data={viewsDyn} options={{ responsive: true }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Категориальный анализ</Typography>
            <Pie data={categories} options={{ responsive: true }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Самые активные IP</Typography>
            <Doughnut data={topIps} options={{ responsive: true }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStatistics;
