import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from '../config/Axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Grid, Container, createTheme, ThemeProvider, Typography, Card, CardActionArea, CardContent, CardMedia, Button, CssBaseline } from '@mui/material';


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
                                    <Grid item xs={12} md={4} key={ele._id}>
                                        <CardActionArea component={Link} to={`/api/posts/${ele._id}`}>
                                            <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: '100%', display: { sm: 'block' } }}
                                                    image={ele.bannerImage}
                                                    alt={ele.imageLabel}
                                                />
                                                <CardContent sx={{ flex: 1 }}>
                                                    <Typography component="h2" variant="h5">
                                                        {ele.title}
                                                    </Typography>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Author - {`${ele.author.firstName} ${ele.author.lastName}`}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="text.secondary">
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
                                        <CardContent style={{ display: 'flex', margin: 'auto', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                            <Typography component="h2" variant="h5">
                                                You haven't created any posts yet. Write your first post!
                                            </Typography>
                                            <Button variant="outlined" size="small" sx={{ marginTop: '30px' }} component={Link} to='/create-post'>
                                                Create First Post
                                            </Button>
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