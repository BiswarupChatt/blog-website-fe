import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from '../config/Axios';
import moment from 'moment';
import { Link } from 'react-router-dom';


const defaultTheme = createTheme();

export default function MyPost() {

    const [posts, setPosts] = useState([])

    useEffect(() => {
        (async () => {
            const response = await axios.get('/api/posts/my-posts', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            if (response) {
                setPosts(response.data)
            } else {
                toast.error('Unable to Fetch The post')
            }
        })()
    }, [])

    const previewContent = (content) => {
        return content.replace(/<[^>]*>/g, '').substring(0, 200).concat('', '.....');
    }

    return (
        <>
            {/* <h2>Home Working</h2> */}
            <ThemeProvider theme={defaultTheme}>
                <CssBaseline />
                <Container maxWidth="lg" sx={{ mt: 10 }}>
                    <main>
                        <Grid container spacing={5} >
                            {posts.length > 0 ? 
                            (posts.map((ele) => (
                                <Grid item xs={12} key={ele._id}>
                                    <CardActionArea component={Link} to={`/api/posts/${ele._id}`}>
                                        <Card sx={{ display: 'flex' }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 300, display: { xs: 'none', sm: 'block' } }}
                                                image={ele.bannerImage}
                                                alt={ele.imageLabel}
                                            />
                                            <CardContent sx={{ flex: 1 }}>
                                                <Typography component="h2" variant="h5">
                                                    {ele.title}
                                                </Typography>
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    {moment(ele.createdAt).format('Do-MMMM-YYYY')}
                                                </Typography>
                                                <Typography variant="subtitle1" paragraph>
                                                {previewContent(ele.content)}
                                                </Typography>
                                                <Typography variant="subtitle1" color="primary">
                                                    Continue reading...
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </CardActionArea>
                                </Grid>
                            ))) : (
                                <>
                                <CardContent>
                                <Typography component="h2" variant="h5">You han't Create any post write your first post</Typography> 
                                <Button variant="outlined" size="small" component={Link} to='/create-post'>Create first Post</Button>
                                </CardContent>
                                </>
                            )}
                        </Grid>
                    </main>
                </Container>
            </ThemeProvider>
        </>
    )
}