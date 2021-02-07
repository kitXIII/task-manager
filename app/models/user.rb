class User < ApplicationRecord
  has_secure_password

  has_many :my_tasks, class_name: 'Task', foreign_key: :author_id, inverse_of: :author
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id

  validates :first_name, presence: true,
                         length: { minimum: 2 }

  validates :last_name, presence: true,
                        length: { minimum: 2 }

  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i }

  def generate_reset_password_token!
    update(reset_password_token: SecureRandom.urlsafe_base64, reset_password_token_sent_at: Time.zone.now)
  end

  def reset_password_token_actual?
    Time.zone.now < reset_password_token_sent_at + 1.day
  end
end
