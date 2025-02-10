require('./incidents-quick');
require('./incidents-injury-list');
require('./cause-analysis');
require('./corrective-actions');
require('./investigations');

const createImpl = require("./createImpl");
const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const exportExcelImpl = require("../exportExcelImpl");
const exportExcelOneImpl = require("../exportExcelOneImpl");

eventManager.on("incidents/create", createImpl);

eventManager.on("incidents/findById", findByIdImpl);

eventManager.on("incidents/listByLogged", listImpl);

eventManager.on("incidents/dashboard", findByIdDashboardImpl);

eventManager.on("incidents/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "Incidents",
	listImpl,
	mapRow,
}));

eventManager.on("incidents/export-excel-one", exportExcelOneImpl({
	currDir: __dirname,
	name: "Incident-Single",
	findByIdImpl,
	mapRow,
}));

function mapRow(item, idx) {
	let {
		id,
		data: {
			created_at,
			//0
			company, client, project, site,
			//1
			group,
			short_desc,
			desc,
			location,
			exact_location,
			document_list,
			//2
			incident_date,
			incident_time,
			date_reported,
			time_reported,
			time_shift,
			//3
			category_list,
			sub_category_list,
			//4
			sector_list,
			activity_list,
			//5.1
			person_involved_list,
			//5.2
			person_reporting,
			//5.3
			person_reported_to,
			//5.4
			witness_list,
			//5.5
			distribution_list,
			//6
			is_vehicle_incident,
			is_infringement_issued,
			did_police_attend_scene,
			collision_reported_to_police_station,
			have_charges_been_laid,
			driver,
			driver_dob,
			driver_gender,
			address,
			email,
			phone,
			licence_num,
			licence_expiry,
			licence_years,
			vehicle_make,
			vehicle_model,
			vehicle_year,
			vehicle_color,
			vehicle_reg_num,
			vehicle_fleet_num,
			vehicle_reg_date,
			vehicle_trip_type,
			vehicle_load_type,
			was_3rd_party_involved,
			are_3rd_party_details_available,
			third_party_fname,
			third_party_lname,
			third_party_address,
			third_party_email,
			third_party_phone,
			did_driver_admit_liability,
			did_someone_else_admit_liability,
			someone_else_admit_liability_name,
			liability_admitted_to_name,
			third_party_opinion,
			third_party_document_list,
			penalty_num,
			issuing_authority,
			issuing_officer,
			type_of_breach,
			addressee_issued_to_name,
			addressee_name_or_entity,
			addressee_amount,
			addressee_due_date,
			ref_or_report_num,
			officer_name,
			officer_station,
			nature_of_charges,
			who_laid_charges,
			who_were_nature_charges_laid_against,
			//7
			is_person_injured,
			person_injured,
			injured_person_dob,
			injured_person_gender,
			nature_of_injury_list,
			bodily_injury_location_list,
			injury_mechanism_list,
			injury_desc,
			//8
			test_undertaken,
			test_type_list,
			test_type_drug_undertaken,
			test_type_alcohol_undertaken,
			test_type_mobile_device_undertaken,
			//9
			consequence,
			likelihood,
			risk_rating,
		}
	} = item;
	
	client = client || company;
	
	return {
		project: project && project.name,
		site: site && site.name,
		
		group,
		short_desc,
		desc,
		location,
		exact_location,
		document_list,
		incident_date:Dates.formatDateSQL(incident_date),
		incident_time,
		date_reported:Dates.formatDateSQL(date_reported),
		time_reported,
		time_shift,
		category_list,
		sub_category_list,
		sector_list,
		activity_list,
		person_involved_list,
		person_reporting: person_reporting && person_reporting.full_name,
		person_reported_to: person_reported_to && person_reported_to.full_name ,
		witness_list,
		distribution_list,
		person_injured: person_injured && person_injured.full_name,
		injured_person_dob:Dates.formatDateSQL(injured_person_dob),
		injured_person_gender,
		nature_of_injury_list,
		bodily_injury_location_list,
		injury_mechanism_list,
		injury_desc,
		test_undertaken,
		test_type_list,
		test_type_drug_undertaken,
		test_type_alcohol_undertaken,
		test_type_mobile_device_undertaken,
		vehicle_make,
		vehicle_model,
		vehicle_year,
		vehicle_color,
		vehicle_reg_num,
		vehicle_fleet_num,
		vehicle_reg_date:Dates.formatDateSQL(vehicle_reg_date),
		vehicle_trip_type,
		vehicle_load_type,
		was_3rd_party_involved,
		are_3rd_party_details_available,
		third_party_fname,
		third_party_lname,
		third_party_address,
		third_party_email,
		third_party_phone,
		did_driver_admit_liability,
		did_someone_else_admit_liability,
		someone_else_admit_liability_name,
		liability_admitted_to_name,
		third_party_opinion,
		third_party_document_list,
		penalty_num,
		issuing_authority,
		issuing_officer,
		type_of_breach,
		addressee_issued_to_name,
		addressee_name_or_entity,
		addressee_amount,
		addressee_due_date:Dates.formatDateSQL(addressee_due_date),
		ref_or_report_num,
		officer_name,
		officer_station,
		nature_of_charges,
		who_laid_charges : who_laid_charges && who_laid_charges.full_name,
		who_were_nature_charges_laid_against: who_were_nature_charges_laid_against && who_were_nature_charges_laid_against.full_name,
		onsequence,
		consequence,
		likelihood,
		risk_rating,
		is_vehicle_incident,
		is_infringement_issued,
		did_police_attend_scene,
		collision_reported_to_police_station,
		have_charges_been_laid,
		driver,
		driver_dob:Dates.formatDateSQL(driver_dob),
		driver_gender,
		address,
		email,
		phone,
		licence_num,
		licence_expiry,
		licence_years,
		
	};
}