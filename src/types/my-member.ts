export type MyMemberSetupType = {
  member_id: string;
  name: string;
  father: string;
  mother: string;
  address_det: string;
  profession: string; // Assuming this is an ID reference
  address_zoneCode: string; // Assuming this is an ID reference
  contact: string;
  email: string | null; // Email can be null
  gender: string; // Only M or F allowed
  spouse: string;
  dob: string; // Date in YYYY-MM-DD format
  blood: string; // Assuming this is an ID reference
  national_id: string;
  religion: string; // Assuming this is an ID reference
  nom_name: string;
  nom_relation: string;
  nom_nid_bc: string;
  nomContact: string;
  int_type: string; // Only M (Member) or O (Other) allowed
  int_id: string | null; // Assuming this is an ID reference
  int_details: string | null;
  mem_date: string; // Date in YYYY-MM-DD format
}
