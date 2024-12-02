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

const args = {
	name: "AssetMonitoringPlanWorkingHrsOrKmListItem",
	tbl: "asset_monitoring_plan_working_distance_or_time",
	details_fragment,
	orgs_fragment: null,
};

const path = 'assets/monitoring-plan-working-hrs-or-km-list';

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/delete`, deleteImpl(args));
