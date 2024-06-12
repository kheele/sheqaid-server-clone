const findByIdImpl = require("../findByIdImpl");
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return findByIdImpl({
        socket,
        id,
        tbl: 'hr_employees_docs_medicals',
        singular: 'Medical',
        inc_fragment,
    });
}
//</editor-fold>