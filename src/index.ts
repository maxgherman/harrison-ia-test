import { App } from './app'
import { mainController } from './routes'
import { userController } from './routes/user'
import { labelController } from './routes/labels'
import { userService, labelService } from './services'

const app = new App([
    mainController(),
    userController(userService()),
    labelController(labelService())
])

app.listen()
