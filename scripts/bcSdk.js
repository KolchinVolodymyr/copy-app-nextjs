export function bigCommerceSDK(context) {
        console.log('111111111111111111');
    if (typeof window === "undefined") return;
    console.log('222222222222222');
    console.log('window', window)
    const s = 'script';
    const id = 'bigcommerce-sdk-js';
    const d = document;
    let js, bcjs = d.getElementsByTagName(s)[0];
    console.log('d', d);
    if (d.getElementById(id)) return;

    js = d.createElement(s);
    console.log('js', js);
    js.id = id;
    js.async = true;
    js.src = "https://cdn.bigcommerce.com/jssdk/bc-sdk.js";
    bcjs.parentNode.insertBefore(js, bcjs);

    window.bcAsyncInit = function() {
        Bigcommerce.init({
            onLogout: function() {
                fetch(`/api/logout?context=${context}`);
            },
        });
    }
}
