
/** 
 *  
 */
define([], function() {
    
    return {
    	
    	/** Helper to convert all numbers to placeholders (tokens)
    	 * 
    	 */
    	getTokened: function(str){
    		return str.replace(/([,;=:\s]|^)\d+([;,\s;]|$)/g, "$1{NNN}$2")
    	    			.replace(/([;,=:\s]|^)\d+([,;\s;]|$)/g, "$1{NNN}$2");
    	},
    	
    	
    	getMatchers: function(str){
    		var i = 0, i_ = 0,
    			idx, s, t, r,
    			matchers = [];
    		
    		while (true) {
    			i = str.indexOf("{NNN}", i_);
    			
    			if (i == -1) {
    				break;
    			}
    			
    			s = str.substring(0, i);
    			t = str.substring(i + 5);
    			
    			r = s.replace(/\{NNN\}/g, "\\d+");
    			r += "(\\d+)";
    			r += t.replace(/\{NNN\}/g, "\\d+");
    			
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
    		    // TODO test for other assignments
    		    if (interStr.indexOf("=") != -1) {
    		    	variableNo = 0;

    		        variable = /([^:;,.=\s]+)=/.exec(interStr)[1];

    		        if (variable_ != variable) {
    		        	variables.push(variable);
    		        }
    		    } else {
    		    	variableNo++;
    		    	variables.push(variable + "_" + (variableNo));
    		    }

    		    variable_ = variable;
    		    i_ = i + 5;
    		}

    		return variables;
    	}
    	
    };
    
});
