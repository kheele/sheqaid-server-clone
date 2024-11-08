const findByIdImpl = require('../../findByIdImpl');
const deleteImpl = require('../../deleteImpl');
const upsertImpl = require("../../upsertImpl");

const details_fragment = `
  id
  monitoring_plan_id
  working_hrs_or_km_opening
  working_hrs_or_km_closing
  working_hrs_or_km
  date
`;

eventManager.on("assets/monitoring-plan-working-hrs-or-km-list/findById", findByIdImpl({
	name: "AssetMonitoringPlanWorkingHrsOrKmListItem",
	tbl: "asset_monitoring_plan_working_distance_or_time",
	details_fragment,
	orgs_fragment: null,
}));

eventManager.on("assets/monitoring-plan-working-hrs-or-km-list/delete", deleteImpl({
	name: "AssetMonitoringPlanWorkingHrsOrKmListItem",
	tbl: "asset_monitoring_plan_working_distance_or_time",
	details_fragment,
	orgs_fragment: null,
}));

eventManager.on("assets/monitoring-plan-working-hrs-or-km-list/upsert", upsertImpl({
	name: "AssetMonitoringPlanWorkingHrsOrKmListItem",
	tbl: "asset_monitoring_plan_working_distance_or_time",
	details_fragment,
	orgs_fragment: null,
}));
