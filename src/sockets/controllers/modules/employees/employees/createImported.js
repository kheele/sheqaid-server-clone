const {createEmployee} = require("./create");
const {checkExistByUsername} = require("./query_employees");

//<editor-fold desc="createEmployeeImported">
exports.createEmployeeImported = async (socket, list) => {
    const dups = (await Promise.all(list.map(async ({email, phone}) => {
        if (!email && !phone) return;
        let existingUser;
        if(email && !phone) {
            existingUser = await checkExistByUsername(socket, email);
        } else if(phone && !email) {
            existingUser = await checkExistByUsername(socket, phone);
        } else if(email && phone) {
            existingUser = await checkExistByUsername(socket, email);
            if (!existingUser || !existingUser.id) {
                existingUser = await checkExistByUsername(socket, phone);
            }
        }

        if (existingUser && existingUser.id) {
            return {id: existingUser.id, email, phone};
        }
    }))).filter(v => !!v);

    if (dups.isNotEmpty()) {
        return {
            dups_email: dups.map(({email}) => list.find(v => v.email === email)),
            dups_phone: dups.map(({phone}) => list.find(v => v.phone === phone)),
        };
    }

    return await Promise.all(list.map(async data => {
        return await createEmployee(socket, data);
    }));
};
//</editor-fold>
