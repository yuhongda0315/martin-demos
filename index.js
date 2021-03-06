let { Stream, Observer } = new RongRTCLib();
let observer = new Observer((stream) => {
  let { type, user, mediaStream } = stream;
  if(type == 'added'){
    // 用户已加入房间且媒体流已到达客户端，可将创建 Video 节点后将媒体流展示至页面
    let video = document.createElement('video');
    video.srcObject = mediaStream;
		video.autoplay = true;
		video.id = user.id;
    // 将 video 添加至容器 (div 或其他节点) 中
  }
  // 用户流发生改变，比如音视频切换视频、视频切换为音频
  if(mediaType == 'changed'){
    let { type } = stream;
    // 此时可更新 UI 比如视频切换音频，可展示对应的音频背景图
  }
});
observer.observe(Stream, {
  // 监听添加用户媒体流事件
  added: true,
  // 监听用户发布媒体流变化
  changed: true
});


function InputStream(){
	this.open = function(){

	};
	this.close = function(){

	};
	this.read = function(){

	};
}

function OutputStream(){
	this.open = function(){

	};
	this.close = function(){

	};
	this.write = function(){
		
	};
}