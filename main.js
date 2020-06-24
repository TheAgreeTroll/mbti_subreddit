var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

jsonData = '';

totalCount = 16;
loadedCount = 0;
mbti_labels = ['esfp','esfj','estp','estj','enfp','enfj','entp','entj','isfp','isfj','istp','istj','infp','infj','intp','intj'];
mbti_labels_up = mbti_labels;
for (var i = 0; i < mbti_labels_up.length; i++) {
  mbti_labels_up[i] = mbti_labels[i].toUpperCase();
}

members = Array(mbti_labels.length).fill(0);
online = Array(mbti_labels.length).fill(0);

var ctx_members = document.getElementById('myChart_members').getContext('2d');
var myChart_members = new Chart(ctx_members, {
    type: 'bar',
    data: {
        labels: mbti_labels_up,
        datasets: [{
            label: '# of subreddit members',
            data: members,
            borderWidth: 1,
            backgroundColor: 'rgba(0,100,255,0.4)',
            borderColor: 'rgba(0,100,255,0.6)'
        }
      ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
              ticks: {
                fontSize: 16
              }
            }]
        },
        layout: {
            padding: {
                left: 0,
                right: 20,
                top: 20,
                bottom: 20
            }
        },
    }
});

var ctx_online = document.getElementById('myChart_online').getContext('2d');
var myChart_online = new Chart(ctx_online, {
    type: 'bar',
    data: {
        labels: mbti_labels_up,
        datasets: [{
            label: '# of subreddit active users',
            data: online,
            borderWidth: 1,
            backgroundColor: 'rgba(255,30,0,0.4)',
            borderColor: 'rgba(255,30,0,0.6)'
        }
      ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
              ticks: {
                fontSize: 16
              }
            }]
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20
            }
        }
    }
});

for (var i = 0; i < mbti_labels.length; i++) {
  get_mbti_info(mbti_labels[i]);
}

function get_mbti_info(intpStr) {
  getJSON('https://www.reddit.com/r/' + intpStr + '/about.json',
  function(err, data) {
    idx = mbti_labels.findIndex(el => el == intpStr);
    if (err !== null) {
      console.log('Something went wrong for: ' + intpStr);
      members[idx] = undefined;
      online[idx] = undefined;
    } else {
      jsonData = data;
      members[idx] = jsonData.data.subscribers;
      online[idx] = jsonData.data.accounts_active;
    }
    loadedCount += 1;
    if (loadedCount == totalCount) {

      mbti_labels.sort(function(a,b){return members[mbti_labels.indexOf(b)] - members[mbti_labels.indexOf(a)]});
      online.sort(function(a,b){return members[online.indexOf(b)] - members[online.indexOf(a)]});
      members.sort(function(a,b){return b - a});

      myChart_members.update();
      myChart_online.update();
    }
  });
}
