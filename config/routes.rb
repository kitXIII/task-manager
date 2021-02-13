Rails.application.routes.draw do
  root :to => 'web/boards#show'

  scope module: :web do
    resource :board, only: :show
    resource :session, only: [:new, :create, :destroy]
    resources :developers, only: [:new, :create]
    resources :password_resets, only: [:new, :create, :edit, :update]
  end

  namespace :admin do
    resources :users
  end

  namespace :api do
    namespace :v1 do
      resources :tasks, only: [:index, :show, :create, :update, :destroy]
      resources :users, only: [:index, :show]
    end
  end

  mount Sidekiq::Web, at: '/admin/sidekiq'
  mount LetterOpenerWeb::Engine, at: '/letter_opener' if Rails.env.development?
end
