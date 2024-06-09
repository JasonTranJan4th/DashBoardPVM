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

    if (dataLength === "9") {
        return data;
    }

    for (let i = 0; i < 9 - dataLength; i++) {
        data.push(itemTemplate);
    }
}

const initLoadCountData = (element, data, status) => {
    const htmlEle = document.getElementById(element);
    htmlEle.classList.remove("text_danger", "text_success");
    if (htmlEle) {
        htmlEle.textContent = data;
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
                return `<tr class="text-[10px] md:text-[0.764vw] font-[600]">
                            <td class="border border-slate-300 h-[35px] md:h-[2.083vw] status_danger"></td>
                            <td class="border border-slate-300">${x.name}</td>
                            <td class="border border-slate-300 text-right">${x.totalTarget}</td>
                            <td class="border border-slate-300 text-right">${x.hourlyTarget}</td>
                            <td class="border border-slate-300 text-right text_danger">${x.actual}</td>
                            <td class="border border-slate-300 text-right text_danger">${x.different}</td>
                        </tr>`
            } else if ((x.status).toString() === "0") {
                return `<tr class="text-[10px] md:text-[0.764vw] font-[600]">
                            <td class="border border-slate-300 h-[35px] md:h-[2.083vw] bg-success"></td>
                            <td class="border border-slate-300">${x.name}</td>
                            <td class="border border-slate-300 text-right">${x.totalTarget}</td>
                            <td class="border border-slate-300 text-right">${x.hourlyTarget}</td>
                            <td class="border border-slate-300 text-right text_success">${x.actual}</td>
                            <td class="border border-slate-300 text-right text_success">${x.different}</td>
                        </tr>`
            } else {
                return `<tr class="text-[10px] md:text-[0.764vw] font-[600]">
                        <td class="border border-slate-300 h-[35px] md:h-[2.083vw]"></td>
                        <td class="border border-slate-300">${x.name}</td>
                        <td class="border border-slate-300 text-right">${x.totalTarget}</td>
                        <td class="border border-slate-300 text-right">${x.hourlyTarget}</td>
                        <td class="border border-slate-300 text-right">${x.actual}</td>
                        <td class="border border-slate-300 text-right">${x.different}</td>
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
        const timeEle = document.querySelector(".header-content .right .time");
        if (timeEle) {
            timeEle.textContent = `${dayjs(new Date()).format('HH:mm:ss')}`;
        }
        setTimeout(countTime, 1000);
    }

    countTime();

    async function fetchDataAndReload() {

        // try {
        //     const data = await dashboardApi.getAll();
        //     console.log(data);

        // } catch (error) {
        //     console.log("failed to fetch data", error);
        // }

        const data = dasboarddata;
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

        // console.log("refresh");

        setTimeout(fetchDataAndReload, 10000);
    }

    fetchDataAndReload();

})();