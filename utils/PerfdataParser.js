
/** 
 *  
 */
define([], function() {
    
    return {
    	
    	/** Helper to convert all numbers to placeholders (tokens)
    	 * 
    	 */
    	getTokened: function(str){
    		return str.replace(/([:=,;\s\[\]\(\)\{\}\*]|^)(?:\d+\.)?\d+([\w:=,;\s\[\]\(\)\{\}\*]|$)/g, "$1{NNN}$2")
						.replace(/([:=,;\s\[\]\(\)\{\}\*]|^)(?:\d+\.)?\d+([\w:=,;\s\[\]\(\)\{\}\*]|$)/g, "$1{NNN}$2");
    	},
    	
    	
    	getMatchers: function(str){
    		var i = 0, i_ = 0,
    			idx, s, t, r,
    			matchers = [];
    		
    		// escape all (but '{' and '}') RegEx meta chars before
    		str = str.replace(/([\.\/[\]\(\)\?\+\|\*])/g, "\\$1");
    		
    		while (true) {
    			i = str.indexOf("{NNN}", i_);
    			
    			if (i == -1) {
    				break;
    			}
    			
    			s = str.substring(0, i);
    			t = str.substring(i + 5);
    			
    			r = s.replace(/\{NNN\}/g, "(?:\\d+?\\.)?\\d+");
    			r += "((?:\\d+?\\.)?\\d+)";
    			r += t.replace(/\{NNN\}/g, "(?:\\d+?\\.)?\\d+");
    			
    			// escape { and } after replacing the placeholder  
    			r = r.replace(/([\{\}])/g, "\\$1");
    			
    			matchers.push(r);
    			
    			i_ = i + 5;
    		}
    		
    		
    		
    		return matchers;
    	},
    	
    	getVariables: function(str){
    		var i = 0, i_ = 0,		// index and previous index
    			interStr,			// string between last match and this match
    			variable = "var",	// current variable
    			variable_ = "var",	// last variable
    			variableNo = 0,		// variable aux counter (see A)
    			variables = [];

    		while (true) {
    			// look for the token since the last token found
    		    i = str.indexOf("{NNN}", i_);
    		    
    		    if (i == -1) {
    		        break;
    		    }

    		    // get str between last token and this token
    		    // might contains
    		    interStr = str.substring(i_, i);

    		    // contains a variable assignment?
    		    // if not, the last variable is suffixed with a counter (A) 
    		    // which is incremented every time the intermediate string does
    		    // not contain a variable assignment
    		    // TODO Test for other types of assignment?
    		    if (interStr.indexOf("=") != -1) {
    		    	variable = interStr.toLowerCase();

    		    	// If the string contains \w that might be part of the last 
    		    	// performance data token. Assuming that it's separated by
    		    	// a separation char and returning part of the right hand 
    		    	// side.
    		    	variable = variable.replace(/^.*[;,\s]([^;,\s]+)$/, "$1");
    		    	
    		    	// Replace non word/digit chars to underscore, trim 
    		    	// underscore
    		        variable = variable.replace(/[^\d\w_]+/g, "_")
    		        					.replace(/^_/, "").replace(/_$/, "");

    		        if (variable_ != variable) {
    		        	variableNo = 0;
    		        	variables.push(variable);
    		        } else {
    		        	variableNo++;
    		        	variables.push(variable + "_" + variableNo);
    		        }
    		    } else {
    		    	variableNo++;
    		    	variables.push(variable + "_" + variableNo);
    		    }

    		    variable_ = variable;
    		    i_ = i + 5;
    		}

    		return variables;
    	}
    	
    };
    
});
