var ElasticSearchClient = require('elasticSearchClient');

function createClient(options){
	if (!options)
		options = {
			server: {
        host: 'localhost',
			    port: 9200
			},
			indexName : 'search-prototype'
		};
	return new DocumentIndexer(options);
}

exports.createClient = createClient;
exports.DocumentIndexer = DocumentIndexer;

function DocumentIndexer(options){
  	this.elasticSearchClient = new ElasticSearchClient(options.server);
  	this.indexName = options.indexName;
  	this.mappingName = 'articles';
};

DocumentIndexer.prototype.addDocument = function(docObject, callback){
	this.elasticSearchClient.index(this.indexName, this.mappingName, docObject)
		.on('data', function (data){
			console.log(data);
			var result = JSON.parse(data);
			if (!result.ok)
				callback(result.error);
			else
				callback(null);
		})
		.on('error', function(error){
			callback(error);
		})
		.exec();
};