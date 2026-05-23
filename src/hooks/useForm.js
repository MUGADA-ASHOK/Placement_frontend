import { useState } from 'react'

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (validate) {
      const fieldErrors = validate(values)
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || '' }))
    }
  }

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault()
    if (validate) {
      const fieldErrors = validate(values)
      setErrors(fieldErrors)
      setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
      if (Object.values(fieldErrors).some(Boolean)) return
    }
    onSubmit(values)
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset, setValues }
}
