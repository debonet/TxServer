require ('logging');

var nsChildProcess = require("child_process");
var nsFS           = require('fs');
var nsDate         = require('nsDate');

//----------------------------------------------------------------------------
// simple little fileserver
var FileServer = function(aConfig){
	this.aConfig = aConfig;
};

//----------------------------------------------------------------------------
FileServer.prototype.bExpressAware = true;

//----------------------------------------------------------------------------
FileServer.prototype.fServeIndex = function(req,res,fCallback){
	var sDirRoot = this.aConfig.sDirRoot;
	if (this.aConfig.sPreCommand){
		nsChildProcess.exec(this.aConfig.sPreCommand, function(sErr,sStdOut,sStdErr){
			var sfl = sDirRoot + "index.html";
			res.sendfile(sfl);
			fCallback(null);
		});
	}
	else{
			var sfl = sDirRoot + "index.html";
			res.sendfile(sfl);
			fCallback(null);
	}

};



//----------------------------------------------------------------------------
FileServer.prototype.fServeFile = function(req,res,fCallback){
	var sDirRoot = this.aConfig.sDirRoot;
	var sfl = sDirRoot + req.params[0];

	nsFS.stat(sfl,function(err,stat){
		res.contentType(sfl);
		if (err || !stat.isFile()){
			return res.end();
		}
		res.sendfile(sfl);

		fCallback(null);
	});
};

module.exports = function(aConfig,fCallback){
	fCallback(null, new FileServer(aConfig));
};







