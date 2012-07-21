<!DOCTYPE html>
<html>
<head>
	<title>Jasmine Spec Runner</title>

	<link rel="stylesheet" type="text/css" href="{#tools-dir}/jasmine-1.2.0/jasmine.css">
	<script type="text/javascript" src="{#tools-dir}/jasmine-1.2.0/jasmine.js"></script>
	<script type="text/javascript" src="{#tools-dir}/jasmine-1.2.0/jasmine-html.js"></script>
	<script type="text/javascript" src="{#tools-dir}/jasmine-phantom-xml-reporter.js"></script>
	
	<script type="text/javascript" src="{#base-dir}/libs/jquery.js"></script>
	<script type="text/javascript" src="{#base-dir}/libs/underscore.js"></script>
	<script type="text/javascript" src="{#base-dir}/libs/backbone.js"></script>
	<script type="text/javascript" src="{#base-dir}/libs/require.js"></script>
	
	<script type="text/javascript">
	requirejs.config({
		paths: {
			"text": "{#base-dir}/text",
			"base": "{#base-dir}"
		}
	});

	require(["{#test-file}"], function(test){
		test();
		jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
		jasmine.getEnv().addReporter(new jasmine.PhantomJSReporter());
		jasmine.getEnv().execute();
	});
	</script>
	
</head>
<body></body>
</html>
