class Web::PasswordResetsController < Web::ApplicationController
  def new
    @password_reset = PasswordResetForm.new
  end

  def create
    @password_reset = PasswordResetForm.new(password_reset_form_params)

    if @password_reset.valid?
      user = @password_reset.user

      user.generate_reset_password_token!

      PasswordResetMailer.with({ email: user.email, token: user.reset_password_token }).password_reset.deliver_now
    else
      render(:new)
    end
  end

  def edit; end

  def update; end

  private

  def password_reset_form_params
    params.require(:password_reset_form).permit(:email)
  end
end
