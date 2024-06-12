const listImpl = require('../listImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {
        annexture_3,
    } = data;
    return listImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_medicals',
        listName: 'medical_list',
        singular: 'Medical',
        inc_fragment,
        attrs: {
            annexture_3,
        },
    });
    // console.log('data', data)
}
//</editor-fold>