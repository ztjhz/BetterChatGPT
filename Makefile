DateStamp := $(shell /bin/date "+%Y%m%d%H%M%S")
CURRENT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

# Conditionally set the BRANCH_NAME variable
ifeq ($(CURRENT_BRANCH), main)
    BRANCH_NAME :=
else
    BRANCH_NAME := "$(CURRENT_BRANCH)-"
endif

VERSION := "$(BRANCH_NAME)$(DateStamp)"

URL=277516517760.dkr.ecr.us-west-2.amazonaws.com/akasa-brtterchatgpt

info:
	echo ${VERSION}

build:
	docker build -t ${URL}:${VERSION} --file dockerfileNpm .

shell:
	docker run -it ${URL}:${VERSION} bash

run:
	docker run -p 5173:5173 ${URL}:${VERESION}

size:
	docker history ${URL}:${VERSION}

push: build-base login-ecr
	docker push ${URL}:${VERSION}

latest: ecr-login
	docker tag ${URL}:${VERSION} ${URL}:latest
	docker push ${URL}:latest

ecr-login: login-ecr
login-ecr:
	aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 277516517760.dkr.ecr.us-west-2.amazonaws.com