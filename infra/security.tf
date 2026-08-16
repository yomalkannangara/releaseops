
# __generated__ by Terraform from "ocid1.securitylist.oc1.ap-hyderabad-1.aaaaaaaaa6aolhmscsyytdivbve6cns6e3rqk7zc4flpctxfi25q4vmdgjia"
resource "oci_core_default_security_list" "releaseops" {
  compartment_id = "ocid1.tenancy.oc1..aaaaaaaapozc5djue5kgzsqcge57u4m3foypcudouen2syydxx7vtpwghuba"
  defined_tags = {
    "Oracle-Tags.CreatedBy" = "default/yomalkannangara@gmail.com"
    "Oracle-Tags.CreatedOn" = "2026-08-16T10:10:27.494Z"
  }
  display_name               = "Default Security List for releaseops-vcn"
  freeform_tags              = {}
  manage_default_resource_id = "ocid1.securitylist.oc1.ap-hyderabad-1.aaaaaaaaa6aolhmscsyytdivbve6cns6e3rqk7zc4flpctxfi25q4vmdgjia"
  egress_security_rules {
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
    stateless        = false
  }
  ingress_security_rules {
    description = "ReleaseOps HTTP"
    protocol    = "6"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = false
    tcp_options {
      max = 80
      min = 80
    }
  }
  ingress_security_rules {
    description = "ReleaseOps HTTPS"
    protocol    = "6"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = false
    tcp_options {
      max = 443
      min = 443
    }
  }
  ingress_security_rules {
    protocol    = "1"
    source      = "10.0.0.0/16"
    source_type = "CIDR_BLOCK"
    stateless   = false
    icmp_options {
      code = -1
      type = 3
    }
  }
  ingress_security_rules {
    protocol    = "1"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = false
    icmp_options {
      code = 4
      type = 3
    }
  }
  ingress_security_rules {
    protocol    = "6"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = false
    tcp_options {
      max = 22
      min = 22
    }
  }
}
