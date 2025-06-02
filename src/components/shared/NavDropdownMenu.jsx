import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function NavDropdownMenu({ items, title }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        sx={{
          fontWeight: 500,
          textTransform: 'none',
          px: 2,
        }}
      >
        {title}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        MenuListProps={{
          sx: { py: 0.5 }
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.path}
            onClick={handleClose}
            component="a"
            href={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default NavDropdownMenu;
