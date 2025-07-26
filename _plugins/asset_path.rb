# Simple asset_path and javascript tags for Jekyll 4 compatibility
# These replace functionality that was previously provided by jekyll-assets

module Jekyll
  # Generates asset paths for images
  class AssetPathTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @text = text.strip
    end

    def render(context)
      # Remove quotes if present
      asset_name = @text.gsub(/['"]/, '')

      # Return the asset path relative to site root
      "/assets/images/#{asset_name}"
    end
  end

  # Generates script tags for JavaScript files
  class JavascriptTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @text = text.strip
    end

    def render(context)
      # Remove quotes if present
      js_name = @text.gsub(/['"]/, '')

      # Return the script tag
      %Q{<script src="/assets/js/#{js_name}.js"></script>}
    end
  end
end

Liquid::Template.register_tag('asset_path', Jekyll::AssetPathTag)
Liquid::Template.register_tag('javascript', Jekyll::JavascriptTag)
