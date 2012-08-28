var ElasticSearchClient = require('elasticsearchclient');

var INDEX_NAME = 'search-prototype';
var MAPPING_NAME = 'people';
var SERVER_OPTIONS = {
  host: 'localhost',
  port: 9200
};
var data = [
	{
		name : 'Glenn Beck',
		tag_line : 'I’ve been blessed to find myself surrounded by amazing people. I have a wonderful and supportive wife, Tania, and four wonderful children. Their love and support gives me the strength to do all the things that I do. I’ve also been blessed to work with an amazing group of people at my company, Mercury Radio Arts. What “Imagineers” were to Walt Disney, Mercury employees are to me. In one breathe both creative, out-of-the-box dreamers, in another, brilliant business engineers. They are innovative artists who are allowed to collaborate and work freely, and together we produce amazing things on stage, screen, and radio. I believe that I’m only able to do what I do and be who I am because of the wonderful people in my life. I don’t like talking about myself, I’d rather talk about them, but this is how they have chosen to describe me. It’s my “official” bio: “Glenn Beck is one of America’s leading radio and television personalities. His quick wit, candid opinions and engaging personality have made The Glenn Beck Program the third highest rated radio program in America and Glenn Beck, one of the most successful new shows on the Fox News Channel. His unique blend of modern-day storytelling and insightful views on current events allowed him to achieve the extraordinary feat of having #1 New York Times bestsellers in both fiction and non-fiction. Beck also stars in a live stage show and is the publisher of Fusion magazine. Online, he is the editor of GlennBeck.com and the publisher of TheBlaze.com.” Wow, I didn’t even realize I did that much.',
		 location : [40.714,-74.006],
         connections : 14299,
         regions : ['New York', 'NY 8th', 'New York County'],
         issues : ['Budget and Spending', 'Health Care Reform', 'Red Tape, Hidden Taxes, and Regulation',
         'Social Security and Entitlement Reform', 'Tax Reform']
	},
	{
		name : 'Joe Wieczorek',
		tag_line : 'Marine Vet (5811/5700). Adhere to the constitution, stay out of my yard , limit the gov and we\'ll get along fine.',
		 location : [38.790,-90.322],
         connections : 13533,
         regions : ['Alabama', 'Arizona', 'Florida', 'Georgia', 'Illinois', 'Iowa', 'Kansas', 'Missouri', 'St. Louis County', 'Pennsylvania', 'Texas', 'Virginia'],
         issues : ['Budget and Spending', 'Card Check and Worker Freedom', 'Energy and Environment', 'Health Care Reform', 'Red Tape, Hidden Taxes, and Regulation','Social Security and Entitlement Reform', 'Tax Reform', 'School Choice']
     },
     {
		name : 'Steve Olds',
		tag_line : 'Desert Storm F15 "Eagle" Pilot. After the Air Force, began an entrepreneurial career to grow debt free families & small businesses. 20+ years of experience and market testing led to the founding and my current role as President of Patriot Mission, which is an Entrepreneurial Revolution to Save American Freedom in 2012.',
		 location : [27.639,-80.397],
         connections : 10717,
         regions : ['Florida', 'FL 15th', 'Indian River County', 'Utah', 'Beaver County'],
         issues : ['Budget and Spending', 'Card Check and Worker Freedom', 'Energy and Environment', 'Health Care Reform', 'Red Tape, Hidden Taxes, and Regulation','Social Security and Entitlement Reform', 'Tax Reform', 'School Choice']
     },
     {
		name : 'Michelle Rene Garcia',
		tag_line : 'Editor, The Capitalist Papers - A collection of free-market, conservative freedom-principles. Our print publication is distributed to Tea Party & Freedom Groups. To get a free copy online go to http://www.TheCapitalistPapers.com. Follow me on Twitter @CapitalistMich.',
		 location : [44.677,-116.780],
         connections : 9000,
         regions : ['Idaho', 'ID 1st', 'Kootenai County'],
         issues : ['Budget and Spending', 'Card Check and Worker Freedom', 'Energy and Environment', 'Health Care Reform', 'Red Tape, Hidden Taxes, and Regulation','Social Security and Entitlement Reform', 'Tax Reform', 'School Choice']
     },
     {
		name : 'Janette Minasian Pires',
		tag_line : 'Ruben and I have two college students, Monica (Purdue) and Eliana (Pace). I\'m a CPA and entrepreneur but often feel my strengths and gifts are not on my resume. I\'ve been politically active all of my life, led both of my daughter\'s Girl Scout troops K-12, began Operation Cookie Drop (now a national GS program), led the youth of our church in their mission projects and served as AYSO commissioner. Most who know me count my strong faith, endless energy, organizational and leadership skills in addition to taking principled positions especially when I\'m outnumbered as my strengths (I live in Los Angeles so that\'s a bit redundant!) Connecting on FC makes Los Angeles feel a bit more like Texas - I can find like-minded patriots right \'round the corner! Please join my groups 1 House of Prayer http://connect.freedomworks.org/node/144806 and Patriots in Action http://connect.freedomworks.org/node/139015 now in Los Angeles, Seattle & Miami. Please contact me if you\'d like to start a chapter in your city. (310) 962-4777',
		 location : [34.052,-118.244],
         connections : 8365,
         regions : ['California', 'CA 37th', 'Los Angeles County'],
         issues : ['Budget and Spending', 'Health Care Reform', 'Tax Reform']
     }
];

var elasticSearchClient = new ElasticSearchClient(SERVER_OPTIONS);
data.forEach(function(obj){
	elasticSearchClient.index(INDEX_NAME, MAPPING_NAME, obj)
			.on('data', function (res){
				console.log(res);
			})
			.on('error', function(error){
				console.log(error);
			})
			.exec();	
});





