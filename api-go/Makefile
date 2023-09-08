all: build

build:
	go get -u ./...
	rm -rf bin
	mkdir bin && mkdir bin/functions
	GOARCH=amd64 GOOS=linux go build -o bin/functions ./src/functions/...

deploy:
	export PROFILE=personal && \
	sls deploy

clean:
	rm -rf bin