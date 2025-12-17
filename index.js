const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv/config')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')
const commentRouter = require('./routes/comment')
//better logging
try {
    const chalk = require('chalk');
    require('better-logging')(console, {
        color: {
            base: chalk.greenBright,
            type: {
                debug: chalk.white,
                info: chalk.white,
                log: chalk.green,
                error: chalk.red,
                warn: chalk.white,
            }
        },
    });
} catch(e) {}

//middlewares
app.use(cors())
app.use(express.json())

app.use('/post', postRouter)
app.use('/user', userRouter)
app.use('/comment', commentRouter)

// Connect to DB
mongoose.connect(
    process.env.DB_URI, 
    { newUrlParser: true },
    (err) => !err ? console.log('DB connection success.'): console.error(err)
)
// 

// Start the app
app.listen(process.env.PORT, () => {
    console.log(`Listining on port : ${process.env.PORT}`)
})