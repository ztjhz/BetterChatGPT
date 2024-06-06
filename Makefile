VERSION=20240606
URL=277516517760.dkr.ecr.us-west-2.amazonaws.com/akasa-brtterchatgpt

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