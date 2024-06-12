class ACntr {

	constructor(root) {
		eventManager.add(root, this);
		this.root = root;

		this.addAction = this.addAction.bind(this);
	}

	addAction(name, fn) {
		const {root} = this;
		eventManager.on(root + name, fn);
	}

	async whenLoggedIn(socket) {
		if (socket.auth.uid) {
			const {auth: {uid, token: {name, picture, email}}} = socket;
			let doc_ref = await db.collection('default_users').doc(uid);
			const snapshot = await doc_ref.get();
			if (!snapshot.exists) {
				return null;
			}
			const db_user = {id: snapshot.id, data: snapshot.data()};
			//company_name, company_phone, country, zone
			let db_company = await db.collection('default_companies').doc(db_user.data.company_id).get();

			const company_data = db_company.data();
			company_data.created_at = company_data.created_at.toDate();

			db_company = {id: db_company.id, data: company_data};
			const loggedUser = {user: db_user, company: db_company};
//            const loggedUser = {user: db_user, company: db_company, access_type: 'User'};

			return loggedUser;
		} else {
			throw new Error('Not authenticated');
		}
	}

}

global.ACntr = ACntr;