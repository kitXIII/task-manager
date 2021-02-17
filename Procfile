release: rails db:migrate
web: bundle exec rails server -p $PORT
worker: bundle exec sidekiq -C /app/config/sidekiq.yml
