require 'rubygems'
require 'rake'
require 'net/http'
require 'net/https'
require 'json'
require 'date'

desc "Deploy to drewish.com"
task :deploy do
  system "rm -r _deploy/"
  system "jekyll build --config _config.yml,_config_live.yml"
  system "rsync -r --delete -v _deploy/* amorton@drewish.com:/var/www/multivac_beta/"
end

desc "Automatically generate site at :4000 for local dev"
task :dev do
  system "jekyll serve"
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

def quote(s)
  s.lines.map { |line| "> #{line}" }.join
end

def fetch_from_pinboard
  uri = URI('https://api.pinboard.in/v1/posts/recent?format=json&count=50')

  # Create client
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.verify_mode = OpenSSL::SSL::VERIFY_PEER

  # Create Request
  req =  Net::HTTP::Get.new(uri)
  req.basic_auth 'drewish', ENV.fetch('PINBOARD_PASSWORD')

  # Fetch Request
  res = http.request(req)
  JSON.parse(res.body)
  # puts "Response HTTP Status Code: #{res.code}"
  # puts "Response HTTP Response Body: #{res.body}"
rescue StandardError => e
  puts "HTTP Request failed (#{e.message})"
end

desc "Fetch from Pinboard"
task :pinboard do
  require 'pry'
  start = Date.today - 7
  posts = fetch_from_pinboard['posts']
    .filter{ |post| Date.iso8601(post['time']) >= start }
    .map do |post|
      "#{post['tags']}\n[#{post['description']}](#{post['href']}):\n" +
        post['extended'].gsub(/<blockquote>(.*)<\/blockquote>/m) {|m| quote(wrap($1, 72)) }
    end
    .join("\n")
  print posts
end

desc "New post"
task :new_post do
  save_and_open_post(prompt_for_post_meta)
end
