const listHRDocsByLoggedImpl = require('../listHRDocsByLoggedImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listHRDocsByLoggedImpl">
module.exports = async (socket, data) => {
    const {
        fitness_option,
        annexture_3,
    } = data;
    return listHRDocsByLoggedImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_medicals',
        listName: 'medical_list',
        singular: 'Medical',
        inc_fragment,
        attrs: {
            fitness_option,
            annexture_3,
        },
    });
    // console.log('data', data)
}
//</editor-fold>