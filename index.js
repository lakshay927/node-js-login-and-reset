require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const connectToDB = require('./db/connection')
const routes = require('./routes/routes')

app.use(express.json())



app.use('/api', routes)
app.get('/', (req, res) => res.send('Hello World!'))


const startConnection = async () => {
    try {
        await connectToDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    }
    catch (err) {
        console.log(err)

    }
}
startConnection()
process.on('uncaughtException', (reason, p) => {

})
