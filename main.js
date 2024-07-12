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
            if (x.enabled === false) {
                return `<tr class="text-[10px] md:text-[0.708vw] font-[600] dark:text-text-white">
                <td class="border border-slate-300 dark:border-black-color h-[35px] md:h-[2.083vw]"></td>
                <td class="border border-slate-300 dark:border-black-color">${x.name}</td>
                <td class="border border-slate-300 dark:border-black-color text-right">-</td>
                <td class="border border-slate-300 dark:border-black-color text-right">-</td>
                <td class="border border-slate-300 dark:border-black-color text-right">-</td>
                <td class="border border-slate-300 dark:border-black-color text-right">-</td>
            </tr>`
            } else {
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
            }

            // if ((x.status).toString() === "1") {
            //     return `<tr class="text-[10px] md:text-[0.708vw] font-[600] dark:text-text-white">
            //                 <td class="border border-slate-300 dark:border-black-color h-[35px] md:h-[2.083vw] status_danger"></td>
            //                 <td class="border border-slate-300 dark:border-black-color">${x.name}</td>
            //                 <td class="border border-slate-300 dark:border-black-color text-right">${new Intl.NumberFormat().format(x.totalTarget)}</td>
            //                 <td class="border border-slate-300 dark:border-black-color text-right">${new Intl.NumberFormat().format(x.hourlyTarget)}</td>
            //                 <td class="border border-slate-300 dark:border-black-color text-right text_danger">${new Intl.NumberFormat().format(x.actual)}</td>
            //                 <td class="border border-slate-300 dark:border-black-color text-right text_danger">${new Intl.NumberFormat().format(x.different)}</td>
            //             </tr>`
            // } else if ((x.status).toString() === "0") {
            //     return `<tr class="text-[10px] md:text-[0.708vw] font-[600] dark:text-text-white">
            //                 <td class="border border-slate-300 dark:border-black-color h-[35px] md:h-[2.083vw] bg-success"></td>
            //                 <td class="border border-slate-300 dark:border-black-color">${x.name}</td>
            //                 <td class="border border-slate-300 dark:border-black-color text-right">${new Intl.NumberFormat().format(x.totalTarget)}</td>
            //                 <td class="border border-slate-300 dark:border-black-color text-right">${new Intl.NumberFormat().format(x.hourlyTarget)}</td>
            //                 <td class="border border-slate-300 dark:border-black-color text-right text_success">${new Intl.NumberFormat().format(x.actual)}</td>
            //                 <td class="border border-slate-300 dark:border-black-color text-right text_success">${new Intl.NumberFormat().format(x.different)}</td>
            //             </tr>`
            // } else {
            //     return `<tr class="text-[10px] md:text-[0.708vw] font-[600] dark:text-text-white">
            //             <td class="border border-slate-300 dark:border-black-color h-[35px] md:h-[2.083vw]"></td>
            //             <td class="border border-slate-300 dark:border-black-color">${x.name}</td>
            //             <td class="border border-slate-300 dark:border-black-color text-right">${x.totalTarget}</td>
            //             <td class="border border-slate-300 dark:border-black-color text-right">${x.hourlyTarget}</td>
            //             <td class="border border-slate-300 dark:border-black-color text-right">${x.actual}</td>
            //             <td class="border border-slate-300 dark:border-black-color text-right">${x.different}</td>
            //         </tr>`
            // }

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

    const key = JSON.parse(localStorage.getItem("key"));
    if (key) {

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
                // console.log(data);

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
    } else {
        window.location.assign("login.html");
    }

})();
