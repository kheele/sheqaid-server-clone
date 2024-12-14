const listHRDocsByLoggedImpl = require('../listHRDocsByLoggedImpl');
const { inc_fragment } = require("./commons");

//<editor-fold desc="listHRDocsByLoggedImpl">
module.exports = async (socket, data) => {
    const {
        type,
        status,
        due_to,
        date_approved,
        date,

        // days_booked,
        // due_to
        // status
        // type
        // employee_comments
        // reason
        // notes
        // doc
        // date_approved
        // date
        // expiry_date
        // expiry_updated
    } = data;
    return listHRDocsByLoggedImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_leaves',
        listName: 'leave_list',
        singular: 'Leave',
        inc_fragment,
        attrs: {
            type,
            status,
            due_to,
            date_approved,
            date,
        },
    });
    // console.log('data', data)
}
//</editor-fold>