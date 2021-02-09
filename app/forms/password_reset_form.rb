class PasswordResetForm
  include ActiveModel::Model

  attr_accessor :email

  validates :email, presence: true, format: { with: /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i }
  validate :has_user?

  def user
    User.find_by(email: email)
  end

  private

  def has_user?
    if user.blank?
      errors.add(:email, 'email not found')
    end
  end
end
