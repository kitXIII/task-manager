require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'create' do
    user = create(:user)
    assert user.persisted?
  end

  test 'generate reset password token' do
    user = create(:user)

    assert_nil(user.reset_password_token)
    assert_nil(user.reset_password_token_sent_at)

    user.generate_reset_password_token!

    assert_not_nil(user.reset_password_token)
    assert_not_nil(user.reset_password_token_sent_at)

    assert_equal User.find_by(reset_password_token: user.reset_password_token), user
  end
end
