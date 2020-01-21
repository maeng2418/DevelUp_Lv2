var socket = io();

socket.on('connect', function() {
  var name = prompt('애칭을 입력해주세요.', '')

  if(!name) {
    name = '익명';
  }
	
  document.getElementById('name').value = name;
	
  socket.emit('newUser', name)
})

document.getElementById("send").addEventListener("click", function(event){
	//닉네임 값 가져오기
	var name = document.getElementById('name').value;
	//메시지 값 가져오기
	var msg = document.getElementById('message').value;
	//가져왔으니 데이터 빈칸으로 변경
	document.getElementById('message').value = '';
	//서버로 가져온 메시지 전달
	socket.emit('send message', name, msg);
	//새로고침 막기
	event.preventDefault();
});
	  
socket.on('create name', function(name){   // 이름 셋팅 - 2
	document.getElementById('name').value = name;
});
	  

socket.on('change name', function(oldname, name){   // 닉네임을 바꿨을 때 - 3
	document.getElementById('name').value = name;
	var node = document.createElement("div");                 // Create a <li> node
	var chatText = '<알림> ' + oldname + '님이 ' + name +'님으로 닉네임을 변경했습니다.\n';
	var textnode = document.createTextNode(chatText);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	document.getElementById("chatLog").appendChild(node);     // Append <li> to <ul> with id="myList"
});
	  

socket.on('receive message', function(msg){   // 메세지를 받았을 때 - 4
	var node = document.createElement("div");                 // Create a <li> node
	var chatText = msg+'\n';
	var textnode = document.createTextNode(chatText);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	var chatLog = document.getElementById("chatLog");
	chatLog.appendChild(node);     // Append <li> to <ul> with id="myList"
	// chatLog.scrollTop = div.scrollHeight; // 스크롤바 자동 아래로
});
	  

socket.on('new_disconnect', function(name){  // 채팅방 접속이 끊어졌을 때 - 5
	var node = document.createElement("div");                 // Create a <li> node
	var chatText = '<알림> ' + name + '님이 채팅창을 떠났습니다.\n';
	var textnode = document.createTextNode(chatText);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	document.getElementById("chatLog").appendChild(node);     // Append <li> to <ul> with id="myList"
});
	  

socket.on('new_connect', function(name){  // 채팅방에 접속했을 때 - 6
	var node = document.createElement("div");                 // Create a <li> node
	var chatText = '<알림> ' + name + '님이 채팅창에 접속했습니다.\n';
	var textnode = document.createTextNode(chatText);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	document.getElementById("chatLog").appendChild(node);     // Append <li> to <ul> with id="myList"
});