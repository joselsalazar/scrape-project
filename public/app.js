$("#addArticle").on("click", function() {
	$.ajax({
		type: "POST",
		url: "/submit",
		dataType: "json",
		data: {
			title: $("#title").val(),
			author: $("#author").val(),
			created: Date.now()
		}
	})
	.done(function(data) {
		console.log(data);
		$("#author").val("");
		$("#title").val("");
	});
	return false;
});