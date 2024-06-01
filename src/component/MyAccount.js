import { useState } from "react"
import { useFormik } from "formik";
import axios from "../config/Axios";
import { toast, Zoom } from "react-toastify";
import { useAuth } from "../context/AuthContext"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { userUpdateValidation } from "../validations/FormValidations";
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme();

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

export default function MyAccount() {
    const { user } = useAuth()
    const [editBtn, setEditBtn] = useState(false)

    const initialValues = {
        firstName: user.firstName ? user.firstName : '',
        lastName: user.lastName ? user.lastName : '',
        email: user.email ? user.email : ''
    }

    const { values, setValues, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: userUpdateValidation,
        onSubmit: async (values) => {
            try {
                const response = await axios.put('/api/users/profile', values, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                setValues(response.data)
                toast.success('Profile Updated Successfully', toastStyle)
                setEditBtn(false)
            } catch (err) {
                if (err.response && err.response.data && err.response.data.errors && err.response.data.errors.length > 0) {
                    err.response.data.errors.forEach((error) => {
                        toast.error(error.msg, toastStyle)
                    })
                } else (
                    toast.error("Something Went Wrong", toastStyle)
                )
            }
        }
    })



    return (
        <ThemeProvider theme={theme}>
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

                    <Grid container display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                        <Grid display='flex' alignItems='center'>
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h2" variant="h6">
                                Personal Information
                            </Typography>
                        </Grid>
                        <Button onClick={() => { setEditBtn(!editBtn) }}>
                            {editBtn ? 'Cancel' : 'Edit'}
                        </Button>
                    </Grid>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.firstName && !!errors.firstName}
                                    helperText={(touched && errors.firstName)}
                                    disabled={!editBtn}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.lastName && !!errors.lastName}
                                    helperText={(touched && errors.lastName)}
                                    disabled={!editBtn}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && !!errors.email}
                                    helperText={(touched && errors.email)}
                                    disabled={!editBtn}
                                />
                            </Grid>
                        </Grid>
                        {editBtn ? (
                            <>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Update
                                </Button>
                            </>
                        ) : (null)}

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
