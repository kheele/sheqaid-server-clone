const findByIdImpl = require('../../findByIdImpl');
const deleteImpl = require('../../deleteImpl');
const upsertImpl = require("../../upsertImpl");

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

const args = {
	name: "AssetMonitoringPlanFuelUsageListItem",
	tbl: "asset_monitoring_plan_fuel_usage",
	details_fragment,
	orgs_fragment: null,
};

const path = 'assets/monitoring-plan-fuel-usage-list';

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/delete`, deleteImpl(args));
