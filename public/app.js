$.getJSON("/all", function(data) {
	for (var i=0; i < data.length; i++) {
		$("#saved-articles").append(`
			<p data-id="${data[i]._id}">
			${data[i].title}<br />
			${data[i].link}<br />
			<button>Remove</button>
			</p>`);
	}
});

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