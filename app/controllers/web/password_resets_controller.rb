class Web::PasswordResetsController < Web::ApplicationController
  def new; end

  def create
    @email = password_reset_params[:email]
    render(:check_email)
  end

  def edit; end

  def update; end

  private

  def password_reset_params
    params.require(:password_reset).permit(:email, :password, :password_confirmation)
  end
end
