
# __generated__ by Terraform from "ocid1.routetable.oc1.ap-hyderabad-1.aaaaaaaaqxfsgcym6aekwb4emgtnfp4ugyduip2e63nhfzoyqrohtvnwhf5q"
resource "oci_core_default_route_table" "releaseops" {
  compartment_id = "ocid1.tenancy.oc1..aaaaaaaapozc5djue5kgzsqcge57u4m3foypcudouen2syydxx7vtpwghuba"
  defined_tags = {
    "Oracle-Tags.CreatedBy" = "default/yomalkannangara@gmail.com"
    "Oracle-Tags.CreatedOn" = "2026-08-16T10:10:27.494Z"
  }
  display_name               = "Default Route Table for releaseops-vcn"
  freeform_tags              = {}
  manage_default_resource_id = "ocid1.routetable.oc1.ap-hyderabad-1.aaaaaaaaqxfsgcym6aekwb4emgtnfp4ugyduip2e63nhfzoyqrohtvnwhf5q"
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = "ocid1.internetgateway.oc1.ap-hyderabad-1.aaaaaaaavo7t2fh2rqlas2if5vo4zfua52shs6rrk3xaointf6udatdqua2a"
    route_type        = "STATIC"
  }
}

# __generated__ by Terraform from "ocid1.vcn.oc1.ap-hyderabad-1.amaaaaaaicm6rqaazcfhtxs2e7gocrrlziqtxajdeb4wiemlhhxdp47d4bfq"
resource "oci_core_vcn" "releaseops" {
  cidr_block     = "10.0.0.0/16"
  cidr_blocks    = ["10.0.0.0/16"]
  compartment_id = "ocid1.tenancy.oc1..aaaaaaaapozc5djue5kgzsqcge57u4m3foypcudouen2syydxx7vtpwghuba"
  defined_tags = {
    "Oracle-Tags.CreatedBy" = "default/yomalkannangara@gmail.com"
    "Oracle-Tags.CreatedOn" = "2026-08-16T10:10:27.494Z"
  }
  display_name            = "releaseops-vcn"
  dns_label               = "vcn08161540"
  freeform_tags           = {}
  ipv6private_cidr_blocks = []
  is_ipv6enabled          = false
  security_attributes     = {}
}
# __generated__ by Terraform from "ocid1.internetgateway.oc1.ap-hyderabad-1.aaaaaaaavo7t2fh2rqlas2if5vo4zfua52shs6rrk3xaointf6udatdqua2a"
resource "oci_core_internet_gateway" "releaseops" {
  compartment_id = "ocid1.tenancy.oc1..aaaaaaaapozc5djue5kgzsqcge57u4m3foypcudouen2syydxx7vtpwghuba"
  defined_tags = {
    "Oracle-Tags.CreatedBy" = "default/yomalkannangara@gmail.com"
    "Oracle-Tags.CreatedOn" = "2026-08-16T10:10:29.074Z"
  }
  display_name  = "Internet Gateway releaseops-vcn"
  enabled       = true
  freeform_tags = {}
  vcn_id        = "ocid1.vcn.oc1.ap-hyderabad-1.amaaaaaaicm6rqaazcfhtxs2e7gocrrlziqtxajdeb4wiemlhhxdp47d4bfq"
}

# __generated__ by Terraform from "ocid1.dhcpoptions.oc1.ap-hyderabad-1.aaaaaaaapysecjylmjr65xnrsyt2vghuui27w4gx3vkwg26nmb6hfojh7naq"
resource "oci_core_default_dhcp_options" "releaseops" {
  compartment_id = "ocid1.tenancy.oc1..aaaaaaaapozc5djue5kgzsqcge57u4m3foypcudouen2syydxx7vtpwghuba"
  defined_tags = {
    "Oracle-Tags.CreatedBy" = "default/yomalkannangara@gmail.com"
    "Oracle-Tags.CreatedOn" = "2026-08-16T10:10:27.494Z"
  }
  display_name               = "Default DHCP Options for releaseops-vcn"
  domain_name_type           = "CUSTOM_DOMAIN"
  freeform_tags              = {}
  manage_default_resource_id = "ocid1.dhcpoptions.oc1.ap-hyderabad-1.aaaaaaaapysecjylmjr65xnrsyt2vghuui27w4gx3vkwg26nmb6hfojh7naq"
  options {
    custom_dns_servers  = []
    search_domain_names = ["vcn08161540.oraclevcn.com"]
    type                = "SearchDomain"
  }
  options {
    custom_dns_servers  = []
    search_domain_names = []
    server_type         = "VcnLocalPlusInternet"
    type                = "DomainNameServer"
  }
}

# __generated__ by Terraform from "ocid1.subnet.oc1.ap-hyderabad-1.aaaaaaaajd4ut6othhvx4bu2gcmf3qeb4gzkwrjptoneb6huqhjqhdzbuhka"
resource "oci_core_subnet" "releaseops_public" {
  cidr_block     = "10.0.0.0/24"
  compartment_id = "ocid1.tenancy.oc1..aaaaaaaapozc5djue5kgzsqcge57u4m3foypcudouen2syydxx7vtpwghuba"
  defined_tags = {
    "Oracle-Tags.CreatedBy" = "default/yomalkannangara@gmail.com"
    "Oracle-Tags.CreatedOn" = "2026-08-16T10:10:30.509Z"
  }
  dhcp_options_id            = "ocid1.dhcpoptions.oc1.ap-hyderabad-1.aaaaaaaapysecjylmjr65xnrsyt2vghuui27w4gx3vkwg26nmb6hfojh7naq"
  display_name               = "releaseops-public-subnet"
  dns_label                  = "subnet08161540"
  freeform_tags              = {}
  ipv4cidr_blocks            = ["10.0.0.0/24"]
  ipv6cidr_blocks            = []
  prohibit_internet_ingress  = false
  prohibit_public_ip_on_vnic = false
  route_table_id             = "ocid1.routetable.oc1.ap-hyderabad-1.aaaaaaaaqxfsgcym6aekwb4emgtnfp4ugyduip2e63nhfzoyqrohtvnwhf5q"
  security_list_ids          = ["ocid1.securitylist.oc1.ap-hyderabad-1.aaaaaaaaa6aolhmscsyytdivbve6cns6e3rqk7zc4flpctxfi25q4vmdgjia"]
  vcn_id                     = "ocid1.vcn.oc1.ap-hyderabad-1.amaaaaaaicm6rqaazcfhtxs2e7gocrrlziqtxajdeb4wiemlhhxdp47d4bfq"
}
