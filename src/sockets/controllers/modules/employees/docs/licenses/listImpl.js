const listImpl = require('../listImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {
        notes,
        date,
    } = data;
    return listImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_licenses',
        listName: 'license_list',
        singular: 'License',
        inc_fragment,
        attrs: {
            notes,
            date,
        },
    });
    // console.log('data', data)
}
//</editor-fold>