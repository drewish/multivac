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

desc "New post"
task :new do
  print "What's the title? "
  title =  STDIN.gets().strip.squeeze(" ")
  date = Time.now.strftime('%Y-%m-%d')
  data = <<HEADER
---
layout: post
title: #{title}
---
HEADER
  file_name = "_posts/#{date}-#{title.downcase.tr(' ','-')}.md"
  File.open(file_name, 'w') {|f| f.write(data) }
  puts file_name
end
