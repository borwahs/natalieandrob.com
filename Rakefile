task :default => :preview

def middleman(opts="")
  sh "middleman " + opts
end

task :build do
  middleman "build"
end

task :serve, :port do |t, args|
  port = "4567"
  port = args[:port] unless args[:port].nil?

  opts = "-p " << port

  middleman "server #{opts}"
end
