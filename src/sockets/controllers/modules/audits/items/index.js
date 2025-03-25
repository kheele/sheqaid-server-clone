const findByIdImpl = require('../../findByIdImpl');
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");

const args = {
	name: "AuditItem",
	tbl: "sheq_compliance_audits_items",
	details_fragment: `
  id
  audit_id
  audit{
    id
  }
  element
  sub_element
  target_date
  due_date
  audit_findings
  audit_summary
  possible_score
  achieved_score
  comments
  compliance
  responsible_person{
    id
    created_at
    profile_pic
    fname
    lname
    full_name
    dob
    sex
    phone
    email
    id_num
    passport_num
    employment_num
    employment_date
    removed
    job_position{
      id
      name
    }
    department{
      id
      name
    }
    linked_user_id
    linked_user{
      id
      auth_id
      created_at
      profile_pic
      fname
      lname
      full_name
      phone
      username
    }
  }
`,
	orgs_fragment: null,
};

const path = "audits/items";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/delete`, deleteImpl(args));
