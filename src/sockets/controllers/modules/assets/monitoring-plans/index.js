const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');
const {orgs_fragment} = require("../../../../../graphql/Fragments");

const details_fragment = `
	id
  removed
  next_service_hrs_or_km
  asset{
    id
    ${orgs_fragment}
  }
`;

eventManager.on("assets/monitoring-plans/findById", findByIdImpl({
	name: "AssetMaintenancePlanList", tbl: "asset_maintenance_plan", details_fragment,
}));

eventManager.on("assets/monitoring-plans/listByLogged", listImpl);
