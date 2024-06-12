const listImpl = require('../listImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {
        type,
        competency_type,
        course_id,
        issued_date,
    } = data;
    return listImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_competencies',
        listName: 'competency_list',
        singular: 'Competency',
        inc_fragment,
        attrs: {
            type,
            competency_type,
            course_id,
            issued_date,
        },
    });
    // console.log('data', data)
}
//</editor-fold>