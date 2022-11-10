const { createApp } = Vue;

const app = Vue.createApp({
  data() {
    return {
      url: "https://en.wikipedia.org/wiki/Women%27s_high_jump_world_record_progression",
      message: "Hello Vue!",
      loading: true,
      error: "",
      data: [],
      chartData: {
        labels: [1, 2, 3, 4, 6, 7, 9],
        datasets: [
          {
            label: "My First Dataset",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "tete",
            data: [32, 54, 65, 32, 56, 55, 21],
            fill: false,
            borderColor: "rgb(55, 32, 22)",
            tension: 0.1,
          },
        ],
      },
      dataChartLine: {
        labels: [],
        datasets: [],
      },
      dataChartBar: {
        labels: [],
        datasets: [
          {
            label: "",
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    async crawl() {
      var request = await axios.get("/api/scan-data?url=" + this.url);
      if (request.data.status) {
        if (request.data.data.length > 0) {
          this.data = request.data.data;
          this.handleDataChartLine();
          this.handleDataChartBar();
        }
      } else {
        this.error = request.data.msg;
      }
    },
    random_rgba() {
      var o = Math.round,
        r = Math.random,
        s = 255;
      return (
        "rgba(" +
        o(r() * s) +
        "," +
        o(r() * s) +
        "," +
        o(r() * s) +
        "," +
        r().toFixed(1) +
        ")"
      );
    },
    handleDataChartBar() {
      var _this = this;
      var dataChart = this.data;
      var arrayYear = [];
      dataChart.map((item) => {
        const init = item.Athlete.indexOf("(");
        const fin = item.Athlete.indexOf(")");
        item.region = item.Athlete.substr(init + 1, fin - init - 1);
        var date = new Date(item.Date);
        item.date = date.getFullYear();
        arrayYear.push(date.getFullYear());
      });

      var arrayUniqueByKey = [
        ...new Map(dataChart.map((item) => [item["date"], item])).values(),
      ];
      arrayUniqueByKey.map((item) => {
        _this.dataChartBar.datasets[0].data.push(parseFloat(item.Mark));
        _this.dataChartBar.labels.push(item.date);
        _this.dataChartBar.datasets[0].backgroundColor.push(
          _this.random_rgba()
        );
        _this.dataChartBar.datasets[0].borderColor.push(_this.random_rgba());
      });
    },
    handleDataChartLine() {
      var _this = this;
      Object.keys(this.data).sort(function (a, b) {
        return a.Athlete - b.Athlete;
      });
      var arrayYear = [];
      this.data.map((item) => {
        const init = item.Athlete.indexOf("(");
        const fin = item.Athlete.indexOf(")");
        item.region = item.Athlete.substr(init + 1, fin - init - 1);
        var date = new Date(item.Date);
        arrayYear.push(date.getFullYear());
      });

      var chartLineGroup = this.data.reduce(
        (entryMap, e) =>
          entryMap.set(e.region, [...(entryMap.get(e.region) || []), e]),
        new Map()
      );
      arrayYear = [...new Set(arrayYear)];
      // _this.dataChartLine.labels = arrayYear;
      chartLineGroup.forEach((item) => {
        var objectLine = {
          label: "",
          data: [],
          fill: false,
          borderColor: "",
          tension: 0.1,
        };
        if (item.length > 0) {
          item.map((line) => {
            objectLine.label = line.region;
            objectLine.borderColor = _this.random_rgba();
            const lineMask = line.Mark;
            objectLine.data.push(lineMask);
          });
          this.dataChartLine.datasets.push(objectLine);
        }
      });
      this.loading = false;
      this.$forceUpdate();
    },
  },
}).mount("#app");

const ctx = document.getElementById("myChart").getContext("2d");
const ctxBar = document.getElementById("myChartBar").getContext("2d");
function renderChart() {
  setTimeout(() => {
    const myChart = new Chart(ctx, {
      type: "line",
      data: app.dataChartLine,
    });
    new Chart(ctxBar, {
      type: "bar",
      data: app.dataChartBar,
    });
  }, 1000);
}
function exportImageLine() {
  const canvas = document.getElementById("myChart");
  download(canvas.toDataURL(),"outputLine","png");
}
function exportImageBar() {
  const canvas = document.getElementById("myChartBar");
  download(canvas.toDataURL(),"outputBar","png");
}
