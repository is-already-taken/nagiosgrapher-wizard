
define(["base/utils/PerfdataParser"], function(PerfdataParser2) {
	
	return function() {
		// 
		var PROBES_DECIMAL = [
			["345,64,56,5,7,54,79,55,0,6767,4,6",
			 "{NNN},{NNN},{NNN},{NNN},{NNN},{NNN},{NNN},{NNN},{NNN},{NNN},{NNN},{NNN}"],
			["345;64;56;5;7;54;79;55;0;6767;4;6",
			 "{NNN};{NNN};{NNN};{NNN};{NNN};{NNN};{NNN};{NNN};{NNN};{NNN};{NNN};{NNN}"],
			["345,64;56,5;7,54;79,55;0,6767;4,6",
			 "{NNN},{NNN};{NNN},{NNN};{NNN},{NNN};{NNN},{NNN};{NNN},{NNN};{NNN},{NNN}"],
			["345 64 56 5 7 54 79 55 0 6767 4 6",
			 "{NNN} {NNN} {NNN} {NNN} {NNN} {NNN} {NNN} {NNN} {NNN} {NNN} {NNN} {NNN}"],
			["var1=345 var2=56 var3=7 var4=79 var5=0 var6=4",
			 "var1={NNN} var2={NNN} var3={NNN} var4={NNN} var5={NNN} var6={NNN}"],
			["var1=345;43 var2=56;34 var3=7;0 var4=79;79 var5=0;7 var6=4;989",
			 "var1={NNN};{NNN} var2={NNN};{NNN} var3={NNN};{NNN} var4={NNN};{NNN} var5={NNN};{NNN} var6={NNN};{NNN}"],
			["var1=345,64;var2=56,5;var3=7,54;var4=79,55;var5=0,6767;var6=4,6",
			 "var1={NNN},{NNN};var2={NNN},{NNN};var3={NNN},{NNN};var4={NNN},{NNN};var5={NNN},{NNN};var6={NNN},{NNN}"],
			["var1=345;43 var2=56;34 var3=7;0 var4=79;79 var5=0;7 var6=4;989",
			 "var1={NNN};{NNN} var2={NNN};{NNN} var3={NNN};{NNN} var4={NNN};{NNN} var5={NNN};{NNN} var6={NNN};{NNN}"]
		];
		
		var PROBES_MATCHERS_DECIMAL = [
			["345,6767,4,6",
			 	["(\\d+),\\d+,\\d+,\\d+", 
			 	 "\\d+,(\\d+),\\d+,\\d+", 
			 	 "\\d+,\\d+,(\\d+),\\d+", 
			 	 "\\d+,\\d+,\\d+,(\\d+)"]
			 ],
			 
			["345,6767;4,6",
			 	["(\\d+),\\d+;\\d+,\\d+", 
			 	 "\\d+,(\\d+);\\d+,\\d+", 
			 	 "\\d+,\\d+;(\\d+),\\d+", 
			 	 "\\d+,\\d+;\\d+,(\\d+)"] 
			 ]
		];
		
		var PROBE_VARIABLES_DECIMAL = [
   			["345,6767,4,6",
   			 	["var_1", "var_2", "var_3", "var_4"]
   			 ],
   			 
   			["var1=345;var2=56;var3=7",
   			 	["var1", "var2", "var3"] 
   			 ],
   			 
   			["var1=345,64;var2=56,5;var3=7,54",
			 	["var1", "var1_1", "var2", "var2_1", "var3", "var3_1"] 
			 ]
   		];
		
		
		describe("getTokened()", function(){
			it("It should replace all decimals with tokens", function(){
				for (var i = 0; i < PROBES_DECIMAL.length; i++) {
					expect(
						PerfdataParser2.getTokened(PROBES_DECIMAL[i][0])
					).toBe(
						PROBES_DECIMAL[i][1]
					);
				}
			});
		});
		
		describe("getGroupedMatchers()", function(){
			it("It should replace all tokens (previously generated) by (grouped) matchers", function(){
				var i, tokened, matchers, j;
				for (i = 0; i < PROBES_MATCHERS_DECIMAL.length; i++) {
					tokened = PerfdataParser2.getTokened(PROBES_MATCHERS_DECIMAL[i][0]);
					matchers = PerfdataParser2.getMatchers(tokened);
					
					expect(matchers.length).toBe(PROBES_MATCHERS_DECIMAL[i][1].length);
					
					for (j = 0; j < matchers.length; j++) {
						expect(
							matchers[j]
						).toBe(
							PROBES_MATCHERS_DECIMAL[i][1][j]
						);
					}
					
				}
			});
		});
		
		describe("getVariables()", function(){
			it("It should return a list of variable names for given perf data", function(){
				var i, tokened, variables, j;
				for (i = 0; i < PROBE_VARIABLES_DECIMAL.length; i++) {
					tokened = PerfdataParser2.getTokened(PROBE_VARIABLES_DECIMAL[i][0]);
					variables = PerfdataParser2.getVariables(tokened);
					
					expect(variables.length).toBe(PROBE_VARIABLES_DECIMAL[i][1].length);
					
					for (j = 0; j < variables.length; j++) {
						expect(
							variables[j]
						).toBe(
							PROBE_VARIABLES_DECIMAL[i][1][j]
						);
					}
					
				}
			});
		});
		
	};
});
