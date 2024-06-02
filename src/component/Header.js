import React, { useState } from 'react';
import { AppBar, Toolbar, Button, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

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
                    <Button size="small" component={Link} to='/my-account' sx={{ display: { xs: 'none', md: 'inline' } }}> {user ? (`Hello ${user.firstName}`) : ('Hello User')}</Button>
                    <div>
                        <Link to='/' style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                            <Typography component="h2" variant="h5" color="inherit" noWrap sx={{ flex: 1, textAlign: 'center' }}>
                                TechTales🚀
                            </Typography>
                        </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <Button variant="outlined" size="small" component={Link} to='/my-post' sx={{ marginRight: 1, display: { xs: 'none', md: 'inline' } }}>
                                    Your Post
                                </Button>
                            </>
                        ) : (null)}

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
                            <div>
                                <MenuItem component={Link} to='/login' onClick={handleClose}>Login</MenuItem>
                                <MenuItem component={Link} to='/register' onClick={handleClose}>Register</MenuItem>
                            </div>
                        ) : (
                            <div>
                                <MenuItem component={Link} to='/my-account' onClick={handleClose}>My Account</MenuItem>
                                <MenuItem component={Link} to='/my-post' onClick={handleClose}>My Post</MenuItem>
                                <MenuItem component={Link} to='/create-post' onClick={handleClose}>Create Post</MenuItem>
                                <MenuItem onClick={() => { handleLogOut(); handleClose(); }}>Logout</MenuItem>
                            </div>
                        )}
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

