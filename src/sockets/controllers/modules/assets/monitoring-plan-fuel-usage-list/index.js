const findByIdImpl = require('../../findByIdImpl');

const details_fragment = `
  id
  monitoring_plan_id
  refilled_fuel
  current_hrs_or_km
  working_hrs_or_km
  date
  receipt
  cost
`;

eventManager.on("assets/monitoring-plan-fuel-usage-list/findById", findByIdImpl({
	name: "AssetMonitoringPlanFuelUsageListItem", tbl: "asset_monitoring_plan_fuel_usage", details_fragment,
}));
