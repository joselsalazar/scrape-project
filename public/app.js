function fetchData() {
	$.getJSON("/all", function(data) {
		$("#saved-articles").empty();
		for (var i=0; i < data.length; i++) {
			$("#saved-articles").append(`
				<p>
					${data[i].title}<br />
					${data[i].link}<br />
					<button data-id="${data[i]._id}">Remove</button>
				</p>`);
		}
	});
}

fetchData();

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
		fetchData();
	});
	return false;
});

$(document).on("click", "#saved-articles p button", function() {
	var thisId = $(this).attr("data-id");
	$.ajax({
		type: "DELETE",
		url: "/all/" + thisId
	})
	.done(function(data) {
		console.log("Fetch Ran!");
		fetchData();
	})
})