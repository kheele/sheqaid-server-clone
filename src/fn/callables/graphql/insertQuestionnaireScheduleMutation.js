
exports.mutation = `
  mutation insertQuestionnaireScheduleMutation($object: default_contractor_questionnaires_schedules_insert_input!) {
    insert_default_contractor_questionnaires_schedules_one(
      object: $object
    ) {
      id
      questionnaire_id
			date
			time
			interval
			completed
			date_completed
			time_completed
    }
  }
`;

