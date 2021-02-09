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

    assert_equal(User.find_by(reset_password_token: user.reset_password_token), user)
  end

  test 'is actual reset password token' do
    user = create(:user)
    user.generate_reset_password_token!

    assert(user.reset_password_token_actual?)

    user.reset_password_token_sent_at = Time.zone.now - 24.hours

    assert(!user.reset_password_token_actual?)
  end

  test 'remove reset password token' do
    user = create(:user)
    user.generate_reset_password_token!

    token = user.reset_password_token

    user.remove_reset_password_token!

    assert_nil(user.reset_password_token)
    assert_nil(user.reset_password_token_sent_at)
    assert_nil(User.find_by(reset_password_token: token))
  end
end
