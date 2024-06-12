const listImpl = require('../listImpl');
const { inc_fragment } = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {
        category,
        date,
        amount,
        status,
        currency_country_id,
        paid_with,
        comments,
        date_submitted,
        date_approved,
        date_compensated,
    } = data;
    return listImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_expenses',
        listName: 'expense_list',
        singular: 'Expense',
        isExpense: true,
        inc_fragment,
        attrs: {
            category,
            date,
            amount,
            status,
            currency_country_id,
            paid_with,
            comments,
            date_submitted,
            date_approved,
            date_compensated,
        },
    });
    // console.log('data', data)
}
//</editor-fold>
