eventManager.on("orgs/updateSession", async (socket, {idToken}) => {
	console.log('updateSession idToken', idToken)
	if(idToken.startsWith('NaN')) {
		return "RETRY";
	}
	
	return admin.auth().verifyIdToken(idToken).then((decodedToken) => {
		socket.request.session.decodedIdToken = decodedToken;
		socket.request.session.save();
	});
});

eventManager.on("orgs/login", async (socket, {data, idToken}) => {
	if (data.orgs_filter) {
		delete data.orgs_filter;
	}
	console.log('login data & idToken', data, idToken)
	if(idToken.startsWith('NaN')) {
		return "RETRY";
	}

	return updateClaims(socket, {data, idToken});
});

eventManager.on("orgs/logout", async (socket, {data, idToken}) => {
	if (data.orgs_filter) {
		delete data.orgs_filter;
	}
	console.log('logout data & idToken', data, idToken)
	if(idToken.startsWith('NaN')) {
		return "RETRY";
	}
	
	return updateClaims(socket, {data, idToken});
});


async function updateClaims(socket, {data, idToken}) {
	return admin.auth().verifyIdToken(idToken).then((decodedToken) => {
		const {uid} = decodedToken;
		const {
			selected_client_id,
			selected_project_id,
			selected_site_id,
			
			logged_contractor_id,
			selected_contractor_client_id,
			selected_contractor_site_id,
		} = data;
		return addCustomUserClaims(uid, data);
	});
}
