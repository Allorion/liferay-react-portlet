<%@ include file="init.jsp" %>

<div id="input"></div>
<script src="<%=request.getContextPath()%>/js/app.js"></script>

<portlet:resourceURL var="downloadURL">
	<portlet:param name="file_id" value="id" />
	<portlet:param name="p_p_resource_id" value="downloadFile" />
</portlet:resourceURL>

<script>
	var allorionMvcPortletProject = {
		portletNamespace : '<portlet:namespace />',
		downloadFullURL: '${downloadURL}'
	};
</script>