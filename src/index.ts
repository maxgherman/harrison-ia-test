import { App } from './app'
import { mainController } from './routes'
import { userController } from './routes/user'
import { userService } from './services'

const app = new App([
    mainController(),
    userController(userService())
])

app.listen()
