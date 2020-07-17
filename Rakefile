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
end

desc "Remove _site from directory before committing"
task :clean do
  system "rm -rf _site"
end

def prompt_for_post_meta
  print "What's the title? "
  title = STDIN.gets().strip.squeeze(" ")
  date = Time.now.strftime('%Y-%m-%d')
  {
    title: title,
    file_name: "_posts/#{date}-#{title.downcase.tr(' ','-')}.md",
    body: "---\nlayout: post\ntitle: #{title}\n---\n",
  }
end

def save_and_open_post meta
  File.open(meta[:file_name], 'w') {|f| f.write(meta[:body]) }

  puts meta[:file_name]
  system "subl #{meta[:file_name]}"
end

# Wrap lines at n characters
def wrap(s, width=78)
  s.gsub(/(.{1,#{width}})(\s+|\Z)/, "\\1\n")
end

desc "New post"
task :new_post do
  save_and_open_post(prompt_for_post_meta)
end
