import React from "react";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import { CreatePostValidation } from '../validations/FormValidations'

export default function () {

    const initialValues = {
        title: "",
        content: ""
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: CreatePostValidation,
        onSubmit: (value) => {
            console.log(value)
        }
    })

    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center' }}>Create Post</h1>
            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
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
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="content" style={{ display: 'block', marginBottom: '8px' }}>Content</label>
                    <ReactQuill
                        name='content'
                        value={formik.values.content}
                        onChange={(content) => formik.setFieldValue('content', content)}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ size: [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                { 'indent': '-1' }, { 'indent': '+1' }],
                                ['link', 'image', 'video'],
                                ['clean']
                            ],
                        }}
                        formats={[
                            'header', 'font', 'size',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'indent',
                            'link', 'image', 'video'
                        ]}
                        style={{ height: '300px' }}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.title}</div>
                    ) : null}
                </div>
                <button
                    type="submit"
                    style={{
                        margin: '50px 0 0 0',
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