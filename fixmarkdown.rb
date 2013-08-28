require 'yaml'
require 'safe_yaml'
require 'reverse_markdown'
require 'digest'

Dir.glob("*.md") do |file_name|
  before = File.read(file_name)
  if before =~ /\A(---\s*\n.*?\n?)^(---\s*$\n?)/m
    front = $1
    content = $'

    content.gsub!(/<\/?em>/, '*')
    content.gsub!(/<\/?strong>/, '**')

    content.gsub!(/<!--break-->/, "\n\n")

    content.gsub!(/<a href="(.*?)">(?!<img)(.*?)<\/a>/, '[\2](\1)')
    content.gsub!(/\[flickr-photo:id=(\d+).+?\]/, "\n" + '{% oembed http://www.flickr.com/photos/drewish/\1 width=620 %}' + "\n")

    content.gsub!(/^<(pre|code)>$/, "\n```")
    content.gsub!(/^<\/(pre|code)>$/, "```\n")
    content.gsub!(/^<\?php$/, "\n``` php\n<?php")
    content.gsub!(/^\?>$/, "?>\n```")

    content.gsub!(/<\/?p>/, "\n")

    content.gsub!(/<blockquote>/, "> ")
    content.gsub!(/<\/blockquote>/, '')

    content.gsub!(/<\/?ul>/, "\n")
    content.gsub!(/^<li>/, '- ')
    content.gsub!(/<li>/, "\n- ")
    content.gsub!(/<\/(ul|li)>/, '')

    markdown = content
#    markdown = ReverseMarkdown.parse content
    after = "#{front}---\n#{markdown}"

    puts before
    puts after

    File.write(file_name, after)
  end
end
