var allQuotes = [];

var Quote = function(author, newquote, rating) {
	this.author = author;
	this.quote = newquote;
	this.rating = [rating];

	allQuotes.push(this);
}



$(document).on('ready', function() {

	$(document).on('click', '.submit', function(event) {
		event.preventDefault();
		new Quote($(this).siblings('.author-name').val(), $(this).siblings('.new-quote').val());
		var newQuoteItem = $('<li class="quote-item"></li>');
		$('.list-of-quotes').append(newQuoteItem.append(allQuotes[allQuotes.length-1].quote + '<br>-' + allQuotes[allQuotes.length-1].author));
		$(this).siblings('.author-name').val('');
		$(this).siblings('.new-quote').val('');
	});
});

