const signup = async (req, res) => {
    res.json({
        data: "you hit the signup endpoint"
    })
}
const login = async (req, res) => {
    res.json({
        data: "you hit the login endpoint"
    })
}
const logout = async (req, res) => {
    res.json({
        data: "you hit the logout endpoint"
    })
}

module.exports = {
    signup,
    login,
    logout,
}