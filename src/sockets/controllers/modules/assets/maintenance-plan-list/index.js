const findByIdImpl = require('../../findByIdImpl');
const createImpl = require("../../createImpl");
const upsertImpl = require("../../upsertImpl");

const args = {
	name: "AssetMaintenancePlanListItem",
	tbl: "asset_maintenance_plan_list",
	details_fragment: `
	  id
	  maintenance_plan_id
	  reason_for_service
	  service
	  service_hrs_or_km
	  service_date
	  cost
	  receipt
	  parts_used_list{
		id
		plan_list_id
		qty
		part{
		  id
		  asset_id
		  asset_type
		  name
		}
	  }
	`,
	orgs_fragment: null,
};

const path = 'assets/maintenance-plan-list';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
