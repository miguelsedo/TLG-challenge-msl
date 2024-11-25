import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes/routes';
import Animal from './pages/Animal';
import { Box, Typography } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Box
        component="header"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "15vh",
          backgroundColor: "#f5f5f5",
          boxShadow: 1,
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
          }}
        >
          Miguel Sedó - Animal Searcher
        </Typography>
      </Box>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="/animal/:id" element={<Animal />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
