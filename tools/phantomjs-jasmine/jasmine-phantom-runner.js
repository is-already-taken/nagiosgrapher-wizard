
(function(){
	const ANSI_COLORS = {
		RED: "\033[0;31m",
		GREEN: "\033[0;32m",
		NONE: "\033[0m"
	};
	
	function red(str){
		return ANSI_COLORS.RED + str + ANSI_COLORS.NONE;
	}

	function green(str){
		return ANSI_COLORS.GREEN + str + ANSI_COLORS.NONE;
	}
	
	var Page, FS, tests = [], oneTestFailure = false;
	
	phantom.injectJs("phantomjs-utils.js");
	
    Page = require("webpage").create();
    FS = require("fs");
    
    Page.onConsoleMessage = function(msg){
    	print("[Page] " + msg);
    };
    
    Page.onError = function(msg, trace){
    	print("[Page] Error: " + msg);
    	trace.forEach(function(item) {
            print('[Page]   ' +  item.file + ':' + item.line);
        });
    };
    
    /** Get path relative to a reference path. This only works with absolute paths.
    *
    * One variant in each column:
    * a = /a/b/c/d /a/b /a/b/c/d
    * b = /a/b/p/q /a/b/p/q /a/b
    * Q = ../../p/q p/q ../..
    *
    * @param {String} referencePath the reference path
    * @param {String} path this path will be returned as relative to referencePath
    * @return path relative to referencePath
    */
    function pathRelative(a, b){
        // a is the reference path
        // b's relative path to a

        var i, aArr = a.split("/"), bArr = b.split("/"),
               aLen = aArr.length, bLen = bArr.length,
               d, e = Math.min(aLen, bLen), target = [];

        for (i = 0; i < Math.min(aLen, bLen); i++) {
            if (aArr[i] !== bArr[i]) {
                e = i
                break;
            }
        }

        d = aLen - e;

        for (i = 0; i < d; i++) {
            target = [".."].concat(target);
        }

        for (i = e; i < bLen; i++) {
            target.push(bArr[i]);
        }

        return target.join("/");
    }    
	
    function print(str){
    	console.log(str);
    }
    
	
    function printHelp(str){
    	print("Usage: phantomjs <path/to/this/script.js>");
    }    
    
    function fail(str){
    	print(str);
    	phantom.exit(0);
    }
    
    function openPage(context){
    	Page.open(context.htmlFile, function(status){
    		handlePageLoad(status, context);
    	});
    }
    

	function handleTestsPassed(reportFilePrefix){
        // Retrieve the result of the tests
        var f, i = 0, len,
            suitesResults;
            
        suitesResults = Page.evaluate(function(){
        	return jasmine.phantomjsXMLReporterResults;
        });
        
        len = suitesResults.length;
        
        for (; i < len; i++) {
            try {
                f = FS.open(reportFilePrefix + '_' + suitesResults[i]["xmlfilename"], "w");
                f.write(suitesResults[i]["xmlbody"]);
                f.close();
            } catch (e) {
            	print(e);
            	print("Unable to save result of Suite '"+ suitesResults[i]["xmlfilename"] +"'");
            }
        }
        
       	onTestPassed();
	}
	
	function handleTestsOrLoadError(){
		print("Error while initializing Jasmine or the tests");
		phantom.exit(1);
	}
	
	function handlePageLoad(status, context){
		if (status == "success") {
    		utils.core.waitfor(function() {
	    			// Test condition by polling
	                return Page.evaluate(function() {
	                    return typeof jasmine !== "undefined" && 
	                    	typeof jasmine.phantomjsXMLReporterPassed !== "undefined";
	                });
	    		},
	    		
	    		function() {
	    			// Jasmine completed
	    			handleTestsPassed(context.reportFilePrefix); 
	    		},
	    		
	            handleTestsOrLoadError
    		);
		} else {
            print("Error while loading runner page: " + context.htmlFile);
            phantom.exit(1);
        }
	}
	
	function onTestPassed(){
		// remember if this test failed
		if (!oneTestFailure) {
			oneTestFailure = (Page.evaluate(function(){
	            return jasmine.phantomjsXMLReporterPassed ? 0 : 1;
	        }));			
		}

		tests.shift();
		runTest(0);
	}
	
	function onAllTestsPassed(){
		print("All tests finished. The overall test result is " + (oneTestFailure ? red("failed") : green("passed")));
        phantom.exit(oneTestFailure ? 64 : 0);
	}
	
	function runTest(idx){
		if (tests.length == 0) {
	        onAllTestsPassed();
	        return;
		}
		
		openPage(tests[0]);
	}
	
	function existsAndIsDir(path){
		return FS.exists(path) && FS.isDirectory(path);
	}
	
	function tryToCreateDir(path){
		try {
			FS.makeDirectory(path);
		} catch (e) {
			fail("Unable to create directory: " + e);
		}
	}
	
	function createHtmlRunnerFile(context){
		var content;
		
		content = FS.read(context.templateFile);
		
		content = content.replace(/\{#base-dir\}/g, context.placeholders.baseDir);
		content = content.replace(/\{#tools-dir\}/g, context.placeholders.toolsDir);
		content = content.replace(/\{#base-dir\}/g, context.placeholders.baseDir);
		content = content.replace(/\{#test-file\}/g, context.placeholders.testFile);
		
		FS.write(context.htmlFile, content, "w");
	}

	function exec() {
		var cwd, 
			testsDir, targetDir,
			reportDir, runnerDir,
			toolsDir,
			jasmineDir,
			fileList,
			i,
			name,
			context;
		
		if (phantom.args.join(" ").indexOf("--help") != -1) {
			printHelp();
			phantom.exit(0);
		}
		
		cwd = FS.absolute(".").replace(/\/$/, "");
		
		testsDir = cwd + "/tests";
		targetDir = cwd + "/target";
		reportDir = targetDir + "/test-reports";
		runnerDir = targetDir + "/test-runners";
		toolsDir = cwd + "/tools/phantomjs-jasmine";
		
		if (!existsAndIsDir(testsDir)) {
			fail("Tests directory does not exists: " + testsDir);
		}

		if (!existsAndIsDir(targetDir)) {
			tryToCreateDir(targetDir);
			tryToCreateDir(reportDir);
			tryToCreateDir(runnerDir);
		} else {
			if (!existsAndIsDir(reportDir)) {
				tryToCreateDir(reportDir);
			}
			
			if (!existsAndIsDir(runnerDir)) {
				tryToCreateDir(runnerDir);
			} 	
		}
		
		fileList = FS.list(testsDir);
		
		for (i = 0; i < fileList.length; i++) {
			file = fileList[i];
			
			if (file.indexOf(".") == 0) {
				continue;
			}
			
			if (/^.*Test\.js$/.test(file)) {
				name = file.replace(/\.js$/, "");
				
				context = {
					placeholders: {
						baseDir: pathRelative(runnerDir, cwd),
						toolsDir: pathRelative(runnerDir, toolsDir),
						baseDir: pathRelative(runnerDir, cwd),
						testFile: pathRelative(runnerDir, testsDir + "/" + file),
					},
					templateFile: toolsDir + "/jasmine-phantom-runner.html.tpl",
					reportFilePrefix: reportDir + "/" + name + "_report",
					htmlFile: runnerDir + "/" + name + ".html"
				};
				
				createHtmlRunnerFile(context);
				tests.push(context);	
			}
		}
		
		// run first test, once the test is done, it will test.shift() and call
		// runTest(0) again
		runTest(0);
	}

	
	exec();
	
})();
