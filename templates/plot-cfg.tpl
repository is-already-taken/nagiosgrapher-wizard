define ngraph {
	service_name		<%= serviceName %>
	graph_perf_regex	<%= regex %>
	graph_value		<%= variable %>
<% if (!hide) { %>
	rrd_plottype		<%= plotType %>
	rrd_color		<%= color %>
	graph_legend		<%= legend %>
	graph_units		<%= units %>
<% } %>
	hide			<%= hide ? "yes" : "no" %>
}