import Chart from 'chart.js/auto';
import dayjs from 'dayjs';
import { mentosDetail } from './data/mentos-data';
import dashboardApi from './api/dasboardApi';

// const semiDlineChart = document.getElementById('semiDlineChart');

// const data = {
//     labels: [
//         'Actual',
//         'Diff',
//     ],
//     datasets: [{
//         label: 'D-line',
//         data: [70, 30],
//         backgroundColor: [
//             '#00ff1b',
//             '#d60d0d',
//         ],
//     }]
// };

// new Chart(semiDlineChart, {
//     type: 'doughnut',
//     data: data,
//     options: {
//         plugins: {
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 enabled: false
//             },
//         },
//     },
// });

const initLoadCountData = (element, data, status) => {
    const htmlEle = document.getElementById(element);
    if (htmlEle) {
        htmlEle.classList.remove("text_danger", "text_success");
        htmlEle.textContent = new Intl.NumberFormat().format(data);
        if (!element.includes("target")) {
            if ((status).toString() === "1") {
                htmlEle.classList.add("text_danger");
            } else if ((status).toString() === "0") {
                htmlEle.classList.add("text_success");
            }
        }
    }
}

const dataOfEachLocation = (location, productData) => {
    return productData.filter(x => (x.type).toString() === location);
}

const initLoadDataEachLocation = (data, element, location) => {
    const rootEle = document.querySelector(element);
    if (rootEle) {
        data.map((x, index) => {
            const title = rootEle.querySelector(`.content-item:nth-child(${index + 1}) .top h2`);
            if (title) {
                title.textContent = x.name;
            }

            const percent = rootEle.querySelector(`.content-item:nth-child(${index + 1}) .top .chart span`);
            if (percent) {
                percent.textContent = `${(Math.round((x.actual / x.totalTarget) * 100))}%`;
            }

            const target = rootEle.querySelector(`.content-item:nth-child(${index + 1}) .bottom .bottom-item:nth-child(1) h4:nth-child(2)`);
            if (target) {
                target.textContent = new Intl.NumberFormat().format(x.totalTarget);
            }

            const actual = rootEle.querySelector(`.content-item:nth-child(${index + 1}) .bottom .bottom-item:nth-child(2) h4:nth-child(2)`);
            if (actual) {
                actual.textContent = new Intl.NumberFormat().format(x.actual);
                actual.classList.remove("text_danger", "text_success");
                if ((x.status).toString() === "1") {
                    actual.classList.add("text_danger");
                } else if ((x.status).toString() === "0") {
                    actual.classList.add("text_success");
                }
            }

            // const actual = rootEle.querySelector(`.content-semi-item:nth-child(${index + 1}) .bottom .bottom-item:nth-child(2)`);
            // if ((x.status).toString() === "1") {
            //     actual.innerHTML =
            //         `
            //         <h4 class="text-text-white text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] bg-primary-color w-[100px] md:w-[4.861vw] border border-primary-color">
            //             Actual
            //         </h4>
            //         <h4 class="text-primary-color text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] w-[100px] md:w-[4.861vw] border border-primary-color text_danger">
            //             ${x.actual}
            //         </h4>
            //         `
            // } else if ((x.status).toString() === "0") {
            //     actual.innerHTML =
            //         `
            //         <h4 class="text-text-white text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] bg-primary-color w-[100px] md:w-[4.861vw] border border-primary-color">
            //             Actual
            //         </h4>
            //         <h4 class="text-primary-color text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] w-[100px] md:w-[4.861vw] border border-primary-color text_success">
            //             ${x.actual}
            //         </h4>
            //         `
            // } else {
            //     actual.innerHTML =
            //         `
            //         <h4 class="text-text-white text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] bg-primary-color w-[100px] md:w-[4.861vw] border border-primary-color">
            //             Actual
            //         </h4>
            //         <h4 class="text-primary-color text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] w-[100px] md:w-[4.861vw] border border-primary-color">
            //             ${x.actual}
            //         </h4>
            //         `
            // }

            const diff = rootEle.querySelector(`.content-item:nth-child(${index + 1}) .bottom .bottom-item:nth-child(3) h4:nth-child(2)`);
            if (diff) {
                diff.textContent = new Intl.NumberFormat().format(x.different);
                diff.classList.remove("text_danger", "text_success");
                if ((x.status).toString() === "1") {
                    diff.classList.add("text_danger");
                } else if ((x.status).toString() === "0") {
                    diff.classList.add("text_success");
                }
            }

            // const diff = rootEle.querySelector(`.content-semi-item:nth-child(${index + 1}) .bottom .bottom-item:nth-child(3)`);
            // if ((x.status).toString() === "1") {
            //     diff.innerHTML =
            //         `
            //         <h4 class="text-text-white text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] bg-primary-color w-[100px] md:w-[4.861vw] border border-primary-color">
            //             Diff.
            //         </h4>
            //         <h4 class="text-primary-color text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] w-[100px] md:w-[4.861vw] border border-primary-color text_danger">
            //             ${x.different}
            //         </h4>
            //         `
            // } else if ((x.status).toString() === "0") {
            //     diff.innerHTML =
            //         `
            //         <h4 class="text-text-white text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] bg-primary-color w-[100px] md:w-[4.861vw] border border-primary-color">
            //             Diff.
            //         </h4>
            //         <h4 class="text-primary-color text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] w-[100px] md:w-[4.861vw] border border-primary-color text_success">
            //             ${x.different}
            //         </h4>
            //         `
            // } else {
            //     diff.innerHTML =
            //         `
            //         <h4 class="text-text-white text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] bg-primary-color w-[100px] md:w-[4.861vw] border border-primary-color">
            //             Diff.
            //         </h4>
            //         <h4 class="text-primary-color text-[13px] md:text-[0.694vw] font-[600] text-center md:px-[0.139vw] md:py-[0.139vw] w-[100px] md:w-[4.861vw] border border-primary-color">
            //             ${x.different}
            //         </h4>
            //         `
            // }

            const chartData = [x.actual, x.totalTarget - x.actual];

            const chart = Chart.getChart(`${location}_${index + 1}`);
            chart.config.data.datasets[0].data = chartData;
            chart.update();
        }
        );
    }
}

const initLoadData = (data) => {
    // console.log("run");
    const semiData = dataOfEachLocation("0", data);
    const fgData = dataOfEachLocation("1", data);

    initLoadDataEachLocation(semiData, ".content-semi-list", "semi");
    initLoadDataEachLocation(fgData, ".content-finished-list", "fg");
}


const renderChart = (location, numberOfChart) => {
    for (let i = 1; i <= numberOfChart; i++) {
        let chart = Chart.getChart(`${location}_${i}`);
        if (chart) {
            chart.destroy();
        }

        const chartEle = document.getElementById(`${location}_${i}`);
        if (chartEle) {
            const data = {
                // labels: [
                //     'Actual',
                //     'Target',
                // ],
                datasets: [{
                    label: 'D-line',
                    data: [50, 50],
                    backgroundColor: [
                        '#00ff1b',
                        '#ff0000',
                    ],
                }]
            };

            chart = new Chart(chartEle, {
                type: 'doughnut',
                data: data,
                options: {
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        },
                    },
                },
            });
        }
    }
}


(() => {

    const dateEle = document.querySelector(".header-content .right .date");
    if (dateEle) {
        dateEle.textContent = `${dayjs(new Date()).format('DD-MMM-YY')}`;
    }

    renderChart("semi", 4);
    renderChart("fg", 7);
    /**
     * note: API gửi lên bao nhiêu item thì rederChart sẽ phải render bấy nhiêu item
     */

    function countTime() {
        const timeEle = document.querySelector(".header-content .right .time");
        if (timeEle) {
            timeEle.textContent = `${dayjs(new Date()).format('HH:mm:ss')}`;
        }

        setTimeout(countTime, 1000);
    }

    countTime();

    // async function loadData() {

    //     try {
    //         const { data } = await dashboardApi.getMentos();
    //         // console.log(data);
    //         // const data = mentosDetail;

    //         initLoadCountData("target", data.totalTarget, data.status);
    //         initLoadCountData("actual", data.actual, data.status);
    //         initLoadCountData("diff", data.different, data.status);

    //         initLoadData(data.locations);

    //     } catch (error) {
    //         console.log("failed to fetch data", error);
    //     }

    //     setTimeout(loadData, 5000);
    // }

    loadData();

})();