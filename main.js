import dayjs from "dayjs";
import dashboardApi from "./api/dasboardApi";
import { dasboarddata } from "./data/dashboard-data";

const dataOfEachProduct = (product, data) => {
    return data.filter(x => x.name.toUpperCase() === product.name.toUpperCase());
}

const dataOfEachLocation = (location, productData) => {
    return productData.filter(x => x.type === location);
}

const addMoreLine = (data, type) => {
    const itemTemplate = {
        "name": "",
        "type": type,
        "totalTarget": "",
        "hourlyTarget": "",
        "actual": "",
        "different": "",
        "status": ""
    }

    const dataLength = data.length;

    if (dataLength.toString() === "9") {
        return data;
    }

    for (let i = 0; i < 9 - dataLength; i++) {
        data.push(itemTemplate);
    }
}

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

const initLoadDataEachLocation = (data, rootElement, product) => {
    // console.log(data);
    const tbody = document.querySelector(rootElement).querySelector(`.${product.name} table`).getElementsByTagName("tbody")[0];
    // console.log(tbody)
    if (tbody) {
        let trEle = data.map((x) => {
            if ((x.status).toString() === "1") {
                return `<tr class="text-[10px] md:text-[0.708vw] font-[600] dark:text-text-white">
                            <td class="border border-slate-300 dark:border-black-color h-[35px] md:h-[2.083vw] status_danger"></td>
                            <td class="border border-slate-300 dark:border-black-color">${x.name}</td>
                            <td class="border border-slate-300 dark:border-black-color text-right">${new Intl.NumberFormat().format(x.totalTarget)}</td>
                            <td class="border border-slate-300 dark:border-black-color text-right">${new Intl.NumberFormat().format(x.hourlyTarget)}</td>
                            <td class="border border-slate-300 dark:border-black-color text-right text_danger">${new Intl.NumberFormat().format(x.actual)}</td>
                            <td class="border border-slate-300 dark:border-black-color text-right text_danger">${new Intl.NumberFormat().format(x.different)}</td>
                        </tr>`
            } else if ((x.status).toString() === "0") {
                return `<tr class="text-[10px] md:text-[0.708vw] font-[600] dark:text-text-white">
                            <td class="border border-slate-300 dark:border-black-color h-[35px] md:h-[2.083vw] bg-success"></td>
                            <td class="border border-slate-300 dark:border-black-color">${x.name}</td>
                            <td class="border border-slate-300 dark:border-black-color text-right">${new Intl.NumberFormat().format(x.totalTarget)}</td>
                            <td class="border border-slate-300 dark:border-black-color text-right">${new Intl.NumberFormat().format(x.hourlyTarget)}</td>
                            <td class="border border-slate-300 dark:border-black-color text-right text_success">${new Intl.NumberFormat().format(x.actual)}</td>
                            <td class="border border-slate-300 dark:border-black-color text-right text_success">${new Intl.NumberFormat().format(x.different)}</td>
                        </tr>`
            } else {
                return `<tr class="text-[10px] md:text-[0.708vw] font-[600] dark:text-text-white">
                        <td class="border border-slate-300 dark:border-black-color h-[35px] md:h-[2.083vw]"></td>
                        <td class="border border-slate-300 dark:border-black-color">${x.name}</td>
                        <td class="border border-slate-300 dark:border-black-color text-right">${x.totalTarget}</td>
                        <td class="border border-slate-300 dark:border-black-color text-right">${x.hourlyTarget}</td>
                        <td class="border border-slate-300 dark:border-black-color text-right">${x.actual}</td>
                        <td class="border border-slate-300 dark:border-black-color text-right">${x.different}</td>
                    </tr>`
            }

        }).join("");
        tbody.innerHTML = trEle;
    }
}

const locationData = (product, productData) => {
    const semiData = dataOfEachLocation(product.semi, productData[0].locations);
    const fgData = dataOfEachLocation(product.fg, productData[0].locations);

    addMoreLine(semiData, product.semi);
    addMoreLine(fgData, product.fg);

    initLoadDataEachLocation(semiData, ".content-semi", product);
    initLoadDataEachLocation(fgData, ".content-finished", product);
}

(() => {

    const dateEle = document.querySelector(".header-content .right .date");
    if (dateEle) {
        dateEle.textContent = `${dayjs(new Date()).format('DD-MMM-YY')}`;
    }

    function countTime() {

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

        const timeEle = document.querySelector(".header-content .right .time");
        if (timeEle) {
            timeEle.textContent = `${dayjs(new Date()).format('HH:mm:ss')}`;
        }
        setTimeout(countTime, 1000);
    }

    countTime();

    async function fetchDataAndReload() {
        try {
            const { data } = await dashboardApi.getAll();
            // console.log(data.data);

            // const data = dasboarddata;

            const PRODUCTS = [
                {
                    name: "mentos",
                    semi: 0,
                    fg: 1
                },
                {
                    name: "gum",
                    semi: 0,
                    fg: 1
                }
            ];

            initLoadCountData("semi-target", data.semiTotalTarget, data.semiStatus);
            initLoadCountData("semi-actual", data.semiActual, data.semiStatus);
            initLoadCountData("semi-diff", data.semiDifferent, data.semiStatus);

            initLoadCountData("fg-target", data.finishTotalTarget, data.finishStatus);
            initLoadCountData("fg-actual", data.finishActual, data.finishStatus);
            initLoadCountData("fg-diff", data.finishDifferent, data.finishStatus);

            for (let i = 0; i < PRODUCTS.length; i++) {
                const productData = dataOfEachProduct(PRODUCTS[i], data.areas);
                locationData(PRODUCTS[i], productData);
            }
        } catch (error) {
            console.log("failed to fetch data", error);
        }

        setTimeout(fetchDataAndReload, 5000);
    }

    fetchDataAndReload();

})();
