import userApi from "./api/userApi";

(async () => {

    const prevUrl = document.referrer;

    const formLogin = document.getElementById("loginForm");

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = new FormData(formLogin);
        const formValues = {};
        for (const [key, value] of data) {
            formValues[key] = value;
        }

        try {
            const newFormValues = { ...formValues };
            newFormValues.password = btoa(unescape(encodeURIComponent(newFormValues.password)));

            const { data } = await userApi.getUser(formValues);

            if (data) {
                window.localStorage.setItem("user", JSON.stringify(newFormValues));
                window.localStorage.setItem("key", JSON.stringify(data));
                // const testdata = localStorage.getItem("user");
                // console.log(JSON.parse(testdata));
                if (prevUrl) {
                    window.location.assign(`${prevUrl}`);
                } else {
                    window.location.assign("index.html");
                }
                // window.history.back();
            }

        } catch (error) {
            alert("The Username or Password is incorrect. Please try again!");
            console.log("Failed to fetch user")
        }
    })

})();