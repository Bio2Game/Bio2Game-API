/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', async () => {
    return 'Bienvenue sur l\'api privé de Bio2Game, vous n\'avez rien a faire ici :c'
  })

  Route.group(() => {
    Route.get('/user', 'AuthController.user')

    Route.post('/register', 'AuthController.register')
    Route.post('/login', 'AuthController.login')
    Route.post('/logout', 'AuthController.logout')
  }).prefix('/auth')

  Route.group(() => {
    Route.get('/', 'QuizzesController.index')

    Route.post('/create', 'QuizzesController.create')
  }).prefix('/quiz')

  Route.get('*', async () => {
    return 'Route introuvable'
  })
}).prefix('/api')
