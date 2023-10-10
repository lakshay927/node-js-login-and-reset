const User = require("../models/userModel")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

//node mailer setup
const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
            pass: 'XXXXXXXX'
        }
    }
)




// add new user
async function addNewUser(req, res) {
    try {

        const temp = req.body
        let { firstname, lastname, username, email, password, dob } = temp
        // validation 

        //bcrypt
        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(req.body.password, salt)


        //create user
        const user = await User.create({ firstname: firstname, lastname: lastname, username: username, email: email, password: hashedPassword, dob: dob })
        console.log(user)
        res.status(200).send({ user: user })




    }
    catch (e) {
        console.log(e)
        res.status(500).send({ msg: "not created ", err: e })
    }

}








// login  user
async function loginUser(req, res) {
    try {
        let data = req.body
        const { username, password } = data
        console.log(data)
        // validation
        // check for user in database 
        // const login = await User.findOne({ where: { username: username }, attributes: ["firstname", "lastname", "email", "password"] })
        const login = await User.findOne({ username: username })
        if (!login) {
            return res.status(404).send({ msg: "user not found" })
        }

        // compare the password from request and database
        if (await bcrypt.compare(password, login.password) == false) {
            return res.status(404).send({ msg: "incorrect password" })

        }

        // create jwttoken

        const token = jwt.sign({ _id: login._id }, "secret", { expiresIn: "24h" })

        console.log(login, token)
        res.status(200).send({ user: login, token: token })
    }
    catch (e) {
        res.status(500).send("error occured", e)
    }

}

// find  user
async function resetPassword(req, res) {
    try {
        const { email } = req.body

        const result = await User.findOne({ email: email })
        if (!result) {
            return res.status(404).send({ msg: "user not found" })
        }

        jwt.sign({ _id: result._id }, "secret", { expiresIn: "15m" }, (err, token) => {
            if (err) {
                res.status(500).send({ msg: 'internal server error' })
            }

            //setup the mail info
            const mailOptions = {
                from: 'your@gmail.com',
                to: email,
                subject: "Reset your password",
                text: `To reset your password, please click the link below: http://localhost:3000/resetpassword/${token}`
            }

            //send email
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err)
                    res.status(500).send({ msg: "error sending the email " })

                }
                else {
                    res.status(200).send({ user: "Email sent successfully" })
                }
            }
            )
        })
    }
    catch (e) {
        res.status(500).send({ error: e })
    }

}

// find  user
async function changePassword(req, res) {
    try {
        const { token } = req.params
        const { newpassword } = req.body

        jwt.verify(token, "secret", async (err, decoded) => {
            if (err) {
                return res.status(400).send({ msg: "invalid token" })
            }

            const hashedPassword = await bcrypt.hash(newpassword, 10)

            await User.findByIdAndUpdate(decoded._id, { password: hashedPassword })

            res.status(200).send({ msg: "password updated successfully" })
        })
    }
    catch (e) {
        res.status(500).send("error occured", e)
    }

}
// find  user
async function findUsers(req, res) {
    try {
        const query = { name: "abc" }

        const result = await User.find(query)
        console.log(result)
        res.status(200).send({ user: result })
    }
    catch (e) {
        res.status(500).send("error occured", e)
    }

}

async function UpdateUsers(req, res) {
    try {
        const query = { name: "abc" }
        console.log(req.body)
        const result = await User.findOneAndUpdate(query, req.body, { new: true })
        console.log(result)
        res.status(200).send({ user: result })
    }
    catch (e) {
        res.status(500).send("error occured", e)
    }

}

async function deleteUser(req, res) {
    try {
        const query = { name: "abc" }

        const result = await User.findOneAnddeleDelete(query)
        console.log(result)
        res.status(200).send({ user: result })
    }
    catch (e) {
        res.status(500).send("error occured", e)
    }

}

module.exports = { addNewUser, findUsers, UpdateUsers, deleteUser, loginUser, resetPassword }
