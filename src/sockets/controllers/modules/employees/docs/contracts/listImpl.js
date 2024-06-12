const listImpl = require('../listImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {
        contract_type,
        payment_type,
        salary_interval,
    } = data;
    return listImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_contracts',
        listName: 'contract_list',
        singular: 'Contract',
        inc_fragment,
        attrs: {
            contract_type,
            payment_type,
            salary_interval,
        },
        isContract: true,
    });
    // console.log('data', data)
}
//</editor-fold>