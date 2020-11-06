window.onload = function(){
	'use strict'
	var sqlite3 = require('sqlite3');
	var fs = require('fs');
	var db = new sqlite3.Database('messages.db');
	var text = document.getElementById("text");
	var message = document.getElementById("message");
	var file = document.getElementById("file");
	var target_result;
	var file_name;
	var submit = document.getElementById("submit");
	var all_delete_button = document.getElementById("all-delete-button");
	var content = document.getElementById("content");
	db.each("SELECT * FROM messages", function(err,row){
		var audio = document.createElement("audio");
		audio.src = `uploads/${row['id']}/${row['image']}`;
		audio.controls = true;
		audio.classList.add("audios");
		content.appendChild(audio);
	});
	all_delete_button.addEventListener('click', function(){
		db.each("SELECT * FROM messages", function(err, row){
			fs.unlinkSync(`uploads/${row['id']}/${row['image']}`);
			fs.rmdirSync(`uploads/${row['id']}`);
			db.run("DELETE FROM messages");
		});
		$('.audios').remove();
	});	
	file.addEventListener('change', function(e){
		var reader = new FileReader();
		reader.onload = function(e){
			target_result = e.target.result;
		}
		reader.readAsDataURL(e.target.files[0]);
		file_name = e.target.files[0];
	});
	submit.addEventListener('click', function(){
		var file_name_go;
		file.value = "";
		var message_id = 0;
		if(file_name != null){
			file_name_go = file_name.name
		}else{
			file_name_go = null;
		}
		var stmt = db.prepare("INSERT INTO messages(image) VALUES(?)");
		stmt.run(file_name_go);
		var p = document.createElement("p");
		var kaku = ["mp3", "wav"];
		var audio_data;
		if(file_name_go != null && target_result != null){
			// img_data = target_result.replace(/^+,/, "");
			if(file_name_go.match(kaku[0]) || file_name_go.match(kaku[1])){
				var audio = document.createElement("audio");
				audio.controls = true;
				audio.src = target_result;
				audio.classList.add("audios");

				content.appendChild(audio);
				audio_data = target_result.replace(/^data:audio\/mpeg;base64,/, "")
				db.each("SELECT * FROM messages where id = last_insert_rowid()",function(err, row){
					message_id = row["id"];
					if(!fs.existsSync('uploads')){
						fs.mkdirSync(`uploads`);
					}
					if(!fs.existsSync(`uploads/${message_id}`)){
						fs.mkdirSync(`uploads/${message_id}`);
					}
					fs.writeFile(`uploads/${message_id}/${file_name_go}`, audio_data, 'base64',function(err){
						if(err){
							console.log(err)
						}
					});
					file_name_go = null;
					message_id = null;
					audio_data = null;

				});
			}
		}
	});
	document.onkeydown = function(e){
		if(e.keyCode == 116 || (e.ctrlKey && e.keyCode == 82)){
            if (e.preventDefault)
            {
                e.preventDefault();
                e.stopPropagation();
            }
		}
	}
	function base64Encode(...parts) {
	  return new Promise(resolve => {
	    const reader = new FileReader();
	    reader.onload = () => {
	      const offset = reader.result.indexOf(",") + 1;
	      resolve(reader.result.slice(offset));
	    };
	    reader.readAsDataURL(new Blob(parts));
	  });
	}
	function base64Decode(text, charset) {
	  return fetch(`data:text/plain;charset=${charset};base64,` + text).then(response => response.text());
	}

	function base64DecodeAsBlob(text, type = "text/plain;charset=UTF-8") {
	  return fetch(`data:${type};base64,` + text).then(response => response.blob());
	} 
}