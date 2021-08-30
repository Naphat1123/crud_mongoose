const express = require('express')
const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/mongoDB'
const option = {
    useNewUrlParser: true,
}
mongoose.connect(url, option)

const app = express()

app.use(express.json())

//กำหนด Schema 
const Cat = mongoose.model('cat', { name: String })

const kitty = new Cat({ name: 'kitty' })
    // kitty.save().then(() => console.log('meow'))

app.get('/', (req, res) => {
    res.json({ massage: 'ok' })
})

//query
app.get('/cats', (req, res) => {
    Cat.find({})
        .then((data) => res.json(data))
        .catch((error) =>
            res.status(400).json({ massage: 'เกิดข้อผิดพลาด' }))
})

app.get('/cats/:id', (req, res) => {
    const { id } = req.params
    Cat.findById(id)
        .then((data) => res.json(data || {}))
        .catch((error) =>
            res.status(400).json({ massage: "เกิดข้อผิดพลาด" }))
})

//create
app.post('/cats', (req, res) => {
    const { name } = req.body

    const cat = new Cat({
        name
    })

    cat.save()
    res.json({ massage: 'saved' })
})

//update
app.put('/cats/:id', async(req, res) => {
    const { id } = req.params
    const { name } = req.body

    const updated = {
        $set: {
            name
        }
    }

    let cat = await Cat.findByIdAndUpdate(id, updated, { new: true })
    res.json(cat)
})

app.delete('/cats/:id', async(req, res) => {
    const { id } = req.params

    await Cat.findByIdAndDelete(id)
    res.json({ massage: "ลบข้อมูลเรียบร้อย" })
})

app.listen('3000', () => {
    console.log('ok')
})