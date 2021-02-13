class SendPasswordResetCreateNotificationJob < ApplicationJob
  sidekiq_options queue: :mailers
  sidekiq_throttle_as :mailer

  def perform(user_id)
    user = User.find_by(id: user_id)
    return if user.blank?

    PasswordResetMailer.with({ email: user.email, token: user.reset_password_token }).password_reset.deliver_now
  end
end
