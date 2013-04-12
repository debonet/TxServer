nsConfig = {
	"fileserver" : {
		sDirRoot         : "website/",
		sPreCommand      : "cd website/; make "
	},
	aServer : {
		nPortPublic  : 3000,
		nPortPrivate : 3001
	},
};

var ns = {};

// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
ns.vaSubserviceSettings = [
	{
		s            : 'main',
		sflHandler   : "./subservices/main/fHandleMain",
		aConfig      : {},
		aRouteDefaults : {
		},
		vaRoute : [
			{
				nPort          : nsConfig.aServer.nPortPublic,
				reRestPath     : /^\/status$/,
				httpmethod     : "get",
				fHandlerMethod : "fGetStatus"
			}
		]
	},


	// Add other subservices here


	// -----------------------------------------------------------------------
	// this needs to be last because it contains catch-all reRestPath's
	{
		s             : 'fileserver',
		sflHandler    : "./subservices/fileserver/fHandleFileServer",
		aConfig       : nsConfig["fileserver"],
		aRouteDefaults : {
			nPort          : nsConfig.aServer.nPortPublic
		},
		vaRoute : [
			{
				httpmethod     : "get",
				reRestPath     : /^\/$/,
				fHandlerMethod : "fServeIndex"
			},
			{
				httpmethod     : "get",
				reRestPath     : /^(.*)$/,
				fHandlerMethod : "fServeFile"
			}
		]
	}
];


module.exports = ns;
