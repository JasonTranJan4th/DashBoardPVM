import dayjs from "dayjs";
import dashboardApi from "./api/dasboardApi";
import Chart from 'chart.js/auto';

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
                    label: "Actual",
                    data: [],
                    borderWidth: 0,
                    backgroundColor: [],
                    order: 2
                }, {
                    data: [],
                    type: 'line',
                    label: "Target",
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
                            enabled: true,
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
                    responsive: true,
                    interaction: {
                        mode: "index"
                    }
                },
            });
        }
    }
}

const getQuantity = (data, typeOfQuantity, type) => {
    let result = 0;
    for (let i = 0; i < data.length; i++) {
        result = result + data[i][typeOfQuantity][type];
    }

    return result;
}

const updateTotalCountData = (element, value, type) => {
    const ele = document.getElementById(element);

    if (ele) {
        ele.classList.remove("text_success", "text_danger");
        ele.textContent = new Intl.NumberFormat().format(value[type]);

        if (type !== "target") {
            if (Number.parseInt(value.diff) < 0) {
                ele.classList.add("text_danger");
            } else {
                ele.classList.add("text_success");
            }
        }
    }
}

const initLoadToTalCount = (data, area) => {
    const value = {
        target: getQuantity(data, `${area}Quantity`, "target"),
        actual: getQuantity(data, `${area}Quantity`, "actual"),
        diff: getQuantity(data, `${area}Quantity`, "different")
    }

    updateTotalCountData(`${area === "finish" ? "fg" : area}-target`, value, "target");
    updateTotalCountData(`${area === "finish" ? "fg" : area}-actual`, value, "actual");
    updateTotalCountData(`${area === "finish" ? "fg" : area}-diff`, value, "diff");
}

const dataOfEachProduct = (product, data) => {
    return data.filter(x => x.name.toUpperCase() === product.name.toUpperCase());
};

const initLoadGaugeData = (element, product, data, type, index) => {
    const gaugeInfoEle = document.querySelector(`.${element} .${product.name} .gauge_info`);
    if (gaugeInfoEle) {
        gaugeInfoEle.textContent = `${new Intl.NumberFormat().format(data.actual)}/${new Intl.NumberFormat().format(data.target)}`;
    }

    const gaugePercent = document.querySelector(`.${element} .${product.name} .gauge_percent`);
    if (gaugePercent) {
        if (data.actual == 0 || data.total == 0) {
            gaugePercent.textContent = `0%`;
        } else {
            if (data.actual == data.target) {
                gaugePercent.textContent = `100%`;
            }
            gaugePercent.textContent = `${(Math.round((data.actual / data.target) * 100))}%`;
        }
    }

    let chartData = [];
    if (data.actual == 0 || data.target == 0) {
        chartData = [];
    }
    else
        if (data.actual >= data.target) {
            chartData = [100, 0];
        } else {
            chartData = [data.actual, data.target - data.actual]
        }

    // const chartData = [1, 1]

    const chart = Chart.getChart(`${type}_gauge_${index + 1}`);
    if (chart) {
        chart.config.data.datasets[0].data = chartData;
        chart.update();
    }
}

const initLoadMainData = (data, index, type) => {

    const COLORS = {
        red: "#fb0003",
        green: "#05b259"
    };

    const tooltipFontSize = window.getComputedStyle(document.querySelector(".gauge .gauge_info"), null).getPropertyValue('font-size').split(".")[0];

    const targetData = [];
    const actualData = [];
    const labelData = [];
    const colors = [];

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        if (element.actual < element.target) {
            colors.push(COLORS.red);
        } else {
            colors.push(COLORS.green)
        }

        targetData.push(element.target);
        actualData.push(element.actual);
        labelData.push(element.display);
    }

    const chart = Chart.getChart(`${type}_${index + 1}`);
    console.log(chart);
    if (chart) {
        chart.config.data.labels = labelData;
        chart.config.data.datasets[0].data = actualData;
        chart.config.data.datasets[1].data = targetData;
        chart.config.data.datasets[0].backgroundColor = colors;
        chart.config.options.plugins.tooltip = { ...chart.config.options.plugins.tooltip, titleFont: { size: Number.parseInt(tooltipFontSize) }, bodyFont: { size: Number.parseInt(tooltipFontSize) } };
        chart.update();
    }
}

const initProductData = (product, productData, index) => {
    initLoadMainData(productData[0].semiProductions, index, "semi");
    initLoadMainData(productData[0].finishProductions, index, "fg");

    initLoadGaugeData("content-semi", product, productData[0].semiQuantity, "semi", index);
    initLoadGaugeData("content-finished", product, productData[0].finishQuantity, "fg", index);

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

        renderChart("semi", 5);
        renderChart("fg", 5);

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

        async function fetchDataAndReload() {

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
                const { data } = await dashboardApi.getAll({ "thinknext_key": key });
                // console.log('check', data);

                const PRODUCTS = [
                    {
                        name: "mentos",
                        semi: 0,
                        fg: 1,
                    },
                    {
                        name: "gum",
                        semi: 0,
                        fg: 1,
                    }
                ];

                initLoadToTalCount(data, "semi");
                initLoadToTalCount(data, "finish");

                for (let i = 0; i < PRODUCTS.length; i++) {
                    const productData = dataOfEachProduct(PRODUCTS[i], data);
                    initProductData(PRODUCTS[i], productData, i);
                }

            } catch (error) {
                console.log("failed to fetch data", error);
            }

            setTimeout(fetchDataAndReload, 5000);
        }

        fetchDataAndReload();
    } else {
        window.location.assign("login.html");
    }
})();
