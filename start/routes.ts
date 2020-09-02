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
    Route.get('/:id', 'QuizzesController.show')
    Route.post('/', 'QuizzesController.store')
    Route.patch('/:id', 'QuizzesController.update')
    Route.delete('/:id', 'QuizzesController.delete')
  }).prefix('/quizzes')

  Route.group(() => {
    Route.get('/', 'QuestionsController.index')
    Route.get('/:id', 'QuestionsController.show')
    Route.post('/', 'QuestionsController.store')
    Route.patch('/:id', 'QuestionsController.update')
    Route.delete('/:id', 'QuestionsController.delete')
  }).prefix('/questions')

  Route.group(() => {
    Route.get('/', 'DomainsController.index')
    Route.get('/:id', 'DomainsController.show')
    Route.post('/', 'DomainsController.store')
    Route.patch('/:id', 'DomainsController.update')
    Route.delete('/:id', 'DomainsController.delete')
  }).prefix('/domains')

  Route.group(() => {
    Route.get('/', 'IconsController.index')
    Route.get('/:id', 'IconsController.show')
    Route.post('/', 'IconsController.store')
    Route.delete('/:id', 'IconsController.delete')
  }).prefix('/icons')

  Route.group(() => {
    Route.get('/', 'Admin/UsersController.index')
    Route.get('/:id', 'Admin/UsersController.show')
    Route.delete('/:id', 'Admin/UsersController.delete')
  }).prefix('/users')

  Route.get('*', async () => {
    return 'Route introuvable'
  })
}).prefix('/api')
