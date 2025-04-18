import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import AdminPanelMain from './AdminPanelMain';
import AdminExport from './AdminExport';
import AdminStatistics from './AdminStatistics';

const AdminPanel = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabIndex} onChange={handleChange} aria-label="admin panel tabs">
        <Tab label="Управление" />
        <Tab label="Экспорт данных" />
        <Tab label="Статистика" />
      </Tabs>
      {tabIndex === 0 && <AdminPanelMain />}
      {tabIndex === 1 && <AdminExport />}
      {tabIndex === 2 && <AdminStatistics />}
    </Box>
  );
};

export default AdminPanel;
