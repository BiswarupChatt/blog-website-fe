import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import HTMLReactParser from "html-react-parser/lib/index"
import axios from "../config/Axios";
import { Box, Grid, Typography, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export default function SinglePost() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/api/posts/${id}`)
                setPost(response.data)
            } catch (err) {
                console.log(err)
            }
        })();
    }, [])
    console.log(post)

    if (!post) {
        return <Typography>Loading...</Typography>
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: 2,
                }}
            >
                <Grid
                    item
                    xs={12}
                    md={8}
                    container
                    direction="column"
                    padding='30px'
                    sx={{
                        border: '1px solid black',
                        borderRadius: '30px',
                        boxShadow: '5px 10px 8px #888888',
                        position: 'relative'
                    }}
                >
                    {post.bannerImage ? (
                        <Box
                            component="img"
                            src={post.bannerImage}
                            alt={post.title}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                margin: '20px 0',
                                borderRadius: '10px'
                            }}
                        />
                    ) : (null)}

                    <Typography variant="h3" gutterBottom>
                        {post.title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Author - {`${post.author.firstName} ${post.author.lastName}`}
                    </Typography>
                    <Divider sx={{ width: '100%' }} />
                    {HTMLReactParser(post.content)}

                    <IconButton
                        variant="contained"
                        sx={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                        }}
                        onClick={handleMenuOpen}

                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                    </Menu>
                </Grid>
            </Box>
        </>
    )
}