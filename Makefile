include .env
export
AWS_DEFAULT_PROFILE=${env}-string
SERVICE_NAME=iframe-app
ECS_CLUSTER=public-sdk
SERVICE_TAG=latest
AWS_REGION=us-west-2
ECR_REPO_URL=${ACCT}.dkr.ecr.us-west-2.amazonaws.com/${SERVICE_NAME}

all: build docker-build push deploy

test-envvars:
	@[ "${env}" ] || ( echo "env var is not set"; exit 1 )

build:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./cmd/app/main ./cmd/app/main.go

run:
	npm run build && cd ./cmd/app && ENV=local go run .
	
docker-build: test-envvars
	docker build -t $(ECR_REPO_URL):${SERVICE_TAG} .

push: test-envvars
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REPO_URL)
	docker push $(ECR_REPO_URL):${SERVICE_TAG} 
	
deploy: test-envvars
	aws ecs --region $(AWS_REGION) update-service --cluster $(ECS_CLUSTER) --service ${SERVICE_NAME} --force-new-deployment
