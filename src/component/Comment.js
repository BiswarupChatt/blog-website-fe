import React, { useState, useEffect, useReducer } from 'react'
import { Box, Grid, Typography, Avatar, IconButton, Menu, MenuItem, TextField, Button, Modal } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MoreVert from '@mui/icons-material/MoreVert'
import SendIcon from '@mui/icons-material/Send'
import axios from '../config/Axios'
import moment from 'moment'
import { toast, Zoom } from 'react-toastify'

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

const initialState = {
    menuToggle: null,
    comment: '',
    refreshComment: '',
    allComment: [],
    editedComment: '',
    commentId: '',
    editModalToggle: false,
    deleteModalToggle: false
}

const reducer = (state, action) => {

    switch (action.type) {

        case "SET_COMMENT":
            return {
                ...state, comment: action.payload
            }

        case "SET_REFRESH_COMMENT":
            return {
                ...state, refreshComment: action.payload
            }

        case "SET_ALL_COMMENT":
            return {
                ...state, allComment: action.payload
            }

        case "SET_EDITED_COMMENT":
            return {
                ...state, editedComment: action.payload
            }

        case "SET_COMMENT_ID":
            return {
                ...state, commentId: action.payload
            }

        case "TOGGLE_MENU":
            return {
                ...state, menuToggle: action.payload
            }

        case "TOGGLE_EDIT_MODAL":
            return {
                ...state, editModalToggle: !state.editModalToggle
            }

        case "TOGGLE_DELETE_MODAL":
            return {
                ...state, deleteModalToggle: !state.deleteModalToggle
            }

        default: {
            return state
        }
    }
}



export default function Comment() {

    const [state, dispatch] = useReducer(reducer, initialState)
    const { id } = useParams()
    const { user } = useAuth()

    // useEffect(() => {
    //     console.log('State:', state)
    // }, [state])


    const handleMenuToggle = (e) => {
        dispatch({ type: "TOGGLE_MENU", payload: state.menuToggle ? null : e.currentTarget })
    }

    const handleEditModalToggle = () => {
        dispatch({ type: "TOGGLE_EDIT_MODAL" })
    }

    const handleDeleteModalToggle = () => {
        dispatch({ type: "TOGGLE_DELETE_MODAL" })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`/api/posts/${id}/comments`, { content: state.comment }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            toast.success('Comment Created Successfully', toastStyle)
            dispatch({ type: "SET_REFRESH_COMMENT", payload: !state.refreshComment })
            dispatch({ type: "SET_COMMENT", payload: '' })
        } catch (err) {
            toast.error('Unable to Comment, Please Try After Sometimes', toastStyle)
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`/api/posts/${id}/comments/${state.commentId}`, { content: state.editedComment }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            handleEditModalToggle()
            toast.success('Comment Updated Successfully', toastStyle)
            dispatch({ type: "SET_REFRESH_COMMENT", payload: !state.refreshComment })
        } catch (err) {
            toast.error('Unable to Update Comment, Please Try After Sometimes', toastStyle)
        }
    }

    const handleDeleteSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.delete(`/api/posts/${id}/comments/${state.commentId}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            handleDeleteModalToggle()
            toast.success('Comment Deleted Successfully', toastStyle)
            dispatch({ type: "SET_REFRESH_COMMENT", payload: !state.refreshComment })
        } catch (err) {

        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/api/posts/${id}/comments`)
                dispatch({ type: "SET_ALL_COMMENT", payload: response.data })
            } catch (err) {
                console.log(err)
            }
        })();
    }, [state.refreshComment])

    useEffect(() => {
        if (state.commentId) {
            (async () => {
                try {
                    const response = await axios.get(`/api/posts/${id}/comments/${state.commentId}`)
                    dispatch({ type: "SET_EDITED_COMMENT", payload: response.data })
                } catch (err) {
                    console.log(err)
                }
            })();
        }
    }, [state.commentId])

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: 2,
                }}>
                <Grid
                    item
                    xs={12}
                    md={8}
                    container
                    direction="column"
                    padding='30px'
                    sx={{
                        margin: 'auto', borderRadius: '30px', boxShadow: '5px 10px 8px #888888'
                    }}>
                    <Typography variant='h4' fontWeight='bold' align='center' mb='20px'>Comments</Typography>

                    {state.allComment.map((ele) => (
                        <Box key={ele._id} sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', mb: 2 }}>
                            <Grid container spacing={2} alignItems="center" sx={{ position: 'relative' }}>
                                <Grid item>
                                    <Avatar alt={ele.author.firstName} src="/path/to/user/image.jpg" />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant='subtitle2'>
                                        {`${ele.author.firstName} ${ele.author.lastName}`}
                                    </Typography>
                                    <Typography variant='body1'>
                                        {ele.content}
                                    </Typography>
                                    <Typography variant='caption'>
                                        {moment(ele.createdAt).startOf('min').fromNow()}
                                    </Typography>
                                </Grid>

                                {ele && ele.author && ele.author._id && user && user._id && user._id.toString() === ele.author._id.toString() && (
                                    <>
                                        <IconButton
                                            variant='contained'
                                            sx={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '0px'
                                            }}
                                            onClick={(e) => {
                                                handleMenuToggle(e);
                                                dispatch({ type: "SET_COMMENT_ID", payload: ele._id })
                                            }}
                                        >
                                            <MoreVert />
                                        </IconButton>

                                        <Menu
                                            anchorEl={state.menuToggle}
                                            open={Boolean(state.menuToggle)}
                                            onClose={handleMenuToggle}
                                        >
                                            <MenuItem onClick={() => {
                                                handleEditModalToggle(); handleMenuToggle()
                                            }}>Edit</MenuItem>
                                            <MenuItem onClick={() => {
                                                handleDeleteModalToggle(); handleMenuToggle()
                                            }}>Delete</MenuItem>
                                        </Menu>
                                    </>
                                )}
                            </Grid>
                        </Box>
                    )

                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ p: 2, border: '3px solid #ddd', borderRadius: '8px', mb: 2 }}>
                            <Grid spacing={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid item mr='10px' sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <Avatar />
                                </Grid>
                                <Grid item xs={10} >
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="comment"
                                        name="comment"
                                        label="Write your thoughts here"
                                        multiline
                                        value={state.comment}
                                        onChange={(e) => {
                                            dispatch({ type: 'SET_COMMENT', payload: e.target.value })
                                        }}
                                    />
                                </Grid>
                                <Grid item ml='10px'>
                                    <Button type='submit' variant="contained" color="primary">
                                        <SendIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </Grid>
            </Box>


            {/* edit modal */}
            <Modal
                open={state.editModalToggle}
                onClose={handleEditModalToggle}
            >
                <Box
                    sx={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '60%', sm: '50%', md: '30%', lg: '20%', }, bgcolor: 'background.paper', borderRadius: '20px', boxShadow: 2, p: 4,
                    }}>
                    <form onSubmit={handleEditSubmit}>
                        <TextField
                            variant='outlined'
                            fullWidth
                            multiline
                            id='editComment'
                            name='editComment'
                            label="Edit your thoughts"
                            value={state.editedComment.content}
                            onChange={(e) => {
                                dispatch({ type: "SET_EDITED_COMMENT", payload: e.target.value })
                            }}
                        />
                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'end' }}>
                            <Button variant="contained" type="button" onClick={handleEditModalToggle}>Cancel</Button>
                            <Button sx={{ ml: 1 }} variant="contained" color="success" type="submit">Update</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>

            <Modal
                open={state.deleteModalToggle}
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
                        p: 4
                    }}
                >
                    <Typography variant="h6" component="h2">Confirm Delete</Typography>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to delete this comment?
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'start' }}>
                        <Button sx={{ mr: 1 }} variant="contained" color="error" type="button"
                            onClick={handleDeleteSubmit}>Delete</Button>
                        <Button sx={{ ml: 1 }} variant="contained" type="button" onClick={handleDeleteModalToggle}>Cancel</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}