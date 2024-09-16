const listImpl = require("../../../../sockets/controllers/modules/listImpl");

exports.run = async () => {
    const list = listImpl({
        name: "Expenses",
        tbl: "hr_employees_docs_expenses",
        skipRemoved: true,
        details_fragment: `
            id
            employee_id
            doc
        `,
        order_by: `
            order_by: {id: asc}
        `,
        orgs_fragment: null,
    });

    const run = (n) => {
        list(null, {limit: 1, offset: 0 + n}).then(async res => {
            Promise.all(res.filter(({data: {doc}}) => !!doc && doc.buffer).map(async item => {
                const {id, data: {employee_id, doc}} = item;
                // let path = Object.getValueByPath(doc, paths);
                // if (!path || !path.buffer) return;
                console.log(id, doc.contentType, !!doc.buffer);
                // let path = doc.path && doc.path.path && doc.path.path.path && doc.path.path.path.path;
                // delete doc.path;
                // console.log(id, doc.isPDF, isString(path));
                // let buffer;
                // if (path.buffer) {
                //     buffer = path.buffer;
                // } else {
                //     buffer = Buffer.from(path);
                // }

                // doc.buffer = buffer;
                // doc.contentType = doc.isPDF ? 'application/pdf' : path.split(';')[0].split(':')[1];

                // console.log(id, !!buffer, doc.contentType);

                // return;

                const new_name = `employees/${employee_id}/docs/expenses/${id}/Expense-doc-${Dates.formatTimestamp(new Date())}`;
                return await uploadFilesUpdate({
                    id,
                    doc,
                    new_name,
                    onUpdate: async ({id, ...attrs}) => {
                        delete attrs.id;

                        await updateRelay({
                            mutation: `
                                mutation updateEmployeeExpenseMutation($id: hr_employees_docs_expenses_pk_columns_input!, $_set: hr_employees_docs_expenses_set_input!) {
                                  update_hr_employees_docs_expenses_by_pk(pk_columns: $id, _set: $_set) {
                                    id
                                  }
                                }
						    `,
                            operationName: "updateEmployeeExpenseMutation",
                            id,
                            attrs,
                        });
                    }
                });
            })).then(res => {
                console.log('res done', res);
                run(n + 1);
            });
        });
    };
    run(1,);
    // run(1, 'path.path.path');
};