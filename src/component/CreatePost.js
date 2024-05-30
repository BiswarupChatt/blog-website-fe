import React, { useState } from "react";
import { toast, Zoom } from "react-toastify";
import axios from "../config/Axios";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import { CreatePostValidation } from '../validations/FormValidations'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from "react-router-dom";

export default function CreatePost() {

    const navigate = useNavigate()

    const errors = {}

    const [clientErrors, setClientErrors] = useState({})
    const [serverErrors, setServerErrors] = useState([])

    const [form, setForm] = useState({
        title: '',
        content: '',
        bannerImage: null
    })

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

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('/api/posts', formData, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        'Content-Type': 'multipart/form-data'
                    }
                })
                toast.success('Post Created Successfully', toastStyle)
                navigate(`/api/posts/${response.data._id}`)
            } catch (err) {
                console.log(err)
                setServerErrors(err.response.data.errors[0].msg)
                toast.error(serverErrors, toastStyle)
            }
        } else {
            setClientErrors(errors)
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center' }}>Create Post</h1>

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
                    {clientErrors.title && <p style={{color: 'red', margin:'5px'}}>{clientErrors.title}</p>}
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
                    {clientErrors.content && <p style={{color: 'red', margin:'5px'}}>{clientErrors.content}</p>}
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
                    Submit
                </button>

            </form>
        </div>
    )
}