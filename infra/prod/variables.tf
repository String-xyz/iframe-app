locals {
  cluster_name       = "public-sdk"
  env                = "prod"
  service_name       = "iframe-app"
  domain             = "frames.string-api.xyz"
  container_port     = "3000"
  desired_task_count = "1"
  memory             = 512
  cpu                = 256
  region             = "us-west-2"
}

variable "versioning" {
  type    = string
  default = "1.0.0"
}

locals {
  task_definition = jsonencode([
    {
      name      = local.service_name
      image     = "${aws_ecr_repository.repo.repository_url}:${var.versioning}"
      essential = true,
      dockerLabels = {
        "com.datadoghq.ad.instances" : "[{\"host\":\"%%host%%\"}]",
        "com.datadoghq.ad.check_names" : "[\"${local.service_name}\"]",
      },
      portMappings = [
        { containerPort = 3000 }
      ],
      environment = [
        {
          name  = "PORT"
          value = local.container_port
        },
        {
          name  = "ENV"
          value = local.env
        },
         {
          name  = "REGION"
          value = local.region
        },
        {
          name  = "ECS_FARGATE"
          value = "true"
        },
        {
          name  = "DD_SERVICE"
          value = local.service_name
        },
        {
          name  = "DD_VERSION"
          value = var.versioning
        },
        {
          name  = "DD_ENV"
          value = local.env
        }
      ],
      logConfiguration = {
        logDriver = "awsfirelens"
        secretOptions = [{
          name      = "apiKey",
          valueFrom = data.aws_ssm_parameter.datadog.arn
        }]
        options = {
          Name             = "datadog"
          "dd_service"     = "${local.service_name}"
          "Host"           = "http-intake.logs.datadoghq.com"
          "dd_source"      = "${local.service_name}"
          "dd_message_key" = "log"
          "dd_tags"        = "project:${local.service_name}"
          "TLS"            = "on"
          "provider"       = "ecs"
        }
      }
    },
    {
      name      = "datadog-agent"
      image     = "gcr.io/datadoghq/agent:latest"
      essential = false
      secrets = [{
        name      = "DD_API_KEY"
        valueFrom = data.aws_ssm_parameter.datadog.arn
      }],
      portMappings = [{
        hostPort      = 8126,
        protocol      = "tcp",
        containerPort = 8126
        }
      ]
    },
    {
      name      = "log_router"
      image     = "public.ecr.aws/aws-observability/aws-for-fluent-bit:stable"
      essential = true
      firelensConfiguration = {
        type = "fluentbit"
        options = {
          "enable-ecs-log-metadata" = "true"
        }
      }
    }
  ])
}
