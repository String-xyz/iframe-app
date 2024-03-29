include .env.deploy
export
AWS_DEFAULT_PROFILE=${env}-string
SERVICE_NAME=iframe-app
ECS_CLUSTER=public-sdk
SERVICE_TAG=${tag}
ECR_REPO_URL=${${env}_AWS_ACCT}.dkr.ecr.us-west-2.amazonaws.com/${SERVICE_NAME}

all: docker-build push deploy

test-envvars:
	@[ "${env}" ] || ( echo "env var is not set"; exit 1 )

docker-build: test-envvars
	docker build  --platform linux/amd64 -t $(ECR_REPO_URL):${SERVICE_TAG} .

push: test-envvars
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REPO_URL)
	docker push $(ECR_REPO_URL):${SERVICE_TAG} 

deploy: test-envvars
	aws ecs --region $(AWS_REGION) update-service --cluster $(ECS_CLUSTER) --service ${SERVICE_NAME} --force-new-deployment
