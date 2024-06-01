import * as React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" style={{textDecoration: 'none', color: 'inherit'}} to='/'>
            TechTales 🚀
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Footer() {
    return (
        <>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </>
    )
}