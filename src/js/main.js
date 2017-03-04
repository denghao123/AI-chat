var socket = io.connect("ws://localhost:8000");

var vm = new Vue({
  el: "#app",
  data: {
    list: [],
    input: "",
    userName: ""
  },

  ready() {
    this.createUser();
    this.init();
    this.list = [{
      name: "AI",
      txt: "hi,我是小i"
    }];

    this.scrollToBottom();
  },

  methods: {
    createUser() {
      var names = ["刘禅", "庄周", "韩信", "墨子", "李白", "貂蝉", "妲己", "小乔", "后羿", "张良", "荆轲", "达摩", ];
      this.userName = names[parseInt(names.length * Math.random())];
    },

    init() {
      var self = this;
      socket.on("server_send", function(data) {
        if (data) {
          self.list.push({
            name: "AI",
            txt: data
          });
          self.scrollToBottom();
        }
      })
    },

    send() {
      var self = this;
      if (self.input) {
        self.list.push({
          name: self.userName,
          txt: self.input
        });
        self.scrollToBottom();
        socket.emit("client_send", self.input);
        self.input = "";
      } else {
        //alert("请输入内容");
      }
    },

    scrollToBottom() {
      var list = document.getElementById('list');
      window.scrollTo(0, list.clientHeight);
    }

  }
})