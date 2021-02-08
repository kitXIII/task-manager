module RenderErrorHelper
  def method_missing(method_name, *arguments, &block)
    if method_name.to_s =~ /render_(403|404|422|500)/
      render(file: File.join(Rails.root, "public/#{$1}.html"), status: $1, layout: false)
    else
      super
    end
  end

  def respond_to_missing?(method_name, include_private = false)
    method_name.to_s =~ /render_(403|404|422|500)/ || super
  end
end
