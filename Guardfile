# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard "jekyll-plus", config: ['_config.yml', '_config_dev.yml'], serve: true,
  extensions: ['md','html','js','scss','css','jpg','png'] do
  watch /.*/
  ignore /^_site/
  ignore /^_deploy/
end

