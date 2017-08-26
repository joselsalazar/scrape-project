function fetchData() {
	$.getJSON("/all", function(data) {
		$("#saved-articles").empty();
		for (var i=0; i < data.length; i++) {
			$("#saved-articles").append(`
				<p>
					${data[i].title}<br />
					${data[i].desc}<br />
					<button><a href="${data[i].link}" target="_blank">Link</a></button>
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
			desc: $("#desc").val(),
			link: $("#link").val(),
			__v: 0
		}
	})
	.done(function(data) {
		console.log(data);
		$("#title").val("");
		$("#desc").val("");
		$("#link").val("");
		fetchData();
	});
	return false;
});

$("#scrape").on("click", function() {
	$.ajax({
		method: 'GET',
		url: '/scrape'
	})
	.done(function(data) {
		console.log(data);
		setTimeout(fetchData, 3000);
	});
})

$(document).on("click", "#saved-articles p button", function() {
	var thisId = $(this).attr("data-id");
	$.ajax({
		type: "DELETE",
		url: "/all/" + thisId
	})
	.done(function(data) {
		console.log("Delete Ran!");
		fetchData();
	})
})