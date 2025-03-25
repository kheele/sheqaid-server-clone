const createImpl = require("../../createImpl");
const {details_fragment} = require("./commons");

const args = {
    name: "QuestionMessage",
    tbl: "default_contractor_questionnaires_messages",
    details_fragment,
    orgs_fragment: null,
};

//<editor-fold desc="createQuestionMessage">
exports.createQuestionMessage = async (socket, input) => {
    const create = createImpl(args);

    const {
        date,
        msg,
        read,
        sender_id,
    } = input;

    const loggedUser = await socket.getLoggedUser();
    if(!loggedUser) return;
    const { user:{id: user_id}, company:{id: company_id}} = loggedUser;
    input.logged_user_id = user_id;

    return create(socket, input);
};
//</editor-fold>
