import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import { AppBar } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {

    const { user, handleLogout } = useAuth()

    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        localStorage.removeItem('token')
        handleLogout()
        navigate('/')
    }

    return (
        <React.Fragment>
            <AppBar position="sticky" color="default" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }} >
                    <Button size="small"> {user? user.firstName : 'enter name'}</Button>
                    <div>
                        <Link to='/' style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                            <Typography component="h2" variant="h5" color="inherit" noWrap sx={{ flex: 1, textAlign: 'center' }}>
                                TechTales 🚀
                            </Typography>
                        </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="outlined" size="small" href='/login' sx={{ marginRight: 1 }}>
                            Sign In
                        </Button>
                        <IconButton
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >{!user ? (
                            <>
                                <Link to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <MenuItem onClick={handleClose} href='/login'>Login</MenuItem>
                                </Link>
                                <Link to='/register' style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <MenuItem onClick={handleClose}>Register</MenuItem>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to='/my-account' style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <MenuItem onClick={handleClose}>My Account</MenuItem>
                                </Link>
                                <Link to='/my-post' style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <MenuItem onClick={handleClose}>My Post</MenuItem>
                                </Link>
                                <MenuItem onClick={() => { handleLogOut(); handleClose() }}>Logout</MenuItem>
                            </>
                        )}
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

