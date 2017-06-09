---
layout: post
title: Validate Swagger Docs in Jenkins
---
Here's a quick hack I worked out to validate Swagger documentation as part of a
Jenkins pull request check. It uses curl to send the JSON off to the [Swagger Validator Badge](https://github.com/swagger-api/validator-badge).
If there are any validation errors it will display them and then fail the build.

For a pipeline style job:

```groovy
stage('Swagger') {
  // Generate or update the .json file
  sh 'touch swagger.json'

  // Send off the .json file for validation
  lint = sh returnStdout: true, script: 'curl -X "POST" "http://online.swagger.io/validator/debug" --silent -d @swagger.json'
  if (lint != '{}') {
    error "Invalid Swagger:\n${lint}"
  }
}
```

For an old freestyle job:

```bash
#!/bin/bash

# Generate or update the .json file
touch swagger.json

# Send off the .json file for validation
SWAGGER_LINT=$(curl -X "POST" "http://online.swagger.io/validator/debug" --silent -d @swagger.json)
if [[ $SWAGGER_LINT != "{}" ]]; then
  echo -e "\nInvalid Swagger:\n$SWAGGER_LINT\n"
  exit 1
fi;
```
