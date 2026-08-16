import {
  to = oci_core_vcn.releaseops
  id = var.vcn_ocid
}

import {
  to = oci_core_subnet.releaseops_public
  id = var.subnet_ocid
}

import {
  to = oci_core_internet_gateway.releaseops
  id = var.internet_gateway_ocid
}

import {
  to = oci_core_default_route_table.releaseops
  id = var.route_table_ocid
}

import {
  to = oci_core_default_security_list.releaseops
  id = var.security_list_ocid
}

import {
  to = oci_core_default_dhcp_options.releaseops
  id = var.dhcp_options_ocid
}

import {
  to = oci_core_instance.releaseops
  id = var.instance_ocid
}
