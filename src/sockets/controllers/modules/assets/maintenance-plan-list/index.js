const findByIdImpl = require('../../findByIdImpl');

const details_fragment = `
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
`;

eventManager.on("assets/maintenance-plan-list/findById", findByIdImpl({
	name: "AssetMaintenancePlanListItem", tbl: "asset_maintenance_plan_list", details_fragment,
}));
