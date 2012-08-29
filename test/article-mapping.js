var ElasticSearchClient = require('elasticsearchclient');


var SERVER_OPTIONS = {
  host: 'localhost',
  port: 9200
};

var documentMapping = 
{
    "articles": {
        "properties" : {
            "title" : {
                "type" : "string",
                "index" : "analyzed"
            },
            "text" : {
                "type" : "string",
                "index" : "analyzed",
                "store" : "yes",
                "term_vector" : "yes"
            },
            "sections": {
              "type" : "string",
              "store" : "yes",
              "index_name" : "section",
              "analyzer" : "keyword"
            },
            "tags": {
                "type" : "string",
                "store" : "yes",
                "index_name" : "tag",
                "analyzer" : "keyword"
            },
            "fee" : {
                "type" : "string"
            },
            "url" : {
                "type" : "string"
            },
            "date" : {
                "type" : "date",
                "format" : "YYYYMMdd"
            }
        }
    }
};

var elasticSearchClient = new ElasticSearchClient(SERVER_OPTIONS);
elasticSearchClient.putMapping('search-prototype', 'articles', documentMapping)
    .on('data', function(data) {
        console.log(JSON.parse(data))
    })
    .on('error', function(error){
        console.log(error)
        })
    .exec();




