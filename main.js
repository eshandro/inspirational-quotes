var allQuotes = [];

var Quote = function(author, newquote, rating) {
	this.author = author;
	this.quote = newquote;
	// if no rating is passed in, set to zero
	if(!rating) {
		rating = 0;
	}
	this.rating = [rating];
	
	// Keeps running rating average
	this.ratingAvg = averageArray(this.rating);

	allQuotes.push(this);
}
// Creates li elem for each new quote
Quote.prototype.createElem = function () {
		var quoteItem = $('<li class="quote-item popup"></li>');
		return quoteItem;
	};


var averageArray = function (array) {
	return _.reduce(array, function(memo, num) 
		{
			return memo + num;
		}, 0) / array.length;
}


$(document).on('ready', function() {

	$(document).on('click', '.submit', function(event) {
		// Stops submit button from refreshing page
		event.preventDefault();
		
		// Creates new Quote 
		var storeQuote = new Quote($(this).siblings('.author-name').val(), $(this).siblings('.new-quote').val());
		
		// Takes new quote info and displays it to the page
		var newQuote = $('<p>' + allQuotes[allQuotes.length-1].quote + '</p>');
		var newAuthorName = $('<p class="author-display">&mdash;' + allQuotes[allQuotes.length-1].author + '</p>');
		
		var newQuoteItem = allQuotes[allQuotes.length-1].createElem();
		newQuoteItem.append(newQuote);
		newQuoteItem.append(newAuthorName);
		$('.list-of-quotes').append(newQuoteItem);
		
		// Stores new quote into local storage
		localStorage.setItem('storedQuote', JSON.stringify(storeQuote));

		// Clears out the input fields
		$(this).siblings('.author-name').val('');
		$(this).siblings('.new-quote').val('');

		// Closes the form
		$('.quote-form').slideUp('500');
	});

	// Shows the add a quote form
	$('.add-quote').on('click', function() {
		$('.quote-form').slideDown('1000');
	});

	// Pop-up for selected quote from list
	$(document).on('click', '.quote-item', function() {
		console.log($(this));
		var quotePop = { content : $(this) };
		$('.popup').popup(quotePop);
	})
});

