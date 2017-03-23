---
layout: post
title: Validate Swagger Docs in Jenkins
---
Here's a quick hack I worked out to validate Swagger documentation as part of a
Jenkins pull request check. It uses some bash scripting to send the JSON off to
the the [Swagger Validator Badge](https://github.com/swagger-api/validator-badge).
If there are any validation errors it will print them and then fail the build.

```bash
#!/bin/bash

# Do what you need to generate the .json file
# ...

# Send off the .json file for validation
SWAGGER_LINT=$(curl -X "POST" "http://online.swagger.io/validator/debug" --silent -d @swagger/v2016-09-01/swagger.json)
if [[ $SWAGGER_LINT != "{}" ]]; then
  echo -e "\nInvalid Swagger:\n$SWAGGER_LINT\n"
  exit 1
fi;
```
