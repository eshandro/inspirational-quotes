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
	this.ratingAvg = rating;

	allQuotes.push(this);
}
// Creates li elem for each new quote
Quote.prototype.createElem = function () {
		var quoteItem = $('<li class="quote-item">');
		return quoteItem;
	};

Quote.prototype.updateRating = function(newRating) {
	this.rating.push(newRating);
	this.ratingAvg = averageRatingArray(this.rating);
}

// Adds quote to local storage
Quote.prototype.addToLocal = function(storeQuote) {
		localStorage.setItem('storedQuote', JSON.stringify(storeQuote));	
};

// Gets quote from local storage
Quote.prototype.getFromLocal = function() {
	return JSON.parse(localStorage.getItem(storedQuote));
}

// Finds average of array of numbers 
var averageRatingArray = function (array) {
	var compactArray = _.compact(array);
	return _.reduce(compactArray, function(memo, num) 
		{
			return memo + num;
		}, 0) / compactArray.length;
}

// function to find index of a specific quote
var findQuoteIndex = function (quote) {
	for(i=0; i<allQuotes.length; i++) {
		if (allQuotes[i].quote === quote) {
			return i;
		}
	}
	return -1;
};

// Find all quotes by an author
var findAllQuotesBy = function(quote) {
	var authorAll = [];
	var indexCurrent = findQuoteIndex(quote);
	var currentAuthor = allQuotes[indexCurrent].author;
	// Makes current author the first element of the authorAll array
	authorAll.push(currentAuthor);
	// loop through allQuotes to find all by current author
	for (i=0; i<allQuotes.length; i++) {
		if (allQuotes[i].author === currentAuthor) {
			authorAll.push(allQuotes[i].quote);
		}
	};
	return authorAll;
}

// Sorts array by ratingAvg value 
var sortAllQuotes = function (array) {
	array = _.sortBy(array, function(item) {
		 return -item.ratingAvg 
		});
	allQuotes = array;
	};

// Display all quotes in array
var displayAllQuotes = function() {
	sortAllQuotes(allQuotes);
	var quotesList = $('.list-of-quotes');
	for (i=0; i<allQuotes.length; i++) {
		var tempItem = allQuotes[i].createElem();
		tempItem.append('<p class="quote-para"><q>' + allQuotes[i].quote) + '</q></p>';
		tempItem.append('<p class="author-display">&mdash;' + allQuotes[i].author + '</p>');

		quotesList.append(tempItem);
		
		var ratyDiv = $('<div class="raty-div">');
		tempItem.after(ratyDiv);
		ratyDiv.raty({ score: allQuotes[i].ratingAvg,
						hints: [null, null, null, null, null] });

	}
	return quotesList;
};

// Find a random quote and create display element
var randomQuoteMaker = function (array) {
	// Find random Quote from array
	var random = _.sample(array);
	// Pull out quote and author from random Quote
	var randomQuote = random.quote;
	var randomAuthor = random.author;
	// Create new li for random quote
	var randomDisplay = random.createElem();
	randomDisplay.append('<p class="quote-para"><q>' + randomQuote + '</q></p>');
	randomDisplay.append('<p class="author-display">&mdash;' + randomAuthor + '</p>');

	// Add star rating to random quote display
	var ratyDiv = $('<div class="raty-div">');
	randomDisplay.after(ratyDiv);
	ratyDiv.raty({ score: random.ratingAvg, 
					hints: [null, null, null, null, null]});
	return randomDisplay;

}


// Make some sample quotes to add to page 
new Quote('Winston Churchill','Success is not final, failure is not fatal: it is the courage to continue that counts.', 5);
new Quote('Albert Einstein','Try not to become a man of success, but rather try to become a man of value.', 3);
new Quote('Albert Einstein','Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.', 4);

$(document).on('ready', function() {
	// Displays all known quotes on page load
	displayAllQuotes();

	// Displays Quote of the Day on new page load
	$('.quote-of-day').append(randomQuoteMaker(allQuotes));
	
	// Adding new quotes to the page
	$(document).on('click', '.submit', function(event) {
		// Stops submit button from refreshing page
		event.preventDefault();
		
		// Creates new Quote 
		var storeQuote = new Quote($(this).siblings('.author-name').val(), $(this).siblings('.new-quote').val());
		
		// Takes new quote info and displays it to the page
		var newQuote = $('<p class="quote-para"><q>' + allQuotes[allQuotes.length-1].quote + '</q></p>');
		var newAuthorName = $('<p class="author-display">&mdash;' + allQuotes[allQuotes.length-1].author + '</p>');
		
		var newQuoteItem = allQuotes[allQuotes.length-1].createElem();
		newQuoteItem.append(newQuote);
		newQuoteItem.append(newAuthorName);
		$('.list-of-quotes').append(newQuoteItem);
		
		// Adds star rating system
		var ratyDiv = $('<div class="raty-div">');
		newQuoteItem.after(ratyDiv);
		ratyDiv.raty({ score: storeQuote.ratingAvg });
		
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
	$(document).on('click', '.quote-item', function(event) {
		// var quotePop = $('<li class="popup-quote">');
		// Removes this click event from popup
		// quotePop.removeClass('quote-item');	
		
		// Create pop-up lightbox
		$('body').append('<div class="popup-back">');
		$('body').append('<div class="popup-cont">');
		
		// Get all quotes from current author
		var currentQuote = $(this).find('.quote-para').text();
		var allByAuthor = findAllQuotesBy(currentQuote);

		// Append all quotes by current author and stars
		for(i=1; i<allByAuthor.length; i++) {
			var quotePop = $('<li class="popup-quote">');	
			var quoteText = $('<p class="quote-para"><q>' + allByAuthor[i] + '</q></p>');
			var quoteAuthor = $('<p class="author-display">&mdash;' + allByAuthor[0]+ '</p>');
			quotePop.append(quoteText);
			quotePop.append(quoteAuthor);
			$('.popup-cont').append(quotePop);			
			var ratyDiv = $('<div class="raty-div">');
			$('.popup-cont').children('li').after(ratyDiv);
			ratyDiv.raty({ hints: [null, null, null, null, null] });
		}

		$('.popup-cont').append('<span class="popup-close">X');		
	});

	// Remove pop-up on click
	$(document).on('click', '.popup-close', function() {
		$('.popup-cont').remove();
		$('.popup-back').remove();
	})

	// Update rating on star click and display new sorted list
	$(document).on('click', '.raty-div > img', function(){
		console.log('Clicked');
		// Get rating value from this quote
		var newRating = +$(this).siblings('input').attr('value');

		// Get quote text to use for findQuoteIndex
		var quoteText = $(this).parent('.raty-div').prev().find('.quote-para > q').text();

		// Use findQuoteIndex to find Quote to update ratingAvg on
		var index = findQuoteIndex(quoteText);

		// Update ratingAvg
		allQuotes[index].updateRating(newRating);

		// Change star to reflect new ratingAvg
		$(this).siblings('input').attr('value', allQuotes[index].ratingAvg);

		// Remove current list and Sort allQuotes and display to page
		$('.list-of-quotes .quote-item').remove();
		$('.list-of-quotes .raty-div').remove();
		displayAllQuotes();

	});


	// Display random quote when button clicked
	$('.random-quote').on('click', function() {
		// Makes pop up for random quote
		$('body').append('<div class="popup-back">');
		$('body').append('<div class="popup-cont">');
		$('.popup-cont').append(randomQuoteMaker(allQuotes));
		$('.popup-cont').append('<p class="rate-label">Rate this quote</p>');
		$('.popup-cont').append('<span class="popup-close">X');

		var ratyDiv = $('<div class="raty-div">');
		$('.popup-cont').children('li').after(ratyDiv);
		ratyDiv.raty({ hints: [null, null, null, null, null] });		
	})
});

