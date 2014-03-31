task :default => :preview

def middleman(opts="")
  sh "middleman " + opts
end

task :build do
  middleman "build"
end

task :serve do
  middleman "server"
end
