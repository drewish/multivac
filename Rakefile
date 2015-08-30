require "rubygems"
require 'rake'

desc "Deploy to drewish.com"
task :deploy do
  system "rm -r _deploy/"
  system "jekyll build --config _config.yml,_config_live.yml"
  system "rsync -r --delete -v _deploy/* amorton@drewish.com:/var/www/multivac_beta/"
end

desc "Automatically generate site at :4000 for local dev"
task :dev do
  system "bundle exec guard"
end # task :dev

desc "Remove _site from directory before committing"
task :clean do
  system "rm -rf _site"
end # task :clean

def format_header title
  <<HEADER
---
layout: post
title: #{title}
---
HEADER
end

def get_post_meta
  print "What's the title? "
  title = STDIN.gets().strip.squeeze(" ")
  date = Time.now.strftime('%Y-%m-%d')
  {
    title: title,
    file_name: "_posts/#{date}-#{title.downcase.tr(' ','-')}.md",
    body: format_header(title),
  }
end

def save_and_open_post meta
  File.open(meta[:file_name], 'w') {|f| f.write(meta[:body]) }

  puts meta[:file_name]
  system "subl #{meta[:file_name]}"
end

desc "New post from facebook"
task :new_facebook do
  require 'json'
  require 'net/https'
  require 'uri'
  require 'time'

  days_back = 14

  # Use https://developers.facebook.com/tools/explorer/ to fetch a token with
  # read_stream permissions
  def fetch access_token
    path = "/10100156140031341/feed?limit=100&access_token=#{access_token}"
    http = Net::HTTP.new("graph.facebook.com", 443)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER

    response = http.request(Net::HTTP::Get.new(path))
    feed = JSON.parse(response.body, symbolize_names: true)
    raise RuntimeError(feed[:error][:message]) if feed[:error]
    feed
  end

  # Format a item in markdown
  def format_item item
    # Wrap lines at n characters
    def wrap(s, width=78)
      s.gsub(/(.{1,#{width}})(\s+|\Z)/, "\\1\n")
    end

    <<ITEM
> #{wrap(item[:message]).chomp}
<cite>#{item[:link]}</cite>

<!-- #{item[:date]} -->

ITEM
  end

  meta = get_post_meta

  puts "Use https://developers.facebook.com/tools/explorer/ to fetch a token with read_stream permissions"
  print "What's the token? "
  token =  STDIN.gets().strip.squeeze(" ")

  fetch(token)[:data].each {|item|
    item[:date] = Date.iso8601(item[:created_time])
  }.select!{|item|
    item[:date] >= Date.today - days_back
  }.each { |item|
    meta[:body] << format_item(item)
  }

  save_and_open_post meta
end

desc "New post"
task :new_post do
  save_and_open_post(get_post_meta)
end
