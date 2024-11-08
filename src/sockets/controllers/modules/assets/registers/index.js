const {
	employee_personal_details_fragment,
	personal_details_other_fragment,
} = require("../../../../../graphql/Fragments");
const findByIdImpl = require('../../findByIdImpl');
const listImpl = require("../../listImpl");

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

eventManager.on("assets/registers/findById", findByIdImpl({
	name: "AssetRegisterListItem",
	tbl: "asset_register_list",
	details_fragment,
}));

eventManager.on("assets/registers/create", async (socket, data) => {
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

eventManager.on("assets/registers/listByLogged", listImpl);