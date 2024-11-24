const validateUserName = (userName) => userName && /[A-Za-z]/.test(userName) && userName.length > 3 && userName.length < 20
const validateEmail = (email) =>  email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)
const validatePassword = (password) => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/gm.test(password) && password.length < 15
const validateImage = (profilePicture) => Buffer.byteLength(profilePicture, 'base64') > 2 * 1024 * 1024

export {validateEmail, validatePassword, validateUserName, validateImage}