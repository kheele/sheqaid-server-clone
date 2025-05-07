const createImpl = require("../../createImpl");
const {training_course_details_fragment} = require("./commons");
const {listByCompanyIdClients} = require("../../../general/clients/query_clients");

const args = {
    name: "Courses",
    tbl: "sheq_training_courses",
    details_fragment: training_course_details_fragment,
};

//<editor-fold desc="createCourse">
exports.createCourse = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const create = createImpl(args);

    const {
        name,
        frequency,
        provider,
        unit_standard,
        unit_standard_desc,
        sector_list,
        job_position_list,
        client_id,
        project_id,
        site_id,
    } = input;

    if(!client_id) {
        const decodedIdToken = await socket.getDecodedIdToken();
        if (!decodedIdToken) return;

        const {
            company_id,
            my_client,
            my_project,
            my_site,
            contractor_id,

            selected_client_id,
            selected_project_id,
            selected_site_id,
            logged_contractor_id,

            selected_contractor_client_id,
            selected_contractor_site_id,

            // access_type,
            // loggedUser: {user: {id: user_id}},
        } = decodedIdToken;

        const {isConsultant} = is;
        if(isConsultant) {
            const clients = await listByCompanyIdClients(company_id);
            const list = await Promise.all(clients.map(async (v) => {
                const _input = {...input, client_id: v.id};
                return await create(socket, _input);
            }));

            return list.find(v => v.data.client.id === selected_client_id);
        }
    }

    return await create(socket, input);
};
//</editor-fold>
