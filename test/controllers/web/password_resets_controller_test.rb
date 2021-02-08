require 'test_helper'

class Web::PasswordResetsControllerTest < ActionController::TestCase
  test 'should get new' do
    get :new
    assert_response :success
  end

  test 'should post create' do
    user = create(:user)

    assert_emails 1 do
      post :create, params: { password_reset_form: { email: user.email } }
    end
    assert_response :success
  end

  test 'should get edit' do
    user = create(:user)
    user.generate_reset_password_token!

    get :edit, params: { id: user.reset_password_token }
    assert_response :success
  end
end
