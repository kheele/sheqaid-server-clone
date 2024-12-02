const {
	employee_personal_details_fragment,
} = require("../../../../../graphql/Fragments");
const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require("../../listByLoggedImpl");

const details_fragment = `
  id
  created_at
  due_return_date
  returned_time
  comments
  status
  condition
  location
  asset_id
  asset{
    id
  }
  employee_id
  employee{
    ${employee_personal_details_fragment}
  }
`;
const args = {
	name: "AssetRegisterListItem",
	tbl: "asset_register_list",
	details_fragment,
	// orgs_fragment: null,
};

const path = 'assets/registers';

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/create`, async (socket, data) => {
	if(!data) return;
	
	const {
		employee_issued_by_id,//out
		employee_received_by_id,//out
		employee_returned_by_id,//in
		employee_return_accepted_by_id,//in
		taken_date,//out
		taken_time,//out
		due_return_date,//out
		returned_date,//in
		returned_time,//in
		status,//in
		condition,//in
		location,//in
		comments,//in & out
		list,//in & out
	} = data;
	
	const input = list.map(asset_id => ({
		asset_id,
		employee_issued_by_id,
		employee_received_by_id,
		employee_returned_by_id,
		employee_return_accepted_by_id,
		taken_date,
		taken_time,
		due_return_date,
		returned_date,
		returned_time,
		status,
		condition,
		location,
		comments,
	}));
	
	return insertGraphQL({
		mutation: `
			mutation insertAssetRegisterListItemMutation($objects: [asset_register_insert_input!]!) {
		    insert_asset_register(
		      objects: $objects
		    ) {
		      returning{
		        ${details_fragment}
		      }
		    }
		  }
		`,
		operationName: "insertAssetRegisterListItemMutation",
		input,
	}).then(res => res && res.returning);
});

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
	...args,
	details_fragment: data => {
		const {data_export} = data;
		return data_export ? asset_export_details_fragment : asset_basic_details_fragment;
	},
	order_by: "order_by: [{asset_detail:{asset_type: asc}}, {asset_detail:{name: asc}},]",
	// getVariablesAndQueryConfig,
}));