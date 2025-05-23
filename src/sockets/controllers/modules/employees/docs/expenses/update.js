const updateImpl = require("../../../updateImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: "Expense",
    tbl: "hr_employees_docs_expenses",
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/expenses/${id}/Expense-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
        key: 'doc',
    }),
};

//<editor-fold desc="updateExpense">
exports.updateExpense = async (socket, attrs) => {
    const update = updateImpl(args);

    const {
        id,

        category,
        currency_country_id,
        paid_with,
        date,
        amount,
        comments,
        doc,

        employee_id,
    } = attrs;

    return update(socket, attrs);
};
//</editor-fold>
