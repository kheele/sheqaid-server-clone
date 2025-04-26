const findByIdImpl = require('../../findByIdImpl');
const exportExcelImpl = require("../../exportExcelImpl2");
const {mapExportRow} = require("./investigations_funcs");
const {getVariablesAndQueryConfig, incident_investigation_details_fragment} = require("./commons");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
	name: "IncidentInvestigations",
	tbl: "sheq_incident_investigation",
	details_fragment: (socket, data) => `
		id
        group
        incident_date
        short_desc
        location
        exact_location
        #
        category_list{
        	category{
            	id
            	name
        	}
        }
        sub_category_list{
        	sub_category{
            	id
            	name
            	category{
                	id
                	name
            	}
        	}
        }
        sector_list{
        	id
        	sector{
            	id
            	name
        	}
        }
        activity_list{
        	id
        	activity{
            	id
            	name
            	sector{
                	id
                	name
            	}
        	}
        }
        investigation{
        	${incident_investigation_details_fragment}
        }
	`,
	order_by: `order_by: {incident_date: desc}`,
	getVariablesAndQueryConfig,
	where: ({data, filters}) => {
		let {filter} = filters;

		return `
       		removed: {_eq: false},
			investigation_id: {_is_null: false},
			${filter}
        `;
	},
};

const path = 'incidents/investigations';

eventManager.on(`${path}/findById`, findByIdImpl({
	...args,
	tbl: "sheq_incident_investigation_investigations",
	details_fragment: incident_investigation_details_fragment,
}));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	currDir: __dirname,
	mapRow: mapExportRow,
}));
