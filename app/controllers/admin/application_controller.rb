class Admin::ApplicationController < ApplicationController
  include AuthHelper
  include RenderErrorHelper
  helper_method :current_user
  before_action :authenticate_user!, :authorize

  def authorize
    render_403 if forbidden?
  end

  def forbidden?
    !current_user.is_a?(Admin)
  end
end
