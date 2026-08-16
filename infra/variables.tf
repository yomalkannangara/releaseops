variable "compartment_ocid" {
  description = "OCI compartment containing ReleaseOps."
  type        = string
}

variable "instance_ocid" {
  description = "Existing ReleaseOps compute instance."
  type        = string
}

variable "vcn_ocid" {
  description = "Existing ReleaseOps VCN."
  type        = string
}

variable "subnet_ocid" {
  description = "Existing public subnet."
  type        = string
}

variable "internet_gateway_ocid" {
  description = "Existing internet gateway."
  type        = string
}

variable "route_table_ocid" {
  description = "Existing default route table."
  type        = string
}

variable "security_list_ocid" {
  description = "Existing default security list."
  type        = string
}

variable "dhcp_options_ocid" {
  description = "Existing default DHCP options."
  type        = string
}
