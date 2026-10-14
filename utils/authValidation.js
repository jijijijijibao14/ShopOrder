const isValidUsername = username =>
    typeof username === "string" && /^[A-Za-z0-9]{7,}$/.test(username);

const isValidPassword = password =>
    typeof password === "string" &&
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password);

module.exports = { isValidUsername, isValidPassword };
