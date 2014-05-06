var text;
var value;
var type;
var selected;
var selectedValue;
var keep;

if(typeof globalDataTotal == 'undefined') var globalDataTotal = 0; //为页面初始化解析所用

jQuery.fn.FillOptions = function(url,options){
    if(url.length == 0) throw "request is required";        
    text = options.textfield || "text";
    value = options.valuefield || "value";    
    type = options.datatype.toLowerCase() || "json";
    if(type != "xml")type="json";
    keep = options.keepold?true:false;
    selected = options.selectedindex || 0;
    selectedValue = options.selectedValue || 0;
    
	$('<option>请等待..</option>').attr('value', '-1').appendTo(this);
    $.ajaxSetup({async:false});
    var datas;
    if(type == "xml")
    {
        $.get(url,function(xml){datas=xml;});            
    }
    else
    {
        $.getJSON(url,function(json){datas=json;globalDataTotal++;});
    }
         
    if(!keep) $(this).empty();
	$('<option>请选择</option>').attr('value', '-1').prependTo(this);
    if(datas == undefined)
    {
		return;
	}
    this.each(function(){
        if(this.tagName == "SELECT")
        {
            var select = this;
            if(!keep)$(select).html("");
			$('<option>请选择</option>').attr('value', '-1').prependTo(this);
            
			addOptions(select,datas);
        }
    });
}


function addOptions(select,datas)
{      
    
    var options;
    var datas;
    if(type == "xml")
    {
        $(text,datas).each(function(i){            
			var tmpValue =  $($(value,datas)[i]).text();
            option = new Option($(this).text(), tmpValue);
            if(tmpValue == selectedValue) option.selected=true;
            select.options.add(option);
        });
    }
    else
    {
		var selectedIndex = 0;
        $.each(datas,function(i,n){
			var tmpValue =  eval("n."+value);
            option = new Option(eval("n."+text), tmpValue);
            select.options.add(option);
        });
		$(select).val(selectedValue).attr('lastselectedindex',$(select)[0].selectedIndex);
        
    }
}
