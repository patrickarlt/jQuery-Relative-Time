require "rubygems"
require "bundler/setup"
require "chronic"

get "/" do
  date = Time.new(chronic.parse(""))
  erb :test
end