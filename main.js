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
		var quoteItem = $('<li class="quote-item popup">');
		return quoteItem;
	};
Quote.prototype.addToLocal = function(storeQuote) {
		localStorage.setItem('storedQuote', JSON.stringify(storeQuote));	
};

Quote.prototype.getFromLocal = function() {
	return JSON.parse(localStorage.getItem(storedQuote));
}

var averageArray = function (array) {
	return _.reduce(array, function(memo, num) 
		{
			return memo + num;
		}, 0) / array.length;
}

// Display all quotes in array
var displayAllQuotes = function() {
	var quotesList = $('.list-of-quotes');
	for (i=0; i<allQuotes.length; i++) {
		var tempItem = allQuotes[i].createElem();
		tempItem.append('<p><q>' + allQuotes[i].quote) + '</q></p>';
		tempItem.append('<p class="author-display">&mdash;' + allQuotes[i].author + '</p>');
		quotesList.append(tempItem);
	}
	return quotesList;
};

// Make some sample quotes to add to page 
new Quote('Winston Churchill','Success is not final, failure is not fatal: it is the courage to continue that counts.');
new Quote('Albert Einstein','Try not to become a man of success, but rather try to become a man of value.');
new Quote('Albert Einstein','Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.');

$(document).on('ready', function() {
displayAllQuotes();
	$(document).on('click', '.submit', function(event) {
		// Stops submit button from refreshing page
		event.preventDefault();
		
		// Creates new Quote 
		var storeQuote = new Quote($(this).siblings('.author-name').val(), $(this).siblings('.new-quote').val());
		
		// Takes new quote info and displays it to the page
		var newQuote = $('<p><q>' + allQuotes[allQuotes.length-1].quote + '</q></p>');
		var newAuthorName = $('<p class="author-display">&mdash;' + allQuotes[allQuotes.length-1].author + '</p>');
		
		var newQuoteItem = allQuotes[allQuotes.length-1].createElem();
		newQuoteItem.append(newQuote);
		newQuoteItem.append(newAuthorName);
		$('.list-of-quotes').append(newQuoteItem);
		
		// Stores new quote into local storage
		// localStorage.setItem('storedQuote', JSON.stringify(storeQuote));
		// storeQuote.addToLocal(storeQuote);

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
		var quotePop = $(this).clone();
		$('body').append('<div class="popup-back">');
		$('body').append('<div class="popup-cont">');
		$('.popup-cont').append(quotePop);
		$('.popup-cont').append('<span class="popup-close">X');		
	});

	// Remove pop-up on click
	$(document).on('click', '.popup-close', function() {
		$('.popup-cont').remove();
		$('.popup-back').remove();
	})


});

