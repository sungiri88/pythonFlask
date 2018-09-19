$(function(){
var dockerRepoArray=['docker-dev-local']
var resultTable= '<table id="dockerImageTableID" class="display compact table" style="width:100%">'+
			        '<thead>'+
			            '<tr>'+
			                '<th>Repository Name</th>'+
			                '<th>Image Tag</th>'+
			                '<th>Created Date</th>'+
			                '<th>Modified Date</th>'+
			                '<th>Approved Status</th>'+			                
			            '</tr>'+
			        '</thead>'+
			        '<tbody>';
    $("#dashboard").append(resultTable);
    $.each(dockerRepoArray,function(i,dockerRepo){	
    $.when(getApprovedKits(dockerRepo),getUnApprovedKits(dockerRepo)).done(function(appr,unappr){
                    console.log('table done');   
     });
    });

})
$(document).ajaxStop(function(){
  bind()
});

var getApprovedKits=function(dockerRepo){
    var dfd = jQuery.Deferred();
    var repoName=dockerRepo;
    getJSON('/api/listDockerRepo/'+dockerRepo).done(function(repositoryList){
              for(i=0;i<repositoryList['repositories'].length;i++){
	        repoValue=repositoryList['repositories'][i];
	        json=getApprovedRegistrySearchJson(repoValue,repoName);         
	        getTableRow(json,"success").promise().done(function(tr){
	             $("#dockerImageTableID").append(tr);                
                });
		if(i+1==['repositories'].length)
		   dfd.resolve('success')
    		}
    });
    return dfd.promise();
}


var getUnApprovedKits=function(dockerRepo){
    var dfd = jQuery.Deferred();
    var repoName=dockerRepo;
    getJSON('/api/listDockerRepo/'+dockerRepo).done(function(repositoryList){
              for(i=0;i<repositoryList['repositories'].length;i++){
                repoValue=repositoryList['repositories'][i];
                json=getUnApprovedRegistrySearchJson(repoValue,repoName);
                getTableRow(json,"danger").promise().done(function(tr){
                     $("#dockerImageTableID").append(tr);
                });
                if(i+1==['repositories'].length)
                   dfd.resolve('success')
                }
    });
    return dfd.promise();
}


var getTableRow=function(jsonData,code){
	var status= (code=="success") ? "Approved" : "Not Approved";
	var dfd = jQuery.Deferred();
	var tr='';	
	$.when(postJSON('/api/search/aql',jsonData)).then( function(data){	
		if(data['results'].length>0){
		 $.each(data['results'],function(imageIndex,ImageValue){
		 		tr += '<tr class="'+code+'">'+
		 					'<td>'+ImageValue["repo"]+'</td>'+
		 					'<td>'+ImageValue["path"]+'</td>'+
		 					'<td>'+ImageValue["created"]+'</td>'+
		 					'<td>'+ImageValue["modified"]+'</td>'+
		 					'<td>'+status+'</td>'+
		 				   '</tr>';			 				   
		 	});
		}
		dfd.resolve(tr);			
	});
	return dfd.promise();
}   	   	
	
var bind=function(){
	setTimeout(
	  function() 
	  {	    
	    $("#dockerImageTableID").DataTable({ "order": [[ 2, "asc" ]] });
	  }, 3000);
	
}
var postJSON = function(jfrogurl,jsonData)
{
	var dfd = jQuery.Deferred();	
	$.ajax({
	type: "POST",
	url: jfrogurl,
	dataType: 'json',
	data: jsonData,
	contentType: 'application/json;charset=UTF-8',
	success: function(data){		
		dfd.resolve(JSON.parse(data));
	}	
	});	
	return dfd.promise();
}
var getJSON = function(jfrogurl){
	var dfd = jQuery.Deferred();	
	$.ajax({
	type: "GET",
	url: jfrogurl,
	dataType: 'json',	
	success: function(data){
		dfd.resolve(JSON.parse(data));
	}	
	});	
	return dfd.promise();
}

var getApprovedRegistrySearchJson=function(repoKey,repoName){
  return 'items.find({"repo":"'+repoName+'","@isProd":{"$eq":"yes"},"@docker.repoName":{"$eq":"'+repoKey+'"},"property.key":{"$eq":"docker.repoName"}}).include("created","modified","path","repo","name","updated","id").sort({"$desc": ["created"]})' 
}
var getUnApprovedRegistrySearchJson=function(repoKey,repoName){
  return 'items.find({"repo":"'+repoName+'","@isProd":{"$ne":"yes"},"@docker.repoName":{"$eq":"'+repoKey+'"},"property.key":{"$eq":"docker.repoName"}}).include("created","modified","path","repo","name","updated","id").sort({"$desc": ["created"]})' 
}
