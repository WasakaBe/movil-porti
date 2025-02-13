const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(phone)) {
    return 'El teléfono debe contener 10 dígitos numéricos.'
  }
  return null
}

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.'
  }
  return null
}

// ✅ Exportación nombrada + default export
export { validatePhone, validatePassword }
export default { validatePhone, validatePassword }
