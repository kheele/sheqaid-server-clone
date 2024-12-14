//<editor-fold desc="getDetailsFragment">
module.exports = async ({socket, data, details_fragment}) => {
    if(isFunction(details_fragment)) {
        return details_fragment(socket, data);
    }

    return details_fragment;
};
//</editor-fold>
