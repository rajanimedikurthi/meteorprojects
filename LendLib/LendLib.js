
lists=new Meteor.Collection("Lists");
if (Meteor.isClient) {
  // counter starts at 0
  Session.set('adding_categpory', false);



  Template.categories.helpers({
	  lists:function(){
	 return lists.find({},{sort:{category:1}})
    },
    new_cat:function(){
	 return Session.equals("adding_category",true);	
   }
 });
 Template.categories.events({
	 'click #btnNewCat':function(e,t){
		Session.set("adding_category",true);
		Meteor.flush();
		focus_text(t.find("#add_category"));
	 },
	 'keyup #add_category':function(e,t){
		 if(e.which==13){
		 var val=String(e.target.value ||"");
		 if(val){
			 lists.insert({category:val}); 
			Session.set("adding_category", false);
		 }
		}
	},'focusout #add-category': function(e,t){
Session.set('adding_category',false);
},
'click .category': selectCategory

  });
  Template.list.helpers({
	items:function(){
		if (Session.equals('current_list',null))
			return null;
	  else {
		var cats = lists.findOne({_id:Session.get('current_list')});
		if (cats&&cats.items)
		{
			for(var i = 0; i<cats.items.length;i++) {
			var d = cats.items[i]; d.Lendee = d.LentTo ? d.LentTo :
			"free"; d.LendClass = d.LentTo ?
			"label-important" : "label-success";
			}
			return cats.items;
		}
	 }
	}	

	,
   list_selected : function() {
return ((Session.get('current_list')!=null) &&
(!Session.equals('current_list',null)));
},
list_status:function(){
if (Session.equals('current_list',this._id))
return "";
else
return " btn-inverse";
},
list_adding : function(){
  return (Session.equals('list_adding',true));
},
lendee_editing : function(){ 	
return (Session.equals('lendee_input',this.Name));
}

	  
	  
});
Template.list.events({ 	
'click #btnAddItem': function (e,t){
Session.set('list_adding',true);
Meteor.flush();
focusText(t.find("#item_to_add"));
},
'keyup #item_to_add': function (e,t){
if (e.which === 13) 	
{
addItem(Session.get('current_list'),e.target.value); 	
Session.set('list_adding',false);
}
},
'focusout #item_to_add': function(e,t){
Session.set('list_adding',false);
},
'click .delete_item': function(e,t){
removeItem(Session.get('current_list'),e.target.id);
},
'click .lendee' : function(e,t){
Session.set('lendee_input',this.Name); 	
Meteor.flush();
focusText(t.find("#edit_lendee"),this.LentTo);
},
'keyup #edit_lendee': function (e,t){
if (e.which === 13)
{
updateLendee(Session.get('current_list'),this.Name,
e.target.value);
Session.set('lendee_input',null);
}
if (e.which === 27)
{
Session.set('lendee_input',null); 	
}
}
});

 function selectCategory(e,t){
Session.set('current_list',this._id);
}
 
  
function focus_text(i){
 i.focus();
 i.select();	
}
}
if (Meteor.isServer) {

  Meteor.startup(function () {
    // code to run on server at startup
  });
}

