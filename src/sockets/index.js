require('./client-sockets');

const {Server} = require("socket.io");
const {createShardedAdapter, createAdapter} = require("@socket.io/redis-adapter");
// const {createAdapter } = require("@socket.io/redis-streams-adapter");

const controllers = require("./controllers");
//api/accounts/sign: add catch and throw: 177

exports.start = async ({server, corsOptions, getRedisClient, sessionMiddleware, helmetMiddleware}) => {
    // Handle server errors
    server.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        switch (error.code) {
            case 'EACCES':
                console.error(`Port ${process.env.PORT} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`Port ${process.env.PORT} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

    server.on('listening', () => {
        console.log('Server is now listening');
    });

    const {pubClient, subClient} = getRedisClient();

    await Promise.all([
        pubClient.connect(),
        subClient.connect()
    ]);

    global.io = new Server(server, {
        adapter: createAdapter(pubClient, subClient),
        // adapter: createShardedAdapter(pubClient, subClient),
        maxHttpBufferSize: 10e8, // 1000 MB
        cors: corsOptions,
        transports: ['websocket'],
        connectionStateRecovery: {
            // the backup duration of the sessions and the packets
            maxDisconnectionDuration: 2 * 60 * 1000,
            // whether to skip middlewares upon successful recovery
            skipMiddlewares: false,
        }
    });

    io.engine.use(helmetMiddleware);
    io.engine.use(sessionMiddleware);

    io.use((socket, next) => {
        if(!socket.getAuth) {
            socket.getAuth = getAuth.bind(socket);
        }
        if(!socket.injectCreate) {
            socket.injectCreate = injectCreate.bind(socket);
        }
        if(!socket.orgsFilter) {
            socket.orgsFilter = orgsFilter.bind(socket);
        }
        next();
    });

    io.use(async (socket, next) => {
        console.log("io.use socket.injectCreate", !!socket.injectCreate);
        console.log("io.use socket.orgsFilter", !!socket.orgsFilter);
        const res = await setAuthDecodedIdTokenBySocket(socket);
        console.log("io.use", res);
        if (res === "UNAUTHORIZED") {
            return;
        }

        next();
    });

    io.on('connection', (socket) => {
        // const {auth} = socket.handshake;
        const {session} = socket.request;
        // console.log(session);

        const sessionId = session.id;
        // the session ID is used as a room
        socket.join(sessionId);

        console.log('user connected', socket.id, sessionId);

        socket.on("disconnect", () => {
            // controllers.destroy();
            console.log('user disconnected', socket.id, sessionId);
        });

        // socket.use((__, next) => {
        // 	session.reload((err) => {
        // 		// WARNING! "session" still points towards the previous session object
        // 		if (err) {
        // 			console.log('socket reload err:', err);
        // 			// forces the client to reconnect
        // 			// socket.conn.close();
        // 			// you can also use socket.disconnect(), but in that case the client
        // 			// will not try to reconnect
        // 		}
        //
        // 		next();
        // 	});
        // });

        controllers.start(socket);
    });
};

function injectCreate(input, skipOrgs = false) {
    if (!input) return;

    const {session} = this.request;

    const {
        company_id,
        my_client,
        my_project,
        my_site,
        contractor_id,

        selected_client_id,
        selected_project_id,
        selected_site_id,
        logged_contractor_id,

        // access_type,
        loggedUser: {user: {id: user_id}},
    } = session.decodedIdToken || {};

    const {
        isConsultant,
        isContractor,
        isNoProjects,
    } = session.decodedIdToken || {};

    const {
        client_id,
        project_id,
        site_id,
    } = input;

    if (isContractor) {
        input.contractor_user_id = user_id;
    } else {
        input.user_id = user_id;
    }

    if (skipOrgs) return;

    if (isContractor) {
        input.contractor_id = contractor_id || logged_contractor_id;
        input.company_id = 38;//TODO: THIS IS A HACK. THE COMPANY WITH THIS ID WAS CREATED ONLY TO ASSIGN CONTRACTORS DATA TO THE COMPANY. BECAUSE PGSQL THROWS NON-NULL ERROR.
        return;
    }

    input.company_id = company_id;

    if (my_site) {
        input.site_id = my_site.id;
    } else if (isConsultant) {
        if (site_id || selected_site_id) {
            input.site_id = site_id || selected_site_id;
        }
    } else if (!isNoProjects) {
        if (site_id || selected_site_id) {
            input.site_id = site_id || selected_site_id;
        }
    }

    if (my_project) {
        input.project_id = my_project.id;
    } else if (isConsultant) {
        if (project_id || selected_project_id) {
            input.project_id = project_id || selected_project_id;
        }
    } else if (!isNoProjects) {
        if (project_id || selected_project_id) {
            input.project_id = project_id || selected_project_id;
        }
    }

    if (my_client) {
        input.client_id = my_client.id;
    } else if (isConsultant) {
        if (client_id || selected_client_id) {
            input.client_id = client_id || selected_client_id;
        }
    }
}

function orgsFilter(orgs) {
    // console.log("orgsFilter", orgs);
    let {
        site_id,
        project_id,
        client_id,
        incContractors = false,
        excContractors = false,
        excCompany = false,
        exact_orgs = false,
        exact_orgs_company = false,
        contractor_site_id_key = "site_id",
    } = orgs || {};

    // console.log("orgsFilter2", orgs);
    if(excCompany) return [];

    const {session} = this.request;
    const {decodedIdToken} = session;

    if(!decodedIdToken) return;

    const {
        company_id,
        my_client,
        my_project,
        my_site,
        contractor_id,

        selected_client_id,
        selected_project_id,
        selected_site_id,
        logged_contractor_id,

        selected_contractor_client_id,
        selected_contractor_site_id,
    } = decodedIdToken;

    console.log("orgsFilter session decodedIdToken selected_client_id", selected_client_id);

    const {
        isConsultant,
        isContractor,
        isNoProjects,
    } = decodedIdToken;

    const hasProjects = !isNoProjects;

    client_id = client_id ? client_id : selected_client_id;
    project_id = project_id ? project_id : selected_project_id;
    site_id = site_id ? site_id : selected_site_id;

    //<editor-fold desc="variables, filters">
    const filter = [];
    if (isContractor) {
        if (logged_contractor_id) {
            filter.push(`contractor_id: {_eq: ${logged_contractor_id}}`);
        }
        if (selected_contractor_site_id) {
            filter.push(`contractor_site_id: {_eq: ${selected_contractor_site_id}}`);
        } else if (selected_contractor_client_id) {
            filter.push(`contractor_site: {client_id: {_eq: ${selected_contractor_client_id}}}`);
        }
        return filter;
    } else {
        if (!excContractors && (logged_contractor_id || selected_contractor_site_id)) {
            if (logged_contractor_id) {
                filter.push(`contractor_id: {_eq: ${logged_contractor_id}}`);
            }
            if (selected_contractor_site_id) {
                filter.push(`contractor_site_id: {_eq: ${selected_contractor_site_id}}`);
            } else if (selected_contractor_client_id) {
                filter.push(`contractor_site: {client_id: {_eq: ${selected_contractor_client_id}}}`);
            }
            return filter;
        }
    }

    if (company_id) {
        filter.push(`company_id: {_eq: ${company_id}}`);
    }

    let qIncContractors;
    if (incContractors) {
        let q = '';
        if (client_id) {
            q = `, client_id: {_eq: ${client_id}}`;
        }
        qIncContractors = `{contractor: {company_id: {_eq: ${company_id}}${q}}},`;
    }

    const site_id_fn = (site_id) => {
        if (site_id && !exact_orgs_company) {
            if (my_site || exact_orgs) {
                return `, ${contractor_site_id_key}: {_eq: ${site_id}}`;
            } else {
                return `, _or: [
					{${contractor_site_id_key}: {_eq: ${site_id}}},
					{${contractor_site_id_key}: {_is_null: true}}
				]`;
            }
        }
        return ``;
    };
    const project_id_fn = (project_id, isConsultant) => {
        if (isConsultant) {
            if (project_id && !exact_orgs_company) {
                if (my_project || exact_orgs) {
                    return `, _or: [
					{
						project_id: {_eq: ${project_id}} 
						${site_id_fn(site_id)}
				  }
				]`;
                } else {
                    return `, _or: [
           {
            project_id: {_eq: ${project_id}} 
						${site_id_fn(site_id)}
				   },
				   {project_id: {_is_null: true}}
        ]`;
                }
            }
            return ``;
        }

        if (my_project || exact_orgs) {
            return `, {
						project_id: {_eq: ${project_id}} 
						${site_id_fn(site_id)}
				}`;
        } else {
            return `, {
					_or: [
            {
              project_id: {_eq: ${project_id}} 
							${site_id_fn(site_id)}
				  	},
				  	{project_id: {_is_null: true}}
				  ]
        }`;
        }
    };

    if (isConsultant) {
        if (client_id) {
            if (my_client || exact_orgs) {
                filter.push(`_or: [
					${qIncContractors ? `${qIncContractors},` : ''}
					{
					  client_id: {_eq: ${client_id}}
					  ${project_id_fn(project_id, isConsultant)}
					}
				]`);
            } else {
                filter.push(`_or: [
					${qIncContractors ? `${qIncContractors},` : ''}
					{
					  client_id: {_eq: ${client_id}}
					  ${project_id_fn(project_id, isConsultant)}
					}, 
					{client_id: {_is_null: true}}
				]`);
            }
        }
    } else {
        if (hasProjects) {
            if (project_id && !exact_orgs_company) {
                filter.push(`_or: [
					${qIncContractors ? `${qIncContractors},` : ''}
					${project_id_fn(project_id, isConsultant).replace(', _or', '_or')}
		    ]`);
            }
        } else if (qIncContractors) {
            filter.push(`_or: [
				${qIncContractors}
	    	]`);
        }
    }
    //</editor-fold>

    // console.log("orgsFilter filter", filter);
    return filter;
}

async function getAuth(token) {
    if(token) {
        const decodedIdToken = await admin.auth().verifyIdToken(token);
        if(!decodedIdToken) return;
        let {
            sub,
            access_type,
        } = decodedIdToken;
        console.log("getAuth from_client_token access_type sub token decodedIdToken", access_type, sub, token, decodedIdToken);

        return {token, user_auth_id: sub, user_access_type: access_type};
    }

    const {request:{session}, handshake: {auth}} = this;

    if(!session) return;
    if(!auth) return;

    const {decodedIdToken} = session;
    if(!decodedIdToken) return;

    token = auth.token;
    if(!token) return;

    let {
        sub,
        access_type,
    } = decodedIdToken;
    if(isFunction(sub)) {
        sub = sub();
    }

    console.log("getAuth from_session access_type sub token decodedIdToken", access_type, sub, token, decodedIdToken);

    return {token, user_auth_id: sub, user_access_type: access_type};
}
