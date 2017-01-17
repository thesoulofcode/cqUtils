
var CurlGenerator = function(options){
	var _pages = [];
	var _index = 0;
	var _script = '';
	var endPoint = '';

	var _createQuery = function(queryPropMap){
		var propsQuery = '?path=/content/www/' + options.locale + '&p.limit='+ options.limiter +'&type=nt:unstructured&';
		var _predicateCount = 0;
		for(_index = 0; _index < queryPropMap.length; _index++){
			_predicate = (_index + 1) + '_property';
			propsQuery += _predicate + '=' + queryPropMap[_index].name + '&' +_predicate + '.value=' + queryPropMap[_index].value;
			(_index != queryPropMap.length - 1) ? propsQuery += '&' : propsQuery += '';
		}
		//console.debug(propsQuery);
		return propsQuery;
	}

	var _fetchResults = function(endpoint){
		var xhr = new XMLHttpRequest();
		//console.debug(_endpoint)
		xhr.onreadystatechange = function (){
			if (this.readyState == 4 && this.status == 200){
				_pages = JSON.parse(this.responseText).hits;
				//console.debug("size" + _pages.length);
				_generate();
			}
		}
		xhr.open("GET", _endpoint);
		xhr.send();
	}

	var _generate = function(){
		var page, componentNode;
		for (_index = 0 ; _index < _pages.length; _index++){
			page = _pages[_index].path;
			//propName = page.split['/'].slice(-1);
			propName = _pages[_index].name;
			_script += 'curl -F "' + propName+'@Delete=" -u "'+ options.credentials +'" http://' + options.host + page + '\n';
			//console.debug(_index +' '+ page);
		}
		console.log(_script);
	}

	var _init = function(options){
		_endpoint = 'http://' + options.host + options.apiUrl + _createQuery(options.queryPropMap);
		//console.debug(_endpoint);
	}

	var _execute = function(){
		_init(options);
		_fetchResults(_endpoint)
	}

	return {
		'execute': _execute,
		'pages': _pages,
		'script': _script
	};
};

var options = {
	'host': 'localhost:4502',
	'apiUrl': '/bin/querybuilder.json',
	'locale': 'us/en',
	'limiter': 1500,
	'credentials': 'admin:admin',
	'queryPropMap': [{
		'name': 'sling:resourceType',
		'value': 'pathToComponent'
		}]
}
var curler = new CurlGenerator (options)
curler.execute();
