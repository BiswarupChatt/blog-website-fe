import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReactQuill from "react-quill";
import { toast, Zoom } from "react-toastify";
import axios from "../config/Axios";
import 'react-quill/dist/quill.snow.css'

export default function CreatePost() {

    const errors = {}
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [clientErrors, setClientErrors] = useState({})
    const [serverErrors, setServerErrors] = useState([])
    const [post, setPost] = useState('')

    const [form, setForm] = useState({
        title: '',
        content: '',
        bannerImage: null
    })

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`/api/posts/${id}`)
                console.log("A", response.data)
                setPost(response.data)
            } catch (err) {
                console.log(err)
                toast.error('Unable to get the post details')
            }
        })();
    }, [])

    console.log("B", post)

    useEffect(() => {
        setForm({
            ...form,
            title: post? post.title : '',
            content: post.content,
            bannerImage: null
        })
        console.log('C', form)
    }, [post])

    const validations = () => {
        if (form.title.trim().length === 0) {
            errors.title = 'Title is required'
        }

        if (form.content.trim().length === 0) {
            errors.content = 'Content is required'
        }
        else if (form.content.trim().length < 200) {
            errors.content = 'Content should be minimum 200 character'
        }
    }

    const toolbar = [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['clean']
    ]

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
    ]

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('content', form.content)
        if (form.bannerImage) {
            formData.append('bannerImage', form.bannerImage)
        }

        validations()
        if (user._id.toString() === post.author._id.toString()) {
            if (Object.keys(errors).length === 0) {
                try {
                    const response = await axios.put(`/api/posts/${id}`, formData, {
                        headers: {
                            Authorization: localStorage.getItem('token'),
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    toast.success('Post Updated Successfully', toastStyle)
                    navigate(`/api/posts/${id}`)
                } catch (err) {
                    console.log(err)
                    setServerErrors(err.response.data.errors[0].msg)
                    toast.error(serverErrors, toastStyle)
                }
            } else {
                setClientErrors(errors)
            }
        } else {
            toast.error("You're not authorize to edit this post", toastStyle)
            navigate(`/api/posts/${id}`)
        }

    }
    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center' }}>Update Post</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>

                <div >
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '8px' }}>Title</label>
                    <input
                        type="text"
                        id="title"
                        name='title'
                        value={form.title}
                        onChange={(e) => {
                            setForm({ ...form, title: e.target.value })
                        }}
                        style={{ width: '97%', padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    {clientErrors.title && <p style={{ color: 'red', margin: '5px' }}>{clientErrors.title}</p>}
                </div>

                <div >
                    <label htmlFor="content" style={{ display: 'block', marginBottom: '8px' }}>Content</label>
                    <ReactQuill
                        name='content'
                        value={form.content}
                        onChange={(value) => {
                            setForm({ ...form, content: value })
                        }}
                        modules={{
                            toolbar: toolbar,
                        }}
                        formats={formats}
                        style={{ height: '300px', marginBottom: '60px' }}
                    />
                    {clientErrors.content && <p style={{ color: 'red', margin: '5px' }}>{clientErrors.content}</p>}
                </div>

                <div >
                    <label htmlFor="bannerImage" >Choose a file:</label>
                    <input
                        type="file"
                        id="bannerImage"
                        name="bannerImage"
                        accept="images/*"
                        onChange={(e) => {
                            setForm({ ...form, bannerImage: e.target.files[0] })
                        }}
                        style={{ width: '97%', padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>

                <button
                    type="submit"
                    style={{
                        margin: '30px 0 0 0', width: '100%', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer'
                    }}
                >
                    Update
                </button>

            </form>
        </div>
    )
}