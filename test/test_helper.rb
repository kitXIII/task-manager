ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'simplecov'
require 'coveralls'
require 'sidekiq/testing'

SimpleCov.start('rails') do
  if ENV['CI']
    formatter Coveralls::SimpleCov::Formatter
  end
end

Rails.application.eager_load!
Sidekiq::Testing.inline!

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  include FactoryBot::Syntax::Methods
  include AuthHelper
  include ActionMailer::TestHelper
end
