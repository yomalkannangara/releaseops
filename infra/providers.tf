terraform {
  required_version = ">= 1.15.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 8.27.0"
    }
  }
}

provider "oci" {
  config_file_profile = "DEFAULT"
}
