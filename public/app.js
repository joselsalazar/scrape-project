$(document).on("click", "#addArticle", function() {
	$.ajax({
		type: "POST",
		url: "/submit",
		dataType: "json",
		data: {
			title: $("#title").val(),
			link: $("#link").val(),
			__v: 0
		}
	})
	.done(function(data) {
		console.log(data);
		$("#link").val("");
		$("#title").val("");
	});
	return false;
});