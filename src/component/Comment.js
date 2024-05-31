import React from 'react';
import { Box, Grid, Avatar, Typography, TextField, Button, IconButton, MenuItem, Menu, Modal } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../config/Axios';
import { toast, Zoom } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';

export default function Comment() {

    const [form, setForm] = useState('')
    const [newComment, setNewComment] = useState('')
    const [allComment, setAllComment] = useState([])

    const [editForm, setEditForm] = useState('')
    const [commentId, setCommentId] = useState(null)

    const [menuToggle, setMenuToggle] = useState(null)
    const [editModalToggle, setEditModalToggle] = useState(false)
    const [deleteModalToggle, setDeleteModalToggle] = useState(false)

    const { id } = useParams()
    const { user } = useAuth()

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

    const handleMenuToggle = (e, commentId, commentContent) => {
        setCommentId(commentId)
        setEditForm(commentContent)
        if (menuToggle) {
            setMenuToggle(null)
        } else {
            setMenuToggle(e.currentTarget)
        }

    }
    console.log(commentId, editForm)

    const handleEditModalToggle = () => {
        setEditModalToggle(!editModalToggle)
    }

    const handleDeleteModalToggle = () => {
        setDeleteModalToggle(!deleteModalToggle)
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`/api/posts/${id}/comment`, { content: form }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            setNewComment(response.data)
            console.log(newComment)
            toast.success('Commented Successfully', toastStyle)
            setForm('')
        } catch (err) {
            toast.error('Unable to Comment, Try Again Later', toastStyle)
        }

    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/api/posts/${id}/comments`)
                console.log(response.data)
                setAllComment(response.data)
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
                        margin: 'auto', borderRadius: '30px', boxShadow: '5px 10px 8px #888888'
                    }}>

                    <Typography variant='h4' fontWeight='bold' align='center' mb='20px'>Comments</Typography>

                    {allComment.map((ele) => (
                        <Box key={ele._id} sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', mb: 2 }}>
                            <Grid container spacing={2} alignItems="center" sx={{ position: 'relative' }}>
                                <Grid item>
                                    <Avatar alt={ele.author.firstName} src="/path/to/user/image.jpg" />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="subtitle2">
                                        {`${ele.author.firstName} ${ele.author.lastName}`}
                                    </Typography>
                                    <Typography variant="body1">
                                        {ele.content}
                                    </Typography>
                                    <Typography variant="caption" >
                                        {moment(ele.createdAt).startOf('hour').fromNow()}
                                    </Typography>
                                </Grid>
                                <IconButton
                                    variant='contained'
                                    sx={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '0px'
                                    }}
                                    onClick={(e) => { handleMenuToggle(e, ele._id, ele.content) }}
                                >
                                    <MoreVertIcon />
                                </IconButton>

                                <Menu
                                    anchorEl={menuToggle}
                                    open={Boolean(menuToggle)}
                                    onClose={handleMenuToggle}
                                >
                                    <MenuItem onClick={() => {
                                        handleEditModalToggle(); handleMenuToggle()
                                    }}>Edit</MenuItem>
                                    <MenuItem onClick={() => {
                                        handleDeleteModalToggle(); handleMenuToggle()
                                    }}>Delete</MenuItem>
                                </Menu>
                            </Grid>
                        </Box>
                    ))}


                    {user ? (
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
                    ) : (null)}

                </Grid>
            </Box>


            {/* Edit Modal */}
            <Modal
                open={editModalToggle}
                onClose={handleEditModalToggle}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: {
                            xs: '60%',
                            sm: '50%',
                            md: '30%',
                            lg: '20%',
                        },
                        bgcolor: 'background.paper',
                        // border: '2px solid #000',
                        borderRadius: '20px',
                        boxShadow: 2,
                        p: 4,
                    }}
                >
                    <TextField
                        variant='outlined'
                        fullWidth
                        multiline
                        id='editComment'
                        name='editComment'
                        label="Edit your thoughts"
                        value={editForm}
                        onChange={(e) => setEditForm(e.target.value)}
                    >

                    </TextField>
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'end' }}>
                        <Button variant="contained" color='error' type="button" onClick={handleEditModalToggle}>
                            Cancel
                        </Button>
                        <Button sx={{ ml: 1 }} variant="contained" color="success" type="button" onClick={handleEditModalToggle}>
                            Update
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* DeleteModal */}
            <Modal
                open={deleteModalToggle}
                onClose={handleDeleteModalToggle}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: {
                            xs: '60%',
                            sm: '50%',
                            md: '30%',
                            lg: '20%',
                        },
                        bgcolor: 'background.paper',
                        // border: '2px solid #000',
                        borderRadius: '20px',
                        boxShadow: 2,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Confirm Delete
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete this comment?
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'start' }}>
                        <Button sx={{ mr: 1 }} variant="contained" color="error" type="button" onClick={handleDeleteModalToggle}>
                            Delete
                        </Button>
                        <Button sx={{ ml: 1 }} variant="contained" type="button" onClick={handleDeleteModalToggle}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
