const listHRDocsByLoggedImpl = require('../listHRDocsByLoggedImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listHRDocsByLoggedImpl">
module.exports = async (socket, data) => {
    const {
        responsible_person_id,
        types,
        reasons,
    } = data;
    return listHRDocsByLoggedImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_counsellings',
        listName: 'counselling_list',
        singular: 'Counselling',
        inc_fragment,
        attrs: {
            responsible_person_id,
            types,
            reasons,
        },
    });
    // console.log('data', data)
}
//</editor-fold>