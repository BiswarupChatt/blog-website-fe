import * as Yup from 'yup'

const registerValidationSchema = Yup.object({
      firstName: Yup.string()
            .required('First name is required')
            .min(2, 'First name must be 2 characters long'),
      lastName: Yup.string()
            .required('Last name is required')
            .min(2, 'Last name must be 2 characters long'),
      email: Yup.string()
            .required('Email is required')
            .email('Enter valid email address'),
      password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be 8 characters long')
})

const loginValidationSchema = Yup.object({
      email: Yup.string()
            .required('Email is required')
            .email('Enter valid email address'),
      password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be 8 characters long')
})

const userUpdateValidation = Yup.object({
      firstName: Yup.string()
            .required('First name is required')
            .min(2, 'First name must be 2 characters long'),
      lastName: Yup.string()
            .required('Last name is required')
            .min(2, 'Last name must be 2 characters long'),
      email: Yup.string()
            .required('Email is required')
            .email('Enter valid email address')
})


const CreatePostValidation = Yup.object({
      title: Yup.string()
            .required('Title is required')
            .min(10, 'Title must be 10 character long'),
      content: Yup.string()
      .required('Content is required')
      .min(50, 'Content must be 50 Character Long' )
})

export { registerValidationSchema, loginValidationSchema, userUpdateValidation, CreatePostValidation }