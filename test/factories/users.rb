FactoryBot.define do
  factory :user do
    first_name
    last_name
    password
    email
    avatar
    type { "" }
  end

  factory :developer do
    type { "Developer" }
  end
  
  factory :manager do
    type { "Manager" }
  end
  
  factory :manager do
    type { "Admin" }
  end
end
