const findByIdImpl = require("../../findByIdImpl");
const listImpl = require("../../listImpl");

const {
	incident_injury_list_details_fragment,
	getVariablesAndQueryConfig
} = require("./commons");

const args = {
	name: "IncidentInjuryList",
	tbl: "sheq_incident_investigation_injury_list",
	details_fragment: incident_injury_list_details_fragment,
	order_by: `{name: asc}`,
	getVariablesAndQueryConfig,
};
// /etc/letsencrypt/live/cloud.sheqaid.com/fullchain.pem
// /etc/letsencrypt/live/cloud.sheqaid.com/privkey.pem
// ssl_certificate /etc/nginx/certs/cloud.sheqaid.com.crt; # Replace with >
// ssl_certificate_key /etc/nginx/certs/cloud.sheqaid.com.key; # Replace w>

// /etc/letsencrypt/live/cloud.sheqaid.com:/etc/letsencrypt/live/cloud.sheqaid.com
const path = "incidents-injury-list";

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listImpl(args));
