import React from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function UserMenu({ anchorEl, onClose, onLogout }) {
  const open = Boolean(anchorEl);
  const location = useLocation(); // Get current path

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Orders', path: '/orders' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      {menuItems.map(item => (
        <MenuItem
          key={item.path}
          component={Link}
          to={item.path}
          onClick={onClose}
          sx={{ fontWeight: location.pathname === item.path ? 600 : 'normal' }}
        >
          {item.label}
        </MenuItem>
      ))}

      <Divider sx={{ my: 1 }} />

      <MenuItem
        onClick={() => { onClose(); onLogout(); }}
        sx={{ color: 'error.main', fontWeight: 600 }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
}
