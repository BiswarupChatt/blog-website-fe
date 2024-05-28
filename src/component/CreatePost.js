import React from "react";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import { CreatePostValidation } from '../validations/FormValidations'
import axios from "../config/Axios";
import { toast, Zoom } from "react-toastify";

export default function () {

    const initialValues = {
        title: "",
        content: ""
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

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: CreatePostValidation,
        onSubmit: async (value) => {
            // console.log(value)
            try {
                const response = await axios.post('/api/posts', value, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                console.log(response.data)
            } catch (err) {
                if (err.response && err.response.data && err.response.data.errors && err.response.data.errors.length > 0) {
                    err.response.data.errors.forEach((error) => {
                        toast.error(error.msg, toastStyle)
                    })
                } else {
                    toast.error('Please fill-up all the details', toastStyle);
                }
            }
        }
    })

    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center' }}>Create Post</h1>
            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                <div >
                    <label htmlFor="title" style={{ display: 'block', marginBottom: '8px' }}>Title</label>
                    <input
                        type="text"
                        id="title"
                        name='title'
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.title}</div>
                    ) : null}
                </div>
                <div style={{}}>
                    <label htmlFor="content" style={{ display: 'block', marginBottom: '8px' }}>Content</label>
                    <ReactQuill
                        name='content'
                        value={formik.values.content}
                        onChange={(content) => formik.setFieldValue('content', content)}
                        modules={{
                            toolbar: toolbar,
                        }}
                        formats={formats}
                        style={{ height: '300px', marginBottom: '60px' }}
                    />
                    {formik.touched.content && formik.errors.content ? (
                        <div style={{ color: 'red', marginTop: '40px' }}>{formik.errors.content}</div>
                    ) : null}
                </div>
                {/* <div style={{ marginTop: '50px' }}>
                    <label htmlFor="fileUpload" >Choose a file:</label>
                    <input
                        type="file"
                        style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '' }} />
                </div> */}
                <button
                    type="submit"
                    style={{
                        // margin: '50px 0 0 0',
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}