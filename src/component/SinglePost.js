import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Comment from "./Comment";
import HTMLReactParser from "html-react-parser/lib/index"
import axios from "../config/Axios";
import { Box, Grid, Typography, Divider, IconButton, Menu, MenuItem, Modal, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from "moment";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";


export default function SinglePost() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [menuToggle, setMenuToggle] = useState(null);
    const { user } = useAuth()
    const [modalToggle, setModalToggle] = useState(false)
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

    const handleMenuToggle = (e) => {
        if (menuToggle) {
            setMenuToggle(null)
        } else {
            setMenuToggle(e.currentTarget)
        }
    }

    const handleModalToggle = () => {
        setModalToggle(!modalToggle)
    }

    const handleDelete = async () => {
        console.log('delete')
        try {
            if (user._id.toString() === post.author._id.toString()) {
                await axios.delete(`/api/posts/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                toast.success("Post Deleted Successfully", toastStyle)
            } else {
                return toast.error("You're Not Authorized to Delete Post", toastStyle)
            }
        } catch (err) {
            return toast.error("Something Went Wrong, Unable to Delete Post", toastStyle)
        }
        navigate('/my-post')
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
                    <Typography variant="subtitle2" color="text.secondary">
                        {moment(post.createdAt).format('Do-MMMM-YYYY')}
                    </Typography>
                    <Divider sx={{ width: '100%' }} />
                    {HTMLReactParser(post.content)}
                    {user && post.author._id === user._id && (
                        <IconButton
                            variant="contained"
                            sx={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                            }}
                            onClick={handleMenuToggle}

                        >
                            <MoreVertIcon />
                        </IconButton>
                    )}

                    <Menu
                        anchorEl={menuToggle}
                        open={Boolean(menuToggle)}
                        onClose={handleMenuToggle}
                    >
                        <MenuItem
                            component={Link}
                            to={`/api/posts/${id}/update`}
                            onClick={handleMenuToggle}
                        >
                            Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => { handleModalToggle(); handleMenuToggle() }}
                        >
                            Delete
                        </MenuItem>
                    </Menu>
                </Grid>
            </Box>

            <Comment />

            <Modal
                open={modalToggle}
                onClose={handleModalToggle}
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
                        Are you sure you want to delete this post?
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'start' }}>
                        <Button sx={{ mr: 1 }} variant="contained" color="error" onClick={handleDelete} type="button">
                            Delete
                        </Button>
                        <Button sx={{ ml: 1 }} variant="contained" onClick={handleModalToggle} type="button">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}