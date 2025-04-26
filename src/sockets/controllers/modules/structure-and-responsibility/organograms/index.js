const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require('../../listByLoggedImpl');
const {organogram_details_fragment} = require("./commons");
const updateImpl = require("../../updateImpl");
const {getVariablesAndQueryConfig} = require("../../../general/sites/commons");
const {employee_personal_details_fragment} = require("../../../../../graphql/Fragments");
const {createOrganogram} = require("./create");

const args = {
    name: "Organogram",
    tbl: "sheq_organograms",
    details_fragment: organogram_details_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `organograms/${id}/organogram-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
        key: 'doc',
    }),
    getVariablesAndQueryConfig,
};

const path = "structure-and-responsibility/organograms";

eventManager.on(`${path}/create`, createOrganogram);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/listTeamBySupervisorId`, async (socket, supervisor_id) => {
    if (!supervisor_id) return;

    const listByLogged = listByLoggedImpl({
        name: "ProxyEmployeeOrganogram",
        tbl: "proxy_employee__organogram",
        details_fragment: `
            id
            team{
                id
                name
                status
                supervisor{
                    ${employee_personal_details_fragment}
                }
                employee_list{
                    ${employee_personal_details_fragment}
                }
            }
            employee_list{
                id
                employee{
                    ${employee_personal_details_fragment}
                }
            }
        `,
        orgs_fragment: null,
        where: ({data, filters}) => {
            const {
                supervisor_id
            } = data;

            // let {filter} = filters;

            return `
                employee_reported_to_id:{_eq: ${supervisor_id}}, 
                _or:[
                    {team_id:{_is_null: false}},
                    {employee_list_aggregate: {count: {predicate: {_gt: 0}}}}
                ]
            `;
        },
    });

    return listByLogged(socket, {supervisor_id}).then(res => {
        return res.map((
            {
                data: {
                    team,
                    employee_list
                }
            }
        ) => team ? team.employee_list : employee_list.map(({employee}) => employee));
    });
});

// PostgreSQL Tables for PPE Forms
// -- PPE Items Table: Tracks individual items
// done: table ppe_items (
//     id bigint primary key generated always as identity,
//     ppe_inventory_id bigint references ppe_inventory(id) on delete cascade, -- Links to inventory
//     supplier_id bigint references ppe_suppliers(id), -- Link to supplier
//     serial_number text unique,                   -- Serial number or barcode
//     purchase_date date,
//     condition text,                              -- e.g., New, Good, Damaged
//     status text default 'Available'              -- e.g., Available, Issued, Lost
// );

// done: table ppe_suppliers (
//     id bigint primary key generated always as identity,
//     name text not null,                -- Supplier name
// contact_person text,               -- Contact person
// phone_number text,                 -- Contact number
// email text,                        -- Email address
// address text                       -- Address
// );

// -- 1. PPE Inventory Form
// done: table ppe_inventory (
//     id bigint primary key generated always as identity,
//     ppe_type_id bigint references ppe_types(id), -- Links to the type of PPE
//     quantity int not null,                       -- Total stock of this type
//     reorder_threshold int,
//     location text,                               -- Where the stock is stored
//     added_date date default current_date,
//     last_updated timestamp default current_timestamp
// );
//
// -- 1. PPE Requisition Form
// done: table ppe_requisitions (
//     id bigint primary key generated always as identity,
//     employee_id bigint references hr_employees(id),
//     ppe_type_id bigint references ppe_types(id),
//     quantity int,
//     reason text,
//     approval_status text,
//     auto_reorder_trigger boolean default false,
//     created_at timestamp default current_timestamp
// );
//
// -- 2. PPE Issuance Form
// done: table ppe_issuances (
//     id bigint primary key generated always as identity,
//     employee_id bigint references hr_employees(id),
//     ppe_item_id bigint references ppe_items(id),
//     issue_date date,
//     task text,
//     issuer_signature jsonb,
//     receiver_signature jsonb
// );
//
// -- 3. PPE Return Form
// done: table ppe_returns (
//     id bigint primary key generated always as identity,
//     employee_id bigint references hr_employees(id),
//     ppe_item_id bigint references ppe_items(id),
//     condition text,
//     return_date date,
//     signature jsonb
// );
//
// -- 5. PPE Inspection Checklist Form
// done: table ppe_inspections (
//     id bigint primary key generated always as identity,
//     ppe_item_id bigint references ppe_items(id),
//     inspection_date date,
//     condition text,
//     issues text,
//     inspector_name text
// );
//
// // Other forms would follow similar schemas...