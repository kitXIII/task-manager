TYPES = ['Developer', 'Manager', 'Admmin'].freeze
STATES = ['new_task', 'in_development', 'in_qa', 'in_code_review', 'ready_for_release', 'released', 'archived'].freeze

FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :name] do |n|
    "string#{n}"
  end

  sequence :text, aliases: [:description] do |n|
    "text#{n}"
  end

  sequence :email do |n|
    "person#{n}@example.com"
  end

  sequence :avatar do |n|
    "path/to/avatar/#{n}.jpg"
  end

  sequence :type do
    TYPES.sample
  end

  sequence :state do
    STATES.sample
  end

  sequence :expired_at do |n|
    n.days.after
  end
end
