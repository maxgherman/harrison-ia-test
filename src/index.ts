import { App } from './app'
import { mainController } from './routes'
import { userController } from './routes/user'
import { labelController } from './routes/labels'
import { imageController } from './routes/images'

import { userService, labelService, imageService } from './services'

const app = new App([
    mainController(),
    userController(userService()),
    labelController(labelService()),
    imageController(imageService())
])

app.listen()
