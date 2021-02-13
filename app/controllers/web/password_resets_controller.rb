class Web::PasswordResetsController < Web::ApplicationController
  def new
    @password_reset = PasswordResetForm.new
  end

  def create
    @password_reset = PasswordResetForm.new(password_reset_form_params)

    if @password_reset.valid?
      user = @password_reset.user

      user.generate_reset_password_token!

      PasswordResetMailer.with({ email: user.email, token: user.reset_password_token }).password_reset.deliver_later
    else
      render(:new)
    end
  end

  def edit
    @user = User.find_by(reset_password_token: params[:id])

    if @user.blank?
      return render_404
    end

    if !@user.reset_password_token_actual?
      @user.remove_reset_password_token!
      render_404
    end
  end

  def update
    @user = User.find_by(reset_password_token: params[:id])

    if @user.blank?
      return render_404
    end

    if !@user.reset_password_token_actual?
      @user.remove_reset_password_token!
      return render_404
    end

    if @user.update(new_password_params)
      @user.remove_reset_password_token!
      redirect_to(:new_session)
    else
      render(:edit)
    end
  end

  private

  def password_reset_form_params
    params.require(:password_reset_form).permit(:email)
  end

  def new_password_params
    params.require(:user).permit(:password, :password_confirmation)
  end
end
