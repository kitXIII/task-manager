class UserMailer < ApplicationMailer
  def task_created
    user = params[:user]
    @task = params[:task]

    mail(to: user.email, subject: 'New Task Created')
  end

  def task_updated
    @task = params[:task]

    mail(to: @task.author.email, subject: 'Task was changed')
  end

  def task_destroyed
    @task = params[:task]

    mail(to: @task.author.email, subject: 'Task was deleted')
  end
end
