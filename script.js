// 获取cookie的值
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function tow(n) {
  return n >= 0 && n < 10 ? '0' + n : '' + n;
}

function getDate() {
  let oDate = new Date();
  let currentYear = oDate.getFullYear();
  let targetDate;

  const savedTime = getCookie('customTime');
  if (savedTime) {
    targetDate = new Date(savedTime);
  } else {
    // 动态计算下一次高考日期
    let newYear = 2032; // 默认设置为2032年
    let newMonth = 5; // 月份从 0 开始，所以6月对应的是5
    let newDay = 7;

    // 如果当前日期已经超过6月7日，则设置为下一年的高考日期
    // if (oDate > new Date(newYear, newMonth, newDay)) {
    //   newYear += 1;
    // }
    targetDate = new Date(newYear, newMonth, newDay);
    
    // 更新页面上显示的年份
    if (window.examYear) {
      window.examYear.textContent = newYear;
    }
  }

  let diffTime = targetDate - oDate;

  let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  let diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  let str = tow(diffHours) + '<span>小时 </span>' +
    tow(diffMinutes) + '<span>分 </span>' +
    tow(diffSeconds) + '<span>秒</span>';

  timeBox.innerHTML = str;
  timeDay.innerText = diffDays;
}

// 确保在DOM加载后执行
document.addEventListener('DOMContentLoaded', () => {
  // 初始化全局变量
  window.timeBox = document.querySelector('.countdown');
  window.timeDay = document.querySelector('#day');
  window.examYear = document.getElementById('exam-year');
  
  const settingsIcon = document.getElementById('settings-icon');
  const settingsPanel = document.getElementById('settings-panel');
  const customTitleInput = document.getElementById('custom-title');
  const customTimeInput = document.getElementById('custom-time');
  const saveSettingsButton = document.getElementById('save-settings');
  const resetSettingsButton = document.getElementById('reset-settings');
  const titleElement = document.querySelector('.msg .title');

  if (settingsIcon && settingsPanel) {
    settingsIcon.addEventListener('click', () => {
      settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    saveSettingsButton.addEventListener('click', () => {
      const title = customTitleInput.value;
      const time = customTimeInput.value;
      document.cookie = `customTitle=${title}; path=/`;
      document.cookie = `customTime=${time}; path=/`;
      location.reload();
    });

    resetSettingsButton.addEventListener('click', () => {
      document.cookie = 'customTitle=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'customTime=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      customTitleInput.value = '';
      customTimeInput.value = '';
      location.reload();
    });
  }

  // 初始化页面内容
  const savedTitle = getCookie('customTitle');
  const savedTime = getCookie('customTime');

  if (savedTitle) {
    customTitleInput.value = savedTitle;
    titleElement.textContent = savedTitle;
  }
  if (savedTime) {
    customTimeInput.value = savedTime;
  }

  // 开始倒计时
  getDate();
  setInterval(getDate, 1000);
});
// 获取Bing每日图片并设置到.bgi img中
// 获取Bing每日图片并设置到.bgi img中
function setBingBackground() {
  // 使用第三方Bing壁纸API
  const bingApiUrl = 'https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=zh-CN';
  
  fetch(bingApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应错误');
      }
      return response.json();
    })
    .then(data => {
      const imageUrl = data.url;
      const imageElement = document.querySelector('.bgi img');
      
      if (imageElement) {
        imageElement.src = imageUrl;
        // 设置图片标题和版权信息
        const copyright = data.copyright;
        if (copyright) {
          imageElement.alt = copyright;
        }
      }
    })
    .catch(error => {
      console.error('获取Bing图片失败:', error);
      // 设置默认图片或者错误提示
      const imageElement = document.querySelector('.bgi img');
      if (imageElement) {
        imageElement.src = 'https://picsum.photos/1920/1080';
        imageElement.alt = '背景图片加载失败，使用默认图片';
      }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  setBingBackground();
});


const animation_time = 600
const pause_time = 16000
const saying = document.querySelector('#saying-text')

const getYiyan = () => {
  // fetch('https://hko.gaokaoya.cn/?c=h&c=d&c=i&c=c&encode=json&charset=utf-8')
  fetch('https://v1.hitokoto.cn/?c=h&c=d&c=i&c=c&encode=json&charset=utf-8')
  .then(response => response.json())
  .then(data => {
    if (data.hitokoto) {
      let book = data.from ? ` 《${data.from}》   ` : ''
      let author = data.from_who ? `   --${data.from_who}` : ''
      
      // 修改动画逻辑，确保动画平滑进行
      $(saying).stop(true, true) // 停止当前正在进行的动画
        .fadeOut(animation_time, function() {
          $(this)
            .html(data.hitokoto + book + author)
            .fadeIn(animation_time);
        });
      
      // 设置下一次淡出的定时器
      setTimeout(() => {
        $(saying).fadeOut(animation_time);
      }, pause_time - animation_time * 2); // 调整时间以确保动画完整播放
    }
  })
  .catch(error => {
    console.error('获取一言数据失败:', error);
  });
}

// 确保初始化和定时器的正确设置
document.addEventListener('DOMContentLoaded', () => {
  getYiyan();
  setInterval(getYiyan, pause_time);
});

//welocome_msg
// 发送请求获取地理位置信息
// $.ajax({
//   url: '',
//   dataType: 'jsonp',
//   jsonpCallback: 'callback', // 指定固定的回调函数名为callback
//   data: {
//     output: 'jsonp'
//   },
//   success: function(data) {
//     if (data && data.result && data.result.ad_info) {
//       var province = data.result.ad_info.province + ' ';
//       var city = data.result.ad_info.city + ' ';
//       var district = data.result.ad_info.district + ' ';

//       var welcomeMessage = province + city;
//       if (district) {
//         welcomeMessage += district + '的同学高考加油哦！';
//       } else {
//         welcomeMessage += '的同学高考加油哦！';
//       }

//       $('#welcome_msg').text(welcomeMessage);
//     } else {
//       console.error('未能获取所需信息');
//     }
//   },
//   error: function() {
//     console.error('请求失败');
//   }
// });









            
            
//运行倒计时
document.addEventListener('DOMContentLoaded', () => {
  var blog_running_years = document.getElementById("blog_running_years");
  var blog_running_days = document.getElementById("blog_running_days");

  function refresh_blog_running_time() {
    var start = new Date(2023, 2, 5, 0, 0, 0);
    var now = new Date();
    var years = now.getFullYear() - start.getFullYear();
    var anniversary = new Date(start);
    anniversary.setFullYear(start.getFullYear() + years);
    if (now < anniversary) {
      years = years - 1;
      anniversary = new Date(start);
      anniversary.setFullYear(start.getFullYear() + years);
    }
    var days = parseInt((now - anniversary) / 24 / 60 / 60 / 1000);
    blog_running_years.innerHTML = years;
    blog_running_days.innerHTML = days;
  }

  refresh_blog_running_time();
  if (typeof bottomTimeIntervalHasSet == "undefined") {
    var bottomTimeIntervalHasSet = true;
    setInterval(function () {
      refresh_blog_running_time();
    }, 500);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('snow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let vw = 0, vh = 0;
  let flakes = [];
  function rnd(min, max) { return Math.random() * (max - min) + min; }
  function createFlakes() {
    const area = vw * vh;
    const target = Math.round(area / 9000) + 90;
    const current = flakes.length;
    if (current < target) {
      for (let i = current; i < target; i++) {
        flakes.push({
          x: Math.random() * vw,
          y: Math.random() * vh,
          r: rnd(1, 3.5),
          vy: rnd(0.3, 1.2),
          vxAmp: rnd(0.5, 1.5),
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (current > target) {
      flakes = flakes.slice(0, target);
    }
  }
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    vw = canvas.width / dpr;
    vh = canvas.height / dpr;
    createFlakes();
  }
  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    const t = Date.now() * 0.001;
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.vy * (0.6 + f.r * 0.15);
      f.x += Math.sin(t * f.vxAmp + f.phase) * 0.4;
      if (f.y > vh + f.r + 5) {
        f.y = -f.r - rnd(0, 20);
        f.x = Math.random() * vw;
        f.r = rnd(1, 3.5);
        f.vy = rnd(0.3, 1.2);
        f.vxAmp = rnd(0.5, 1.5);
        f.phase = Math.random() * Math.PI * 2;
      }
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      g.addColorStop(0, 'rgba(255,255,255,0.95)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    requestAnimationFrame(step);
  }
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(step);
});


document.addEventListener('DOMContentLoaded', () => {
  const strip = document.getElementById('lantern-strip');
  if (!strip) return;
  const src = strip.getAttribute('data-src');
  if (!src) return;
  const img = new Image();
  img.onload = () => {
    function applyBg(h) {
      strip.style.height = h + 'px';
      strip.style.backgroundImage = `url('${src}')`;
      strip.style.backgroundSize = `auto ${h}px`;
    }
    const h = img.naturalHeight || 34;
    applyBg(h);
    function update() {
      const currentH = Math.min(Math.max(h, 24), 120);
      applyBg(currentH);
    }
    window.addEventListener('resize', update);
  };
  img.src = src;
});
