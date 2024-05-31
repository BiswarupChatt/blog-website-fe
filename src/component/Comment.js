import React from 'react';
import { Box, Grid, Avatar, Typography, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../config/Axios';
import { toast } from 'react-toastify';

export default function Comment() {

    const [form, setForm] = useState('')
    const [newComment, setNewComment] = useState('')
    const [allComment, setAllCOmment] = useState([])
    const { id } = useParams()



    const handleCommentSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`/api/posts/${id}/comments`, { content: form }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            setNewComment(response.data)
            console.log(newComment)
            toast.success('Commented Successfully')
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/api/posts/${id}/comments`)
                console.log(response.data)
                setAllCOmment(response.data)
            } catch (err) {
                console.log(err)
            }
        })();
    }, [newComment])


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
                <Grid item
                    xs={12}
                    md={8}
                    container
                    direction="column"
                    padding='30px'
                    sx={{
                        margin: 'auto', borderRadius: '30px', boxShadow: '5px 10px 8px #888888', position: 'relative'
                    }}>
                    <Typography variant='h4' fontWeight='bold' align='center' mb='20px'>Comments</Typography>

                    {allComment.map((ele) => (
                        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Avatar alt={ele.author.firstName} src="/path/to/user/image.jpg" />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {`${ele.author.firstName} ${ele.author.lastName}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {ele.content}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}


                    <form onSubmit={handleCommentSubmit}>
                        <Box sx={{ p: 2, border: '3px solid #ddd', borderRadius: '8px', mb: 2 }}>
                            <Grid spacing={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid item>
                                    <Avatar alt="Your Name" src="/path/to/your/image.jpg" />
                                </Grid>
                                <Grid item xs={10} mx='10px'>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="comment"
                                        name="comment"
                                        value={form}
                                        onChange={(e) => {
                                            setForm(e.target.value)
                                        }}
                                        label="Write your thoughts here"
                                        multiline
                                    />
                                </Grid>
                                <Grid item textAlign="center">
                                    <Button type="submit" variant="contained" color="primary">
                                        <SendIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </Grid>
            </Box>
        </>
    );
}
