const findByIdImpl = require('../../findByIdImpl');

const details_fragment = `
  id
  monitoring_plan_id
  working_hrs_or_km_opening
  working_hrs_or_km_closing
  working_hrs_or_km
  date
`;

eventManager.on("assets/monitoring-plan-working-hrs-or-km-list/findById", findByIdImpl({
	name: "AssetMonitoringPlanWorkingHrsOrKmListItem", tbl: "asset_monitoring_plan_working_distance_or_time", details_fragment,
}));
