class PasswordResetMailer < ApplicationMailer
  def password_reset
    email = params[:email]
    @token = params[:token]

    mail(to: email, subject: 'Reset password')
  end
end
