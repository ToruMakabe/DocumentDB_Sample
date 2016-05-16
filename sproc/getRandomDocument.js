function getRandomDocument(filterQuery, continuationToken) {
  var collection = getContext().getCollection();
  var maxResult = 1000;
  var result = [];
  
  tryQuery(continuationToken);
  
  function tryQuery(nextContinuationToken) {
    var responseOptions = { continuation: nextContinuationToken, pageSize : maxResult };
     if (result.length >= maxResult || !query(responseOptions)) {
       setBody(nextContinuationToken);
     }
  }
  
  function query(responseOptions) {
    return (filterQuery && filterQuery.length) ?
       collection.queryDocuments(collection.getSelfLink(), filterQuery, responseOptions, onReadDocuments) :
          collection.readDocuments(collection.getSelfLink(), responseOptions, onReadDocuments);
  }
  		
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function onReadDocuments(err, docFeed, responseOptions) {
    if (err) {
      throw 'Error while reading document: ' + err;
    }
  
    docFeed.forEach(function(element){
       result.push(element);
    });				
  
    if (responseOptions.continuation) {
      tryQuery(responseOptions.continuation);
    } else {
       setBody(null);
    }
  }
  
  function setBody(continuationToken) {
    var randomIndex = getRandomInt(0, result.length - 1);
    var body = { randomDocument: result[randomIndex], continuationToken: continuationToken };
    getContext().getResponse().setBody(body);
  }
}