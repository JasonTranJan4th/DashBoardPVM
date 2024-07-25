import Chart from 'chart.js/auto';
import dayjs from 'dayjs';
import dashboardApi from './api/dasboardApi';

const renderChart = (location, numberOfChart) => {
    for (let i = 1; i <= numberOfChart; i++) {
        let gaugeChart = Chart.getChart(`${location}_gauge_${i}`);
        let mainChart = Chart.getChart(`${location}_${i}`);

        if (gaugeChart) {
            gaugeChart.destroy();
        }

        if (mainChart) {
            mainChart.destroy();
        }

        const gaugeChartEle = document.getElementById(`${location}_gauge_${i}`);
        const mainChartEle = document.getElementById(`${location}_${i}`);

        if (gaugeChartEle && mainChartEle) {
            const gaugeData = {
                labels: [],
                datasets: [{
                    label: "Gauge",
                    data: [],
                    backgroundColor: [
                        "rgb(54, 162, 235)",
                        "rgb(255, 99, 132)",
                    ],
                    circumference: 180,
                    rotation: 270,
                    cutout: '60%',
                }]
            };

            const mainData = {
                datasets: [{
                    // label: "H-Target",
                    data: [],
                    borderWidth: 0,
                    backgroundColor: [],
                    order: 2
                }, {
                    data: [],
                    type: 'line',
                    // label: "H-Actual",
                    fill: false,
                    tension: 0,
                    pointRadius: 3,
                    borderColor: 'rgb(255, 205, 86)',

                }],
                labels: []
            }

            gaugeChart = new Chart(gaugeChartEle, {
                type: "doughnut",
                data: gaugeData,
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                }
            });

            mainChart = new Chart(mainChartEle, {
                type: "bar",
                data: mainData,
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true
                        },
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    },
                    responsive: true
                },
            });
        }
    }
}

const dataOfEachLocation = (location, productData) => {
    return productData.filter(x => x.type === Number.parseInt(location));
}

const initLoadData = (data, rootEle, type) => {
    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const itemContentEle = document.querySelector(`.${rootEle} .content-semi-list .content-item:nth-child(${i + 1})`);
        if (itemContentEle) {
            const nameEle = itemContentEle.querySelector(".top h5");
            if (nameEle) {
                nameEle.textContent = element.name;
            }

            const gaugePercent = itemContentEle.querySelector(".center .gauge .gauge_percent");
            if (gaugePercent) {
                if (element.quantity.actual == 0 || element.quantity.total == 0) {
                    gaugePercent.textContent = `0%`;
                } else {
                    if (element.quantity.actual == element.quantity.target) {
                        gaugePercent.textContent = `100%`;
                    }
                    gaugePercent.textContent = `${(Math.round((element.quantity.actual / element.quantity.target) * 100))}%`;
                }
            }

            const gaugeInfoEle = itemContentEle.querySelector(".center .gauge .gauge_info");
            if (gaugeInfoEle) {
                gaugeInfoEle.textContent = `${new Intl.NumberFormat().format(element.quantity.actual)}/${new Intl.NumberFormat().format(element.quantity.target)}`;
            }
        }

        let chartData = [];
        if (element.quantity.actual == 0 || element.quantity.target == 0) {
            chartData = [];
        }
        else
            if (element.quantity.actual >= element.quantity.target) {
                chartData = [100, 0];
            } else {
                chartData = [element.quantity.actual, element.quantity.target - element.quantity.actual]
            }

        // const chartData = [1, 1]

        const chart = Chart.getChart(`${type}_gauge_${i + 1}`);
        if (chart) {
            chart.config.data.datasets[0].data = chartData;
            chart.update();
        }


        const COLORS = {
            red: "#fb0003",
            green: "#05b259"
        };

        const targetData = [];
        const actualData = [];
        const labelData = [];
        const colors = [];

        for (let i = 0; i < element.productions.length; i++) {
            const ele = element.productions[i];

            if (ele.actual < ele.target) {
                colors.push(COLORS.red);
            } else {
                colors.push(COLORS.green)
            }

            targetData.push(ele.target);
            actualData.push(ele.actual);
            labelData.push(ele.display);
        }

        const chartMain = Chart.getChart(`${type}_${i + 1}`);
        if (chartMain) {
            chartMain.config.data.labels = labelData;
            chartMain.config.data.datasets[0].data = actualData;
            chartMain.config.data.datasets[1].data = targetData;
            chartMain.config.data.datasets[0].backgroundColor = colors;
            chartMain.update();
        }
    }
}


const initLoadCountData = (data) => {
    const targetEle = document.getElementById("target")
    if (targetEle) {
        targetEle.textContent = new Intl.NumberFormat().format(data.semiQuantity.target + data.finishQuantity.target);
    }

    const actualEle = document.getElementById("actual");
    if (actualEle) {
        actualEle.textContent = new Intl.NumberFormat().format(data.semiQuantity.actual + data.finishQuantity.actual);
        actualEle.classList.remove("text_success", "text_danger");
        if (data.semiQuantity.different + data.finishQuantity.different < 0) {
            actualEle.classList.add("text_danger");
        } else {
            actualEle.classList.add("text_success");
        }
    }

    const diffEle = document.getElementById("diff");
    if (diffEle) {
        diffEle.textContent = new Intl.NumberFormat().format(data.semiQuantity.different + data.finishQuantity.different);
        diffEle.classList.remove("text_success", "text_danger");
        if (data.semiQuantity.different + data.finishQuantity.different < 0) {
            diffEle.classList.add("text_danger");
        } else {
            diffEle.classList.add("text_success");
        }
    }
}


(() => {

    const key = JSON.parse(localStorage.getItem("key"));
    if (key) {

        const navList = document.querySelectorAll("ol li");
        for (let i = 0; i < navList.length; i++) {
            const navEle = navList[i];

            navEle.addEventListener('click', () => {
                const eleAttr = navEle.getAttribute("id");
                switch (eleAttr) {
                    case "nav-main":
                        window.location.assign("index.html");
                        break;
                    case "nav-mentos":
                        window.location.assign("mentos.html");
                        break;
                    case "nav-gum":
                        window.location.assign("gum.html");
                        break;

                    default:
                        break;
                }
            })
        }

        const loggedUser = JSON.parse(localStorage.getItem("user"));

        const contentEle = document.querySelector(".wrapper");
        contentEle.classList.remove("hidden");

        const logoEle = document.querySelector(".user_logo");
        if (logoEle) {
            logoEle.addEventListener("click", () => {
                const sidebarEle = document.querySelector(".sidebar");
                if (sidebarEle) {
                    sidebarEle.classList.toggle("hidden");

                    const loggedUserEle = document.querySelector(".logged_user");
                    if (loggedUserEle) {
                        loggedUserEle.textContent = `${loggedUser.username}`;
                    }

                    const logOutBtn = document.querySelector(".logout");
                    if (logOutBtn) {
                        logOutBtn.addEventListener("click", () => {
                            window.localStorage.clear("key");
                            window.localStorage.clear("user");
                            window.location.reload();
                        })
                    }
                }
            })
        }

        const dateEle = document.querySelector(".header-content .right .date");
        if (dateEle) {
            dateEle.textContent = `${dayjs(new Date()).format('DD-MMM-YY')}`;
        }

        renderChart("semi", 9);
        renderChart("fg", 9);
        /**
         * note: API gửi lên bao nhiêu item thì renderChart sẽ phải render bấy nhiêu item
         */

        function countTime() {
            const timeEle = document.querySelector(".header-content .right .time");
            const shiftEle = document.querySelector(".header-content .left .shift");

            if (timeEle) {
                timeEle.textContent = `${dayjs(new Date()).format('HH:mm:ss')}`;
            }

            if (shiftEle) {
                const d = new Date();
                const hour = d.getHours();

                if (hour >= 6 && hour < 14) {
                    shiftEle.textContent = "Shift 1";
                } else if (hour >= 14 && hour < 22) {
                    shiftEle.textContent = "Shift 2";
                } else {
                    shiftEle.textContent = "Shift 3";
                }
            }

            setTimeout(countTime, 1000);
        }

        countTime();

        async function loadData() {

            if (navigator.onLine.toString() === "false") {
                const errorEle = document.querySelector(".error");
                if (errorEle) {
                    errorEle.classList.remove("hidden");
                }
            } else {
                const errorEle = document.querySelector(".error");
                if (errorEle) {
                    errorEle.classList.add("hidden");
                }
            }

            try {
                const { data } = await dashboardApi.getGum({ "thinknext_key": key });
                // console.log(data);

                initLoadCountData(data);

                const semiData = dataOfEachLocation("0", data.locations);
                const fgData = dataOfEachLocation("1", data.locations);
                // console.log("semi", semiData);
                // console.log("fg", fgData);

                initLoadData(semiData, "content-semi", "semi");
                initLoadData(fgData, "content-finished", "fg");

            } catch (error) {
                console.log("failed to fetch data", error);
            }

            setTimeout(loadData, 5000);
        }

        loadData();
    } else {
        window.location.assign("login.html");
    }

})();