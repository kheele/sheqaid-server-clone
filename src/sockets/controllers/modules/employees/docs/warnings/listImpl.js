const listImpl = require('../listImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {
        issued_by_id,
        witness_id,
        type,
        date,
    } = data;
    return listImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_warnings',
        listName: 'warning_list',
        singular: 'Warning',
        inc_fragment,
        attrs: {
            issued_by_id,
            witness_id,
            type,
            date,
        },
    });
    // console.log('data', data)
}
//</editor-fold>