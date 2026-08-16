# __generated__ by Terraform from "ocid1.instance.oc1.ap-hyderabad-1.anuhsljricm6rqac2bw5xtyalamxvwqmegy3brmq452qt6cund3mbuhchoqa"
resource "oci_core_instance" "releaseops" {
  async                      = null
  availability_domain        = "RNrZ:AP-HYDERABAD-1-AD-1"
  cluster_placement_group_id = null
  compartment_id             = "ocid1.tenancy.oc1..aaaaaaaapozc5djue5kgzsqcge57u4m3foypcudouen2syydxx7vtpwghuba"
  defined_tags = {
    "Oracle-Tags.CreatedBy" = "default/yomalkannangara@gmail.com"
    "Oracle-Tags.CreatedOn" = "2026-08-16T10:10:31.937Z"
  }
  display_name      = "releaseops-server"
  extended_metadata = {}
  fault_domain      = "FAULT-DOMAIN-3"
  freeform_tags     = {}
  metadata = {
    ssh_authorized_keys = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC7yDrSfxhQ3fWJxsHWcqQzulSV7Ph3ydh0uSeDfP0P2xIqeoOoZ2NKIyRcKuO7Y5dNYeJlunaAC6V1kHsDWB7Cp9WM1WZSh4sFiMn0OZYPvkXNxswUjci3Z4tl2wcktz96Cvy49yW2O2fcarRKHpLzAPs28S/NoCbL5QZ0P7gcy9T3yKWJM18U6lHWF4Wi4pYiomJ4XbkTgVR3HJZFlSxwfL4a+ACsLAbOGU5Jov8TlmFKsosOll3iX6lLRkUOeLg7n3qoIc59TsZAfyv5aveNp2Q+T1l3UyGyIx4KvPc3Y5QasYljiD3rZDIt+9GeYapeR7YonbvFTAE12S11sOX+UMnwRYoAPFuv4TbiXjZJON3tzGSdbp+31WGYWAgT0gIde9FXTrcO7QrIeTtEvOE9z7gbV2KsO2kITCM2DEo+mFle9JP7H1CmYM7ggN12OnCZq15GCRNHlndbgoapgcUe++OXweKLsKWRh3DanpthVoqOTezC9atRu3Fjr7Yr0DmdL5TEJyaUD6Wq4dQJUHCuUZFP0QGTFZKxJPLYp96RblolRPFhlcHiLM+f9YwhMafYtA/UowgesZVD48GRv8gvDaExqb4djzh9wR9PNXc/E7lWzKX5xHUJZjQOtF9j9J+Cnl3GJ3O63VGweTEc4y4WFQpg64AN+3DnJXVzGWXguQ== yomal@yomal-Zenbook-UX3404VA-Q420VA"
  }
  preserve_boot_volume                    = null
  preserve_data_volumes_created_at_launch = null
  security_attributes                     = {}
  shape                                   = "VM.Standard.E2.1.Micro"
  state                                   = "RUNNING"
  update_operation_constraint             = null
  agent_config {
    are_all_plugins_disabled = false
    is_management_disabled   = false
    is_monitoring_disabled   = false
    plugins_config {
      desired_state = "DISABLED"
      name          = "Vulnerability Scanning"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "OS Management Hub Agent"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Management Agent"
    }
    plugins_config {
      desired_state = "ENABLED"
      name          = "Custom Logs Monitoring"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Compute RDMA GPU Monitoring"
    }
    plugins_config {
      desired_state = "ENABLED"
      name          = "Compute Instance Monitoring"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Compute HPC RDMA Auto-Configuration"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Compute HPC RDMA Authentication"
    }
    plugins_config {
      desired_state = "ENABLED"
      name          = "Cloud Guard Workload Protection"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Block Volume Management"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Bastion"
    }
  }
  availability_config {
    is_live_migration_preferred = false
    recovery_action             = "RESTORE_INSTANCE"
  }
  create_vnic_details {
    assign_ipv6ip             = false
    assign_private_dns_record = false
    assign_public_ip          = "true"
    defined_tags = {
      "Oracle-Tags.CreatedBy" = "default/yomalkannangara@gmail.com"
      "Oracle-Tags.CreatedOn" = "2026-08-16T10:10:32.038Z"
    }
    display_name           = "releaseops-server"
    freeform_tags          = {}
    hostname_label         = "releaseops-server"
    nsg_ids                = []
    private_ip             = "10.0.0.177"
    security_attributes    = {}
    skip_source_dest_check = false
    subnet_id              = "ocid1.subnet.oc1.ap-hyderabad-1.aaaaaaaajd4ut6othhvx4bu2gcmf3qeb4gzkwrjptoneb6huqhjqhdzbuhka"
  }
  instance_options {
    are_legacy_imds_endpoints_disabled = true
  }
  launch_options {
    boot_volume_type                    = "PARAVIRTUALIZED"
    firmware                            = "UEFI_64"
    is_consistent_volume_naming_enabled = true
    is_pv_encryption_in_transit_enabled = false
    network_type                        = "PARAVIRTUALIZED"
    remote_data_volume_type             = "PARAVIRTUALIZED"
  }
  shape_config {
    local_volume_size_in_gbs = 0
    memory_in_gbs            = 1
    nvmes                    = 0
    ocpus                    = 1
    vcpus                    = 2
  }
  source_details {
    boot_volume_size_in_gbs         = "47"
    boot_volume_vpus_per_gb         = "10"
    is_preserve_boot_volume_enabled = false
    kms_key_id                      = null
    source_id                       = "ocid1.image.oc1.ap-hyderabad-1.aaaaaaaa76jw234swsf2l2pib6vqyhhau62cjdfz6gucbsx7oen7hup6nb7a"
    source_type                     = "image"
  }
}
