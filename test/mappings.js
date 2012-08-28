var ElasticSearchClient = require('elasticsearchclient');

var INDEX_NAME = 'search-prototype';
var SERVER_OPTIONS = {
  host: 'localhost',
  port: 9200
};


var personMapping = 
{
    "people": {
        "properties" : {
            "name" : {
                "type" : "string",
                "index" : "analyzed"
            },
            "tag_line" : {
                "type" : "string",
                "index" : "analyzed"
            },
            "location" : {
                "type" : "geo_point"
            },
            "connections" : {
                "type" : "integer",
                "null_value" : 0
            },
            "regions" : {
                "type" : "string",
                "index_name" : "region",
                "analyzer" : "keyword"
            },
            "issues" : {
                "type" : "string",
                "index_name" : "issue",
                "analyzer" : "keyword"
            }
        }
    }
};

var elasticSearchClient = new ElasticSearchClient(SERVER_OPTIONS);

elasticSearchClient.putMapping(INDEX_NAME, 'people', personMapping)
    .on('data', function(data) {
        console.log(JSON.parse(data))
    })
    .on('error', function(error){
        console.log(error)
        })
    .exec();



