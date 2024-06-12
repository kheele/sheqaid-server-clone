eventManager.on("contractors/template-categories/listByLogged", async (socket, data) => {
	return listGraphQL({
		query: `
	    query ContractorTemplateCategories {
	      default_contractor_questionnaire_templates(
	        where: {category: {_is_null: false}},
		      order_by: {category: asc},
		      distinct_on: category
	      ) {
          category
	      }
	    }
		`,
		operationName: `ContractorTemplateCategories`,
	}).then(res => res.map(({category}) => category));
});
//
