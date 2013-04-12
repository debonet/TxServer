require ('functional');
var nsFS           = require('fs');
var nsDate         = require('nsDate');
var nsExpress      = require('express');
var nsTypes        = require('nsTypes');
var nsUtilities    = require('nsUtilities');

var nsChildProcess = require("child_process");


//----------------------------------------------------------------------------
var SubserviceStatus = {
	RUNNING : "running",
	STOPPED : "stopped"
};

//----------------------------------------------------------------------------
var HttpMethod = {
	GET    : "get",
	POST   : "post",
	PUT    : "put",
  DELETE : "delete",
  DEL    : "delete"
};


//----------------------------------------------------------------------------
/*
	aSubserviceSettings: {
		s            : 'xxxyz',
		classHandler : MySubservice,
		aConfig      : {},
		aRouteDefaults : {
			nPort          : 
			reRestPath     : 
			httpmethod    : 
			fHandlerMethod : 
		},
		vaRoute : {
			nPort          : 
			reRestPath     : 
			httpmethod    : 
			fHandlerMethod : 
		}

	}
*/


//----------------------------------------------------------------------------
var TxServer = function(){
	this.aappForPort  = {};
	this.aServices    = {};
};


//----------------------------------------------------------------------------
// sends a standard, error aware response
TxServer.fSendResponse = function(res,err,x){
	if (err){
		if (err.nReturnCode){
			res.writeHead(err.nReturnCode,err.sMsg);
			I("fMakeRestRoutes","fSendResponse","http error",err);
		}
		else{
			res.writeHead(404,err.toString());
			I("fMakeRestRoutes","fSendResponse","http error",404,err);
		}

	}
	else{
		I("fMakeRestRoutes","fSendResponse","sending");
		res.json(x);
	}
	res.end();
};


//----------------------------------------------------------------------------
TxServer.prototype.fhanderForSubservice = function(sSubservice){
	if (!(sSubservice in this.aServices)){
		E("TxServer","fhanderForSubservice","unknown subservice",sSubservice);
		return null;
	}
	return this.aServices[sSubservice].handler;
};

//----------------------------------------------------------------------------
TxServer.prototype.fStartSubservices = function(
	vaSubserviceSettings, fCallback
){
	var txserver = this;
	vaSubserviceSettings.serialeach(
		function(aSubserviceSettings, n, fCallbackAsync){
			txserver.fStartSubservice(aSubserviceSettings, fCallbackAsync);
		},
		function(err){
			if (err){return fCallback(err);}
			txserver.fListen();
		}
	);
};


//----------------------------------------------------------------------------
TxServer.prototype.fappForPort = function(nPort){
	if (!(nPort in this.aappForPort)){
		var app = nsExpress.createServer();
		app.use(nsExpress.bodyParser());
		this.aappForPort[nPort] = app;
	}
	
	return this.aappForPort[nPort];
};

//----------------------------------------------------------------------------
TxServer.prototype.fListen = function(){
	this.aappForPort.each(function(app,nPort){
		app.listen(nPort);
	});
};

//----------------------------------------------------------------------------
TxServer.prototype.fStartRoute = function(
	sService, aOptions, f
){
	var app = this.fappForPort(aOptions.nPort);

	app[aOptions.httpmethod](
		aOptions.reRestPath,
		function(req, res){
			var vs;

			if (aOptions.bNoSplit){
				vs = req.params;
			}
			else{
				vs = req.params.length?req.params[0].split('/'):[];
				if (vs.length === 1 && vs[0] === ''){
					vs = [];
				}
			}

			if (aOptions.bExpressAware){
				f(
					req,
					res,
					function(err){
						I("TxServer","fStartRoute","handled request",sService,vs,err);
					}
				);
			}
			else{
				if (aOptions.httpmethod === "get" || aOptions.httpmethod === "delete"){
					f(
						vs,
						function(err,x){
							I("TxServer","fStartRoute","handled request",sService,vs,err);
							TxServer.fSendResponse(res,err,x);
						}
					);
				}
				else{
					f(
						vs,
						req.body,
						function(err,x){
							I("TxServer","fStartRoute","handled request",sService,vs,err);
							TxServer.fSendResponse(res,err,x);
						}
					);
				}
			}
		}
	);
};

//----------------------------------------------------------------------------
TxServer.prototype.fStartSubservice = function(aSubserviceSettings, fCallback){
	var aRouteDefaults = aSubserviceSettings.aRouteDefaults;
	var txserver   = this;
	var fHandler    = require(aSubserviceSettings.sflHandler);

	fHandler(
		aSubserviceSettings.aConfig || {},
		function(err, handler){
			if (err){return fCallback(err);}
		
			var vaRouteUsed = [];

			I("TxServer","fStartSubservice","starting subservice",aSubserviceSettings.s);
			aSubserviceSettings.vaRoute.each(function(aRoute){

				var aRouteUse = aRouteDefaults.foMerge(aRoute);
				aRouteUse.bExpressAware = handler.bExpressAware;

				txserver.fStartRoute(
					aSubserviceSettings.s,
					aRouteUse,
					function (){
						var f = handler[aRouteUse.fHandlerMethod];
						f.apply(handler, arguments);
					}
				);

				I(
					"TxServer","fStartSubservice","starting route",
					aSubserviceSettings.s, aRouteUse.fHandlerMethod, aRouteUse.httpmethod,aRouteUse.nPort
				);
				vaRouteUsed.push(aRouteUse);
			});

			var s = aSubserviceSettings.s;
			txserver.aServices[s] = {};
			txserver.aServices[s].status = SubserviceStatus.RUNNING;
			txserver.aServices[s].vaRoute = vaRouteUsed;
			txserver.aServices[s].handler = handler;
			fCallback(null);
		},
		this
	);
};



//----------------------------------------------------------------------------
TxServer.prototype.fGetStatus = function(vs,fCallback){
	switch (vs.length){
	case 0:
		var aStatus = this.aServices.map(function(a,sService){
			return a.status;
		});

		fCallback(null, aStatus);
		return;
		
	case 1:
		fCallback(null, this.aServices[vs[0]].status);
		return;

	default:
		fCallback("unknown service");
		return;
	}
};




module.exports=TxServer;
