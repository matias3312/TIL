import {Router} from 'express'
import { AuthControllers } from '../controllers/auth.controllers.js'


export const router = Router()


router.get('/login',AuthControllers.register)