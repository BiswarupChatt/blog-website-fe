import * as React from 'react';
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../validations/FormValidations';
import axios from '../config/Axios';
import { useNavigate } from 'react-router-dom';
import { Zoom, toast } from 'react-toastify';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const initialValues = {
    email: "",
    password: ""
}

export default function Login() {

    const navigate = useNavigate()

    const toastStyle = {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: loginValidationSchema,
        onSubmit: async (value) => {
            try {
                const response = await axios.post('/api/users/login', value)
                localStorage.setItem("token", response.data.token)
                navigate('/')
            } catch (err) {
                if (err.response && err.response.data && err.response.data.errors && err.response.data.errors.length > 0) {
                    toast.error(err.response.data.errors, toastStyle)
                } else {
                    toast.error('Please fill-up all the details', toastStyle)
                }
            }
        }
    })

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && !!errors.email}
                            helperText={(touched && errors.email)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && !!errors.email}
                            helperText={(touched && errors.password)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent='center'>
                            <Grid item>
                                <Link to="/register" style={{ textDecoration: 'underline', color: 'primary', flex: 1 }}>
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}