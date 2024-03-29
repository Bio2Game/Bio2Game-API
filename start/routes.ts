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

Route.get('/', async () => {
  return "Bienvenue sur l'api privé de Bio2Game, vous n'avez rien a faire ici :c"
})

Route.group(() => {
  Route.get('/', async () => {
    return "Bienvenue sur l'api privé de Bio2Game, vous n'avez rien a faire ici :c"
  })

  Route.group(() => {
    Route.get('/', 'UsersController.index')
  }).prefix('/contributors')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'AuthController.user')

      Route.post('/register', 'AuthController.register')
      Route.post('/login', 'AuthController.login')
      Route.post('/logout', 'AuthController.logout')

      Route.post('/reset-password', 'AuthController.resetPassword')
      Route.post('/change-password', 'AuthController.updatePasswordByToken')
    }).prefix('/user')

    Route.group(() => {
      Route.get('/', 'GuestController.guest')

      Route.post('/register', 'GuestController.register')
      Route.post('/logout', 'GuestController.logout')
    }).prefix('/guest')

    Route.group(() => {
      Route.get('/google', 'SocialsController.googleRedirection')
      Route.get('/linkedin', 'SocialsController.linkedinRedirection')
      Route.get('/facebook', 'SocialsController.facebookRedirection')
    }).prefix('/social')
  }).prefix('/auth')

  Route.group(() => {
    Route.get('/', 'FormationsController.index')
    Route.get('/:id', 'FormationsController.show')
  }).prefix('/formations')

  Route.group(() => {
    Route.get('/', 'QuizzesController.index')
    Route.get('/questions', 'QuizzesController.indexQuestions')
    Route.get('/:id', 'QuizzesController.show')
  }).prefix('/quizzes')

  Route.group(() => {
    Route.get('/', 'QuestionsController.index')
    Route.get('/:id', 'QuestionsController.show')
    Route.post('/', 'QuestionsController.store')
    Route.patch('/:id', 'QuestionsController.update')
    Route.delete('/:id', 'QuestionsController.delete')
  }).prefix('/questions')

  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'Admin/UsersController.index')
      Route.get('/:id', 'Admin/UsersController.show')
      Route.patch('/:id', 'Admin/UsersController.update')
      Route.delete('/:id', 'Admin/UsersController.delete')
    }).prefix('/users')

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
  })
    .prefix('/admin')
    .middleware(['auth', 'admin'])

  Route.group(() => {
    Route.patch('/', 'UsersController.update')
    Route.post('/avatar', 'UsersController.uploadAvatar')
    Route.get('/animators', 'UsersController.animators')
  })
    .prefix('/user')
    .middleware('auth')

  Route.group(() => {
    Route.get('/:id/:type', 'UserQuizsController.show')
    Route.post('/:id/:type', 'UserQuizsController.store')
  }).prefix('/quiz')

  Route.group(() => {
    Route.get('/domains', 'DomainsController.index')

    Route.group(() => {
      Route.get('/', 'Contributor/QuizzesController.index')
      Route.post('/', 'Contributor/QuizzesController.store')
      Route.patch('/:id', 'Contributor/QuizzesController.update')
      Route.patch('/:id/order', 'Contributor/QuizzesController.updateOrder')
      Route.delete('/:id', 'Contributor/QuizzesController.delete')
    }).prefix('/quizzes')

    Route.group(() => {
      Route.post('/', 'Contributor/QuestionsController.store')
      Route.patch('/:id', 'Contributor/QuestionsController.update')
      Route.delete('/:id', 'Contributor/QuestionsController.delete')
    }).prefix('/questions')

    Route.group(() => {
      Route.get('/', 'Contributor/FormationsController.index')
      Route.get('/:id', 'Contributor/FormationsController.show')
      Route.post('/', 'Contributor/FormationsController.store')
      Route.patch('/:id', 'Contributor/FormationsController.update')
      Route.delete('/:id', 'Contributor/FormationsController.delete')
    }).prefix('/formations')
  })
    .prefix('/contributor')
    .middleware(['auth', 'contributor'])

  Route.group(() => {
    Route.get('/google', 'SocialsController.googleCallback')
    Route.get('/linkedin', 'SocialsController.linkedinCallback')
    Route.get('/facebook', 'SocialsController.facebookCallback')
  }).prefix('/login/callback')

  Route.group(() => {
    Route.post('/upload', 'Contributor/ImageController.store')
  }).middleware(['auth', 'contributor'])

  Route.post('/payment', 'PaymentsController.create').middleware('auth')
  Route.post('/webhook', 'PaymentsController.webhook')

  Route.get('*', () => 'Route introuvable')
}).prefix('/api')
