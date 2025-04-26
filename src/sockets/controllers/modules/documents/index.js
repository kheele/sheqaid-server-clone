require('./categories');
require('./ohs-docs');

const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");
const {document_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const exportExcelImpl = require("../exportExcelImpl");
const createImpl = require("../createImpl");
const updateImpl = require("../updateImpl");
const {signable_doc_template_details_fragment} = require("../../default/doc-signing-settings/templates/commons");

const args = {
    name: "Documents",
    tbl: "sheq_documents",
    details_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `documents/${id}/doc`,
        key: 'doc',
    }),
};

eventManager.on(`documents/create`, async (socket, input) => {
    const fn = createImpl(args);
    const {doc_template_id} = input;
    delete input.doc_template_id;
    if (doc_template_id) {
        // const {} = input;

        return fn.apply(this, [socket, input]).then(docRes => {
            if (!docRes) return;

            // console.log(`${path}/create`, res);

            const update = updateImpl({
                name: "SignableDocTemplate",
                tbl: "signable_doc_templates",
                details_fragment: signable_doc_template_details_fragment,
                orgs_fragment: null,
            });

            const attrs = {
                id: doc_template_id,
                employee_sheq_document_id: docRes.id,
            };

            return update.apply(this, [socket, attrs]).then(res => {
                if (!res) return;

                return docRes;
            });
        });
    } else {
        const {
            doc_type,
            //0
            client_id,
            project_id,
            site_id,
            //1
            responsible_department_id,
            responsible_person_id,
            expiry,
            internal_or_external,
            category_id,
            desc,
            //2
            title,
            doc_version_list,//[{type,expiry,doc,doc_docs_id,doc_num}]
        } = input;

        return fn.apply(this, [socket, input]);
    }
});

eventManager.on("documents/update", updateImpl(args));

eventManager.on("documents/findById", findByIdImpl(args));

eventManager.on("documents/listByLogged", listImpl({
    ...args,
    details_fragment,
    order_by: "order_by: {title: asc}",
    getVariablesAndQueryConfig,
}));

eventManager.on("documents/dashboard", findByIdDashboardImpl);

eventManager.on("documents/export-excel", exportExcelImpl({
    currDir: __dirname,
    name: "Record-And-Document-Control",
    listImpl: listImpl({
        ...args,
        details_fragment,
        order_by: "order_by: {title: asc}",
        getVariablesAndQueryConfig,
    }),
    mapRow: (item, idx) => {
        let {
            id,
            data: {
                created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
                company, client, project, site,
                //
                removed,
                //1
                responsible_department,
                responsible_person,
                expiry,
                internal_or_external,
                category,
                desc,
//            doc_num, doc_rev_num
                //2
                type,
                title,
                doc,
            }
        } = item;

        client = client || company;

        return {
            idx: idx + 1,

            project: project && project.name,
            site: site && site.name,

            id,
            responsible_department: responsible_department && responsible_department.name,
            responsible_person: responsible_person && responsible_person.full_name,
            expiry: Dates.formatDateSQL(expiry),
            internal_or_external,
            category,
            desc,
            type,
            title,

            doc: doc && doc.dlUrls ? doc.dlUrls[0] : '',

            status: removed ? "Inactive" : "Active",
        };
    },
}));
