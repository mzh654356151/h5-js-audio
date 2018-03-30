window.onload = function () {
    var audio = document.getElementById('audio'), // 音乐
        sourceList = audio.getElementsByTagName('source'), // 音乐列表
        play = document.getElementById('play'), // 播放按钮
        prev = document.getElementById('prev'), // 上一曲
        next = document.getElementById('next'), // 下一曲
        jingyin = document.getElementById('jingyin'), // 静音
        voiceBar = document.getElementById('voice-bar'), // 音量调节
        musicBar = document.getElementById('music-bar'), // 播放进度控制
        playedBar = document.getElementById('played-bar'), // 已播放进度条
        voicedBar = document.getElementById('voiced-bar'), // 已播放进度条
        musicTitle = document.getElementById('title'), // 音乐标题
        loadBar = document.getElementById('load-bar'), // 加载进度条
        currentTime = document.getElementById('current-time'), // 当前音乐时间
        totalTime = document.getElementById('total-time'), // 当前音乐时间
        musicImg = document.getElementById('music-img'), // 音乐封面
        xunhuan = document.getElementById('xunhuan'), // 循环按钮
        mlist=document.getElementById('oncl').getElementsByTagName('li'),//歌单列表
        micon=document.getElementById('oncl').getElementsByTagName('div'),//播放标志
        needle=document.getElementById('needle'),//唱碟指针
        listbtn=document.getElementById('listbtn'),//歌单按钮
        musicList=document.getElementById('music-list'),
        phonelist=document.getElementById('gedan'),
        lyric_txt=document.getElementById("lyric_txt"),//歌词
        lyric_con=document.getElementById("lyric_con"),
        lyrichead=document.getElementById('lyrichead'),
        lyricbtn=document.getElementById('lyricbtn'),//响应式歌词按钮
        gecilist=document.getElementById('geci'),
        phonelyric=document.getElementById('lyric'),
        currentSrcIndex = 0,
        btnflag=0,//歌单显示隐藏按钮
        lyricflag=1;//歌词显示隐藏按钮
    // 网易云音乐模块
    var keyword = document.getElementById('keyword'); // 搜索歌名
    var searchBtn = document.getElementById('search-btn'); // 搜索按钮
    var result = document.getElementById('result'); // 结果区
    var toPlay = document.getElementById('to-play'); // 立即播放按钮

    // 是否循环播放
    audio.loop = false;

    // 是否自动播放
    audio.autoplay = false;

    // 初始化音量
    audio.volume = 0.5;
    var voicedBarWidth = (audio.volume / 1) * voiceBar.clientWidth;
    voicedBar.style.width = voicedBarWidth + 'px';

    // 是否自动缓冲加载
    audio.autobuffer = true;

    // 显示第一首歌曲时长
    (function () {
        var fen = parseInt(audio.duration / 60);
        var miao = parseInt(audio.duration % 60);
        if (miao < 10) {
            miao = '0'+miao;
        }
        totalTime.innerHTML = fen + ':' + miao;
        loadLyric();
    })();
//加载歌词
    function loadLyric()
        {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            lyric_txt.innerHTML=lyric_ctrl(xmlhttp.responseText);
        }
    }
    var title = sourceList[currentSrcIndex].title;
    xmlhttp.open("GET","lyric/" + title +".lrc",true);
    xmlhttp.send();
        }
    function lyric_ctrl(txt) {
        var lyricObj=txt;
        var temp=lyricObj.split("[");
        var html="";
        for(var i=0;i<temp.length;i++)
        {
            var arr=temp[i].split("]");
            var text=(arr[1]);
            var time=arr[0].split(",");
            var temp2=time[0].split(".");
            var ms=temp2[1];//毫秒
            var temp3=temp2[0].split(":");
            var s=temp3[1];//秒
            var m=temp3[0];//分
            var s_sum=parseInt(m*60)+parseInt(s);
            if(text)
            {
                html+="<p id='lyric"+s_sum+"'>"+text+"</p>"+"<br>";
            }
        }
        return html;
    }

    for (var i=0;i<mlist.length;i++){
        clickList(i);
    }
    //点击歌单播放歌曲
    function clickList(n){
        mlist[n].onclick=function(){
            currentSrcIndex=n;
            var currentSrc = sourceList[n].getAttribute('src');
            var currentImg = sourceList[n].getAttribute('data-img');
            musicImg.setAttribute('src', currentImg);
            audio.setAttribute('src', currentSrc);
            audio.play();
            play.innerHTML = '||';
            musicImg.style.animation = 'xuanzhuan 5s linear infinite';
            musicTime(n);
            rotaten();
            seticon(n);
            loadLyric();
        }
    }
    phonelist.onclick=function(){
        musicList.style.display="inline";
        if(btnflag==0){
            musicList.style.left='0';
            musicList.style.opacity='1';
            btnflag=1;
        }
        else {
            musicList.style.left='-100%';
            musicList.style.opacity='0';
            btnflag=0;
        }
    };
    var changpian=document.getElementById('changpian'),
        geciflag=0;
    phonelyric.onclick=function(){
        if(geciflag==0){
            gecilist.style.display="inline-block";
            changpian.style.display="none";
            geciflag=1;
        }
        else {
            gecilist.style.display="none";
            changpian.style.display="inline-block";
            geciflag=0;
        }
    };
    var mL=document.getElementById('musiclist');
    //歌单隐藏/显示
    listbtn.onclick=function(){
        if(btnflag==0){
            musicList.style.left='-35%';
            musicList.style.opacity='0';
            btnflag=1;
        }
        else {
            musicList.style.left='6%';
            musicList.style.opacity='1';
            btnflag=0;
        }
    };
    lyricbtn.onclick=function(){
        if(lyricflag==0){
            gecilist.style.opacity='1';
            lyricflag=1;
        }
        else {
            gecilist.style.opacity='0';
            lyricflag=0;
        }
    };
    //设置正在播放效果
    function seticon(n){
        for(var i=0;i<micon.length;i++){
            if(n!==i){
                micon[i].className="";
            }
        }
        if(audio.paused){
            micon[n].className="jicon";}
        else {
            micon[n].className="micon";
        }
    }
    //指针移动
    function rotaten(){
        if(audio.paused){
            needle.style.transform="rotate(-25deg)";
        }
        else {
            needle.style.transform="rotate(0deg)";
        }
    }
    // 播放 暂停
    play.onclick = function () {
        if (audio.paused) {
            audio.play();
            this.innerHTML = '||';
            musicImg.style.animation = 'xuanzhuan 5s linear infinite';
            rotaten();
            seticon(currentSrcIndex);
        } else {
            audio.pause();
            this.innerHTML = '►';
            musicImg.removeAttribute('style');
            rotaten();
            seticon(currentSrcIndex);
        }
        musicTime(currentSrcIndex);
    };
    // 下一曲
    next.onclick = function () {
        changeMusic('next');
        rotaten();
        seticon(currentSrcIndex);
        loadLyric();
    };
    // 上一曲
    prev.onclick = function () {
        changeMusic('prev');
        rotaten();
        seticon(currentSrcIndex);
        loadLyric();
    };
    // 切换歌曲
    function changeMusic (direct) {
        if (direct === 'next') {
            ++ currentSrcIndex > sourceList.length - 1 && (currentSrcIndex = 0); // 下一曲
        } else {
            -- currentSrcIndex < 0 && (currentSrcIndex = sourceList.length -1); // 上一曲
        }
        currentSrc = sourceList[currentSrcIndex].getAttribute('src');
        currentImg = sourceList[currentSrcIndex].getAttribute('data-img');
        musicImg.setAttribute('src', currentImg);
        audio.setAttribute('src', currentSrc);
        audio.play();
        play.innerHTML = '||';
        musicImg.style.animation = 'xuanzhuan 5s linear infinite';
        musicTime(currentSrcIndex);
    }
    // 音量调节（增加黄色现在音量显示）
    voiceBar.onclick = function (event) {
        var voiceBarWidth = voiceBar.clientWidth;
        var newVolume = (event.offsetX / voiceBarWidth);
        audio.volume = newVolume;

        // 音量大小更新
        var voicedBarWidth = (audio.volume / 1) * voiceBarWidth;
        voicedBar.style.width = voicedBarWidth + 'px';
    };
    // 播放进度控制
    musicBar.onclick = function (event) {
        var musicBarWidth = musicBar.clientWidth;
        var newCurrentTime = (event.offsetX / musicBarWidth) * audio.duration;
        audio.currentTime = newCurrentTime;
        var playedBarWidth = (audio.currentTime / audio.duration) * musicBarWidth;
        playedBar.style.width = playedBarWidth + 'px';
    };
    // 播放进度实时更新(修改为歌曲播放时开启定时器，暂停和页面load时清除定时器)
    function movelyric(){
        var id_num=parseInt(audio.currentTime);
        var lyric_p=document.getElementsByTagName("p");
        for(var i=0;i<lyric_p.length;i++)
        {
            lyric_p[i].index=i;
        }
        if(document.getElementById("lyric"+id_num))
        {
            var obj=document.getElementById("lyric"+id_num);
            for(var i=0;i<obj.index;i++)
            {
                lyric_p[i].className="played";
            }
            for(var j=obj.index;j<lyric_p.length;j++)
            {
                lyric_p[j].className="";
            }
            obj.className="yellow active";
            lyric_txt.style.top=lyric_con.offsetHeight/3-obj.offsetTop+"px";
        }
    }
    setInterval(function (){
        movelyric();
        var musicBarWidth = musicBar.clientWidth;
        var playedBarWidth = (audio.currentTime / audio.duration) * musicBarWidth;
        playedBar.style.width = playedBarWidth + 'px';
        if (audio.currentTime % 60 < 10) {
            currentTime.innerHTML = parseInt(audio.currentTime / 60) + ':0' + parseInt(audio.currentTime % 60);
        } else {
            currentTime.innerHTML = parseInt(audio.currentTime / 60) + ':' + parseInt(audio.currentTime % 60);
        }
        //如果是时间结束，并且是非单曲循环，自动下一曲
        if (audio.currentTime === audio.duration && !audio.loop) {
            next.onclick();
        }
    }, 100);
    // 静音
    jingyin.onclick = function () {
        if (!audio.muted) {
            audio.muted = true;
            voicedBar.style.width = 0 +'px';
        }else {
            audio.muted = false;
            var voiceBarWidth = voiceBar.clientWidth;
            // 音量大小更新
            var voicedBarWidth = (audio.volume / 1) * voiceBarWidth;
            voicedBar.style.width = voicedBarWidth + 'px';
        }
    };

    // 判断文件缓冲进度
    setInterval(function updateCache () {
        var buffered, percent;
        // 已缓冲部分
        audio.readyState == 4 && (buffered = audio.buffered.end(0));
        // 已缓冲百分百
        audio.readyState == 4 && (percent = Math.round(buffered / audio.duration * 100) + '%');
        loadBar.style.width = (Math.round(buffered / audio.duration * 100) * musicBar.clientWidth * 0.01) + 'px';
    }, 1000);
    // 计算音乐时间
    function musicTime(k) {
        // 更换播放歌曲
        musicTitle.innerHTML = sourceList[k].title;
        lyrichead.innerHTML = sourceList[k].title;
        // 播放时间显示
        audio.addEventListener("canplay", function(){
            var sc=audio.duration;
            var fen = parseInt(sc / 60);
            var miao = parseInt(sc % 60);
            if (miao < 10) {
                totalTime.innerHTML = fen + ':0' + miao;
            }else {
                totalTime.innerHTML = fen + ':' + miao;
            }
        });
    }

    // 是否单曲循环
    xunhuan.onclick = function () {
        if (audio.loop) {
            audio.loop = false;
            this.innerHTML = '循环';
        } else {
            audio.loop = true;
            this.innerHTML = '单曲';
        }
    };

    var toPlay = document.getElementById('to-play'); // 立即播放按钮
    var result = document.getElementById('result'); // 结果区

    // 利用委托来为立即播放绑定事件
    result.addEventListener('click', function (ev) {
        var t = ev.target || ev.srcElement;
        if (t.tagName === 'A') {
            var oMusicSrc = result.getAttribute('data-audio');
            var oMusicImg = result.getAttribute('data-img');
            var oMusicName = result.getAttribute('data-music');
            var oSinger = result.getAttribute('data-singer');
            musicImg.setAttribute('src',oMusicImg);
            musicTitle.innerHTML = oMusicName + '-' + oSinger;
            audio.setAttribute('src', oMusicSrc);
            audio.play();
            play.innerHTML = '||';
            musicImg.style.animation = 'xuanzhuan 5s linear infinite';
        }

    });

    // 搜索按钮
    searchBtn.addEventListener('click', function () {
        var value = keyword.value;
        if (!value) {
            alert('关键词不能为空');
            return;
        }
        var url = "http://s.music.163.com/search/get/";
        var data = {
            "type": 1,
            "limit": 1,
            "s": value,
            "callback": "jsonpcallback"
        };
        var buffer = [];
        for (var key in data) {
            buffer.push(key + '=' + encodeURIComponent(data[key]));
        }
        var fullpath = url + '?' + buffer.join('&');
        CreateScript(fullpath);
    });

    function CreateScript (src) {
        var el = document.createElement('script');
        el.src = src;
        el.async = true;
        el.defer = true;
        document.body.appendChild(el);
    }
};
