'use strict';

Parse.initialize("PCceNdSbqYXTd2hN0KhKtiXr0BZGaALUX3WSCGx4");
Parse.serverURL = 'http://assignmentjn.herokuapp.com/parse';

angular.module('Notepad',['ngAnimate', 'toastr'])
	.controller('MainController', function MainController($scope, $rootScope, toastr){
		var vm = this;
		vm.notes = []; // list of notes from Parse server
		vm.active; //open note

		var NoteObj = Parse.Object.extend("Note");

		var query = new Parse.Query(NoteObj);
		query.find({
			success: function(notes){
				$scope.$apply(function(){
					vm.notes = notes;
				});
			},
			error: function(error){
				toastr.error("Couldn't retrieve the notes!");
			}
		});

		vm.openNote = function(id){
			vm.notes.forEach(function(note,index){
				if(note.id == id){
					vm.active = {
						index: index, 
						id: id, 
						title: note.get('title'),
						text: note.get('text')
					};
				}
			});
		};

		vm.addNote = function(){
			var note = new NoteObj();
			note.save({"title": "","text": ""}).then(function(createdEmptyNote) {
				$scope.$apply(function(){
					vm.notes.push(createdEmptyNote);
				});
				vm.active = {
					index: (vm.notes.length-1),
					id: createdEmptyNote.id,
					title: createdEmptyNote.get("title"),
					text: createdEmptyNote.get("text")
				};
			});
		};

		vm.removeNote = function(){
			var note = vm.notes.splice(vm.active.index,1);
			note[0].destroy({
				success: function(note){
					toastr.success(note.get('title') + ' has successfully been removed!','Note removed');
					vm.active = {};
				},
				error: function(note,error){
					toastr.error('Something went wrong');
				}
			});
		};

		vm.saveNote = function(){
			var text = vm.active.text,
				title= text.substring(0,15);

			vm.notes[vm.active.index].save({"title": title,"text": text}).then(function(savedNote) {
				vm.notes[vm.active.index] ;
				vm.active.text = savedNote.get('text');
				vm.active.title = savedNote.get('title');
				toastr.success(savedNote.get('title') + ' has successfully been saved!','Note saved');
			});
		};

		vm.isSelected = function(note){
			if( vm.active && note.id == vm.active.id) return "selectedNote";
		};
	});

	

			