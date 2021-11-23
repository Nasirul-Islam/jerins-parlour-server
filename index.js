const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.send('Hello jerin parlore')
})


// runing port
app.listen(port, () => {
    console.log(`jerin parlore at port: ${port}`)
})