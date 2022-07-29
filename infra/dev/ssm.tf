data "aws_ssm_parameter" "datadog" {
  name = "datadog-key"
}

data "aws_kms_key" "kms_key" {
  key_id = "alias/main-kms-key"
}
