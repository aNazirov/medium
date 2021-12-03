import app from './app'
import { config } from 'dotenv'

config()

const port = process.env.PORT || 5500

app.listen(port, () => console.log(`Server has been started on ${port} port`))

