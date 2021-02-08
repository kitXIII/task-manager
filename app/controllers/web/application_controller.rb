class Web::ApplicationController < ApplicationController
  include AuthHelper
  include RenderErrorHelper
  helper_method :current_user
end
