const {asset_basic_details_fragment, orgs_fragment, } = require("../../../../../graphql/Fragments");

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findOneAssetDocQuery {
                asset_docs(
                  where: {id: {_eq: ${id}},},
                ) {
                    id
                    created_at
                    date
                    expiry
                    removed
                    title
                    desc
                    type
                    doc
                    
                    asset{
                      ${asset_basic_details_fragment}
                      doc_list(where: {removed: {_eq: false}}){
                        id
                        expiry
                      }
                      ${orgs_fragment}
                    }
                }
            }
        `,
        operationName: "findOneAssetDocQuery",
    });
}
//</editor-fold>