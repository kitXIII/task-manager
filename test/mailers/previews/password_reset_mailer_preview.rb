# Preview all emails at http://localhost:3000/rails/mailers/password_reset_mailer
class PasswordResetMailerPreview < ActionMailer::Preview
  def password_reset
    user = User.first
    token = user.generate_reset_password_token!
    params = { email: user.email, token: token }

    PasswordResetMailer.with(params).password_reset
  end
end
