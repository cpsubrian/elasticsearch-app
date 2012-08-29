var request = require('request');
var documentIndexer = require('./documentIndexer');

var apiKey='c38203111a02f9113aa9a5e5730d235a:12:66509815';
var categories = ['World', 'U.S.', 'Politics', 'Business', 'Technology', 'Sports'
, 'Science', 'Health', 'Arts', 'Style'];
var indexer = documentIndexer.createClient();

var searchCategory = function(category, startDate, endDate, callback){
	var uri = 'http://api.nytimes.com/svc/search/v1/article?query='
	+ 'nytd_section_facet:[' + category + ']&fields=title,nytd_section_facet,des_facet,date,url,fee,body&begin_date='
    +startDate+'&end_date='+endDate+'&api-key='+apiKey;

	request(uri, function (error, response, body){
		if(error) callback(error, null);
		if(body.trim().length>0){
			var results = (JSON.parse(body)).results;
			callback(null, results);
		}else{
			callback(null, []);
		}
	});
};

var indexResults = function(err, results){
  if(err)
    throw err;
  results.forEach(function(result){
    var tags_correct_case = []
    for(var idx in result.des_facet){
      var tag = result.des_facet[idx].toLowerCase();
      var words = tag.split(' ');
      var correct_case = '';
      for(var wIdx in words){
        var first = words[wIdx].charAt(0).toUpperCase();
        correct_case = correct_case.concat(first.concat(words[wIdx].substr(1)), ' ');
      }
      tags_correct_case.push(correct_case.trim());

    }
    var docObj = {
      title : result.title,
      text : result.body,
      sections : result.nytd_section_facet,
      tags: tags_correct_case,
      fee : result.fee,
      url : result.url,
      date : result.date
    };
    console.log(docObj);
    indexer.addDocument(docObj, function(err){
      if(err) throw err;
    });

  });
};

var startDate=20120828;
var endDate=20120829;
for(var i=0; i< 30; ++i){

  for(var j in categories){
    setTimeout(searchCategory(categories[j], startDate.toString(), endDate.toString(), indexResults), 60000);
    console.log(j);
  }
  startDate--;
  endDate--;


};
