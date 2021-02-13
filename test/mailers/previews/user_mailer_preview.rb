# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def task_created
    user = User.first
    task = Task.first
    params = { user: user, task: task }

    UserMailer.with(params).task_created
  end

  def task_updated
    task = Task.first
    params = { task: task }

    UserMailer.with(params).task_updated
  end

  def task_destroyed
    task = Task.first
    params = { task_id: task.id, email: task.author.email }

    UserMailer.with(params).task_destroyed
  end
end
