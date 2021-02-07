require 'test_helper'

class PasswordResetMailerTest < ActionMailer::TestCase
  test 'send password reset' do
    user = create(:user)
    user.generate_reset_password_token!

    params = { email: user.email, token: user.reset_password_token }
    email = PasswordResetMailer.with(params).password_reset

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ['noreply@taskmanager.com'], email.from
    assert_equal [user.email], email.to
    assert_equal 'Reset password', email.subject
    assert email.body.to_s.include?("/password_resets/#{user.reset_password_token}/edit")
  end
end
