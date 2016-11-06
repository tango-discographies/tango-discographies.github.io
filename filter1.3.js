    var filter_table = function ( filterbar , table ) {
	

	var $table = $(table);
	var $filterbar = $(filterbar);
	//console.log(table);
	//console.log($table);
	
	var $rows = $table.find("tbody tr");
	
	
        var $searchbox = $filterbar.find("input[type=searchbox]");
	var $radio_all = $filterbar.find(".show-all"),
	    $radio_tango = $filterbar.find(".show-tango"),
	    $radio_vals = $filterbar.find(".show-vals"),
	    $radio_milonga = $filterbar.find(".show-milonga");
	var $checkbox_other = $filterbar.find(".hide-other");
	
	// for the old filter bar with four checkboxes
        //    $checkbox_tango = $filterbar.find(".toggle-tango"),
        //    $checkbox_vals = $filterbar.find(".toggle-vals"),
        //    $checkbox_milonga = $filterbar.find(".toggle-milonga"),
        //    $checkbox_other = $filterbar.find(".toggle-other");

	// for the old filter bar with four checkboxes
        //    var update_f_state_old = function() {
        //       f_state.str = $searchbox.val();
        //        f_state.show_tango = $checkbox_tango.is(":checked");
        //        f_state.show_vals = $checkbox_vals.is(":checked");
        //       f_state.show_milonga = $checkbox_milonga.is(":checked");
        //        f_state.show_other = $checkbox_other.is(":checked");
        //    };
	
	
        var f_state = {
                str: "",
                show_tango: true,
                show_vals: true,
                show_milonga: true,
                show_other: true
            };

	
	// for the new filterbar with four radio buttons and one checkbox
	var update_f_state = function() {
	    
	    f_state.str = $searchbox.val();
	    if ($radio_all.is(":checked")) {
		if ($checkbox_other.is(":checked")) {
		    f_state.show_tango = true;
		    f_state.show_vals = true;
		    f_state.show_milonga = true;
		    f_state.show_other = false;
		} else {
		    f_state.show_tango = true;
		    f_state.show_vals = true;
		    f_state.show_milonga = true;
		    f_state.show_other = true;
		};
	    };
	    if ($radio_tango.is(":checked")) {
		f_state.show_tango = true;
		f_state.show_vals = false;
		f_state.show_milonga = false;
		f_state.show_other = false;
	    };
	    if ($radio_vals.is(":checked")) {
		f_state.show_tango = false;
		f_state.show_vals = true;
		f_state.show_milonga = false;
		f_state.show_other = false;
	    };
	    if ($radio_milonga.is(":checked")) {
		f_state.show_tango = false;
		f_state.show_vals = false;
		f_state.show_milonga = true;
		f_state.show_other = false;
	    };
	};
	

            // throw in genre string and decide from f_state wether to output true or false
            // better name for function!
            var show_genre = function(str) {
                switch (str) {
                    case "Tango":
                        return f_state.show_tango;
                        break;
                    case "Vals":
                        return f_state.show_vals;
                        break;
                    case "Milonga":
                        return f_state.show_milonga;
                        break;
                    default:
                        return f_state.show_other;
                };
            };


        $filterbar.find("input").on("change keyup", function() {
                var genre_str; // for checkbox filter
                var val, reg, row_text; // for searchbox filter
                update_f_state();

                val = "^(?=.*\\b" + $.trim(f_state.str).split(/\s+/).join("\\b)(?=.*\\b") + ").*$";
                reg = RegExp(val, "i");

                $rows.show().filter(function() {
                    // get the entry in the current row which is the genre
                    genre_str = $(this).children(":nth-child(2)").text();
                    // get the text of the current row and replace newlines 
                    // introduced by the .text() method
                    row_text = $(this).text().replace(/\s+/g, " ");
                    // check row_text against RegExp and genre_str with 
                    return !(show_genre(genre_str) && reg.test(row_text));
                }).hide();
	    $table.find('tbody').children(":visible:odd").css('background', 'transparent');
	    $table.find('tbody').children(":visible:even").css('background', '#f5f5f5');	   
        });
    };


var add_column_class = function () {
    var col_classes = ["col-no","col-genre","col-date text-nowrap","col-title","col-singer","col-auth","col-disc text-nowrap"];
    var step;
    for (step=0; step < col_classes.length; step++) {
	$("tbody tr").children(":nth-child(" + (step + 1) + ")").addClass(col_classes[step]);
    };
}; 






var add_ext_search_column = function () {

    // returns url with query to tango-dj.at database from table row
    var tangodjat_url = function (row) {

	var title = $(row).children(":nth-child(4)").text();
	var date = $(row).children(":nth-child(3)").text();
	
	var base_url = "http://www.tango-dj.at/database/index.htm?";
	var adv = "&advsearch=Search";
	var title_search = "&titlesearch=" + title.replace(/\ /g,"+");
	var date_search;

	var full_date = RegExp("19[0-9][0-9]-[0-9][0-9]-[0-9][0-9]");
    
	if (full_date.test(date)) {
	    date_search = "&yearsearch=" + date.replace(/(19[0-9][0-9])-([0-9][0-9])-([0-9][0-9])/, "$3.$2.$1");
	} else {
	    date_search = date;
	};
    
	return base_url + title_search + date_search + adv; 
    };

    var tangoinfo_url = function (row) {
	var title = $(row).children(":nth-child(4)").text();
	return "https://tango.info/?q=" + title.replace(/\ /g,"+");
    };

    
    $("colgroup").append("<col class=\x22left\x22>");
    $("thead tr").append("<th scope=\x22col\x22 class=\x22text-left\x22> </th>");
    $("tbody tr").append( function () {
	
	var span_attrb = " tabindex='0' href=javascript://' class='popover-dismiss glyphicon glyphicon-search' data-toggle='popover' ";
	var pop_title = " title='Find recording at:' ";
	var pop_content = " data-content=' " +  "<span class=x22pophead\x22>Find this recording at:</span><br>" +"&nbsp&nbsp<a target=\x22_blank\x22 href=\x22"
	    + tangodjat_url($(this)).replace(/[',’]/g,"%27")
	    + "\x22>tango-dj.at</a> <br>&nbsp&nbsp<a target=\x22_blank\x22 href=\x22"
	    + tangoinfo_url($(this)).replace(/[',’]/g,"%27") + "\x22>tango.info</a>'";
	
	return  "<td>" + "<span" + span_attrb  + pop_content + " ></span>" + "</td>" ;
    });



    $('.popover-dismiss').popover({
	trigger: 'focus',
	container: 'body',
	html: 'true'
    });
    
};
