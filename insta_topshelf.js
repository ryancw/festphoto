/* Instagram tag grabber/infinite scroller
*   Just add "return LoadResults()" in a JS function on the page to get working
*	Written by Ryan Williams
*	Scroll thanks to Ali Ukani 
*	October 2012
*/

/****
* Initialize variables
****/

// tag displaying
var tag_name = 'topshelfrecords';
// your client id (given by instagram api)
var client_id = 'ce1235ec240f4b07958a6311484af678';
var url = 'https://api.instagram.com/v1/tags/'+tag_name+'/media/recent?client_id='+client_id;
var thumb_dimension = 220;
var div_to_add_pics = '#pag';

function LoadResults(){
		$.ajax({
			dataType:'jsonp',
			url:url,
			success:function(response){
				return ProcessData(response);
			}
		});
	};

function ProcessData(response){
		if(response != null){
			var ul = $('<ul/>');
			ul.attr({'class': tag_name});
			var href = $('<a/>');
			href.attr({'href': response.pagination.next_url});

			$(response.data).each(function(index,obj){
				if(index == 20)
					return response.pagination.next_url;
				var link = $('<a/>'), image = $('<img/>'), li = $('<li/>');
				image.attr({'src': obj.images.thumbnail.url,'width':thumb_dimension,'height': thumb_dimension});
				link.attr('href',obj.link);
				image.appendTo(link);
				link.appendTo(li);
				ul.append(li);
			});
			
			$(div_to_add_pics).append(ul);
			// make url correlate to the next set of data
			url = response.pagination.next_url;
		}
	};

/*********
 * Setup *
 *********/

var nextLink = false;

var loadingImages = false;


/******************
 *   SCROLLIN'	 *
 ******************/


/* Loads the next set of images and appends them to #images */
function loadNext() {
  // Prevent (redundantly) loading images if we're already loading them,
  // and prevent us from entering an infinite loop (the last page is
  // also the index)
  if (loadingImages || nextLink == url) {
    return false;
  }else{

  // We are now loading images!
  loadingImages = true;

   LoadResults();
   nextLink = url;

    // Aaaaaand we're done loading.
    loadingImages = false;
}
  
}

/* When the user scrolls to the bottom of the page, load the next set
 * of images */
$(window).scroll(function() {
  var offset = 200; // Change for distance to load
  if($(window).scrollTop() + $(window).height() > $(document).height() - offset) {
    loadNext();
  }
});
