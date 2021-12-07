.PHONY: build-tweet load-env prepare

build-tweet:
	cd resources/lambdaFunctions/tweet && GOARCH=amd64 GOOS=linux go build -o bin/main

load-env:
	source ".env"

prepare: load-env build-tweet